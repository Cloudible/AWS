import { getUserAWSInstance } from "./AWS.function";
import { 
    addVPCResource, 
    removeVPCResource, 
    getVPCByName, 
    getVPCById,
    getSubnetByName,
    getSubnetById,
    loadUserData,
    VPCResource,
    SubnetResource,
    addRouteTableResource,
    removeRouteTableResource,
    updateRouteTableRoutes,
    updateRouteTableAssociations,
    RouteTableResource,
    Route,
    RouteTableAssociation
} from "../middleWare/resourceManager";

export const createVPC = async (
    userId : string,
    region : string,
    CIDR : string,
    vpcName : string,
    internetGateway : boolean
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        const params = {
            CidrBlock : CIDR,
            TagSpecifications : [
                {
                    ResourceType : "vpc",
                    Tags : [
                        {
                            Key : "Name",
                            Value : vpcName
                        }
                    ]
                }
            ]
        };

        const response = await vpc.createVpc(params).promise();

        if(internetGateway) {
            const internetGatewayName = vpcName + "-internetGateway";

            const internetParams = {
                TagSpecifications : [
                    {
                        ResourceType : "internet-gateway",
                        Tags : [
                            {
                                Key : "Name",
                                Value : internetGatewayName
                            }
                        ]
                    }
                ]
            }
            const internetResponse = await vpc.createInternetGateway(internetParams).promise();

            const attachParams = {
                InternetGatewayId : internetResponse.InternetGateway?.InternetGatewayId,
                VpcId : response.Vpc.VpcId
            }

            await vpc.attachInternetGateway(attachParams).promise();

            // 통합 데이터에 VPC 리소스 추가
            const vpcResource: VPCResource = {
                name: vpcName,
                region,
                vpcId: response.Vpc.VpcId!,
                vpcName,
                internetGateway: internetResponse.InternetGateway?.InternetGatewayId,
                subnets: []
            };
            addVPCResource(userId, vpcResource);

            return {
                success : true,
                vpcId: response.Vpc.VpcId,
                cidrBlock: response.Vpc.CidrBlock,
                state: response.Vpc.State,
                vpcName: vpcName,
                internetGatewayName: internetGatewayName,
                internetGatewayId: internetResponse.InternetGateway?.InternetGatewayId
            }
        }
        
        // 통합 데이터에 VPC 리소스 추가
        const vpcResource: VPCResource = {
            name: vpcName,
            region,
            vpcId: response.Vpc.VpcId!,
            vpcName,
            subnets: []
        };
        addVPCResource(userId, vpcResource);
        
        return {
            success: true,
            vpcId: response.Vpc.VpcId,
            cidrBlock: response.Vpc.CidrBlock,
            state: response.Vpc.State,
            vpcName: vpcName,
            internetGatewayName: null,
            internetGatewayId: null
        };

    } catch (error) {
        throw new Error(`VPC 생성 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const listUpVPC = async (
    userId : string,
    region : string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        const response = await vpc.describeVpcs().promise();

        if (!response.Vpcs || response.Vpcs.length === 0) {
            return '조회된 VPC가 없습니다.';
        }

        let vpcList = '';

        
        for (const vpcItem of response.Vpcs) {
            const vpcName = vpcItem.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
            
            // 해당 VPC에 연결된 인터넷 게이트웨이 조회
            const igwResponse = await vpc.describeInternetGateways({
                Filters: [
                    {
                        Name: 'attachment.vpc-id',
                        Values: [vpcItem.VpcId]
                    }
                ]
            }).promise();

            let internetGatewayInfo = '없음';
            if (igwResponse.InternetGateways && igwResponse.InternetGateways.length > 0) {
                const igw = igwResponse.InternetGateways[0];
                const igwName = igw.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
                internetGatewayInfo = `${igw.InternetGatewayId}`;
            }

            vpcList += `**${response.Vpcs.indexOf(vpcItem) + 1}. ${vpcName}**\n`;
            vpcList += `   **VPC ID:** ${vpcItem.VpcId}\n`;
            vpcList += `   **CIDR Block:** ${vpcItem.CidrBlock}\n`;
            vpcList += `   **State:** ${vpcItem.State}\n`;
            vpcList += `   **Default:** ${vpcItem.IsDefault ? 'Yes' : 'No'}\n`;
            vpcList += `   **Internet Gateway:** ${internetGatewayInfo}\n\n`;
        }

        return vpcList;

    } catch (error) {
        throw new Error(`VPC 목록 불러오기 실패: ${error instanceof Error ? error.message : String(error)}`);
    }

};

export const addSubnet = async (
    userId : string,
    region : string,
    vpcId : string,
    subnetName : string,
    cidr : string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        const params = {
            CidrBlock : cidr,
            VpcId : vpcId,
            TagSpecifications : [
                {
                    ResourceType : "subnet",
                    Tags : [
                        {
                            Key : "Name",
                            Value : subnetName
                        }
                    ]
                }
            ]
        }

        const response = await vpc.createSubnet(params).promise();

        // 서브넷 정보를 VPC 리소스에 추가
        const subnetResource: SubnetResource = {
            name: subnetName,
            region,
            subnetId: response.Subnet?.SubnetId!,
            subnetName,
            cidr,
            availabilityZone: response.Subnet?.AvailabilityZone!,
            state: response.Subnet?.State!,
            vpcId
        };

        // VPC 리소스 업데이트 (서브넷 추가)
        const vpcResource = getVPCById(userId, vpcId);
        if (vpcResource) {
            if (!vpcResource.subnets) vpcResource.subnets = [];
            vpcResource.subnets.push(subnetResource);
            addVPCResource(userId, vpcResource); // 기존 데이터를 덮어씀
        }

        return {
            success : true,
            subnetId : response.Subnet?.SubnetId,
            cidrBlock : response.Subnet?.CidrBlock,
            state : response.Subnet?.State,
            subnetName : subnetName
        }

    } catch (error) {
        throw new Error(`서브넷 추가 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const deleteSubnet = async (
    userId : string,
    region : string,
    subnetId : string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);
    
        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }
    
        const vpc = awsInstance.VPC(region);
    
        const params = {
            SubnetId : subnetId
        };
    
        await vpc.deleteSubnet(params).promise();

        // 서브넷 정보를 VPC 리소스에서 제거
        // 서브넷 ID로 VPC를 찾기 위해 모든 VPC를 검색
        const data = loadUserData(userId);
        for (const vpc of data.VPC) {
            if (vpc.subnets && vpc.subnets.some((subnet: SubnetResource) => subnet.subnetId === subnetId)) {
                vpc.subnets = vpc.subnets.filter((subnet: SubnetResource) => subnet.subnetId !== subnetId);
                addVPCResource(userId, vpc); // 기존 데이터를 덮어씀
                break;
            }
        }

        return {
            success : true,
            subnetId : subnetId
        }

    } catch (error) {
        throw new Error(`서브넷 삭제 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const deleteVPC = async (
    userId : string,
    region : string,
    vpcId : string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        // 0. 연결된 InternetGateway 조회 → 분리/삭제 (없으면 건너뜀)
        const igwResponse = await vpc.describeInternetGateways({
            Filters: [ { Name: 'attachment.vpc-id', Values: [vpcId] } ]
        }).promise();

        let internetGatewayId: string | null = null;
        if (igwResponse.InternetGateways && igwResponse.InternetGateways.length > 0) {
            internetGatewayId = igwResponse.InternetGateways[0].InternetGatewayId || null;
            if (internetGatewayId) {
                await vpc.detachInternetGateway({ InternetGatewayId: internetGatewayId, VpcId: vpcId }).promise();
                await vpc.deleteInternetGateway({ InternetGatewayId: internetGatewayId }).promise();
            }
        }

        // 1. 라우팅 테이블 조회 및 삭제 (기본 라우팅 테이블 제외)
        const routeTablesResponse = await vpc.describeRouteTables({
            Filters: [ { Name: 'vpc-id', Values: [vpcId] } ]
        }).promise();
        
        if (routeTablesResponse.RouteTables && routeTablesResponse.RouteTables.length > 0) {
            for (const routeTable of routeTablesResponse.RouteTables) {
                if (routeTable.RouteTableId) {
                    // 기본 라우팅 테이블이 아닌 경우에만 삭제
                    if (!routeTable.Associations?.some((association: any) => association.Main)) {
                        // 라우팅 테이블 연결 해제
                        if (routeTable.Associations) {
                            for (const association of routeTable.Associations) {
                                if (association.RouteTableAssociationId && !association.Main) {
                                    await vpc.disassociateRouteTable({
                                        AssociationId: association.RouteTableAssociationId
                                    }).promise();
                                }
                            }
                        }
                        
                        // 라우팅 테이블 삭제
                        await vpc.deleteRouteTable({ RouteTableId: routeTable.RouteTableId }).promise();
                        
                        // JSON 데이터에서 RouteTable 제거
                        removeRouteTableResource(userId, routeTable.RouteTableId);
                    }
                }
            }
        }

        // 2. 연결된 서브넷 모두 삭제 (존재 시)
        const subnetsResponse = await vpc.describeSubnets({
            Filters: [ { Name: 'vpc-id', Values: [vpcId] } ]
        }).promise();
        if (subnetsResponse.Subnets && subnetsResponse.Subnets.length > 0) {
            for (const subnet of subnetsResponse.Subnets) {
                if (subnet.SubnetId) {
                    await vpc.deleteSubnet({ SubnetId: subnet.SubnetId }).promise();
                }
            }
        }

        // 3. VPC 삭제
        await vpc.deleteVpc({ VpcId: vpcId }).promise();

        // 통합 데이터에서 VPC 리소스 제거
        removeVPCResource(userId, vpcId);

        return {
            success : true,
            vpcId : vpcId,
            internetGatewayId : internetGatewayId
        }

    } catch (error) {
        throw new Error(`VPC 삭제 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const addSubnetGroup = async (
    userId : string,
    region : string,
    vpcId : string,  // VPC ID 추가
    name : string
) => {
    try {
        const awsInstance = await getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }
        
        const vpc = awsInstance.VPC(region);

        const params = {
            VpcId: vpcId,  // VPC ID 필수
            TagSpecifications : [
                {
                    ResourceType : "route-table",
                    Tags : [
                        {
                            Key : "Name",
                            Value : name
                        }
                    ]
                }
            ]
        }

        const response = await vpc.createRouteTable(params).promise();

        // RouteTable JSON 데이터 추가
        const routeTableResource: RouteTableResource = {
            name: name,
            region,
            routeTableId: response.RouteTable?.RouteTableId!,
            routeTableName: name,
            vpcId,
            routes: [],
            associations: []
        };
        addRouteTableResource(userId, routeTableResource);

        return {
            success : true,
            routeTableId : response.RouteTable?.RouteTableId,
            routeTableName : name
        }

    } catch (error) {
        throw new Error(`라우팅 테이블 생성 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const attachSubnetGroup = async (
    userId : string,
    region : string,
    routingTableId : string,
    subnetId : string,
) => {
    try {
        const awsInstance = await getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        const params = {
            SubnetId : subnetId,
            RouteTableId : routingTableId
        }

        const response = await vpc.associateRouteTable(params).promise();

        // RouteTable 연결 정보를 JSON 데이터에 추가
        const association: RouteTableAssociation = {
            subnetId: subnetId,
            associationId: response.AssociationId!,
            associationState: response.AssociationState?.State || 'associated'
        };

        // 기존 연결 정보에 새로운 연결 추가
        const data = loadUserData(userId);
        const routeTableIndex = data.RouteTable.findIndex(rt => rt.routeTableId === routingTableId);
        if (routeTableIndex >= 0) {
            data.RouteTable[routeTableIndex].associations.push(association);
            updateRouteTableAssociations(userId, routingTableId, data.RouteTable[routeTableIndex].associations);
        }

        return {
            success : true,
            subnetId : subnetId,
            routingTableId : routingTableId,
            state : response.AssociationState?.State || 'associated'
        }   

    } catch (error) {
        throw new Error(`라우팅 테이블 연결 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};


export const listRoutingTables = async (
    userId : string,
    region : string,
    vpcId : string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        // 1. VPC의 모든 라우팅 테이블 조회
        const routeTablesResponse = await vpc.describeRouteTables({
            Filters: [
                {
                    Name: 'vpc-id',
                    Values: [vpcId]
                }
            ]
        }).promise();

        if (!routeTablesResponse.RouteTables || routeTablesResponse.RouteTables.length === 0) {
            return '해당 VPC에 라우팅 테이블이 없습니다.';
        }

        // 2. VPC의 모든 서브넷 조회
        const subnetsResponse = await vpc.describeSubnets({
            Filters: [
                {
                    Name: 'vpc-id',
                    Values: [vpcId]
                }
            ]
        }).promise();

        if (!subnetsResponse.Subnets || subnetsResponse.Subnets.length === 0) {
            return '해당 VPC에 서브넷이 없습니다.';
        }

        // 3. 라우팅 테이블별로 서브넷 정보 구성
        let result = '';
        
        routeTablesResponse.RouteTables.forEach((routeTable: any, index: number) => {
            const routeTableName = routeTable.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
            const routeTableId = routeTable.RouteTableId;
            
            result += `**${routeTableName} : **`;
            result += `${routeTableId}\n`;

            // 해당 라우팅 테이블에 연결된 서브넷들 찾기
            const associatedSubnets = subnetsResponse.Subnets.filter((subnet: any) => {
                // 라우팅 테이블 연결 정보 확인
                return routeTable.Associations?.some((association: any) => 
                    association.SubnetId === subnet.SubnetId
                );
            });

            if (associatedSubnets.length === 0) {
                result += `   • 연결된 서브넷이 없습니다.\n\n`;
            } else {
                associatedSubnets.forEach((subnet: any, subnetIndex: number) => {
                    const subnetName = subnet.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
                    result += `      **${subnetIndex + 1}.** ${subnetName}\n`;
                    result += `            서브넷 ID: ${subnet.SubnetId}\n`;
                    result += `            CIDR: ${subnet.CidrBlock}\n`;
                    result += `            가용영역: ${subnet.AvailabilityZone}\n`;
                    result += `            상태: ${subnet.State}\n\n`;
                });
            }
        });

        return result;

    } catch (error) {
        throw new Error(`라우팅 테이블 목록 불러오기 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const addRoutingTableRule = async (
    userId: string,
    region: string,
    routingTableId: string,
    destinationCidrBlock: string,
    targetType: string,
    targetValue: string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);
        if (!awsInstance) throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        const vpc = awsInstance.VPC(region);

        // 0) 라우팅 테이블이 속한 VPC 확인
        const rtDesc = await vpc.describeRouteTables({ RouteTableIds: [routingTableId] }).promise();
        const rt = rtDesc.RouteTables?.[0];
        if (!rt || !rt.VpcId) throw new Error('라우팅 테이블을 찾을 수 없습니다.');
        const rtVpcId = rt.VpcId;

        // 1) 파라미터 뼈대
        const routeParams: any = { RouteTableId: routingTableId };

        // IPv4/IPv6 목적지 분기
        const isIpv6 = destinationCidrBlock.includes(':');
        if (isIpv6) routeParams.DestinationIpv6CidrBlock = destinationCidrBlock;
        else routeParams.DestinationCidrBlock = destinationCidrBlock;

        // 2) 대상 타입 처리
        if (targetType === 'internet-gateway') {
            // a) IGW 선택/검증
            let igwId = targetValue;
            if (!igwId || igwId === 'auto') {
                const igwList = await vpc.describeInternetGateways({
                    Filters: [{ Name: 'attachment.vpc-id', Values: [rtVpcId] }],
                }).promise();
                igwId = igwList.InternetGateways?.[0]?.InternetGatewayId || '';
                if (!igwId) {
                    // 없으면 생성 후 attach
                    const igw = await vpc.createInternetGateway({}).promise();
                    igwId = igw.InternetGateway?.InternetGatewayId!;
                    await vpc.attachInternetGateway({ InternetGatewayId: igwId, VpcId: rtVpcId }).promise();
                }
            } else {
                // 전달된 igw가 다른 VPC에 붙어있거나 detach면 이 VPC로 붙임
                const igwDesc = await vpc.describeInternetGateways({ InternetGatewayIds: [igwId] }).promise();
                const attachedVpc = igwDesc.InternetGateways?.[0]?.Attachments?.[0]?.VpcId;
                if (attachedVpc !== rtVpcId) {
                    if (attachedVpc) {
                        await vpc.detachInternetGateway({ InternetGatewayId: igwId, VpcId: attachedVpc }).promise().catch(() => {});
                    }
                    await vpc.attachInternetGateway({ InternetGatewayId: igwId, VpcId: rtVpcId }).promise();
                }
            }
            if (isIpv6) throw new Error('IPv6 기본 인터넷 액세스는 egress-only IGW가 필요합니다.');
            routeParams.GatewayId = igwId;
        } else if (targetType === 'nat-gateway') {
            routeParams.NatGatewayId = targetValue;
        } else if (targetType === 'transit-gateway') {
            routeParams.TransitGatewayId = targetValue;
        } else if (targetType === 'network-interface') {
            routeParams.NetworkInterfaceId = targetValue;
        } else if (targetType === 'instance') {
            routeParams.InstanceId = targetValue;
        } else if (targetType === 'peering-connection') {
            routeParams.VpcPeeringConnectionId = targetValue;
        } else if (targetType === 'virtual-private-gateway') {
            routeParams.GatewayId = targetValue;
        } else {
            throw new Error(`지원하지 않는 대상 타입입니다: ${targetType}`);
        }

        // 3) 기존 동일 목적지 라우트 존재 시 교체
        const exists = rt.Routes?.some((r:any) =>
            (isIpv6 ? r.DestinationIpv6CidrBlock === destinationCidrBlock : r.DestinationCidrBlock === destinationCidrBlock)
        );
        if (exists) {
            await vpc.replaceRoute(routeParams).promise();
        } else {
            await vpc.createRoute(routeParams).promise();
        }

        // RouteTable 라우트 정보를 JSON 데이터에 추가/업데이트
        const newRoute: Route = {
            destination: destinationCidrBlock,
            target: targetValue,
            targetType: targetType,
            state: 'active'
        };

        // 기존 라우트 정보에 새로운 라우트 추가
        const data = loadUserData(userId);
        const routeTableIndex = data.RouteTable.findIndex(rt => rt.routeTableId === routingTableId);
        if (routeTableIndex >= 0) {
            // 기존 동일 목적지 라우트가 있으면 교체, 없으면 추가
            const existingRouteIndex = data.RouteTable[routeTableIndex].routes.findIndex(r => r.destination === destinationCidrBlock);
            if (existingRouteIndex >= 0) {
                data.RouteTable[routeTableIndex].routes[existingRouteIndex] = newRoute;
            } else {
                data.RouteTable[routeTableIndex].routes.push(newRoute);
            }
            updateRouteTableRoutes(userId, routingTableId, data.RouteTable[routeTableIndex].routes);
        }

        return { success: true, routeTableId: routingTableId, destinationCidrBlock, targetType, targetValue, state: 'active' };
    } catch (error) {
        throw new Error(`라우팅 테이블 규칙 추가 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const deleteRouteTable = async (
    userId: string,
    region: string,
    routeTableId: string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);
        if (!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        // 1. 라우팅 테이블 정보 조회
        const routeTableResponse = await vpc.describeRouteTables({
            RouteTableIds: [routeTableId]
        }).promise();

        if (!routeTableResponse.RouteTables || routeTableResponse.RouteTables.length === 0) {
            throw new Error('라우팅 테이블을 찾을 수 없습니다.');
        }

        const routeTable = routeTableResponse.RouteTables[0];

        // 2. 연결된 서브넷 연결 해제
        if (routeTable.Associations) {
            for (const association of routeTable.Associations) {
                if (association.RouteTableAssociationId && !association.Main) {
                    await vpc.disassociateRouteTable({
                        AssociationId: association.RouteTableAssociationId
                    }).promise();
                }
            }
        }

        // 3. 라우팅 테이블 삭제
        await vpc.deleteRouteTable({
            RouteTableId: routeTableId
        }).promise();

        // 4. JSON 데이터에서 RouteTable 제거
        removeRouteTableResource(userId, routeTableId);

        return {
            success: true,
            routeTableId: routeTableId
        };

    } catch (error) {
        throw new Error(`라우팅 테이블 삭제 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const deleteRouteTableRule = async (
    userId: string,
    region: string,
    routeTableId: string,
    destinationCidrBlock: string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);
        if (!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        // 1. 라우트 삭제
        const routeParams: any = {
            RouteTableId: routeTableId
        };

        const isIpv6 = destinationCidrBlock.includes(':');
        if (isIpv6) {
            routeParams.DestinationIpv6CidrBlock = destinationCidrBlock;
        } else {
            routeParams.DestinationCidrBlock = destinationCidrBlock;
        }

        await vpc.deleteRoute(routeParams).promise();

        // 2. JSON 데이터에서 라우트 제거
        const data = loadUserData(userId);
        const routeTableIndex = data.RouteTable.findIndex(rt => rt.routeTableId === routeTableId);
        if (routeTableIndex >= 0) {
            data.RouteTable[routeTableIndex].routes = data.RouteTable[routeTableIndex].routes.filter(
                route => route.destination !== destinationCidrBlock
            );
            updateRouteTableRoutes(userId, routeTableId, data.RouteTable[routeTableIndex].routes);
        }

        return {
            success: true,
            routeTableId: routeTableId,
            destinationCidrBlock: destinationCidrBlock
        };

    } catch (error) {
        throw new Error(`라우팅 테이블 규칙 삭제 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const detachSubnetFromRouteTable = async (
    userId: string,
    region: string,
    associationId: string
) => {
    try {
        const awsInstance = await getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        // 1. 서브넷 연결 해제
        await vpc.disassociateRouteTable({
            AssociationId: associationId
        }).promise();

        // 2. JSON 데이터에서 연결 정보 제거
        const data = loadUserData(userId);
        for (const routeTable of data.RouteTable) {
            const associationIndex = routeTable.associations.findIndex(assoc => assoc.associationId === associationId);
            if (associationIndex >= 0) {
                routeTable.associations.splice(associationIndex, 1);
                updateRouteTableAssociations(userId, routeTable.routeTableId, routeTable.associations);
                break;
            }
        }

        return {
            success: true,
            associationId: associationId
        };

    } catch (error) {
        throw new Error(`서브넷 연결 해제 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const listSubnet = async (
    userId : string,
    region : string,
    vpcId : string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const vpc = awsInstance.VPC(region);

        // VPC의 모든 서브넷 조회
        const subnetsResponse = await vpc.describeSubnets({
            Filters: [
                {
                    Name: 'vpc-id',
                    Values: [vpcId]
                }
            ]
        }).promise();

        if (!subnetsResponse.Subnets || subnetsResponse.Subnets.length === 0) {
            return '해당 VPC에 서브넷이 없습니다.';
        }

        // 서브넷 정보 구성
        let result = '';
        
        subnetsResponse.Subnets.forEach((subnet: any, index: number) => {
            const subnetName = subnet.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
            
            result += `   **서브넷 이름:** ${subnetName}\n`;
            result += `   **서브넷 ID:** ${subnet.SubnetId}\n`;
            result += `   **CIDR:** ${subnet.CidrBlock}\n`;
            result += `   **가용영역:** ${subnet.AvailabilityZone}\n`;
            result += `   **상태:** ${subnet.State}\n\n`;
        });

        return result;

    } catch (error) {
        throw new Error(`서브넷 목록 불러오기 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};