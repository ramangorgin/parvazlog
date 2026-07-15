"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEnglishDigits = toEnglishDigits;
exports.toPersianDigits = toPersianDigits;
exports.generateReference = generateReference;
exports.generateWatcher = generateWatcher;
exports.generateFlightNumber = generateFlightNumber;
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
function toEnglishDigits(str) {
    return str.replace(/[۰-۹]/g, d => englishDigits[persianDigits.indexOf(d)]);
}
function toPersianDigits(str) {
    return str.replace(/[0-9]/g, d => persianDigits[parseInt(d)]);
}
function generateReference() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = '';
    for (let i = 0; i < 8; i++)
        ref += chars.charAt(Math.floor(Math.random() * chars.length));
    return ref;
}
function generateWatcher() {
    return String(Math.floor(10000000 + Math.random() * 90000000)); // 8-digit
}
function generateFlightNumber() {
    const airlineCodes = ['IR', 'W5', 'EP', 'ZV', 'I3', 'QB']; // sample
    const code = airlineCodes[Math.floor(Math.random() * airlineCodes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${code}${num}`;
}
