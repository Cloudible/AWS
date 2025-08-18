import { getUserAWSInstance } from "./AWS.function";


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
        response.Vpcs.forEach((vpc: any, index: number) => {
            const vpcName = vpc.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || '이름 없음';
            vpcList += `**${index + 1}. ${vpcName}**\n`;
            vpcList += `   **VPC ID:** ${vpc.VpcId}\n`;
            vpcList += `   **CIDR Block:** ${vpc.CidrBlock}\n`;
            vpcList += `   **State:** ${vpc.State}\n`;
            vpcList += `   **Default:** ${vpc.IsDefault ? 'Yes' : 'No'}\n\n`;
        });

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

        // 1. 연결된 서브넷 모두 삭제 (존재 시)
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

        // 2. VPC 삭제
        await vpc.deleteVpc({ VpcId: vpcId }).promise();

        return {
            success : true,
            vpcId : vpcId,
            internetGatewayId : internetGatewayId
        }

    } catch (error) {
        throw new Error(`VPC 삭제 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};