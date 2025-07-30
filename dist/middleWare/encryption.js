"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptCredentials = exports.encryptCredentials = void 0;
const crypto_1 = __importDefault(require("crypto"));
// 암호화 키 생성 (사용자 비밀번호 기반)
const generateKey = (password, salt) => {
    return crypto_1.default.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
};
// 암호화 함수
const encryptCredentials = (text, password) => {
    const salt = crypto_1.default.randomBytes(16);
    const key = generateKey(password, salt); // Password 토대로 Key 생성
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // salt, iv, 암호화된 데이터를 함께 저장
    return salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
};
exports.encryptCredentials = encryptCredentials;
// 복호화 함수
const decryptCredentials = (encryptedText, password) => {
    try {
        const parts = encryptedText.split(':');
        if (parts.length !== 3) {
            throw new Error('잘못된 암호화 형식입니다.');
        }
        const salt = Buffer.from(parts[0], 'hex');
        const iv = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];
        const key = generateKey(password, salt);
        const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        throw new Error('복호화 실패: 비밀번호가 올바르지 않거나 파일이 손상되었습니다.');
    }
};
exports.decryptCredentials = decryptCredentials;
