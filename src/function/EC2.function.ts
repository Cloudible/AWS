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


export const getEC2State = async (
    userId : string,
    region : string,
    InstanceId : string
):Promise<string> => {
    const awsInstance = getUserAWSInstance(userId);

    if(!awsInstance) {
        throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
    }

    const ec2 = awsInstance.EC2(region);

    const params = {
        InstanceIds : [InstanceId]
    }

    const result = await ec2.describeInstances(params).promise();

    const instanceName = result.Reservations[0].Instances[0].Tags.find((tag: any) => tag.Key === 'Name')?.Value || 'N/A';

    if(!result.Reservations || result.Reservations.length === 0) {
        return `${region} 리전에 ${instanceName}가 존재하지 않습니다.`
    }

    const instanceState = result.Reservations[0].Instances[0].State;

    return instanceState.Name;
};


export const letEC2Start = async (
    userId : string,
    region : string,
    InstanceId : string,
    dryRun : boolean
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error(`AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.`);
        }

        const ec2 = awsInstance.EC2(region);

        const params = {
            InstanceIds: [InstanceId],
            DryRun: dryRun
        }

        await ec2.startInstances(params).promise();
        return `**EC2 인스턴스 실행**\n\n**리전:** (${region})\n**인스턴스 Id:** ${InstanceId}\n**DryRun:** ${dryRun}`;

    } catch (error) {
        throw new Error(`EC2 인스턴스 실행 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};  

export const letEC2Stop = async (
    userId : string,
    region : string,
    InstanceId : string,
    dryRun : boolean,
    hibernation : boolean
) => {
    
    try {
         const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error(`AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.`);
        }

        const ec2 = awsInstance.EC2(region);

        const params = {
            InstanceIds: [InstanceId],
            DryRun: dryRun,
            Hibernate: hibernation
        }

        await ec2.stopInstances(params).promise();
        return `**EC2 인스턴스 중지**\n\n**리전:** (${region})\n**인스턴스 Id:** ${InstanceId}\n**DryRun:** ${dryRun}\n**절전 모드:** ${hibernation}`;
    } catch (error) {
        throw new Error (`EC2 인스턴스 중지 실패: ${error instanceof Error ? error.message : String(error) }`);
    }
};

export const letEC2Reboot = async (
    userId : string,
    region : string,
    InstanceId : string,
    dryRun : boolean
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error(`AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.`);
        }

        const ec2 = awsInstance.EC2(region);
        const params = {
            InstanceIds: [InstanceId],
            DryRun: dryRun
        }

        await ec2.rebootInstances(params).promise();
        return `**EC2 인스턴스 재부팅**\n\n**리전:** (${region})\n**인스턴스 Id:** ${InstanceId}\n**DryRun:** ${dryRun}`;

    } catch (error) {
        throw new Error (`EC2 인스턴스 재부팅 실패: ${error instanceof Error ? error.message : String(error) }`);
    }
};