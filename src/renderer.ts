import {
    toEnglishDigits, toPersianDigits,
    generateReference, generateWatcher, generateFlightNumber
} from './utils';
import {
    cityAirports, airlines,
    getCityEnglish, getAirportEnglish, getAirlineEnglish
} from './dictionary';
import Swal from 'sweetalert2';

declare const window: any;
declare const jalaliDatepicker: any;
declare const bootstrap: any;
declare const html2canvas: any;
declare const jQuery: any;
const $ = jQuery;

const api = window.electronAPI;

// ---------- State ----------
let tickets: any[] = [];
let editingId: number | null = null;
let passengers: any[] = [];
let currentPreviewTickets: any[] = [];
let searchTerm = '';
let sortDirection: 'asc' | 'desc' = 'asc';
let currentPage = 1;
let pageSize = 10;
let yearFilter = ''; // selected Jalali year

// ---------- Utility ----------
function computeTotal(price: number, penalty: number): number {
    return Math.round(price * (1 - penalty / 100));
}

function formatPrice(value: string): string {
    let eng = toEnglishDigits(value).replace(/[^0-9]/g, '');
    if (eng === '') return '';
    let formatted = '';
    for (let i = eng.length - 1, count = 0; i >= 0; i--, count++) {
        if (count > 0 && count % 3 === 0) formatted = ',' + formatted;
        formatted = eng[i] + formatted;
    }
    return toPersianDigits(formatted);
}

function unformatPrice(str: string): number {
    return parseInt(toEnglishDigits(str).replace(/,/g, '')) || 0;
}

// ---------- Year filter population ----------
function populateYearFilter() {
    const years = new Set<string>();
    tickets.forEach(t => {
        const y = t.flight_date.split('/')[0];
        if (y) years.add(y);
    });
        const select = document.getElementById('yearFilterSelect') as HTMLSelectElement;
        const currentVal = select.value;
        select.innerHTML = '<option value="">همه</option>';
        Array.from(years).sort().forEach(y => {
            select.add(new Option(y, y));
        });
        select.value = yearFilter || '';
}

// ---------- Data loading & table rendering ----------
async function loadTickets() {
    tickets = await api.getAllTickets();
    currentPage = 1;
    populateYearFilter();
    renderTable();
}

function renderTable() {
    // 1. Filter by year and search term
    let filtered = tickets;
    if (yearFilter) {
        filtered = filtered.filter(t => t.flight_date.startsWith(yearFilter + '/'));
    }
    const filter = searchTerm.toLowerCase().trim();
    if (filter) {
        filtered = filtered.filter(t => {
            const text = `${t.row_number} ${t.first_name_persian} ${t.last_name_persian} ${t.origin_city} ${t.destination_city} ${t.flight_date} ${t.flight_time} ${t.ticket_price}`.toLowerCase();
            return text.includes(filter);
        });
    }

    // 2. Sort
    const sorted = [...filtered].sort((a, b) => {
        const diff = a.row_number - b.row_number;
        return sortDirection === 'asc' ? diff : -diff;
    });

    // 3. Paginate
    const totalPages = pageSize === 0 ? 1 : Math.ceil(sorted.length / pageSize);
    const start = pageSize === 0 ? 0 : (currentPage - 1) * pageSize;
    const paginated = pageSize === 0 ? sorted : sorted.slice(start, start + pageSize);

    // 4. Update pagination controls
    document.getElementById('pageInfo')!.textContent = `صفحه ${currentPage} از ${totalPages}`;
    (document.getElementById('prevPageBtn') as HTMLButtonElement).disabled = currentPage <= 1;
    (document.getElementById('nextPageBtn') as HTMLButtonElement).disabled = currentPage >= totalPages;

    // 5. Build table body
    const tbody = document.getElementById('ticketsTableBody')!;
    tbody.innerHTML = '';
    paginated.forEach((t: any) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td><input type="checkbox" class="ticket-checkbox" data-id="${t.id}"></td>
        <td>${toPersianDigits(String(t.row_number))}</td>
        <td>${t.first_name_persian} ${t.last_name_persian}</td>
        <td>${t.origin_city}</td>
        <td>${t.destination_city}</td>
        <td>${toPersianDigits(t.flight_date)}</td>
        <td>${t.flight_time}</td>
        <td>${formatPrice(String(t.ticket_price))}</td>
        <td>
        <button class="btn btn-sm btn-warning edit-btn" data-id="${t.id}">ویرایش</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${t.id}">حذف</button>
        <button class="btn btn-sm btn-info preview-btn" data-id="${t.id}">پیش‌نمایش</button>
        </td>`;
        tbody.appendChild(tr);
    });

    bindTableEvents();
    updateMultiButtons();
}

function bindTableEvents() {
    document.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', async (e) => {
        const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        editTicket(id);
    }));
    document.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', async (e) => {
        const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        const result = await Swal.fire({
            title: 'آیا مطمئن هستید؟',
            text: "این عملیات قابل بازگشت نیست!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، حذف کن',
            cancelButtonText: 'لغو',
            confirmButtonColor: '#d9534f',
            cancelButtonColor: '#6c757d'
        });
        if (result.isConfirmed) {
            await api.deleteTicket(id);
            loadTickets();
            Swal.fire('حذف شد!', 'بلیط با موفقیت حذف شد.', 'success');
        }
    }));
    document.querySelectorAll('.preview-btn').forEach(b => b.addEventListener('click', (e) => {
        const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        const t = tickets.find(tk => tk.id === id);
        if (t) showPreview([t]);
    }));
}

// ---------- Selection ----------
document.getElementById('selectAll')!.addEventListener('change', (e) => {
    const ch = (e.target as HTMLInputElement).checked;
    document.querySelectorAll('.ticket-checkbox').forEach((cb: any) => cb.checked = ch);
    updateMultiButtons();
});
document.addEventListener('change', (e) => {
    if ((e.target as HTMLElement).classList.contains('ticket-checkbox')) updateMultiButtons();
});

function getSelectedIds(): number[] {
    return Array.from(document.querySelectorAll('.ticket-checkbox:checked'))
    .map((cb: any) => parseInt(cb.dataset.id));
}

function updateMultiButtons() {
    const sel = getSelectedIds();
    (document.getElementById('previewSelectedBtn') as HTMLButtonElement).disabled = sel.length === 0;
    (document.getElementById('deleteSelectedBtn') as HTMLButtonElement).disabled = sel.length === 0;
}

// ---------- Edit ticket ----------
async function editTicket(id: number) {
    const ticket = await api.getTicketById(id);
    if (!ticket) return;
    editingId = id;
    passengers = [{
        firstNameFa: ticket.first_name_persian,
        lastNameFa: ticket.last_name_persian,
        firstNameEn: ticket.first_name_english,
        lastNameEn: ticket.last_name_english,
    }];
    buildForm(ticket);
}

// ---------- Preview / Print / Export ----------
function showPreview(ticketsToPreview: any[]) {
    currentPreviewTickets = ticketsToPreview;
    const modalBody = document.getElementById('previewContent')!;
    let html = '';
    ticketsToPreview.forEach((t, idx) => {
        html += buildPreviewHTML(t);
        if (idx < ticketsToPreview.length - 1) html += '<div style="page-break-after: always;"></div>';
    });
        modalBody.innerHTML = html;

        const modalEl = document.getElementById('previewModal')!;
        const modal = new bootstrap.Modal(modalEl);
        modal.show();

        (document.getElementById('printPreviewBtn')!).onclick = () => window.print();
        (document.getElementById('exportPreviewBtn')!).onclick = () => exportPreviewAsImage();
}

function buildPreviewHTML(ticket: any): string {
    const passengerNameEn = (ticket.first_name_english && ticket.last_name_english)
    ? `${ticket.first_name_english} ${ticket.last_name_english}`
    : `${ticket.first_name_persian} ${ticket.last_name_persian}`;

    const originCityEn = getCityEnglish(ticket.origin_city);
    const destCityEn = getCityEnglish(ticket.destination_city);
    const airlineEn = getAirlineEnglish(ticket.airline);

    return `
    <div class="ticket-ugly container border border-2 border-dark rounded p-4 bg-white text-dark" style="max-width: 600px; font-family: monospace, sans-serif; font-size: 1.1rem;">
    <h2 class="text-center mb-4 fw-bold" style="letter-spacing: 2px;">Flight Ticket</h2>

    <div class="row mb-3">
    <div class="col-6">Voucher:${ticket.watcher}</div>
    <div class="col-6">Reference:${ticket.reference}</div>
    </div>

    <div class="row mb-3">
    <div class="col-6">Flight Date: ${ticket.flight_date}</div>
    <div class="col-6">Flight Time: ${ticket.flight_time}</div>
    </div>

    <div class="row mb-3">
    <div class="col-6">Flight No.:${ticket.flight_number}</div>
    <div class="col-6">Airline:${airlineEn}</div>
    </div>

    <div class="row mb-4">
    <div class="col-6">From: ${originCityEn}</div>
    <div class="col-6">To: ${destCityEn}</div>
    </div>

    <div class="text-center mb-3">
    Allowed Baggage:${ticket.max_baggage} kg
    </div>

    <div class="text-center mb-4">
    Passenger List<br>
    <span class="fs-5">${passengerNameEn}</span>
    </div>

    <div class="row mb-4">
    <div>
    Amount<br>
    ${ticket.ticket_price.toLocaleString()}
    </div>
    </div>

    <div class="text-start small mb-4" style="font-size: 0.85rem; direction: ltr !important; text-align: left !important;">
    Passenger presence at the airport is mandatory at least 2 hours for domestic and 3 hours for international flights.
    </div>

    <div class="row mt-5">
    <div class="col-12 text-end">
    <span class="border-top border-dark border-2 pt-2 d-inline-block">Seal and signature</span>
    </div>
    </div>
    </div>`;
}

async function exportPreviewAsImage() {
    const ticketsToExport = currentPreviewTickets;
    if (!ticketsToExport.length) return;

    let savedCount = 0;
    for (const ticket of ticketsToExport) {
        const container = document.createElement('div');
        container.style.cssText = 'position:absolute;left:-9999px;top:0;';
        container.innerHTML = buildPreviewHTML(ticket);
        document.body.appendChild(container);

        const canvas = await html2canvas(container, { scale: 2 });
        document.body.removeChild(container);

        const dataUrl = canvas.toDataURL('image/png');
        const year = ticket.flight_date.split('/')[0];
        const fileName = `${year}.${ticket.row_number}.png`;
        const filePath = await api.saveImage(dataUrl, fileName, true);
        if (filePath) {
            savedCount++;
        } else {
            break;
        }
    }

    if (savedCount === 0) {
        return;
    } else if (savedCount < ticketsToExport.length) {
        Swal.fire('توقف', `${savedCount} فایل ذخیره شد. باقی لغو گردید.`, 'warning');
    } else {
        Swal.fire('ذخیره شد', `${savedCount} فایل با موفقیت ذخیره شد.`, 'success');
    }
}

// ---------- Export path setting ----------
document.getElementById('setExportPathBtn')!.addEventListener('click', async () => {
    const path = await api.setExportPath();
    if (path) {
        Swal.fire('تنظیم شد', `مسیر خروجی: ${path}`, 'success');
    }
});

// Load and display current path on startup (optional)
(async () => {
    const currentPath = await api.getExportPath();
    if (currentPath) {
        // You can show it in a tooltip or small label; for now we just keep it silent
        (document.getElementById('setExportPathBtn') as HTMLElement).title = `Current: ${currentPath}`;
    }
})();

// ---------- Multi‑select preview button ----------
document.getElementById('previewSelectedBtn')!.addEventListener('click', () => {
    const ids = getSelectedIds();
    const selected = tickets.filter(t => ids.includes(t.id));
    if (selected.length) showPreview(selected);
});

// ---------- Delete selected button ----------
document.getElementById('deleteSelectedBtn')!.addEventListener('click', async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) return;
    const confirm = await Swal.fire({
        title: 'حذف انتخاب‌ها',
        text: `آیا مطمئن هستید که می‌خواهید ${ids.length} رکورد را حذف کنید؟`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، حذف کن',
        cancelButtonText: 'لغو',
    });
    if (confirm.isConfirmed) {
        await api.deleteMultipleTickets(ids);
        loadTickets();
        Swal.fire('حذف شد', `${ids.length} رکورد حذف شد.`, 'success');
    }
});

// ---------- Sort, Page size & Pagination controls ----------
document.getElementById('sortBtn')!.addEventListener('click', () => {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    document.getElementById('sortLabel')!.textContent = sortDirection === 'asc' ? 'صعودی' : 'نزولی';
    renderTable();
});

document.getElementById('pageSizeSelect')!.addEventListener('change', (e) => {
    pageSize = parseInt((e.target as HTMLSelectElement).value);
    currentPage = 1;
    renderTable();
});

document.getElementById('prevPageBtn')!.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderTable(); }
});

document.getElementById('nextPageBtn')!.addEventListener('click', () => {
    const totalPages = pageSize === 0 ? 1 : Math.ceil(
        tickets.filter(t => {
            const filter = searchTerm.toLowerCase().trim();
            if (filter === '') return true;
            const text = `${t.row_number} ${t.first_name_persian} ${t.last_name_persian} ${t.origin_city} ${t.destination_city} ${t.flight_date} ${t.flight_time} ${t.ticket_price}`.toLowerCase();
            return text.includes(filter);
        }).length / pageSize
    );
    if (currentPage < totalPages) { currentPage++; renderTable(); }
});

// ---------- Search ----------
document.getElementById('searchInput')!.addEventListener('input', (e) => {
    searchTerm = (e.target as HTMLInputElement).value;
    currentPage = 1;
    renderTable();
});

// ---------- Year filter ----------
document.getElementById('yearFilterSelect')!.addEventListener('change', (e) => {
    yearFilter = (e.target as HTMLSelectElement).value;
    currentPage = 1;
    renderTable();
});

// ---------- New ticket button ----------
document.getElementById('newTicketBtn')!.addEventListener('click', () => {
    editingId = null;
    passengers = [{ firstNameFa: '', lastNameFa: '', firstNameEn: '', lastNameEn: '' }];
    buildForm();
});

// ---------- Import / Export buttons ----------
document.getElementById('importExcelBtn')!.addEventListener('click', async () => {
    Swal.fire({
        title: 'در حال بارگذاری فایل Excel',
        html: 'لطفا صبر کنید...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    const result = await api.importExcel();
    Swal.close();
    if (result.success) {
        Swal.fire('موفق', `${result.count} رکورد اضافه شد.`, 'success');
        loadTickets();
    } else {
        Swal.fire('خطا', result.message || 'خطا در بارگذاری فایل', 'error');
    }
});

document.getElementById('exportExcelBtn')!.addEventListener('click', async () => {
    await api.exportExcel();
});

// ---------- Form building ----------
function buildForm(existingTicket?: any) {
    const container = document.getElementById('formContainer')!;
    container.classList.add('visible');

    const hours = Array.from({ length: 24 }, (_, i) => {
        const n = i.toString().padStart(2, '0');
        return { english: n, persian: toPersianDigits(n) };
    });
    const minutes = Array.from({ length: 12 }, (_, i) => {
        const n = (i * 5).toString().padStart(2, '0');
        return { english: n, persian: toPersianDigits(n) };
    });

    const refreshSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
    </svg>`;

    let html = `
    <h4 class="mb-4 text-center" style="color: #2c3e50;">${existingTicket ? 'ویرایش بلیط' : 'ثبت بلیط جدید'}</h4>
    <form id="ticketForm" class="row g-3">
    <div class="col-md-6"><label class="form-label">شهر مبدا</label>
    <select id="originCity" class="form-select searchable" required>
    <option value="">انتخاب کنید</option>
    ${[...new Set(cityAirports.map(c => c.persianCity))].map(city => `<option value="${city}" ${existingTicket?.origin_city===city?'selected':''}>${city}</option>`).join('')}
    </select></div>
    <div class="col-md-6"><label class="form-label">شهر مقصد</label>
    <select id="destCity" class="form-select searchable" required>
    <option value="">انتخاب کنید</option>
    ${[...new Set(cityAirports.map(c => c.persianCity))].map(city => `<option value="${city}" ${existingTicket?.destination_city===city?'selected':''}>${city}</option>`).join('')}
    </select></div>
    <div class="col-md-6"><label class="form-label">فرودگاه مبدا</label><select id="originAirport" class="form-select searchable" required></select></div>
    <div class="col-md-6"><label class="form-label">فرودگاه مقصد</label><select id="destAirport" class="form-select searchable" required></select></div>
    <div class="col-md-6"><label class="form-label">تاریخ (جلالی)</label><input type="text" id="flightDate" class="form-control" data-jdp value="${existingTicket?.flight_date||''}" required></div>
    <div class="col-md-3"><label class="form-label">ساعت پرواز</label>
    <select id="flightHour" class="form-select" required>
    ${hours.map(h => `<option value="${h.english}" ${existingTicket?.flight_time?.startsWith(h.english+':')?'selected':''}>${h.persian}</option>`).join('')}
    </select></div>
    <div class="col-md-3"><label class="form-label">دقیقه</label>
    <select id="flightMinute" class="form-select" required>
    ${minutes.map(m => `<option value="${m.english}" ${existingTicket?.flight_time?.endsWith(':'+m.english)?'selected':''}>${m.persian}</option>`).join('')}
    </select></div>
    <div class="col-md-6"><label class="form-label">ایرلاین</label>
    <select id="airline" class="form-select searchable" required>
    <option value="">انتخاب کنید یا بنویسید</option>
    ${airlines.map(a => `<option value="${a.persianName}" ${existingTicket?.airline===a.persianName?'selected':''}>${a.persianName}</option>`).join('')}
    </select></div>
    <div class="col-md-3"><label class="form-label">شماره پرواز</label>
    <div class="input-group">
    <input type="text" id="flightNumber" class="form-control" value="${existingTicket?.flight_number||''}" required>
    <button type="button" class="btn btn-outline-secondary auto-flight" title="تولید تصادفی">${refreshSVG}</button>
    </div></div>
    <div class="col-md-3"><label class="form-label">حداکثر بار (kg)</label>
    <input type="text" id="maxBaggage" class="form-control numeric" value="${existingTicket ? toPersianDigits(String(existingTicket.max_baggage)) : '۲۰'}" required></div>
    <div class="col-md-3"><label class="form-label">Voucher (۸ رقمی)</label>
    <div class="input-group">
    <input type="text" id="watcher" class="form-control numeric" value="${existingTicket ? toPersianDigits(existingTicket.watcher) : ''}" required>
    <button type="button" class="btn btn-outline-secondary auto-watcher" title="تولید تصادفی">${refreshSVG}</button>
    </div></div>
    <div class="col-md-3"><label class="form-label">Reference (۸ کاراکتر)</label>
    <div class="input-group">
    <input type="text" id="reference" class="form-control" value="${existingTicket?.reference||''}" required>
    <button type="button" class="btn btn-outline-secondary auto-ref" title="تولید تصادفی">${refreshSVG}</button>
    </div></div>
    <div class="col-md-6"><label class="form-label">قیمت بلیط (ریال)</label>
    <input type="text" id="ticketPrice" class="form-control numeric price-input" value="${existingTicket ? formatPrice(String(existingTicket.ticket_price)) : ''}" required></div>
    <div class="col-12"></div>
    <div class="col-md-6"><label class="form-label">درصد جریمه</label>
    <input type="text" id="penaltyPercent" class="form-control numeric" value="${existingTicket ? toPersianDigits(String(existingTicket.penalty_percent)) : '۰'}" required></div>
    <div class="col-md-6"><label class="form-label">قیمت کل</label>
    <input type="text" id="totalPrice" class="form-control" readonly></div>
    <div class="col-12 mt-4"><h5 class="mb-3" style="color: #2c3e50;">مسافران</h5>
    <div id="passengerList"></div>
    <button type="button" id="addPassengerBtn" class="btn btn-outline-primary btn-sm mt-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
    افزودن مسافر
    </button></div>
    <div class="col-12 d-flex justify-content-end gap-3 mt-4">
    <button type="button" id="cancelFormBtn" class="btn btn-outline-secondary btn-lg px-5">انصراف</button>
    <button type="submit" class="btn btn-success btn-lg px-5">ذخیره</button>
    </div>
    </form>`;

    container.innerHTML = html;

    // Searchable selects (cities, airports)
    $('.searchable:not(#airline)').select2({
        placeholder: 'جستجو...',
        language: { noResults: () => 'نتیجه‌ای یافت نشد' }
    });

    // Airline with custom tags
    $('#airline').select2({
        placeholder: 'انتخاب کنید یا بنویسید',
        language: { noResults: () => 'نتیجه‌ای یافت نشد' },
                          tags: true,
                          createTag: (params: any) => {
                              const term = params.term.trim();
                              if (term === '') return null;
                              // Avoid duplicate if already exists
                              if (airlines.find(a => a.persianName === term)) return null;
                              return { id: term, text: term, newTag: true };
                          }
    });

    jalaliDatepicker.startWatch({
        input: document.getElementById('flightDate')!,
                                persianDigits: true
    });

    const populateAirports = (citySelectId: string, airportSelectId: string, existingValue?: string) => {
        const cityVal = $(`#${citySelectId}`).val() as string;
        const $airport = $(`#${airportSelectId}`);
        $airport.empty();
        if (!cityVal) {
            $airport.append('<option value="">ابتدا شهر را انتخاب کنید</option>');
        } else {
            const airports = cityAirports.filter(c => c.persianCity === cityVal);
            airports.forEach(ap => {
                const selected = existingValue === ap.airportPersian ? ' selected' : '';
                $airport.append(`<option value="${ap.airportPersian}"${selected}>${ap.airportPersian}</option>`);
            });
            if (airports.length === 1) {
                $airport.val(airports[0].airportPersian).trigger('change');
            }
        }
        $airport.select2({ placeholder: 'انتخاب فرودگاه' });
    };

    populateAirports('originCity', 'originAirport', existingTicket?.origin_airport);
    populateAirports('destCity', 'destAirport', existingTicket?.destination_airport);

    $('#originCity').on('change', () => populateAirports('originCity', 'originAirport'));
    $('#destCity').on('change', () => populateAirports('destCity', 'destAirport'));

    renderPassengerInputs();
    attachFormEvents(existingTicket);
}

// ---------- Passenger management ----------
function renderPassengerInputs() {
    const listDiv = document.getElementById('passengerList')!;
    listDiv.innerHTML = passengers.map((p, idx) => `
    <div class="passenger-row row g-3 align-items-center mt-3">
    <div class="col-md-3"><label class="form-label">نام فارسی</label><input class="form-control" placeholder="نام" value="${p.firstNameFa}" data-idx="${idx}" data-field="firstNameFa"></div>
    <div class="col-md-3"><label class="form-label">نام خانوادگی فارسی</label><input class="form-control" placeholder="نام خانوادگی" value="${p.lastNameFa}" data-idx="${idx}" data-field="lastNameFa"></div>
    <div class="col-md-3"><label class="form-label">First Name</label><input class="form-control" placeholder="First" value="${p.firstNameEn}" data-idx="${idx}" data-field="firstNameEn"></div>
    <div class="col-md-3"><label class="form-label">Last Name</label><input class="form-control" placeholder="Last" value="${p.lastNameEn}" data-idx="${idx}" data-field="lastNameEn"></div>
    ${idx > 0 ? `<div class="col-12 text-end"><button type="button" class="btn btn-danger btn-sm remove-passenger" data-idx="${idx}">حذف مسافر</button></div>` : ''}
    </div>`).join('');

    document.querySelectorAll('.remove-passenger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt((e.currentTarget as HTMLElement).dataset.idx!);
            passengers.splice(idx, 1);
            renderPassengerInputs();
        });
    });
    listDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const idx = parseInt(target.dataset.idx!);
            const field = target.dataset.field!;
            passengers[idx][field] = target.value;
        });
    });
    document.getElementById('addPassengerBtn')!.onclick = () => {
        passengers.push({ firstNameFa: '', lastNameFa: '', firstNameEn: '', lastNameEn: '' });
        renderPassengerInputs();
    };
}

// ---------- Form events ----------
function attachFormEvents(existingTicket?: any) {
    const form = document.getElementById('ticketForm')!;
    document.getElementById('cancelFormBtn')!.onclick = () => {
        const container = document.getElementById('formContainer')!;
        container.classList.remove('visible');
    };
    document.querySelectorAll('.numeric').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            target.value = toPersianDigits(toEnglishDigits(target.value).replace(/[^0-9]/g, ''));
        });
    });
    const priceInp = document.getElementById('ticketPrice') as HTMLInputElement;
    priceInp.addEventListener('input', () => {
        const raw = toEnglishDigits(priceInp.value).replace(/,/g, '');
        if (raw === '') { priceInp.value = ''; return; }
        priceInp.value = formatPrice(raw);
    });
    document.querySelector('.auto-watcher')?.addEventListener('click', () => {
        (document.getElementById('watcher') as HTMLInputElement).value = toPersianDigits(generateWatcher());
    });
    document.querySelector('.auto-ref')?.addEventListener('click', () => {
        (document.getElementById('reference') as HTMLInputElement).value = generateReference();
    });
    document.querySelector('.auto-flight')?.addEventListener('click', () => {
        (document.getElementById('flightNumber') as HTMLInputElement).value = generateFlightNumber();
    });
    const penaltyInp = document.getElementById('penaltyPercent') as HTMLInputElement;
    const totalInp = document.getElementById('totalPrice') as HTMLInputElement;
    const updateTotal = () => {
        const price = unformatPrice(priceInp.value);
        const penalty = parseInt(toEnglishDigits(penaltyInp.value)) || 0;
        totalInp.value = formatPrice(String(computeTotal(price, penalty)));
    };
    priceInp.addEventListener('input', updateTotal);
    penaltyInp.addEventListener('input', updateTotal);
    updateTotal();

    form.onsubmit = async (e) => {
        e.preventDefault();
        const shared = {
            origin_city: $('#originCity').val() as string,
            destination_city: $('#destCity').val() as string,
            origin_airport: $('#originAirport').val() as string,
            destination_airport: $('#destAirport').val() as string,
            flight_date: (document.getElementById('flightDate') as HTMLInputElement).value,
            flight_time: `${(document.getElementById('flightHour') as HTMLSelectElement).value}:${(document.getElementById('flightMinute') as HTMLSelectElement).value}`,
            airline: $('#airline').val() as string,   // may be a new custom string
            flight_number: (document.getElementById('flightNumber') as HTMLInputElement).value,
            max_baggage: parseInt(toEnglishDigits((document.getElementById('maxBaggage') as HTMLInputElement).value)) || 20,
            ticket_price: unformatPrice(priceInp.value),
            penalty_percent: parseInt(toEnglishDigits(penaltyInp.value)) || 0,
            total_price: unformatPrice(totalInp.value),
            watcher: toEnglishDigits((document.getElementById('watcher') as HTMLInputElement).value),
            reference: (document.getElementById('reference') as HTMLInputElement).value,
        };

        // If airline is a new custom name, we should add it to the global list
        const airlineVal = shared.airline;
        if (airlineVal && !airlines.find(a => a.persianName === airlineVal)) {
            // It's a new airline – add it (with empty English name and code for now)
            airlines.push({ persianName: airlineVal, englishName: airlineVal, code: '' });
        }

        if (!passengers.length) { Swal.fire('خطا', 'حداقل یک مسافر وارد کنید.', 'error'); return; }

        if (editingId) {
            const p = passengers[0];
            await api.updateTicket(editingId, {
                ...shared,
                row_number: existingTicket.row_number,
                first_name_persian: p.firstNameFa,
                last_name_persian: p.lastNameFa,
                first_name_english: p.firstNameEn,
                last_name_english: p.lastNameEn,
                group_id: null,
            });
            Swal.fire('موفق', 'بلیط ویرایش شد.', 'success');
        } else {
            const maxRow = await api.getMaxRowNumber();
            let rowNum = maxRow + 1;
            const groupId = passengers.length > 1 ? `GRP-${Date.now()}-${Math.floor(Math.random()*1000)}` : null;
            for (const p of passengers) {
                await api.insertTicket({
                    ...shared,
                    row_number: rowNum++,
                    first_name_persian: p.firstNameFa,
                    last_name_persian: p.lastNameFa,
                    first_name_english: p.firstNameEn,
                    last_name_english: p.lastNameEn,
                    group_id: groupId,
                });
            }
            Swal.fire('موفق', 'بلیط(ها) با موفقیت ذخیره شد.', 'success');
        }
        const container = document.getElementById('formContainer')!;
        container.classList.remove('visible');
        editingId = null;
        passengers = [];
        loadTickets();
    };
}

// ---------- Auto‑update handlers ----------
if (window.electronAPI) {
    let updateSwal: any = null;

    window.electronAPI.onUpdateMessage((msg: string) => {
        updateSwal = Swal.fire({
            title: 'در حال بررسی',
            text: msg,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
    });

    window.electronAPI.onUpdateAvailable((info: any) => {
        if (updateSwal) Swal.close();
        updateSwal = null;
        Swal.fire({
            title: 'نسخه جدید موجود است',
            html: `نسخه ${info.version} آماده دانلود است. هم‌اکنون دانلود شود؟`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'دانلود',
            cancelButtonText: 'بعدا',
        }).then((result) => {
            if (result.isConfirmed) {
                // Show download progress
                Swal.fire({
                    title: 'در حال دانلود',
                    html: '<div class="progress"><div class="progress-bar" role="progressbar" style="width: 0%" id="updateProgressBar">0%</div></div>',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                        // Start download
                        window.electronAPI.startDownload(info.url);
                    }
                });
            }
        });
    });

    window.electronAPI.onDownloadProgress((percent: number) => {
        const bar = document.getElementById('updateProgressBar');
        if (bar) {
            bar.style.width = `${percent}%`;
            bar.textContent = `${percent}%`;
        }
    });

    window.electronAPI.onUpdateDownloaded(() => {
        Swal.fire({
            title: 'دانلود کامل شد',
            text: 'آماده نصب است. هم‌اکنون راه‌اندازی مجدد شود؟',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'راه‌اندازی مجدد',
            cancelButtonText: 'بعدا',
        }).then((result) => {
            if (result.isConfirmed) {
                window.electronAPI.installUpdate();
            }
        });
    });

    window.electronAPI.onUpdateError((err: any) => {
        Swal.fire('خطا در به‌روزرسانی', err.message || 'خطای ناشناخته', 'error');
    });

    window.electronAPI.onUpdateNotAvailable(() => {
        if (updateSwal) Swal.close();
        updateSwal = null;
        Swal.fire({
            title: 'به‌روزرسانی',
            text: 'شما از آخرین نسخه استفاده می‌کنید.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    });
}

// ---------- Initial load ----------
loadTickets();
