import { getUserAWSInstance } from "./AWS.function";


export const createVPC = async (
    userId : string,
    region : string,
    CIDR : string,
    vpcName : string
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
        
        return {
            success: true,
            vpcId: response.Vpc?.VpcId,
            cidrBlock: response.Vpc?.CidrBlock,
            state: response.Vpc?.State,
            vpcName: vpcName
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
            vpcList += `   - VPC ID: ${vpc.VpcId}\n`;
            vpcList += `   - CIDR Block: ${vpc.CidrBlock}\n`;
            vpcList += `   - State: ${vpc.State}\n`;
            vpcList += `   - Default: ${vpc.IsDefault ? 'Yes' : 'No'}\n\n`;
        });

        return vpcList;

    } catch (error) {
        throw new Error(`VPC 목록 불러오기 실패: ${error instanceof Error ? error.message : String(error)}`);
    }

};