"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRDSInstanceStatus = exports.deleteRDSInstance = exports.listRDSInstances = exports.createRDSInstance = void 0;
const AWS_function_1 = require("./AWS.function");
// 사용자별 RDS 클라이언트 생성
const getUserRDSClient = (userId, region = "ap-northeast-2") => {
    const userAWS = (0, AWS_function_1.getUserAWSInstance)(userId);
    if (!userAWS) {
        throw new Error("AWS 자격 증명이 설정되지 않았습니다. `/aws configure` 명령어로 먼저 설정해주세요.");
    }
    return userAWS.RDS(region);
};
// RDS 인스턴스 생성
const createRDSInstance = async (userId, { dbInstanceIdentifier, dbInstanceClass = "db.t3.micro", engine = "mysql", masterUsername, masterUserPassword, allocatedStorage = 20, subnetGroupName, region = "ap-northeast-2", }) => {
    console.log(`RDS 생성 시작 - 사용자: ${userId}, 리전: ${region}, DB ID: ${dbInstanceIdentifier}`);
    const rds = getUserRDSClient(userId, region);
    const params = {
        DBInstanceIdentifier: dbInstanceIdentifier,
        DBInstanceClass: dbInstanceClass,
        Engine: engine,
        MasterUsername: masterUsername,
        MasterUserPassword: masterUserPassword,
        AllocatedStorage: allocatedStorage,
        PubliclyAccessible: true, // 외부 접근 허용
        BackupRetentionPeriod: 0, // 백업 비활성화 (비용 절약)
        MultiAZ: false, // Multi-AZ 비활성화 (비용 절약)
        StorageType: "gp2", // 범용 SSD
        // SQL Server의 경우 라이센스 모델 설정
        ...(engine.startsWith("sqlserver") && {
            LicenseModel: "license-included",
        }),
        // Oracle의 경우 라이센스 모델 설정
        ...(engine.startsWith("oracle") && {
            LicenseModel: "license-included",
        }),
        ...(subnetGroupName && {
            DBSubnetGroupName: subnetGroupName,
        }),
    };
    console.log("RDS 생성 파라미터:", {
        DBInstanceIdentifier: params.DBInstanceIdentifier,
        DBInstanceClass: params.DBInstanceClass,
        Engine: params.Engine,
        MasterUsername: params.MasterUsername,
        AllocatedStorage: params.AllocatedStorage,
        StorageType: params.StorageType,
        region: region,
    });
    try {
        const result = await rds.createDBInstance(params).promise();
        console.log("RDS 인스턴스 생성 성공:", dbInstanceIdentifier);
        return result;
    }
    catch (error) {
        console.error("RDS 인스턴스 생성 실패:", error);
        throw error;
    }
};
exports.createRDSInstance = createRDSInstance;
// RDS 인스턴스 목록 조회
const listRDSInstances = async (userId, region = "ap-northeast-2") => {
    const rds = getUserRDSClient(userId, region);
    const result = await rds.describeDBInstances().promise();
    return (result.DBInstances?.map((instance) => ({
        id: instance.DBInstanceIdentifier,
        status: instance.DBInstanceStatus,
        engine: instance.Engine,
        endpoint: instance.Endpoint?.Address || "N/A",
        port: instance.Endpoint?.Port || "N/A",
        instanceClass: instance.DBInstanceClass,
        availabilityZone: instance.AvailabilityZone,
        multiAZ: instance.MultiAZ,
        storageEncrypted: instance.StorageEncrypted,
        allocatedStorage: instance.AllocatedStorage,
    })) || []);
};
exports.listRDSInstances = listRDSInstances;
// RDS 인스턴스 삭제
const deleteRDSInstance = async (userId, dbInstanceIdentifier, skipFinalSnapshot = true, region = "ap-northeast-2") => {
    const rds = getUserRDSClient(userId, region);
    const params = {
        DBInstanceIdentifier: dbInstanceIdentifier,
        SkipFinalSnapshot: skipFinalSnapshot,
    };
    return rds.deleteDBInstance(params).promise();
};
exports.deleteRDSInstance = deleteRDSInstance;
// RDS 인스턴스 상태 확인
const getRDSInstanceStatus = async (userId, dbInstanceIdentifier, region = "ap-northeast-2") => {
    const rds = getUserRDSClient(userId, region);
    const params = {
        DBInstanceIdentifier: dbInstanceIdentifier,
    };
    const result = await rds.describeDBInstances(params).promise();
    const instance = result.DBInstances?.[0];
    if (!instance) {
        throw new Error(`RDS 인스턴스 '${dbInstanceIdentifier}'를 찾을 수 없습니다.`);
    }
    return {
        id: instance.DBInstanceIdentifier,
        status: instance.DBInstanceStatus,
        engine: instance.Engine,
        endpoint: instance.Endpoint?.Address || "N/A",
        port: instance.Endpoint?.Port || "N/A",
        instanceClass: instance.DBInstanceClass,
        availabilityZone: instance.AvailabilityZone,
    };
};
exports.getRDSInstanceStatus = getRDSInstanceStatus;
