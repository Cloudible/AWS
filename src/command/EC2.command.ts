import { ApplicationCommand, ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../DTO/slashCommand.DTO";
import { getEC2Info, getEC2List, letEC2MornitoringOff, letEC2MornitoringOn, letEC2Reboot, letEC2Start, letEC2Stop, getEC2MonitoringData, formatMonitoringData } from "../function/EC2.function";

export const ec2Command : SlashCommand = {
    name : "ec2",
    description : "EC2 관리",
    options : [
        {
            name : "list-up",
            description : "EC2 인스턴스 목록 조회",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "region",
                    description : "리전 선택",
                    type : ApplicationCommandOptionType.String,
                    required : true,
                    choices : [
                        // 미국 리전
                        {
                            name : "🇺🇸 미국 - 버지니아 북부",
                            value : "us-east-1"
                        },
                        {
                            name : "🇺🇸 미국 - 오하이오",
                            value : "us-east-2"
                        },
                        {
                            name : "🇺🇸 미국 - 캘리포니아",
                            value : "us-west-1"
                        },
                        {
                            name : "🇺🇸 미국 - 오레곤",
                            value : "us-west-2"
                        },
                        // 아시아 태평양 리전
                        {
                            name : "🇮🇳 아시아 - 뭄바이",
                            value : "ap-south-1"
                        },
                        {
                            name : "🇯🇵 아시아 - 도쿄",
                            value : "ap-northeast-1"
                        },
                        {
                            name : "🇰🇷 아시아 - 서울",
                            value : "ap-northeast-2"
                        },
                        {
                            name : "🇯🇵 아시아 - 오사카",
                            value : "ap-northeast-3"
                        },
                        {
                            name : "🇸🇬 아시아 - 싱가포르",
                            value : "ap-southeast-1"
                        },
                        {
                            name : "🇦🇺 아시아 - 시드니",
                            value : "ap-southeast-2"
                        },
                        // 캐나다 리전
                        {
                            name : "🇨🇦 캐나다 - 중부",
                            value : "ca-central-1"
                        },
                        // 유럽 리전
                        {
                            name : "🇩🇪 유럽 - 프랑크푸르트",
                            value : "eu-central-1"
                        },
                        {
                            name : "🇮🇪 유럽 - 아일랜드",
                            value : "eu-west-1"
                        },
                        {
                            name : "🇬🇧 유럽 - 런던",
                            value : "eu-west-2"
                        },
                        {
                            name : "🇫🇷 유럽 - 파리",
                            value : "eu-west-3"
                        },
                        {
                            name : "🇸🇪 유럽 - 스톡홀름",
                            value : "eu-north-1"
                        },
                        // 남아메리카 리전
                        {
                            name : "🇧🇷 남아메리카 - 상파울루",
                            value : "sa-east-1"
                        }
                    ]
                }
            ]
        },
        {
            name : "specify-instance",
            description : "EC2 인스턴스 세부 정보 불러오기",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "region",
                    description : "리전 선택",
                    type : ApplicationCommandOptionType.String,
                    required : true,
                    choices : [
                        // 미국 리전
                        {
                            name : "🇺🇸 미국 - 버지니아 북부",
                            value : "us-east-1"
                        },
                        {
                            name : "🇺🇸 미국 - 오하이오",
                            value : "us-east-2"
                        },
                        {
                            name : "🇺🇸 미국 - 캘리포니아",
                            value : "us-west-1"
                        },
                        {
                            name : "🇺🇸 미국 - 오레곤",
                            value : "us-west-2"
                        },
                        // 아시아 태평양 리전
                        {
                            name : "🇮🇳 아시아 - 뭄바이",
                            value : "ap-south-1"
                        },
                        {
                            name : "🇯🇵 아시아 - 도쿄",
                            value : "ap-northeast-1"
                        },
                        {
                            name : "🇰🇷 아시아 - 서울",
                            value : "ap-northeast-2"
                        },
                        {
                            name : "🇯🇵 아시아 - 오사카",
                            value : "ap-northeast-3"
                        },
                        {
                            name : "🇸🇬 아시아 - 싱가포르",
                            value : "ap-southeast-1"
                        },
                        {
                            name : "🇦🇺 아시아 - 시드니",
                            value : "ap-southeast-2"
                        },
                        // 캐나다 리전
                        {
                            name : "🇨🇦 캐나다 - 중부",
                            value : "ca-central-1"
                        },
                        // 유럽 리전
                        {
                            name : "🇩🇪 유럽 - 프랑크푸르트",
                            value : "eu-central-1"
                        },
                        {
                            name : "🇮🇪 유럽 - 아일랜드",
                            value : "eu-west-1"
                        },
                        {
                            name : "🇬🇧 유럽 - 런던",
                            value : "eu-west-2"
                        },
                        {
                            name : "🇫🇷 유럽 - 파리",
                            value : "eu-west-3"
                        },
                        {
                            name : "🇸🇪 유럽 - 스톡홀름",
                            value : "eu-north-1"
                        },
                        // 남아메리카 리전
                        {
                            name : "🇧🇷 남아메리카 - 상파울루",
                            value : "sa-east-1"
                        }
                    ]
                },
                {
                    name : "instance-name",
                    description : "인스턴스 이름",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        },
        {
            name : "state-change",
            description : "Instance 상태 수정 (실행/중지/재부팅)",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "region",
                    description : "리전 선택",
                    type : ApplicationCommandOptionType.String,
                    required : true,
                    choices : [
                        // 미국 리전
                        {
                            name : "🇺🇸 미국 - 버지니아 북부",
                            value : "us-east-1"
                        },
                        {
                            name : "🇺🇸 미국 - 오하이오",
                            value : "us-east-2"
                        },
                        {
                            name : "🇺🇸 미국 - 캘리포니아",
                            value : "us-west-1"
                        },
                        {
                            name : "🇺🇸 미국 - 오레곤",
                            value : "us-west-2"
                        },
                        // 아시아 태평양 리전
                        {
                            name : "🇮🇳 아시아 - 뭄바이",
                            value : "ap-south-1"
                        },
                        {
                            name : "🇯🇵 아시아 - 도쿄",
                            value : "ap-northeast-1"
                        },
                        {
                            name : "🇰🇷 아시아 - 서울",
                            value : "ap-northeast-2"
                        },
                        {
                            name : "🇯🇵 아시아 - 오사카",
                            value : "ap-northeast-3"
                        },
                        {
                            name : "🇸🇬 아시아 - 싱가포르",
                            value : "ap-southeast-1"
                        },
                        {
                            name : "🇦🇺 아시아 - 시드니",
                            value : "ap-southeast-2"
                        },
                        // 캐나다 리전
                        {
                            name : "🇨🇦 캐나다 - 중부",
                            value : "ca-central-1"
                        },
                        // 유럽 리전
                        {
                            name : "🇩🇪 유럽 - 프랑크푸르트",
                            value : "eu-central-1"
                        },
                        {
                            name : "🇮🇪 유럽 - 아일랜드",
                            value : "eu-west-1"
                        },
                        {
                            name : "🇬🇧 유럽 - 런던",
                            value : "eu-west-2"
                        },
                        {
                            name : "🇫🇷 유럽 - 파리",
                            value : "eu-west-3"
                        },
                        {
                            name : "🇸🇪 유럽 - 스톡홀름",
                            value : "eu-north-1"
                        },
                        // 남아메리카 리전
                        {
                            name : "🇧🇷 남아메리카 - 상파울루",
                            value : "sa-east-1"
                        }
                    ]
                },
                {
                    name : "instance-id",
                    description : "인스턴스 Id",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "state",
                    description : "인스턴스 상태 ( 실행 / 중지 / 재부팅 )",
                    type : ApplicationCommandOptionType.String,
                    required : true,
                    choices : [
                        {
                            name : "실행",
                            value : "run"
                        },
                        {
                            name : "중지",
                            value : "stop"
                        },
                        {
                            name : "재부팅",
                            value : "reboot"
                        }
                    ]
                },
                {
                    name : "dry-run",
                    description : "DryRun 옵션 사용 여부",
                    type : ApplicationCommandOptionType.Boolean,
                    required : true
                },
                {
                    name : "hibernation",
                    description : "중지 시 절전 모드 사용 여부",
                    type : ApplicationCommandOptionType.Boolean,
                    required : false
                }
            ]
        },
        {
            name : "monitoring-instance",
            description : "Instance 모니터링 여부",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "region",
                    description : "리전 선택",
                    type : ApplicationCommandOptionType.String,
                    required : true,
                    choices : [
                        // 미국 리전
                        {
                            name : "🇺🇸 미국 - 버지니아 북부",
                            value : "us-east-1"
                        },
                        {
                            name : "🇺🇸 미국 - 오하이오",
                            value : "us-east-2"
                        },
                        {
                            name : "🇺🇸 미국 - 캘리포니아",
                            value : "us-west-1"
                        },
                        {
                            name : "🇺🇸 미국 - 오레곤",
                            value : "us-west-2"
                        },
                        // 아시아 태평양 리전
                        {
                            name : "🇮🇳 아시아 - 뭄바이",
                            value : "ap-south-1"
                        },
                        {
                            name : "🇯🇵 아시아 - 도쿄",
                            value : "ap-northeast-1"
                        },
                        {
                            name : "🇰🇷 아시아 - 서울",
                            value : "ap-northeast-2"
                        },
                        {
                            name : "🇯🇵 아시아 - 오사카",
                            value : "ap-northeast-3"
                        },
                        {
                            name : "🇸🇬 아시아 - 싱가포르",
                            value : "ap-southeast-1"
                        },
                        {
                            name : "🇦🇺 아시아 - 시드니",
                            value : "ap-southeast-2"
                        },
                        // 캐나다 리전
                        {
                            name : "🇨🇦 캐나다 - 중부",
                            value : "ca-central-1"
                        },
                        // 유럽 리전
                        {
                            name : "🇩🇪 유럽 - 프랑크푸르트",
                            value : "eu-central-1"
                        },
                        {
                            name : "🇮🇪 유럽 - 아일랜드",
                            value : "eu-west-1"
                        },
                        {
                            name : "🇬🇧 유럽 - 런던",
                            value : "eu-west-2"
                        },
                        {
                            name : "🇫🇷 유럽 - 파리",
                            value : "eu-west-3"
                        },
                        {
                            name : "🇸🇪 유럽 - 스톡홀름",
                            value : "eu-north-1"
                        },
                        // 남아메리카 리전
                        {
                            name : "🇧🇷 남아메리카 - 상파울루",
                            value : "sa-east-1"
                        }
                    ]
                },
                {
                    name : "monitoring-toggle",
                    description: "모니터링 전환",
                    type : ApplicationCommandOptionType.String,
                    required : true,
                    choices : [
                        {
                            name : "on",
                            value : "on"
                        },
                        {
                            name : "off",
                            value : "off"
                        }
                    ]
                },  
                {
                    name : "instance-id",
                    description : "인스턴스 Id",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "dry-run",
                    description : "DryRun 옵션 사용 여부",
                    type : ApplicationCommandOptionType.Boolean,
                    required : true
                },
                {
                    name : "hours",
                    description : "모니터링 주기 (시간 단위, 기본값: 1시간마다)",
                    type : ApplicationCommandOptionType.Integer,
                    required : false,
                    min_value : 1,
                    max_value : 24
                }
            ]
        }
    ],
    execute : async(client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if(subcommand == "list-up") {
            try {
                const region = interaction.options.getString("region");
                
                const ec2List = await getEC2List(userId, region!);
                await interaction.reply({
                    content: `**EC2 인스턴스 목록 조회**\n\n**리전:** (${region})\n\n${ec2List}`,
                    flags: 64
                });
            }catch(error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content : `EC2 인스턴스 목록 조회 실패 : ${errorMessage}`,
                    flags : 64
                });
            }
        } else if(subcommand == "specify-instance") {
            try {
                const region = interaction.options.getString("region");
                const instanceName = interaction.options.getString("instance-name");

                const ec2Info = await getEC2Info(userId, region!, instanceName!);
                await interaction.reply({
                    content : `**EC2 인스턴스 조회**\n\n**리전:** (${region})\n**인스턴스 이름:** ${instanceName}\n\n${ec2Info}`,
                    flags : 64
                });

            } catch(error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content : `EC2 인스턴스 조회 실패 : ${errorMessage}`,
                    flags : 64
                });
            }
        } else if(subcommand == "state-change") {
            try {   
                const region = interaction.options.getString("region"); 
                const intstanceId = interaction.options.getString("instance-id");
                const dryRun = interaction.options.getBoolean("dry-run");
                const hibernation = interaction.options.getBoolean("hibernation");
                const state = interaction.options.getString("state");

                if(state == "run") {
                    await letEC2Start(userId!, region!, intstanceId!, dryRun!);
                    await interaction.reply({
                        content : `**EC2 인스턴스 실행**\n\n**리전:** (${region})\n**인스턴스 Id:** ${intstanceId}\n**DryRun:** ${dryRun}\n**절전 모드:** ${hibernation}`,
                        flags : 64
                    });
                } else if(state == "stop") {
                    await letEC2Stop(userId! ,region!, intstanceId!, dryRun!, hibernation!);
                    await interaction.reply({
                        content : `**EC2 인스턴스 중지**\n\n**리전:** (${region})\n**인스턴스 Id:** ${intstanceId}\n**DryRun:** ${dryRun}\n**절전 모드:** ${hibernation}`,
                        flags : 64
                    });
                } else if(state == "reboot") {
                    await letEC2Reboot(userId! ,region!, intstanceId!, dryRun!);
                    await interaction.reply({
                        content : `**EC2 인스턴스 재부팅**\n\n**리전:** (${region})\n**인스턴스 Id:** ${intstanceId}\n**DryRun:** ${dryRun}`,
                    });
                } else {
                    await interaction.reply({
                        content : "올바른 상태를 입력해주세요.",
                        flags : 64
                    });
                }

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content : `EC2 상태 변경 실패 : ${errorMessage}`,
                    flags : 64
                });
            }
        } else if(subcommand === "monitoring-instance") {
            try {
                const region = interaction.options.getString("region");
                const instanceId = interaction.options.getString("instance-id");
                const dryRun = interaction.options.getBoolean("dry-run");
                const switchMornitoring = interaction.options.getString("monitoring-toggle");
                const monitoringInterval = interaction.options.getInteger("hours") || 1;

                let responseMessage = `**EC2 인스턴스 모니터링 전환**\n\n**리전:** (${region})\n**인스턴스 Id:** ${instanceId}\n**DryRun:** ${dryRun}\n**state:** ${switchMornitoring}`;

                if(switchMornitoring === 'on') {
                    // 모니터링 활성화
                    await letEC2MornitoringOn(userId!, region!, instanceId!, dryRun!);
                    responseMessage += `\n\n✅ **모니터링이 활성화되었습니다.**`;
                    responseMessage += `\n📊 **모니터링 주기:** ${monitoringInterval}시간마다`;
                    
                    // 모니터링 데이터 조회 (사용자가 설정한 주기만큼)
                    try {
                        const monitoringData = await getEC2MonitoringData(userId!, region!, instanceId!, monitoringInterval);
                        const formattedData = formatMonitoringData(monitoringData, instanceId!, monitoringInterval);
                        responseMessage += `\n\n${formattedData}`;
                    } catch (monitoringError) {
                        responseMessage += `\n\n⚠️ **모니터링 데이터 조회 실패:** ${monitoringError instanceof Error ? monitoringError.message : String(monitoringError)}`;
                        responseMessage += `\n\n💡 **해결 방법:**`;
                        responseMessage += `\n- 모니터링이 활성화된 후 몇 분 기다린 후 다시 시도하세요`;
                        responseMessage += `\n- 인스턴스가 실행 중인지 확인하세요`;
                        responseMessage += `\n- CloudWatch 권한이 있는지 확인하세요`;
                    }

                } else if(switchMornitoring === 'off') {
                    // 모니터링 비활성화
                    await letEC2MornitoringOff(userId!, region!, instanceId!, dryRun!);
                    responseMessage += `\n\n🛑 **모니터링이 비활성화되었습니다.**`;
                    responseMessage += `\n\n📊 **모니터링 중단됨:**`;
                    responseMessage += `\n- CPU 사용률 데이터 수집 중단`;
                    responseMessage += `\n- 네트워크 트래픽 데이터 수집 중단`;
                    responseMessage += `\n- 디스크 I/O 데이터 수집 중단`;
                    responseMessage += `\n\n💰 **비용 절약:** 모니터링 비용이 발생하지 않습니다.`;
                }
                
                await interaction.reply({
                    content : responseMessage,
                    flags : 64
                });

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content : `모니터링 전환 실패 : ${errorMessage}`,
                    flags : 64
                });
            }
        }
    }
}   