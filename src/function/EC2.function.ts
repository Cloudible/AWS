import { getUserAWSInstance } from "./AWS.function";

export const getEC2List = async(
    userId: string,
    region: string
) => {
    try {
        const awsInstance = getUserAWSInstance(userId); // userId를 통한 aws인스턴스 값 불러오기

        // 권한이 존재하지 않을 경우 예외 처리
        if (!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }
    
        // EC2 인스턴스 생성 (함수 호출)
        const ec2 = awsInstance.EC2(region);
        

        // 최대 10개의 instance 정보를 가져옴
        const params = {
            MaxResults: 10
        };
        
        // AWS SDK에 있는 라이브러리 describeInstances를 통해 인스턴스 정보를 가져옴
        const response = await ec2.describeInstances(params).promise();
        
        if (!response.Reservations || response.Reservations.length === 0) {
            return  `${region} 리전에 EC2 인스턴스가 없습니다.`;
        }
        
        let result = '';
        response.Reservations.forEach((reservation: any, index: number) => {
            reservation.Instances?.forEach((instance: any) => {
                result += `**인스턴스 ${index + 1}:**\n`;
                result += `- 인스턴스 ID: ${instance.InstanceId}\n`;
                result += `- 인스턴스 이름: ${instance.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || 'N/A'}\n`;
                result += `- 상태: ${instance.State?.Name}\n`;
                result += '\n';
            });
        });
        
        return result || 'EC2 인스턴스 정보를 가져올 수 없습니다.';
    } catch (error) {
        throw new Error(`EC2 인스턴스 목록 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};


export const getEC2Info = async (
    userId : string,
    region : string,
    instanceName : string
) => {
    try {
        
        const awsInstance = getUserAWSInstance(userId);
        
        if(!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }
    
        const ec2 = awsInstance.EC2(region);
    
        const params = {
            Filters : [
                {
                    Name : "tag:Name",
                    Values : [instanceName]
                }
            ]
        }
        const response = await ec2.describeInstances(params).promise();
    
        if(!response.Reservations || response.Reservations.length === 0) {
            return `${region} 리전에 ${instanceName} 인스턴스가 없습니다.`
        }
    
        let result = '';
        response.Reservations.forEach((reservation: any) => {
            reservation.Instances?.forEach((instance: any) => {
                result += `- 인스턴스 이름: ${instance.Tags?.find((tag: any) => tag.Key === 'Name')?.Value || 'N/A'}\n`;
                result += `- 인스턴스 ID: ${instance.InstanceId}\n`;
                result += `- 상태: ${instance.State?.Name}\n`;
                result += `- 인스턴스 타입: ${instance.InstanceType}\n`;
                result += `- 퍼블릭 IP: ${instance.PublicIpAddress || 'N/A'}\n`;
                result += `- 프라이빗 IP: ${instance.PrivateIpAddress || 'N/A'}\n`;
                result += `- 시작 시간: ${instance.LaunchTime?.toISOString()}\n`;
                result += '\n';
            })
        })
    
        return result || 'EC2 인스턴스 정보를 가져올 수 없습니다.';

    } catch (error) {
        throw new Error(`EC2 인스턴스 정보 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};