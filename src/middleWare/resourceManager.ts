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

export interface RouteTableResource {
  name: string;
  region: string;
  routeTableId: string;
  routeTableName: string;
  vpcId: string;
  routes: Route[];
  associations: RouteTableAssociation[];
}

export interface Route {
  destination: string;
  target: string;
  targetType: string;
  state: string;
}

export interface RouteTableAssociation {
  subnetId?: string;
  gatewayId?: string;
  associationId: string;
  associationState: string;
}

// 통합 데이터 구조
export interface IntegratedData {
  VPC: VPCResource[];
  EC2: EC2Resource[];
  RDS: RDSResource[];
  RouteTable: RouteTableResource[];
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
      RouteTable: [],
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
      RouteTable: [],
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
    // 모든 API 호출을 병렬로 실행하여 속도 향상
    const [vpcResponse, ec2Response, rdsResponse, routeTableResponse] = await Promise.all([
      vpc.describeVpcs().promise(),
      ec2.describeInstances().promise(),
      rds.describeDBInstances().promise(),
      vpc.describeRouteTables().promise()
    ]);

    // VPC 데이터 동기화 (병렬 처리)
    const vpcPromises = (vpcResponse.Vpcs || []).map(async (vpcItem: any) => {
      const vpcName = vpcItem.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
      
      // VPC별로 인터넷 게이트웨이와 서브넷을 병렬로 조회
      const [igwResponse, subnetsResponse] = await Promise.all([
        vpc.describeInternetGateways({
          Filters: [{ Name: 'attachment.vpc-id', Values: [vpcItem.VpcId!] }]
        }).promise(),
        vpc.describeSubnets({
          Filters: [{ Name: 'vpc-id', Values: [vpcItem.VpcId!] }]
        }).promise()
      ]);
      
      const internetGateway = igwResponse.InternetGateways?.[0]?.InternetGatewayId;

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

      return {
        name: vpcName,
        region,
        vpcId: vpcItem.VpcId!,
        vpcName,
        internetGateway,
        subnets
      };
    });

    const vpcResources: VPCResource[] = await Promise.all(vpcPromises);

    // EC2 데이터 동기화
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

    // RouteTable 데이터 동기화
    const routeTableResources: RouteTableResource[] = [];

    for (const routeTable of routeTableResponse.RouteTables || []) {
      const routeTableName = routeTable.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
      
      const routes: Route[] = (routeTable.Routes || []).map((route: any) => ({
        destination: route.DestinationCidrBlock || route.DestinationPrefixListId || 'local',
        target: route.GatewayId || route.NatGatewayId || route.VpcPeeringConnectionId || route.TransitGatewayId || route.VpcEndpointId || route.NetworkInterfaceId || route.InstanceId || 'local',
        targetType: route.GatewayId ? 'gateway' : 
                   route.NatGatewayId ? 'nat-gateway' : 
                   route.VpcPeeringConnectionId ? 'vpc-peering' : 
                   route.TransitGatewayId ? 'transit-gateway' : 
                   route.VpcEndpointId ? 'vpc-endpoint' : 
                   route.NetworkInterfaceId ? 'network-interface' : 
                   route.InstanceId ? 'instance' : 'local',
        state: route.State || 'active'
      }));

      const associations: RouteTableAssociation[] = (routeTable.Associations || []).map((association: any) => ({
        subnetId: association.SubnetId,
        gatewayId: association.GatewayId,
        associationId: association.RouteTableAssociationId!,
        associationState: association.AssociationState?.State || 'associated'
      }));

      routeTableResources.push({
        name: routeTableName,
        region,
        routeTableId: routeTable.RouteTableId!,
        routeTableName,
        vpcId: routeTable.VpcId!,
        routes,
        associations
      });
    }

    const integratedData: IntegratedData = {
      VPC: vpcResources,
      EC2: ec2Resources,
      RDS: rdsResources,
      RouteTable: routeTableResources,
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
export const getVPCAutocompleteOptions = (userId: string): Array<{name: string, value: string}> => {
  const data = loadUserData(userId);
  return data.VPC.map(vpc => ({
    name: vpc.name,
    value: vpc.vpcId
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
    name: `${subnet.name} (${subnet.cidr})`,
    value: subnet.subnetId
  }));
};

export const getEC2AutocompleteOptions = (userId: string): Array<{name: string, value: string}> => {
  const data = loadUserData(userId);
  return data.EC2.map(ec2 => ({
    name: ec2.name,
    value: ec2.instanceId
  }));
};

export const getRDSAutocompleteOptions = (userId: string): Array<{name: string, value: string}> => {
  const data = loadUserData(userId);
  return data.RDS.map(rds => ({
    name: rds.name,
    value: rds.dbInstanceIdentifier
  }));
};

export const getRouteTableAutocompleteOptions = (userId: string, vpcId?: string): Array<{name: string, value: string}> => {
  const data = loadUserData(userId);
  let routeTables = data.RouteTable;
  
  if (vpcId) {
    routeTables = routeTables.filter(rt => rt.vpcId === vpcId);
  }
  
  return routeTables.map(rt => ({
    name: rt.name,
    value: rt.routeTableId
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

export const getRouteTableByName = (userId: string, routeTableName: string): RouteTableResource | undefined => {
  const data = loadUserData(userId);
  return data.RouteTable.find(rt => rt.name === routeTableName);
};

export const getRouteTableById = (userId: string, routeTableId: string): RouteTableResource | undefined => {
  const data = loadUserData(userId);
  return data.RouteTable.find(rt => rt.routeTableId === routeTableId);
};

export const getRouteTablesByVPC = (userId: string, vpcId: string): RouteTableResource[] => {
  const data = loadUserData(userId);
  return data.RouteTable.filter(rt => rt.vpcId === vpcId);
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
  // VPC가 삭제되면 관련 EC2, RDS, RouteTable도 제거
  data.EC2 = data.EC2.filter(ec2 => ec2.vpcId !== vpcId);
  data.RDS = data.RDS.filter(rds => rds.vpcId !== vpcId);
  data.RouteTable = data.RouteTable.filter(rt => rt.vpcId !== vpcId);
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
  data.RDS.push(rdsResource);
  saveUserData(userId, data);
};

export const removeRDSResource = (userId: string, dbInstanceIdentifier: string): void => {
  const data = loadUserData(userId);
  data.RDS = data.RDS.filter(rds => rds.dbInstanceIdentifier !== dbInstanceIdentifier);
  saveUserData(userId, data);
};

export const addRouteTableResource = (userId: string, routeTableResource: RouteTableResource): void => {
  const data = loadUserData(userId);
  // 기존 RouteTable이 있으면 업데이트, 없으면 추가
  const existingIndex = data.RouteTable.findIndex(rt => rt.routeTableId === routeTableResource.routeTableId);
  if (existingIndex >= 0) {
    data.RouteTable[existingIndex] = routeTableResource;
  } else {
    data.RouteTable.push(routeTableResource);
  }
  saveUserData(userId, data);
};

export const removeRouteTableResource = (userId: string, routeTableId: string): void => {
  const data = loadUserData(userId);
  data.RouteTable = data.RouteTable.filter(rt => rt.routeTableId !== routeTableId);
  saveUserData(userId, data);
};

export const updateRouteTableRoutes = (userId: string, routeTableId: string, routes: Route[]): void => {
  const data = loadUserData(userId);
  const routeTableIndex = data.RouteTable.findIndex(rt => rt.routeTableId === routeTableId);
  if (routeTableIndex >= 0) {
    data.RouteTable[routeTableIndex].routes = routes;
    saveUserData(userId, data);
  }
};

export const updateRouteTableAssociations = (userId: string, routeTableId: string, associations: RouteTableAssociation[]): void => {
  const data = loadUserData(userId);
  const routeTableIndex = data.RouteTable.findIndex(rt => rt.routeTableId === routeTableId);
  if (routeTableIndex >= 0) {
    data.RouteTable[routeTableIndex].associations = associations;
    saveUserData(userId, data);
  }
};

// RouteTable 관련 유틸리티 함수들
export const getRouteTableBySubnet = (userId: string, subnetId: string): RouteTableResource | undefined => {
  const data = loadUserData(userId);
  return data.RouteTable.find(rt => 
    rt.associations.some(assoc => assoc.subnetId === subnetId)
  );
};

export const getMainRouteTable = (userId: string, vpcId: string): RouteTableResource | undefined => {
  const data = loadUserData(userId);
  return data.RouteTable.find(rt => 
    rt.vpcId === vpcId && 
    rt.associations.some(assoc => assoc.associationState === 'associated' && !assoc.subnetId)
  );
};

export const getRouteTableWithInternetAccess = (userId: string, vpcId: string): RouteTableResource | undefined => {
  const data = loadUserData(userId);
  return data.RouteTable.find(rt => 
    rt.vpcId === vpcId && 
    rt.routes.some(route => 
      route.destination === '0.0.0.0/0' && 
      route.targetType === 'gateway' && 
      route.state === 'active'
    )
  );
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
      RouteTable: [],
      lastUpdated: new Date().toISOString()
    };
    saveUserData(userId, emptyData);
  }
};
