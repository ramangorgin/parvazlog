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

// ---------- Load tickets table ----------
async function loadTickets() {
    tickets = await api.getAllTickets();
    const tbody = document.getElementById('ticketsTableBody')!;
    tbody.innerHTML = '';
    tickets.forEach((t: any) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td><input type="checkbox" class="ticket-checkbox" data-id="${t.id}"></td>
        <td>${toPersianDigits(String(t.row_number))}</td>
        <td>${t.first_name_persian} ${t.last_name_persian}</td>
        <td>${t.origin_city}</td>
        <td>${t.destination_city}</td>
        <td>${toPersianDigits(t.flight_date)}</td>
        <td>${t.flight_number}</td>
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
    (document.getElementById('printSelectedBtn') as HTMLButtonElement).disabled = sel.length === 0;
    (document.getElementById('exportSelectedBtn') as HTMLButtonElement).disabled = sel.length === 0;
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
async function showPreview(ticketsToPreview: any[]) {
    currentPreviewTickets = ticketsToPreview;

    // Ask user with beautiful SweetAlert2 dialog
    const result = await Swal.fire({
        title: 'انتخاب نوع پیش‌نمایش',
        html: 'چه نسخه‌ای را می‌خواهید مشاهده کنید؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'نسخه کامل (آژانس)',
                                   cancelButtonText: 'نسخه مشتری',
                                   confirmButtonColor: '#3085d6',
                                   cancelButtonColor: '#f0ad4e',
                                   reverseButtons: true,
                                   focusCancel: true,
    });

    // If dismissed (clicked outside), do nothing
    if (result.isDismissed) return;

    // true if "نسخه کامل" clicked, false for "نسخه مشتری"
    const isFull = result.isConfirmed;

    const modalBody = document.getElementById('previewContent')!;
    let html = '';
    ticketsToPreview.forEach((t, idx) => {
        html += buildPreviewHTML(t, isFull);
        if (idx < ticketsToPreview.length - 1) html += '<div style="page-break-after: always;"></div>';
    });
        modalBody.innerHTML = html;

        const modalEl = document.getElementById('previewModal')!;
        const modal = new bootstrap.Modal(modalEl);
        modal.show();

        (document.getElementById('printPreviewBtn')!).onclick = () => window.print();
        (document.getElementById('exportPreviewBtn')!).onclick = () => exportPreviewAsImage();
}

function buildPreviewHTML(ticket: any, isFull: boolean): string {
    const originCityEn = getCityEnglish(ticket.origin_city);
    const destCityEn = getCityEnglish(ticket.destination_city);
    const originAirportEn = getAirportEnglish(ticket.origin_airport);
    const destAirportEn = getAirportEnglish(ticket.destination_airport);
    const airlineEn = getAirlineEnglish(ticket.airline);

    return `
    <div class="ticket-preview">
    <h5>Ticket #${ticket.row_number}</h5>
    <p><strong>Passenger:</strong> ${ticket.first_name_english} ${ticket.last_name_english} (Adult)</p>
    <p><strong>Route:</strong> ${originCityEn} (${originAirportEn}) → ${destCityEn} (${destAirportEn})</p>
    <p><strong>Date:</strong> ${ticket.flight_date} &nbsp; <strong>Time:</strong> ${ticket.flight_time}</p>
    <p><strong>Airline:</strong> ${airlineEn} &nbsp; <strong>Flight:</strong> ${ticket.flight_number}</p>
    <p><strong>Baggage Allowance:</strong> ${ticket.max_baggage} kg</p>
    <p><strong>Ticket Price:</strong> ${ticket.ticket_price.toLocaleString()} Rial</p>
    ${isFull ? `
        <p><strong>Reference:</strong> ${ticket.reference}</p>
        <p><strong>Watcher:</strong> ${ticket.watcher}</p>
        <p><strong>Penalty:</strong> ${ticket.penalty_percent}%</p>
        <p><strong>Refundable Amount:</strong> ${ticket.total_price.toLocaleString()} Rial</p>
        ` : ''}
        <div class="stamp-area">Stamp / Seal</div>
        ${!isFull ? `<p class="required-note">Passenger presence at the airport is mandatory at least 2 hours for domestic and 3 hours for international flights.</p>` : ''}
        </div>`;
}

async function exportPreviewAsImage() {
    const modalBody = document.getElementById('previewContent')!;
    const canvas = await html2canvas(modalBody, { scale: 2 });
    const dataUrl = canvas.toDataURL('image/png');
    if (currentPreviewTickets.length) {
        const t = currentPreviewTickets[0];
        const year = t.flight_date.split('/')[0];
        await api.saveImage(dataUrl, `${year}.${t.row_number}.png`);
    } else {
        await api.saveImage(dataUrl, 'ticket.png');
    }
}

// ---------- Multi‑select buttons ----------
document.getElementById('printSelectedBtn')!.addEventListener('click', () => {
    const ids = getSelectedIds();
    const selected = tickets.filter(t => ids.includes(t.id));
    if (selected.length) showPreview(selected);
});
document.getElementById('exportSelectedBtn')!.addEventListener('click', async () => {
    const ids = getSelectedIds();
    const selected = tickets.filter(t => ids.includes(t.id));
    if (!selected.length) return;

    const version = confirm('خروجی نسخه کامل (آژانس)؟\nOK = کامل\nCancel = مشتری');
    const isFull = version;
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;left:-9999px;top:0;';
    document.body.appendChild(container);

    selected.forEach(t => {
        const div = document.createElement('div');
        div.innerHTML = buildPreviewHTML(t, isFull);
        container.appendChild(div);
    });

    const canvas = await html2canvas(container, { scale: 2 });
    document.body.removeChild(container);
    const dataUrl = canvas.toDataURL('image/png');
    const t0 = selected[0];
    const year = t0.flight_date.split('/')[0];
    const defaultName = selected.length === 1 ? `${year}.${t0.row_number}.png` : `${year}.multi.png`;
    await api.saveImage(dataUrl, defaultName);
});

// ---------- Form building ----------
document.getElementById('newTicketBtn')!.addEventListener('click', () => {
    editingId = null;
    passengers = [{ firstNameFa: '', lastNameFa: '', firstNameEn: '', lastNameEn: '' }];
    buildForm();
});

function buildForm(existingTicket?: any) {
    const container = document.getElementById('formContainer')!;
    container.classList.remove('d-none');

    const hours = Array.from({ length: 24 }, (_, i) => {
        const n = i.toString().padStart(2, '0');
        return { english: n, persian: toPersianDigits(n) };
    });
    const minutes = Array.from({ length: 12 }, (_, i) => {
        const n = (i * 5).toString().padStart(2, '0');
        return { english: n, persian: toPersianDigits(n) };
    });

    // Circular arrow SVG icon
    const refreshSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
    </svg>`;

    let html = `
    <h4 class="mb-4 text-center" style="color: #2c3e50;">${existingTicket ? 'ویرایش بلیط' : 'ثبت بلیط جدید'}</h4>
    <form id="ticketForm" class="row g-3">
    <div class="col-md-6">
    <label class="form-label">شهر مبدا</label>
    <select id="originCity" class="form-select searchable" required>
    <option value="">انتخاب کنید</option>
    ${[...new Set(cityAirports.map(c => c.persianCity))].map(city => `<option value="${city}" ${existingTicket?.origin_city===city?'selected':''}>${city}</option>`).join('')}
    </select>
    </div>
    <div class="col-md-6">
    <label class="form-label">شهر مقصد</label>
    <select id="destCity" class="form-select searchable" required>
    <option value="">انتخاب کنید</option>
    ${[...new Set(cityAirports.map(c => c.persianCity))].map(city => `<option value="${city}" ${existingTicket?.destination_city===city?'selected':''}>${city}</option>`).join('')}
    </select>
    </div>
    <div class="col-md-6">
    <label class="form-label">فرودگاه مبدا</label>
    <select id="originAirport" class="form-select searchable" required></select>
    </div>
    <div class="col-md-6">
    <label class="form-label">فرودگاه مقصد</label>
    <select id="destAirport" class="form-select searchable" required></select>
    </div>
    <div class="col-md-6">
    <label class="form-label">تاریخ (جلالی)</label>
    <input type="text" id="flightDate" class="form-control" data-jdp value="${existingTicket?.flight_date||''}" required>
    </div>
    <div class="col-md-3">
    <label class="form-label">ساعت پرواز</label>
    <select id="flightHour" class="form-select" required>
    ${hours.map(h => `<option value="${h.english}" ${existingTicket?.flight_time?.startsWith(h.english+':')?'selected':''}>${h.persian}</option>`).join('')}
    </select>
    </div>
    <div class="col-md-3">
    <label class="form-label">دقیقه</label>
    <select id="flightMinute" class="form-select" required>
    ${minutes.map(m => `<option value="${m.english}" ${existingTicket?.flight_time?.endsWith(':'+m.english)?'selected':''}>${m.persian}</option>`).join('')}
    </select>
    </div>
    <div class="col-md-6">
    <label class="form-label">ایرلاین</label>
    <select id="airline" class="form-select searchable" required>
    <option value="">انتخاب کنید</option>
    ${airlines.map(a => `<option value="${a.persianName}" ${existingTicket?.airline===a.persianName?'selected':''}>${a.persianName}</option>`).join('')}
    </select>
    </div>
    <div class="col-md-3">
    <label class="form-label">شماره پرواز</label>
    <div class="input-group">
    <input type="text" id="flightNumber" class="form-control" value="${existingTicket?.flight_number||''}" required>
    <button type="button" class="btn btn-outline-secondary auto-flight" title="تولید تصادفی">${refreshSVG}</button>
    </div>
    </div>
    <div class="col-md-3">
    <label class="form-label">حداکثر بار (kg)</label>
    <input type="text" id="maxBaggage" class="form-control numeric" value="${existingTicket ? toPersianDigits(String(existingTicket.max_baggage)) : '۲۰'}" required>
    </div>

    <div class="col-md-3">
    <label class="form-label">ناظر (۸ رقمی)</label>
    <div class="input-group">
    <input type="text" id="watcher" class="form-control numeric" value="${existingTicket ? toPersianDigits(existingTicket.watcher) : ''}" required>
    <button type="button" class="btn btn-outline-secondary auto-watcher" title="تولید تصادفی">${refreshSVG}</button>
    </div>
    </div>
    <div class="col-md-3">
    <label class="form-label">مرجع (۶ کاراکتر)</label>
    <div class="input-group">
    <input type="text" id="reference" class="form-control" value="${existingTicket?.reference||''}" required>
    <button type="button" class="btn btn-outline-secondary auto-ref" title="تولید تصادفی">${refreshSVG}</button>
    </div>
    </div>

    <!-- Price row: half width -->
    <div class="col-md-6">
    <label class="form-label">قیمت بلیط (ریال)</label>
    <input type="text" id="ticketPrice" class="form-control numeric price-input" value="${existingTicket ? formatPrice(String(existingTicket.ticket_price)) : ''}" required>
    </div>
    <div class="col-12"></div> <!-- force next row -->
    <div class="col-md-6">
    <label class="form-label">درصد جریمه</label>
    <input type="text" id="penaltyPercent" class="form-control numeric" value="${existingTicket ? toPersianDigits(String(existingTicket.penalty_percent)) : '۰'}" required>
    </div>
    <div class="col-md-6">
    <label class="form-label">قیمت کل</label>
    <input type="text" id="totalPrice" class="form-control" readonly>
    </div>

    <!-- Passenger section -->
    <div class="col-12 mt-4">
    <h5 class="mb-3" style="color: #2c3e50;">مسافران</h5>
    <div id="passengerList"></div>
    <button type="button" id="addPassengerBtn" class="btn btn-outline-primary btn-sm mt-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
    افزودن مسافر
    </button>
    </div>

    <div class="col-12 d-flex justify-content-end gap-3 mt-4">
    <button type="button" id="cancelFormBtn" class="btn btn-outline-secondary btn-lg px-5">انصراف</button>
    <button type="submit" class="btn btn-success btn-lg px-5">ذخیره</button>
    </div>
    </form>`;

    container.innerHTML = html;

    // Initialize select2 for searchable elements
    $('.searchable').select2({
        placeholder: 'جستجو...',
        language: { noResults: () => 'نتیجه‌ای یافت نشد' }
    });

    // Initialize date picker
    jalaliDatepicker.startWatch({
        input: document.getElementById('flightDate')!,
                                persianDigits: true
    });

    // Populate origin/destination airports based on selected cities
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

    // Initialize for both with existing values
    populateAirports('originCity', 'originAirport', existingTicket?.origin_airport);
    populateAirports('destCity', 'destAirport', existingTicket?.destination_airport);

    // Bind change events
    $('#originCity').on('change', () => populateAirports('originCity', 'originAirport'));
    $('#destCity').on('change', () => populateAirports('destCity', 'destAirport'));

    // Render passenger inputs
    renderPassengerInputs();

    // Attach form events
    attachFormEvents(existingTicket);
}

// ---------- Passenger management ----------
function renderPassengerInputs() {
    const listDiv = document.getElementById('passengerList')!;
    listDiv.innerHTML = passengers.map((p, idx) => `
    <div class="passenger-row row g-3 align-items-center mt-3">
    <div class="col-md-3">
    <label class="form-label">نام فارسی</label>
    <input class="form-control" placeholder="نام" value="${p.firstNameFa}" data-idx="${idx}" data-field="firstNameFa">
    </div>
    <div class="col-md-3">
    <label class="form-label">نام خانوادگی فارسی</label>
    <input class="form-control" placeholder="نام خانوادگی" value="${p.lastNameFa}" data-idx="${idx}" data-field="lastNameFa">
    </div>
    <div class="col-md-3">
    <label class="form-label">First Name</label>
    <input class="form-control" placeholder="First" value="${p.firstNameEn}" data-idx="${idx}" data-field="firstNameEn">
    </div>
    <div class="col-md-3">
    <label class="form-label">Last Name</label>
    <input class="form-control" placeholder="Last" value="${p.lastNameEn}" data-idx="${idx}" data-field="lastNameEn">
    </div>
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
        document.getElementById('formContainer')!.classList.add('d-none');
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
            airline: $('#airline').val() as string,
            flight_number: (document.getElementById('flightNumber') as HTMLInputElement).value,
            max_baggage: parseInt(toEnglishDigits((document.getElementById('maxBaggage') as HTMLInputElement).value)) || 20,
            ticket_price: unformatPrice(priceInp.value),
            penalty_percent: parseInt(toEnglishDigits(penaltyInp.value)) || 0,
            total_price: unformatPrice(totalInp.value),
            watcher: toEnglishDigits((document.getElementById('watcher') as HTMLInputElement).value),
            reference: (document.getElementById('reference') as HTMLInputElement).value,
        };

        if (!passengers.length) {
            Swal.fire('خطا', 'حداقل یک مسافر وارد کنید.', 'error');
            return;
        }

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

        document.getElementById('formContainer')!.classList.add('d-none');
        editingId = null;
        passengers = [];
        loadTickets();
    };
}

// ---------- Initial load ----------
loadTickets();
