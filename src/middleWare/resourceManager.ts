import path from "path";
import fs from "fs";
import { getUserAWSInstance } from "../function/AWS.function";

// 통합 데이터 디렉토리
const INTEGRATED_DATA_DIR = path.join(process.cwd(), "aws-integrated-data");

// 사용자별 통합 데이터 파일 경로
const getUserIntegratedDataFile = (userId: string) => {
  return path.join(INTEGRATED_DATA_DIR, `integrated-data-${userId}.json`);
};

// 디렉토리 생성
if (!fs.existsSync(INTEGRATED_DATA_DIR)) {
  fs.mkdirSync(INTEGRATED_DATA_DIR, { recursive: true });
}

// 리소스 타입 정의
export interface VPCResource {
  name: string;
  region: string;
  vpcId: string;
  vpcName: string;
  internetGateway?: string;
  subnets?: SubnetResource[];
}

export interface SubnetResource {
  name: string;
  region: string;
  subnetId: string;
  subnetName: string;
  cidr: string;
  availabilityZone: string;
  state: string;
  vpcId: string;
}

export interface EC2Resource {
  name: string;
  region: string;
  instanceId: string;
  instanceName: string;
  state: string;
  instanceType: string;
  publicIp?: string;
  privateIp?: string;
  vpcId?: string;
  subnetId?: string;
}

export interface RDSResource {
  name: string;
  region: string;
  dbInstanceIdentifier: string;
  engine: string;
  status: string;
  endpoint?: string;
  port?: string;
  instanceClass: string;
  availabilityZone: string;
  vpcId?: string;
  subnetGroupName?: string;
}

// 통합 데이터 구조
export interface IntegratedData {
  VPC: VPCResource[];
  EC2: EC2Resource[];
  RDS: RDSResource[];
  lastUpdated: string;
}

// 데이터 로드 함수
export const loadUserData = (userId: string): IntegratedData => {
  const filePath = getUserIntegratedDataFile(userId);
  
  if (!fs.existsSync(filePath)) {
    return {
      VPC: [],
      EC2: [],
      RDS: [],
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`사용자 데이터 로드 실패 (${userId}):`, error);
    return {
      VPC: [],
      EC2: [],
      RDS: [],
      lastUpdated: new Date().toISOString()
    };
  }
};

// 데이터 저장 함수
export const saveUserData = (userId: string, data: IntegratedData): void => {
  const filePath = getUserIntegratedDataFile(userId);
  
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`사용자 데이터 저장 실패 (${userId}):`, error);
    throw new Error('데이터 저장에 실패했습니다.');
  }
};

// AWS에서 실시간 데이터 동기화
export const syncAWSData = async (userId: string, region: string = "ap-northeast-2"): Promise<IntegratedData> => {
  const awsInstance = getUserAWSInstance(userId);
  
  if (!awsInstance) {
    throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
  }

  const vpc = awsInstance.VPC(region);
  const ec2 = awsInstance.EC2(region);
  const rds = awsInstance.RDS(region);

  try {
    // VPC 데이터 동기화
    const vpcResponse = await vpc.describeVpcs().promise();
    const vpcResources: VPCResource[] = [];

    for (const vpcItem of vpcResponse.Vpcs || []) {
      const vpcName = vpcItem.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
      
      // 인터넷 게이트웨이 조회
      const igwResponse = await vpc.describeInternetGateways({
        Filters: [{ Name: 'attachment.vpc-id', Values: [vpcItem.VpcId!] }]
      }).promise();
      
      const internetGateway = igwResponse.InternetGateways?.[0]?.InternetGatewayId;

      // 서브넷 조회
      const subnetsResponse = await vpc.describeSubnets({
        Filters: [{ Name: 'vpc-id', Values: [vpcItem.VpcId!] }]
      }).promise();

      const subnets: SubnetResource[] = (subnetsResponse.Subnets || []).map((subnet: any) => ({
        name: subnet.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음',
        region,
        subnetId: subnet.SubnetId!,
        subnetName: subnet.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음',
        cidr: subnet.CidrBlock!,
        availabilityZone: subnet.AvailabilityZone!,
        state: subnet.State!,
        vpcId: vpcItem.VpcId!
      }));

      vpcResources.push({
        name: vpcName,
        region,
        vpcId: vpcItem.VpcId!,
        vpcName,
        internetGateway,
        subnets
      });
    }

    // EC2 데이터 동기화
    const ec2Response = await ec2.describeInstances().promise();
    const ec2Resources: EC2Resource[] = [];

    for (const reservation of ec2Response.Reservations || []) {
      for (const instance of reservation.Instances || []) {
        const instanceName = instance.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
        
        ec2Resources.push({
          name: instanceName,
          region,
          instanceId: instance.InstanceId!,
          instanceName,
          state: instance.State?.Name || 'unknown',
          instanceType: instance.InstanceType!,
          publicIp: instance.PublicIpAddress,
          privateIp: instance.PrivateIpAddress,
          vpcId: instance.VpcId,
          subnetId: instance.SubnetId
        });
      }
    }

    // RDS 데이터 동기화
    const rdsResponse = await rds.describeDBInstances().promise();
    const rdsResources: RDSResource[] = (rdsResponse.DBInstances || []).map((instance : any) => ({
      name: instance.DBInstanceIdentifier!,
      region,
      dbInstanceIdentifier: instance.DBInstanceIdentifier!,
      engine: instance.Engine!,
      status: instance.DBInstanceStatus!,
      endpoint: instance.Endpoint?.Address,
      port: instance.Endpoint?.Port?.toString(),
      instanceClass: instance.DBInstanceClass!,
      availabilityZone: instance.AvailabilityZone!,
      vpcId: instance.DBSubnetGroup?.VpcId,
      subnetGroupName: instance.DBSubnetGroup?.DBSubnetGroupName
    }));

    const integratedData: IntegratedData = {
      VPC: vpcResources,
      EC2: ec2Resources,
      RDS: rdsResources,
      lastUpdated: new Date().toISOString()
    };

    // 데이터 저장
    saveUserData(userId, integratedData);
    return integratedData;

  } catch (error) {
    console.error('AWS 데이터 동기화 실패:', error);
    throw new Error(`AWS 데이터 동기화 실패: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Autocomplete 함수들
export const getVPCAutocompleteOptions = (userId: string): Array<{name: string, vpcId: string}> => {
  const data = loadUserData(userId);
  return data.VPC.map(vpc => ({
    name: `${vpc.name} (${vpc.vpcId})`,
    vpcId: vpc.vpcId
  }));
};

export const getSubnetAutocompleteOptions = (userId: string, vpcId?: string): Array<{name: string, value: string}> => {
  const data = loadUserData(userId);
  const subnets: SubnetResource[] = [];
  
  data.VPC.forEach(vpc => {
    if (vpc.subnets) {
      if (vpcId) {
        // 특정 VPC의 서브넷만 필터링
        if (vpc.vpcId === vpcId) {
          subnets.push(...vpc.subnets);
        }
      } else {
        // 모든 서브넷
        subnets.push(...vpc.subnets);
      }
    }
  });

  return subnets.map(subnet => ({
    name: `${subnet.name} (${subnet.cidr}) - ${subnet.subnetId}`,
    value: subnet.subnetId
  }));
};

export const getEC2AutocompleteOptions = (userId: string): Array<{name: string, value: string}> => {
  const data = loadUserData(userId);
  return data.EC2.map(ec2 => ({
    name: `${ec2.name} (${ec2.instanceType}) - ${ec2.instanceId}`,
    value: ec2.instanceId
  }));
};

export const getRDSAutocompleteOptions = (userId: string): Array<{name: string, value: string}> => {
  const data = loadUserData(userId);
  return data.RDS.map(rds => ({
    name: `${rds.name} (${rds.engine}) - ${rds.status}`,
    value: rds.dbInstanceIdentifier
  }));
};

// 특정 리소스 조회 함수들
export const getVPCByName = (userId: string, vpcName: string): VPCResource | undefined => {
  const data = loadUserData(userId);
  return data.VPC.find(vpc => vpc.name === vpcName);
};

export const getVPCById = (userId: string, vpcId: string): VPCResource | undefined => {
  const data = loadUserData(userId);
  return data.VPC.find(vpc => vpc.vpcId === vpcId);
};

export const getSubnetByName = (userId: string, subnetName: string): SubnetResource | undefined => {
  const data = loadUserData(userId);
  for (const vpc of data.VPC) {
    if (vpc.subnets) {
      const subnet = vpc.subnets.find(sub => sub.name === subnetName);
      if (subnet) return subnet;
    }
  }
  return undefined;
};

export const getSubnetById = (userId: string, subnetId: string): SubnetResource | undefined => {
  const data = loadUserData(userId);
  for (const vpc of data.VPC) {
    if (vpc.subnets) {
      const subnet = vpc.subnets.find(sub => sub.subnetId === subnetId);
      if (subnet) return subnet;
    }
  }
  return undefined;
};

export const getEC2ByName = (userId: string, instanceName: string): EC2Resource | undefined => {
  const data = loadUserData(userId);
  return data.EC2.find(ec2 => ec2.name === instanceName);
};

export const getEC2ById = (userId: string, instanceId: string): EC2Resource | undefined => {
  const data = loadUserData(userId);
  return data.EC2.find(ec2 => ec2.instanceId === instanceId);
};

export const getRDSByName = (userId: string, dbName: string): RDSResource | undefined => {
  const data = loadUserData(userId);
  return data.RDS.find(rds => rds.name === dbName);
};

export const getRDSById = (userId: string, dbInstanceIdentifier: string): RDSResource | undefined => {
  const data = loadUserData(userId);
  return data.RDS.find(rds => rds.dbInstanceIdentifier === dbInstanceIdentifier);
};

// 데이터 업데이트 함수들 (리소스 생성/삭제 시 호출)
export const addVPCResource = (userId: string, vpcResource: VPCResource): void => {
  const data = loadUserData(userId);
  // 기존 VPC가 있으면 업데이트, 없으면 추가
  const existingIndex = data.VPC.findIndex(vpc => vpc.vpcId === vpcResource.vpcId);
  if (existingIndex >= 0) {
    data.VPC[existingIndex] = vpcResource;
  } else {
    data.VPC.push(vpcResource);
  }
  saveUserData(userId, data);
};

export const removeVPCResource = (userId: string, vpcId: string): void => {
  const data = loadUserData(userId);
  data.VPC = data.VPC.filter(vpc => vpc.vpcId !== vpcId);
  // VPC가 삭제되면 관련 EC2, RDS도 제거
  data.EC2 = data.EC2.filter(ec2 => ec2.vpcId !== vpcId);
  data.RDS = data.RDS.filter(rds => rds.vpcId !== vpcId);
  saveUserData(userId, data);
};

export const addEC2Resource = (userId: string, ec2Resource: EC2Resource): void => {
  const data = loadUserData(userId);
  // 기존 EC2가 있으면 업데이트, 없으면 추가
  const existingIndex = data.EC2.findIndex(ec2 => ec2.instanceId === ec2Resource.instanceId);
  if (existingIndex >= 0) {
    data.EC2[existingIndex] = ec2Resource;
  } else {
    data.EC2.push(ec2Resource);
  }
  saveUserData(userId, data);
};

export const removeEC2Resource = (userId: string, instanceId: string): void => {
  const data = loadUserData(userId);
  data.EC2 = data.EC2.filter(ec2 => ec2.instanceId !== instanceId);
  saveUserData(userId, data);
};

export const addRDSResource = (userId: string, rdsResource: RDSResource): void => {
  const data = loadUserData(userId);
  // 기존 RDS가 있으면 업데이트, 없으면 추가
  const existingIndex = data.RDS.findIndex(rds => rds.dbInstanceIdentifier === rdsResource.dbInstanceIdentifier);
  if (existingIndex >= 0) {
    data.RDS[existingIndex] = rdsResource;
  } else {
    data.RDS.push(rdsResource);
  }
  saveUserData(userId, data);
};

export const removeRDSResource = (userId: string, dbInstanceIdentifier: string): void => {
  const data = loadUserData(userId);
  data.RDS = data.RDS.filter(rds => rds.dbInstanceIdentifier !== dbInstanceIdentifier);
  saveUserData(userId, data);
};

// 데이터 정리 함수 (오래된 데이터 정리)
export const cleanupOldData = (userId: string, daysOld: number = 30): void => {
  const data = loadUserData(userId);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  // 마지막 업데이트가 오래된 데이터는 제거
  if (new Date(data.lastUpdated) < cutoffDate) {
    const emptyData: IntegratedData = {
      VPC: [],
      EC2: [],
      RDS: [],
      lastUpdated: new Date().toISOString()
    };
    saveUserData(userId, emptyData);
  }
};
