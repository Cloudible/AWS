"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAWSCredentials = exports.generateAWSConsoleUrl = exports.getCurrentCredentials = exports.getIAMList = exports.getIAMUserInfo = exports.getAccountInfo = exports.validateCredentials = exports.checkCredentials = exports.deleteCredentials = exports.getSavedCredentials = exports.loadCredentials = exports.saveCredentials = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 사용자별 자격 증명 저장 디렉토리
const CREDENTIALS_DIR = path_1.default.join(process.cwd(), 'aws-credentials');
// 디렉토리가 없으면 생성
if (!fs_1.default.existsSync(CREDENTIALS_DIR)) {
    fs_1.default.mkdirSync(CREDENTIALS_DIR, { recursive: true });
}
// 사용자별 자격 증명 파일 경로 생성
const getUserCredentialsFile = (userId) => {
    return path_1.default.join(CREDENTIALS_DIR, `user-${userId}.json`);
};
// 사용자별 AWS 인스턴스 저장
const userAWSInstances = new Map();
// 사용자별 AWS 인스턴스 생성
const createUserAWSInstance = (userId, accessKeyId, secretAccessKey, region = 'us-east-1') => {
    const awsInstance = aws_sdk_1.default;
    awsInstance.config.update({
        accessKeyId,
        secretAccessKey,
        region
    });
    userAWSInstances.set(userId, awsInstance);
    return awsInstance;
};
// 사용자별 AWS 인스턴스 가져오기
const getUserAWSInstance = (userId) => {
    return userAWSInstances.get(userId);
};
// 자격 증명을 파일에 저장 (사용자별)
const saveCredentials = (userId, accessKeyId, secretAccessKey, region = 'us-east-1') => {
    try {
        const credentials = {
            accessKeyId,
            secretAccessKey,
            region,
            savedAt: new Date().toISOString()
        };
        const filePath = getUserCredentialsFile(userId);
        fs_1.default.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
        // 파일 권한 설정 (600: 소유자만 읽기/쓰기)
        fs_1.default.chmodSync(filePath, 0o600);
        // 사용자별 AWS 인스턴스 생성
        createUserAWSInstance(userId, accessKeyId, secretAccessKey, region);
        console.log(`자격 증명이 파일에 저장되었습니다. (사용자: ${userId})`);
        console.log(`저장 위치 : ${filePath}`);
        return true;
    }
    catch (error) {
        console.error('자격 증명 저장 실패:', error);
        return false;
    }
};
exports.saveCredentials = saveCredentials;
// 파일에서 자격 증명 불러오기 (사용자별)
const loadCredentials = (userId) => {
    try {
        const filePath = getUserCredentialsFile(userId);
        if (!fs_1.default.existsSync(filePath)) {
            return null;
        }
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        const credentials = JSON.parse(data);
        // 사용자별 AWS 인스턴스 생성
        createUserAWSInstance(userId, credentials.accessKeyId, credentials.secretAccessKey, credentials.region);
        console.log(`파일에서 자격 증명을 불러왔습니다. (사용자: ${userId})`);
        return credentials;
    }
    catch (error) {
        console.error('자격 증명 불러오기 실패:', error);
        return null;
    }
};
exports.loadCredentials = loadCredentials;
// 저장된 자격 증명 정보 확인 (사용자별)
const getSavedCredentials = (userId) => {
    try {
        const filePath = getUserCredentialsFile(userId);
        if (!fs_1.default.existsSync(filePath)) {
            return null;
        }
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        const credentials = JSON.parse(data);
        return {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: '***', // 보안상 마스킹
            region: credentials.region,
            savedAt: credentials.savedAt
        };
    }
    catch (error) {
        return null;
    }
};
exports.getSavedCredentials = getSavedCredentials;
// 자격 증명 파일 삭제 (사용자별)
const deleteCredentials = (userId) => {
    try {
        const filePath = getUserCredentialsFile(userId);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            // 사용자별 AWS 인스턴스 제거
            userAWSInstances.delete(userId);
            console.log(`자격 증명 파일이 삭제되었습니다. (사용자: ${userId})`);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('자격 증명 파일 삭제 실패:', error);
        return false;
    }
};
exports.deleteCredentials = deleteCredentials;
// 자격 증명이 설정되어 있는지 확인 (사용자별)
const checkCredentials = (userId) => {
    const awsInstance = getUserAWSInstance(userId);
    if (!awsInstance) {
        return false;
    }
    const credentials = awsInstance.config.credentials;
    if (!credentials || !credentials.accessKeyId || !credentials.secretAccessKey) {
        return false;
    }
    return true;
};
exports.checkCredentials = checkCredentials;
// AWS 자격 증명 유효성 검사 (사용자별)
const validateCredentials = async (userId) => {
    try {
        // 자격 증명이 설정되어 있는지 확인
        if (!(0, exports.checkCredentials)(userId)) {
            return {
                valid: false,
                error: '자격 증명이 설정되지 않았습니다. /aws configure 또는 /aws load-credentials 명령어로 자격 증명을 설정하세요.'
            };
        }
        const awsInstance = getUserAWSInstance(userId);
        const sts = new awsInstance.STS();
        const response = await sts.getCallerIdentity().promise();
        return {
            valid: true,
            accountId: response.Account,
            userId: response.UserId,
            arn: response.Arn
        };
    }
    catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
};
exports.validateCredentials = validateCredentials;
// AWS 계정 정보 가져오기 (사용자별)
const getAccountInfo = async (userId) => {
    try {
        // 자격 증명이 설정되어 있는지 확인
        if (!(0, exports.checkCredentials)(userId)) {
            throw new Error('자격 증명이 설정되지 않았습니다. /aws configure 또는 /aws load-credentials 명령어로 자격 증명을 설정하세요.');
        }
        const awsInstance = getUserAWSInstance(userId);
        const sts = new awsInstance.STS();
        const response = await sts.getCallerIdentity().promise();
        return response;
    }
    catch (error) {
        throw new Error(`AWS 계정 정보 조회 실패: ${error}`);
    }
};
exports.getAccountInfo = getAccountInfo;
// IAM 사용자 정보 가져오기 (사용자별)
const getIAMUserInfo = async (userId, username) => {
    try {
        // 자격 증명이 설정되어 있는지 확인
        if (!(0, exports.checkCredentials)(userId)) {
            throw new Error('자격 증명이 설정되지 않았습니다. /aws configure 또는 /aws load-credentials 명령어로 자격 증명을 설정하세요.');
        }
        const awsInstance = getUserAWSInstance(userId);
        const iam = new awsInstance.IAM();
        const params = {
            UserName: username
        };
        // 타임아웃 설정 (1초)
        const response = await Promise.race([
            iam.getUser(params).promise(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('IAM API 호출 시간 초과')), 1000))
        ]);
        return response; // 타입 에러 해결을 위해 any 사용
    }
    catch (error) {
        throw new Error(`IAM 사용자 정보 조회 실패: ${error}`);
    }
};
exports.getIAMUserInfo = getIAMUserInfo;
// IAM 사용자 목록 가져오기 (사용자별)
const getIAMList = async (userId) => {
    try {
        // 자격 증명이 설정되어 있는지 확인
        if (!(0, exports.checkCredentials)(userId)) {
            return '자격 증명이 설정되지 않았습니다.\n\n**해결 방법:**\n1. /aws configure 명령어로 자격 증명을 설정하세요\n2. 또는 /aws load-credentials 명령어로 저장된 자격 증명을 불러오세요';
        }
        const awsInstance = getUserAWSInstance(userId);
        const iam = new awsInstance.IAM();
        const params = {
            MaxItems: 50 // 더 적은 수로 제한
        };
        // 타임아웃 설정 (1초)
        const response = await Promise.race([
            iam.listUsers(params).promise(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('IAM API 호출 시간 초과')), 1000))
        ]);
        const userResponse = response;
        return userResponse.Users?.map((user) => user.UserName).join('\n') || 'IAM 사용자가 없습니다.';
    }
    catch (error) {
        return `IAM 사용자 목록 조회 실패: ${error instanceof Error ? error.message : String(error)}\n\n**해결 방법:**\n1. 자격 증명이 올바른지 확인하세요\n2. IAM 권한이 있는지 확인하세요`;
    }
};
exports.getIAMList = getIAMList;
// 현재 설정된 자격 증명 정보 가져오기 (사용자별)
const getCurrentCredentials = (userId) => {
    const awsInstance = getUserAWSInstance(userId);
    if (!awsInstance) {
        return null;
    }
    const credentials = awsInstance.config.credentials;
    if (!credentials) {
        return null;
    }
    return {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey ? '***' : undefined,
        sessionToken: credentials.sessionToken
    };
};
exports.getCurrentCredentials = getCurrentCredentials;
// AWS Console 로그인 URL 생성 (region 기반)
const generateAWSConsoleUrl = (region = 'us-east-1') => {
    const baseUrl = 'https://signin.aws.amazon.com/console';
    const params = new URLSearchParams({
        region: region,
        destination: 'console'
    });
    return `${baseUrl}?${params.toString()}`;
};
exports.generateAWSConsoleUrl = generateAWSConsoleUrl;
// AWS CLI 자격 증명 설정 (사용자별)
const configureAWSCredentials = (userId, accessKeyId, secretAccessKey, region = 'us-east-1', sessionToken) => {
    const credentials = new aws_sdk_1.default.Credentials({
        accessKeyId,
        secretAccessKey,
        sessionToken
    });
    const awsInstance = aws_sdk_1.default;
    awsInstance.config.update({
        credentials,
        region
    });
    // 사용자별 AWS 인스턴스 저장
    userAWSInstances.set(userId, awsInstance);
    return credentials;
};
exports.configureAWSCredentials = configureAWSCredentials;
