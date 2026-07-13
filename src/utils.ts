const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishDigits = ['0','1','2','3','4','5','6','7','8','9'];

export function toEnglishDigits(str: string): string {
    return str.replace(/[۰-۹]/g, d => englishDigits[persianDigits.indexOf(d)]);
}

export function toPersianDigits(str: string): string {
    return str.replace(/[0-9]/g, d => persianDigits[parseInt(d)]);
}

export function generateReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = '';
    for (let i = 0; i < 6; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
    return ref;
}

export function generateWatcher(): string {
    return String(Math.floor(10000000 + Math.random() * 90000000)); // 8-digit
}

export function generateFlightNumber(): string {
    const airlineCodes = ['IR', 'W5', 'EP', 'ZV', 'I3', 'QB']; // sample
    const code = airlineCodes[Math.floor(Math.random() * airlineCodes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${code}${num}`;
}
