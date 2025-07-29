import AWS from "aws-sdk";
import fs from 'fs';
import path from 'path';

// 사용자별 자격 증명 저장 디렉토리
const CREDENTIALS_DIR = path.join(process.cwd(), 'aws-credentials');

// 디렉토리가 없으면 생성
if (!fs.existsSync(CREDENTIALS_DIR)) {
    fs.mkdirSync(CREDENTIALS_DIR, { recursive: true });
}

// 사용자별 자격 증명 파일 경로 생성
const getUserCredentialsFile = (userId: string) => {
    return path.join(CREDENTIALS_DIR, `user-${userId}.json`);
};

// 사용자별 AWS 인스턴스 저장
const userAWSInstances = new Map<string, any>();

// 사용자별 AWS 인스턴스 생성
const createUserAWSInstance = (userId: string, accessKeyId: string, secretAccessKey: string, region: string = 'us-east-1') => {
    const awsInstance = AWS;
    awsInstance.config.update({
        accessKeyId,
        secretAccessKey,
        region
    });
    
    userAWSInstances.set(userId, awsInstance);
    return awsInstance;
};

// 사용자별 AWS 인스턴스 가져오기
const getUserAWSInstance = (userId: string) => {
    return userAWSInstances.get(userId);
};

// 자격 증명을 파일에 저장 (사용자별)
export const saveCredentials = (userId: string, accessKeyId: string, secretAccessKey: string, region: string = 'us-east-1') => {
    try {
        const credentials = {
            accessKeyId,
            secretAccessKey,
            region,
            savedAt: new Date().toISOString()
        };
        
        const filePath = getUserCredentialsFile(userId);
        fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
        
        // 파일 권한 설정 (600: 소유자만 읽기/쓰기)
        fs.chmodSync(filePath, 0o600);
        
        // 사용자별 AWS 인스턴스 생성
        createUserAWSInstance(userId, accessKeyId, secretAccessKey, region);
        
        console.log(`자격 증명이 파일에 저장되었습니다. (사용자: ${userId})`);
        console.log(`저장 위치 : ${filePath}`);
        return true;
    } catch (error) {
        console.error('자격 증명 저장 실패:', error);
        return false;
    }
};

// 파일에서 자격 증명 불러오기 (사용자별)
export const loadCredentials = (userId: string) => {
    try {
        const filePath = getUserCredentialsFile(userId);
        
        if (!fs.existsSync(filePath)) {
            return null;
        }
        
        const data = fs.readFileSync(filePath, 'utf8');
        const credentials = JSON.parse(data);
        
        // 사용자별 AWS 인스턴스 생성
        createUserAWSInstance(userId, credentials.accessKeyId, credentials.secretAccessKey, credentials.region);
        
        console.log(`파일에서 자격 증명을 불러왔습니다. (사용자: ${userId})`);
        return credentials;
    } catch (error) {
        console.error('자격 증명 불러오기 실패:', error);
        return null;
    }
};

// 저장된 자격 증명 정보 확인 (사용자별)
export const getSavedCredentials = (userId: string) => {
    try {
        const filePath = getUserCredentialsFile(userId);
        
        if (!fs.existsSync(filePath)) {
            return null;
        }
        
        const data = fs.readFileSync(filePath, 'utf8');
        const credentials = JSON.parse(data);
        
        return {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: '***', // 보안상 마스킹
            region: credentials.region,
            savedAt: credentials.savedAt
        };
    } catch (error) {
        return null;
    }
};

// 자격 증명 파일 삭제 (사용자별)
export const deleteCredentials = (userId: string) => {
    try {
        const filePath = getUserCredentialsFile(userId);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            // 사용자별 AWS 인스턴스 제거
            userAWSInstances.delete(userId);
            console.log(`자격 증명 파일이 삭제되었습니다. (사용자: ${userId})`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('자격 증명 파일 삭제 실패:', error);
        return false;
    }
};

// 자격 증명이 설정되어 있는지 확인 (사용자별)
export const checkCredentials = (userId: string) => {
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

// AWS 자격 증명 유효성 검사 (사용자별)
export const validateCredentials = async (userId: string) => {
    try {
        // 자격 증명이 설정되어 있는지 확인
        if (!checkCredentials(userId)) {
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
    } catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
};

// AWS 계정 정보 가져오기 (사용자별)
export const getAccountInfo = async (userId: string) => {
    try {
        // 자격 증명이 설정되어 있는지 확인
        if (!checkCredentials(userId)) {
            throw new Error('자격 증명이 설정되지 않았습니다. /aws configure 또는 /aws load-credentials 명령어로 자격 증명을 설정하세요.');
        }

        const awsInstance = getUserAWSInstance(userId);
        const sts = new awsInstance.STS();
        const response = await sts.getCallerIdentity().promise();
        return response;
    } catch (error) {
        throw new Error(`AWS 계정 정보 조회 실패: ${error}`);
    }
};

// IAM 사용자 정보 가져오기 (사용자별)
export const getIAMUserInfo = async (userId: string, username: string) => {
    try {
        // 자격 증명이 설정되어 있는지 확인
        if (!checkCredentials(userId)) {
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
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('IAM API 호출 시간 초과')), 1000)
            )
        ]);
        
        return response as any; // 타입 에러 해결을 위해 any 사용
    } catch (error) {
        throw new Error(`IAM 사용자 정보 조회 실패: ${error}`);
    }
};

// IAM 사용자 목록 가져오기 (사용자별)
export const getIAMList = async (userId: string) => {
    try {
        // 자격 증명이 설정되어 있는지 확인
        if (!checkCredentials(userId)) {
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
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('IAM API 호출 시간 초과')), 1000)
            )
        ]);
        
        const userResponse = response as any;
        return userResponse.Users?.map((user: any) => user.UserName).join('\n') || 'IAM 사용자가 없습니다.';
    } catch (error) {
        return `IAM 사용자 목록 조회 실패: ${error instanceof Error ? error.message : String(error)}\n\n**해결 방법:**\n1. 자격 증명이 올바른지 확인하세요\n2. IAM 권한이 있는지 확인하세요`;
    }
};

// 현재 설정된 자격 증명 정보 가져오기 (사용자별)
export const getCurrentCredentials = (userId: string) => {
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

// AWS Console 로그인 URL 생성 (region 기반)
export const generateAWSConsoleUrl = (region: string = 'us-east-1') => {
    const baseUrl = 'https://signin.aws.amazon.com/console';
    const params = new URLSearchParams({
        region: region,
        destination: 'console'
    });
    
    return `${baseUrl}?${params.toString()}`;
};

// AWS CLI 자격 증명 설정 (사용자별)
export const configureAWSCredentials = (userId: string, accessKeyId: string, secretAccessKey: string, region: string = 'us-east-1', sessionToken?: string) => {
    const credentials = new AWS.Credentials({
        accessKeyId,
        secretAccessKey,
        sessionToken
    });

    const awsInstance = AWS;
    awsInstance.config.update({
        credentials,
        region
    });

    // 사용자별 AWS 인스턴스 저장
    userAWSInstances.set(userId, awsInstance);

    return credentials;
};