// src/function/RDS.function.ts
import AWS from "aws-sdk";
import { getUserAWSInstance } from "./AWS.function";

// 사용자별 RDS 클라이언트 생성
const getUserRDSClient = (
  userId: string,
  region: string = "ap-northeast-2"
) => {
  const userAWS = getUserAWSInstance(userId);
  if (!userAWS) {
    throw new Error(
      "AWS 자격 증명이 설정되지 않았습니다. `/aws configure` 명령어로 먼저 설정해주세요."
    );
  }
  return userAWS.RDS(region);
};

// RDS 인스턴스 생성
export const createRDSInstance = async (
  userId: string,
  {
    dbInstanceIdentifier,
    dbInstanceClass = "db.t3.micro",
    engine = "mysql",
    masterUsername,
    masterUserPassword,
    allocatedStorage = 20,
    subnetGroupName,
    region = "ap-northeast-2",
  }: {
    dbInstanceIdentifier: string;
    dbInstanceClass?: string;
    engine?: string;
    masterUsername: string;
    masterUserPassword: string;
    allocatedStorage?: number;
    subnetGroupName?: string;
    region?: string;
  }
) => {
  console.log(
    `RDS 생성 시작 - 사용자: ${userId}, 리전: ${region}, DB ID: ${dbInstanceIdentifier}`
  );

  const rds = getUserRDSClient(userId, region);

  const params: AWS.RDS.CreateDBInstanceMessage = {
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
  } catch (error) {
    console.error("RDS 인스턴스 생성 실패:", error);
    throw error;
  }
};

// RDS 인스턴스 목록 조회
export const listRDSInstances = async (
  userId: string,
  region: string = "ap-northeast-2"
) => {
  const rds = getUserRDSClient(userId, region);

  const result = await rds.describeDBInstances().promise();
  return (
    result.DBInstances?.map((instance: any) => ({
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
    })) || []
  );
};

// RDS 인스턴스 삭제
export const deleteRDSInstance = async (
  userId: string,
  dbInstanceIdentifier: string,
  skipFinalSnapshot: boolean = true,
  region: string = "ap-northeast-2"
) => {
  const rds = getUserRDSClient(userId, region);

  const params: AWS.RDS.DeleteDBInstanceMessage = {
    DBInstanceIdentifier: dbInstanceIdentifier,
    SkipFinalSnapshot: skipFinalSnapshot,
  };

  return rds.deleteDBInstance(params).promise();
};

// RDS 인스턴스 상태 확인
export const getRDSInstanceStatus = async (
  userId: string,
  dbInstanceIdentifier: string,
  region: string = "ap-northeast-2"
) => {
  const rds = getUserRDSClient(userId, region);

  const params = {
    DBInstanceIdentifier: dbInstanceIdentifier,
  };

  const result = await rds.describeDBInstances(params).promise();
  const instance = result.DBInstances?.[0];

  if (!instance) {
    throw new Error(
      `RDS 인스턴스 '${dbInstanceIdentifier}'를 찾을 수 없습니다.`
    );
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
