import crypto from 'crypto';

// 암호화 키 생성 (사용자 비밀번호 기반)
const generateKey = (password: string, salt: Buffer) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
};

// 암호화 함수
export const encryptCredentials = (text: string, password: string): string => {
    const salt = crypto.randomBytes(16);
    const key = generateKey(password, salt); // Password 토대로 Key 생성
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // salt, iv, 암호화된 데이터를 함께 저장
    return salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
};

// 복호화 함수
export const decryptCredentials = (encryptedText: string, password: string): string => {
    try {
        const parts = encryptedText.split(':');
        if (parts.length !== 3) {
            throw new Error('잘못된 암호화 형식입니다.');
        }
        
        const salt = Buffer.from(parts[0], 'hex');
        const iv = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];
        
        const key = generateKey(password, salt);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        throw new Error('복호화 실패: 비밀번호가 올바르지 않거나 파일이 손상되었습니다.');
    }
}; 