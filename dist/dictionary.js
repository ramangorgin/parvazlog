"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.airlines = exports.cityAirports = void 0;
exports.getCityEnglish = getCityEnglish;
exports.getAirportEnglish = getAirportEnglish;
exports.getAirlineEnglish = getAirlineEnglish;
exports.cityAirports = [
    { persianCity: 'تهران', englishCity: 'Tehran', airportPersian: 'مهرآباد', airportEnglish: 'Mehrabad International Airport', airportCode: 'THR' },
    { persianCity: 'تهران', englishCity: 'Tehran', airportPersian: 'امام خمینی', airportEnglish: 'Imam Khomeini International Airport', airportCode: 'IKA' },
    { persianCity: 'مشهد', englishCity: 'Mashhad', airportPersian: 'شهید هاشمی‌نژاد', airportEnglish: 'Mashhad International Airport', airportCode: 'MHD' },
    { persianCity: 'اصفهان', englishCity: 'Isfahan', airportPersian: 'شهید بهشتی', airportEnglish: 'Isfahan International Airport', airportCode: 'IFN' },
    { persianCity: 'شیراز', englishCity: 'Shiraz', airportPersian: 'شهید دستغیب', airportEnglish: 'Shiraz International Airport', airportCode: 'SYZ' },
    { persianCity: 'تبریز', englishCity: 'Tabriz', airportPersian: 'شهید مدنی', airportEnglish: 'Tabriz International Airport', airportCode: 'TBZ' },
    { persianCity: 'اهواز', englishCity: 'Ahvaz', airportPersian: 'سردار سلیمانی', airportEnglish: 'Ahvaz International Airport', airportCode: 'AWZ' },
    { persianCity: 'کرمان', englishCity: 'Kerman', airportPersian: 'آیت‌الله هاشمی رفسنجانی', airportEnglish: 'Kerman Airport', airportCode: 'KER' },
    { persianCity: 'یزد', englishCity: 'Yazd', airportPersian: 'شهید صدوقی', airportEnglish: 'Yazd Airport', airportCode: 'AZD' },
    { persianCity: 'بندرعباس', englishCity: 'Bandar Abbas', airportPersian: 'بین‌المللی بندرعباس', airportEnglish: 'Bandar Abbas International Airport', airportCode: 'BND' },
    { persianCity: 'کیش', englishCity: 'Kish', airportPersian: 'بین‌المللی کیش', airportEnglish: 'Kish International Airport', airportCode: 'KIH' },
    { persianCity: 'رشت', englishCity: 'Rasht', airportPersian: 'سردار جنگل', airportEnglish: 'Sardar-e Jangal Airport', airportCode: 'RAS' },
    { persianCity: 'بوشهر', englishCity: 'Bushehr', airportPersian: 'شهید یاسینی', airportEnglish: 'Bushehr Airport', airportCode: 'BUZ' },
    { persianCity: 'اردبیل', englishCity: 'Ardabil', airportPersian: 'اردبیل', airportEnglish: 'Ardabil Airport', airportCode: 'ADU' },
    { persianCity: 'ارومیه', englishCity: 'Urmia', airportPersian: 'شهید باکری', airportEnglish: 'Urmia Airport', airportCode: 'OMH' },
    { persianCity: 'زاهدان', englishCity: 'Zahedan', airportPersian: 'بین‌المللی زاهدان', airportEnglish: 'Zahedan International Airport', airportCode: 'ZAH' },
    { persianCity: 'چابهار', englishCity: 'Chabahar', airportPersian: 'کنارک', airportEnglish: 'Konarak Airport', airportCode: 'ZBR' },
    { persianCity: 'زابل', englishCity: 'Zabol', airportPersian: 'زابل', airportEnglish: 'Zabol Airport', airportCode: 'ACZ' },
    { persianCity: 'ایرانشهر', englishCity: 'Iranshahr', airportPersian: 'ایرانشهر', airportEnglish: 'Iranshahr Airport', airportCode: 'IHR' },
    { persianCity: 'بیرجند', englishCity: 'Birjand', airportPersian: 'بین‌المللی بیرجند', airportEnglish: 'Birjand International Airport', airportCode: 'XBJ' },
    { persianCity: 'طبس', englishCity: 'Tabas', airportPersian: 'شهید رحمانی', airportEnglish: 'Tabas Airport', airportCode: 'TCX' },
    { persianCity: 'کرمانشاه', englishCity: 'Kermanshah', airportPersian: 'شهید اشرفی اصفهانی', airportEnglish: 'Kermanshah Airport', airportCode: 'KSH' },
    { persianCity: 'سنندج', englishCity: 'Sanandaj', airportPersian: 'سنندج', airportEnglish: 'Sanandaj Airport', airportCode: 'SDG' },
    { persianCity: 'همدان', englishCity: 'Hamedan', airportPersian: 'همدان', airportEnglish: 'Hamedan Airport', airportCode: 'HDM' },
    { persianCity: 'خرم‌آباد', englishCity: 'Khorramabad', airportPersian: 'خرم‌آباد', airportEnglish: 'Khorramabad Airport', airportCode: 'KHD' },
    { persianCity: 'آبادان', englishCity: 'Abadan', airportPersian: 'بین‌المللی آبادان', airportEnglish: 'Abadan International Airport', airportCode: 'ABD' },
    { persianCity: 'دزفول', englishCity: 'Dezful', airportPersian: 'دزفول', airportEnglish: 'Dezful Airport', airportCode: 'DEF' },
    { persianCity: 'ماهشهر', englishCity: 'Mahshahr', airportPersian: 'ماهشهر', airportEnglish: 'Mahshahr Airport', airportCode: 'MRX' },
    { persianCity: 'گرگان', englishCity: 'Gorgan', airportPersian: 'گرگان', airportEnglish: 'Gorgan Airport', airportCode: 'GBT' },
    { persianCity: 'ساری', englishCity: 'Sari', airportPersian: 'دشت ناز', airportEnglish: 'Dasht-e Naz Airport', airportCode: 'SRY' },
    { persianCity: 'رامسر', englishCity: 'Ramsar', airportPersian: 'رامسر', airportEnglish: 'Ramsar Airport', airportCode: 'RZR' },
    { persianCity: 'نوشهر', englishCity: 'Nowshahr', airportPersian: 'نوشهر', airportEnglish: 'Nowshahr Airport', airportCode: 'NSH' },
    { persianCity: 'قشم', englishCity: 'Qeshm', airportPersian: 'بین‌المللی قشم', airportEnglish: 'Qeshm International Airport', airportCode: 'GSM' },
    { persianCity: 'لار', englishCity: 'Lar', airportPersian: 'آیت‌الله آیت‌اللهی', airportEnglish: 'Larestan International Airport', airportCode: 'LRR' },
    { persianCity: 'لامرد', englishCity: 'Lamerd', airportPersian: 'لامرد', airportEnglish: 'Lamerd Airport', airportCode: 'LFM' },
    { persianCity: 'جهرم', englishCity: 'Jahrom', airportPersian: 'جهرم', airportEnglish: 'Jahrom Airport', airportCode: 'JAR' },
    { persianCity: 'فسا', englishCity: 'Fasa', airportPersian: 'فسا', airportEnglish: 'Fasa Airport', airportCode: 'FAZ' },
    { persianCity: 'گچساران', englishCity: 'Gachsaran', airportPersian: 'گچساران', airportEnglish: 'Gachsaran Airport', airportCode: 'GCH' },
    { persianCity: 'یاسوج', englishCity: 'Yasuj', airportPersian: 'یاسوج', airportEnglish: 'Yasuj Airport', airportCode: 'YES' },
    { persianCity: 'ایلام', englishCity: 'Ilam', airportPersian: 'ایلام', airportEnglish: 'Ilam Airport', airportCode: 'IIL' },
    { persianCity: 'بجنورد', englishCity: 'Bojnord', airportPersian: 'بجنورد', airportEnglish: 'Bojnord Airport', airportCode: 'BJB' },
    { persianCity: 'سبزوار', englishCity: 'Sabzevar', airportPersian: 'شهدای سبزوار', airportEnglish: 'Sabzevar Airport', airportCode: 'AFZ' },
    { persianCity: 'گناباد', englishCity: 'Gonabad', airportPersian: 'گناباد', airportEnglish: 'Gonabad Airport', airportCode: 'GKD' },
    { persianCity: 'رفسنجان', englishCity: 'Rafsanjan', airportPersian: 'رفسنجان', airportEnglish: 'Rafsanjan Airport', airportCode: 'RJN' },
    { persianCity: 'سیرجان', englishCity: 'Sirjan', airportPersian: 'سیرجان', airportEnglish: 'Sirjan Airport', airportCode: 'SYJ' },
    { persianCity: 'جیرفت', englishCity: 'Jiroft', airportPersian: 'جیرفت', airportEnglish: 'Jiroft Airport', airportCode: 'JYR' },
    { persianCity: 'بم', englishCity: 'Bam', airportPersian: 'بم', airportEnglish: 'Bam Airport', airportCode: 'BXR' },
    { persianCity: 'خرمشهر', englishCity: 'Khorramshahr', airportPersian: 'بین‌المللی خرمشهر', airportEnglish: 'Khorramshahr International Airport', airportCode: 'KHZ' },
];
exports.airlines = [
    { persianName: 'ایران ایر', englishName: 'Iran Air', code: 'IR' },
    { persianName: 'ماهان', englishName: 'Mahan Air', code: 'W5' },
    { persianName: 'آسمان', englishName: 'Aseman Airlines', code: 'EP' },
    { persianName: 'زاگرس', englishName: 'Zagros Airlines', code: 'ZV' },
    { persianName: 'آتا', englishName: 'ATA Airlines', code: 'I3' },
    { persianName: 'قشم ایر', englishName: 'Qeshm Air', code: 'QB' },
    { persianName: 'معراج', englishName: 'Meraj Airlines', code: 'JI' },
    { persianName: 'کیش ایر', englishName: 'Kish Air', code: 'Y9' },
    { persianName: 'کاسپین', englishName: 'Caspian Airlines', code: 'RV' },
    { persianName: 'تابان', englishName: 'Taban Air', code: 'HH' },
    { persianName: 'ساها', englishName: 'Saha Airlines', code: 'IRZ' },
    { persianName: 'وارش', englishName: 'Varesh Airlines', code: 'VRH' },
    { persianName: 'پویا', englishName: 'Pouya Air', code: 'PYA' },
    { persianName: 'کارون', englishName: 'Karun Airlines', code: 'IRK' },
];
function getCityEnglish(persian) {
    const f = exports.cityAirports.find(c => c.persianCity === persian);
    return f ? f.englishCity : persian;
}
function getAirportEnglish(persianAirportName) {
    const f = exports.cityAirports.find(c => c.airportPersian === persianAirportName);
    return f ? f.airportEnglish : persianAirportName;
}
function getAirlineEnglish(persian) {
    const f = exports.airlines.find(a => a.persianName === persian);
    return f ? f.englishName : persian;
}
