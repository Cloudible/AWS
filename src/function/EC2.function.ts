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

        const checkFirst = await getEC2State(userId, region, InstanceId);
        if(checkFirst === 'running') {
            throw new Error(`${InstanceId} 인스턴스는 이미 실행 중입니다.`);
        } else if(checkFirst === 'pending') {
            throw new Error(`${InstanceId} 인스턴스는 이미 실행 준비 중입니다. "Pending"`);
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

        const checkFirst = await getEC2State(userId, region, InstanceId);
        if(checkFirst === 'stopped') {
            throw new Error(`${InstanceId} 인스턴스는 이미 중지 되었습니다.`);
        } else if(checkFirst === 'stopping') {
            throw new Error(`${InstanceId} 인스턴스는 이미 중지 중입니다.`);
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

export const letEC2MornitoringOn = async (
    userId : string,
    region : string,
    instanceId : string,
    dryRun : boolean
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error(`AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.`);
        }

        const ec2 = awsInstance.EC2(region);
        const params = {
            InstanceIds: [instanceId],
            DryRun: dryRun
        }

        await ec2.monitorInstances(params).promise();
        return `**EC2 인스턴스 모니터링 전환**\n\n**리전:** (${region})\n**인스턴스 Id:** ${instanceId}\n**DryRun:** ${dryRun}\n**state:** on`;

    } catch(error) {
        throw new Error (`EC2 인스턴스 모니터링 실패: ${error instanceof Error ? error.message : String(error) }`);
    }
};

export const letEC2MornitoringOff = async (
    userId : string,
    region : string,
    instanceId : string,
    dryRun : boolean
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);

        if(!awsInstance) {
            throw new Error(`AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.`);
        }

        const ec2 = awsInstance.EC2(region);
        const params = {
            InstanceIds: [instanceId],
            DryRun: dryRun
        }

        await ec2.unmonitorInstances(params).promise();
        return `**EC2 인스턴스 모니터링 전환**\n\n**리전:** (${region})\n**인스턴스 Id:** ${instanceId}\n**DryRun:** ${dryRun}\n**state:** off`;

    } catch(error) {
        throw new Error (`EC2 인스턴스 모니터링 전환 실패: ${error instanceof Error ? error.message : String(error) }`);
    }
};

// CloudWatch에서 CPU 사용률 데이터 가져오기 (주기 설정)
export const getEC2CPUUtilization = async (
    userId: string,
    region: string,
    instanceId: string,
    monitoringInterval: number = 1
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);
        if (!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const cloudwatch = awsInstance.CloudWatch(region);
        const endTime = new Date();
        // 모니터링 주기에 따라 시작 시간 계산 (예: 2시간 주기면 최근 2시간 데이터)
        const startTime = new Date(endTime.getTime() - monitoringInterval * 60 * 60 * 1000);

        const params = {
            Namespace: 'AWS/EC2',
            MetricName: 'CPUUtilization',
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            StartTime: startTime,
            EndTime: endTime,
            Period: 300, // 5분 간격
            Statistics: ['Average', 'Maximum', 'Minimum']
        };

        const data = await cloudwatch.getMetricStatistics(params).promise();
        return data;
    } catch (error) {
        throw new Error(`CPU 사용률 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

// CloudWatch에서 네트워크 트래픽 데이터 가져오기 (주기 설정)
export const getEC2NetworkTraffic = async (
    userId: string,
    region: string,
    instanceId: string,
    monitoringInterval: number = 1
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);
        if (!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const cloudwatch = awsInstance.CloudWatch(region);
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - monitoringInterval * 60 * 60 * 1000);

        // 네트워크 인바운드
        const inboundParams = {
            Namespace: 'AWS/EC2',
            MetricName: 'NetworkIn',
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            StartTime: startTime,
            EndTime: endTime,
            Period: 300,
            Statistics: ['Average', 'Maximum', 'Minimum']
        };

        // 네트워크 아웃바운드
        const outboundParams = {
            Namespace: 'AWS/EC2',
            MetricName: 'NetworkOut',
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            StartTime: startTime,
            EndTime: endTime,
            Period: 300,
            Statistics: ['Average', 'Maximum', 'Minimum']
        };

        const [inboundData, outboundData] = await Promise.all([
            cloudwatch.getMetricStatistics(inboundParams).promise(),
            cloudwatch.getMetricStatistics(outboundParams).promise()
        ]);

        return { inbound: inboundData, outbound: outboundData };
    } catch (error) {
        throw new Error(`네트워크 트래픽 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

// CloudWatch에서 디스크 I/O 데이터 가져오기 (주기 설정)
export const getEC2DiskIO = async (
    userId: string,
    region: string,
    instanceId: string,
    monitoringInterval: number = 1
) => {
    try {
        const awsInstance = getUserAWSInstance(userId);
        if (!awsInstance) {
            throw new Error('AWS 인스턴스가 설정되지 않았습니다. /aws configure 명령어로 자격 증명을 설정하세요.');
        }

        const cloudwatch = awsInstance.CloudWatch(region);
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - monitoringInterval * 60 * 60 * 1000);

        // 디스크 읽기
        const readParams = {
            Namespace: 'AWS/EC2',
            MetricName: 'DiskReadBytes',
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            StartTime: startTime,
            EndTime: endTime,
            Period: 300,
            Statistics: ['Average', 'Maximum', 'Minimum']
        };

        // 디스크 쓰기
        const writeParams = {
            Namespace: 'AWS/EC2',
            MetricName: 'DiskWriteBytes',
            Dimensions: [
                {
                    Name: 'InstanceId',
                    Value: instanceId
                }
            ],
            StartTime: startTime,
            EndTime: endTime,
            Period: 300,
            Statistics: ['Average', 'Maximum', 'Minimum']
        };

        const [readData, writeData] = await Promise.all([
            cloudwatch.getMetricStatistics(readParams).promise(),
            cloudwatch.getMetricStatistics(writeParams).promise()
        ]);

        return { read: readData, write: writeData };
    } catch (error) {
        throw new Error(`디스크 I/O 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

// 종합 모니터링 데이터 가져오기 (주기 설정)
export const getEC2MonitoringData = async (
    userId: string,
    region: string,
    instanceId: string,
    monitoringInterval: number = 1
) => {
    try {
        const [cpuData, networkData, diskData] = await Promise.all([
            getEC2CPUUtilization(userId, region, instanceId, monitoringInterval),
            getEC2NetworkTraffic(userId, region, instanceId, monitoringInterval),
            getEC2DiskIO(userId, region, instanceId, monitoringInterval)
        ]);

        return {
            cpu: cpuData,
            network: networkData,
            disk: diskData
        };
    } catch (error) {
        throw new Error(`모니터링 데이터 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};

// 모니터링 데이터를 포맷팅하여 반환 (주기 설정)
export const formatMonitoringData = (
    monitoringData: any,
    instanceId: string,
    monitoringInterval: number
) => {
    let result = `**EC2 인스턴스 모니터링 데이터**\n\n`;
    result += `**인스턴스 ID:** ${instanceId}\n`;
    result += `**모니터링 주기:** ${monitoringInterval}시간마다\n`;
    result += `**모니터링 상태:** 활성화됨 ✅\n\n`;

    // CPU 사용률
    if (monitoringData.cpu && monitoringData.cpu.Datapoints && monitoringData.cpu.Datapoints.length > 0) {
        const latestCPU = monitoringData.cpu.Datapoints[monitoringData.cpu.Datapoints.length - 1];
        const allCPUs = monitoringData.cpu.Datapoints;
        const avgCPU = allCPUs.reduce((sum: number, dp: any) => sum + (dp.Average || 0), 0) / allCPUs.length;
        const maxCPU = Math.max(...allCPUs.map((dp: any) => dp.Maximum || 0));
        const minCPU = Math.min(...allCPUs.map((dp: any) => dp.Minimum || 0));
        
        result += `**CPU 사용률:**\n`;
        result += `- 현재: ${latestCPU.Average?.toFixed(2) || 'N/A'}%\n`;
        result += `- 평균: ${avgCPU.toFixed(2)}%\n`;
        result += `- 최대: ${maxCPU.toFixed(2)}%\n`;
        result += `- 최소: ${minCPU.toFixed(2)}%\n\n`;
    } else {
        result += `**CPU 사용률:** 데이터 없음\n`;
        result += `💡 **가능한 원인:**\n`;
        result += `- 모니터링이 방금 활성화되어 데이터가 아직 수집되지 않음\n`;
        result += `- 인스턴스가 중지된 상태\n`;
        result += `- CloudWatch 권한 문제\n\n`;
    }

    // 네트워크 트래픽
    if (monitoringData.network && monitoringData.network.inbound && monitoringData.network.inbound.Datapoints && monitoringData.network.inbound.Datapoints.length > 0) {
        const latestInbound = monitoringData.network.inbound.Datapoints[monitoringData.network.inbound.Datapoints.length - 1];
        const latestOutbound = monitoringData.network.outbound.Datapoints[monitoringData.network.outbound.Datapoints.length - 1];
        
        const allInbound = monitoringData.network.inbound.Datapoints;
        const allOutbound = monitoringData.network.outbound.Datapoints;
        
        const avgInbound = allInbound.reduce((sum: number, dp: any) => sum + (dp.Average || 0), 0) / allInbound.length;
        const avgOutbound = allOutbound.reduce((sum: number, dp: any) => sum + (dp.Average || 0), 0) / allOutbound.length;
        
        result += `**네트워크 트래픽:**\n`;
        result += `- 인바운드: ${(latestInbound.Average / 1024 / 1024).toFixed(2) || 'N/A'} MB/s (평균: ${(avgInbound / 1024 / 1024).toFixed(2)} MB/s)\n`;
        result += `- 아웃바운드: ${(latestOutbound.Average / 1024 / 1024).toFixed(2) || 'N/A'} MB/s (평균: ${(avgOutbound / 1024 / 1024).toFixed(2)} MB/s)\n\n`;
    } else {
        result += `**네트워크 트래픽:** 데이터 없음\n\n`;
    }

    // 디스크 I/O
    if (monitoringData.disk && monitoringData.disk.read && monitoringData.disk.read.Datapoints && monitoringData.disk.read.Datapoints.length > 0) {
        const latestRead = monitoringData.disk.read.Datapoints[monitoringData.disk.read.Datapoints.length - 1];
        const latestWrite = monitoringData.disk.write.Datapoints[monitoringData.disk.write.Datapoints.length - 1];
        
        const allRead = monitoringData.disk.read.Datapoints;
        const allWrite = monitoringData.disk.write.Datapoints;
        
        const avgRead = allRead.reduce((sum: number, dp: any) => sum + (dp.Average || 0), 0) / allRead.length;
        const avgWrite = allWrite.reduce((sum: number, dp: any) => sum + (dp.Average || 0), 0) / allWrite.length;
        
        result += `**디스크 I/O:**\n`;
        result += `- 읽기: ${(latestRead.Average / 1024 / 1024).toFixed(2) || 'N/A'} MB/s (평균: ${(avgRead / 1024 / 1024).toFixed(2)} MB/s)\n`;
        result += `- 쓰기: ${(latestWrite.Average / 1024 / 1024).toFixed(2) || 'N/A'} MB/s (평균: ${(avgWrite / 1024 / 1024).toFixed(2)} MB/s)\n\n`;
    } else {
        result += `**디스크 I/O:** 데이터 없음\n\n`;
    }

    // 모니터링 설정 정보
    result += `**모니터링 설정:**\n`;
    result += `- 데이터 수집 간격: 5분\n`;
    result += `- 모니터링 주기: ${monitoringInterval}시간마다\n`;
    result += `- 데이터 포인트 수: 약 ${monitoringInterval * 12}개\n`;
    result += `- 다음 업데이트: 약 ${monitoringInterval}시간 후\n`;
    result += `- 모니터링 유지: 활성화됨`;

    return result;
};