"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ec2Command = void 0;
const discord_js_1 = require("discord.js");
const EC2_function_1 = require("../function/EC2.function");
exports.ec2Command = {
    name: "ec2",
    description: "EC2 관리",
    options: [
        {
            name: "list-up",
            description: "EC2 인스턴스 목록 조회",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "region",
                    description: "리전 선택",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        // 미국 리전
                        {
                            name: "🇺🇸 미국 - 버지니아 북부",
                            value: "us-east-1"
                        },
                        {
                            name: "🇺🇸 미국 - 오하이오",
                            value: "us-east-2"
                        },
                        {
                            name: "🇺🇸 미국 - 캘리포니아",
                            value: "us-west-1"
                        },
                        {
                            name: "🇺🇸 미국 - 오레곤",
                            value: "us-west-2"
                        },
                        // 아시아 태평양 리전
                        {
                            name: "🇮🇳 아시아 - 뭄바이",
                            value: "ap-south-1"
                        },
                        {
                            name: "🇯🇵 아시아 - 도쿄",
                            value: "ap-northeast-1"
                        },
                        {
                            name: "🇰🇷 아시아 - 서울",
                            value: "ap-northeast-2"
                        },
                        {
                            name: "🇯🇵 아시아 - 오사카",
                            value: "ap-northeast-3"
                        },
                        {
                            name: "🇸🇬 아시아 - 싱가포르",
                            value: "ap-southeast-1"
                        },
                        {
                            name: "🇦🇺 아시아 - 시드니",
                            value: "ap-southeast-2"
                        },
                        // 캐나다 리전
                        {
                            name: "🇨🇦 캐나다 - 중부",
                            value: "ca-central-1"
                        },
                        // 유럽 리전
                        {
                            name: "🇩🇪 유럽 - 프랑크푸르트",
                            value: "eu-central-1"
                        },
                        {
                            name: "🇮🇪 유럽 - 아일랜드",
                            value: "eu-west-1"
                        },
                        {
                            name: "🇬🇧 유럽 - 런던",
                            value: "eu-west-2"
                        },
                        {
                            name: "🇫🇷 유럽 - 파리",
                            value: "eu-west-3"
                        },
                        {
                            name: "🇸🇪 유럽 - 스톡홀름",
                            value: "eu-north-1"
                        },
                        // 남아메리카 리전
                        {
                            name: "🇧🇷 남아메리카 - 상파울루",
                            value: "sa-east-1"
                        }
                    ]
                }
            ]
        },
        {
            name: "specify-instance",
            description: "EC2 인스턴스 세부 정보 불러오기",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "region",
                    description: "리전 선택",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        // 미국 리전
                        {
                            name: "🇺🇸 미국 - 버지니아 북부",
                            value: "us-east-1"
                        },
                        {
                            name: "🇺🇸 미국 - 오하이오",
                            value: "us-east-2"
                        },
                        {
                            name: "🇺🇸 미국 - 캘리포니아",
                            value: "us-west-1"
                        },
                        {
                            name: "🇺🇸 미국 - 오레곤",
                            value: "us-west-2"
                        },
                        // 아시아 태평양 리전
                        {
                            name: "🇮🇳 아시아 - 뭄바이",
                            value: "ap-south-1"
                        },
                        {
                            name: "🇯🇵 아시아 - 도쿄",
                            value: "ap-northeast-1"
                        },
                        {
                            name: "🇰🇷 아시아 - 서울",
                            value: "ap-northeast-2"
                        },
                        {
                            name: "🇯🇵 아시아 - 오사카",
                            value: "ap-northeast-3"
                        },
                        {
                            name: "🇸🇬 아시아 - 싱가포르",
                            value: "ap-southeast-1"
                        },
                        {
                            name: "🇦🇺 아시아 - 시드니",
                            value: "ap-southeast-2"
                        },
                        // 캐나다 리전
                        {
                            name: "🇨🇦 캐나다 - 중부",
                            value: "ca-central-1"
                        },
                        // 유럽 리전
                        {
                            name: "🇩🇪 유럽 - 프랑크푸르트",
                            value: "eu-central-1"
                        },
                        {
                            name: "🇮🇪 유럽 - 아일랜드",
                            value: "eu-west-1"
                        },
                        {
                            name: "🇬🇧 유럽 - 런던",
                            value: "eu-west-2"
                        },
                        {
                            name: "🇫🇷 유럽 - 파리",
                            value: "eu-west-3"
                        },
                        {
                            name: "🇸🇪 유럽 - 스톡홀름",
                            value: "eu-north-1"
                        },
                        // 남아메리카 리전
                        {
                            name: "🇧🇷 남아메리카 - 상파울루",
                            value: "sa-east-1"
                        }
                    ]
                },
                {
                    name: "instance-name",
                    description: "인스턴스 이름",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    execute: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        if (subcommand == "list-up") {
            try {
                const region = interaction.options.getString("region");
                const ec2List = await (0, EC2_function_1.getEC2List)(userId, region);
                await interaction.reply({
                    content: `**EC2 인스턴스 목록 조회**\n\n**리전:** (${region})\n\n${ec2List}`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `EC2 인스턴스 목록 조회 실패 : ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand == "specify-instance") {
            try {
                const region = interaction.options.getString("region");
                const instanceName = interaction.options.getString("instance-name");
                const ec2Info = await (0, EC2_function_1.getEC2Info)(userId, region, instanceName);
                await interaction.reply({
                    content: `**EC2 인스턴스 조회**\n\n**리전:** (${region})\n**인스턴스 이름:** ${instanceName}\n\n${ec2Info}`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `EC2 인스턴스 조회 실패 : ${errorMessage}`,
                    flags: 64
                });
            }
        }
    }
};
