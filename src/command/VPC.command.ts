import { SlashCommand } from "../DTO/slashCommand.DTO";
import { ApplicationCommandOptionType, Client, ChatInputCommandInteraction } from "discord.js";
import { addSubnet, createVPC, deleteSubnet, listUpVPC } from "../function/VPC.function";

export const vpcCommand : SlashCommand ={
    name : "vpc",
    description : "VPC 관리",
    options : [
        {
            name : "create",
            description : "VPC를 생성합니다.",
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
                    name : "cidr",
                    description : "CIDR 세팅",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "vpc-name",
                    description : "VPC 이름 세팅",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]

        },
        {
            name : "list-up",
            description : "VPC 목록 조회",
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
            name : "add-subnet",
            description : "서브넷 추가",
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
                    name : "vpc-id",
                    description : "VPC ID 선택",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "subnet-name",
                    description : "서브넷 이름 세팅",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "cidr",
                    description : "CIDR 세팅",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        },
        {
            name : "delete-subnet",
            description : "서브넷 삭제",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
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
                    name : "subnetId",
                    description : "Subnet 아이디",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        }
    ],
    execute : async(client : Client, interaction : ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

            if(subcommand === "create") {
                try {
                    const region = interaction.options.getString("region");
                    const cidr = interaction.options.getString("cidr");
                    const vpcName = interaction.options.getString("vpc-name");
    
                    // function call
                    await createVPC(userId!, region!, cidr!, vpcName!);
    
                    await interaction.reply({
                        content : `**VPC 생성**\n\n**리전:** (${region})\n**CIDR:** ${cidr}\n**VPC 이름:** ${vpcName}`,
                        flags : 64
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content: `VPC 생성에 실패했습니다 :  ${errorMessage}`,
                        flags: 64
                    });
                }
            } else if(subcommand === "list-up") {
                try {
                    const region = interaction.options.getString("region");

                    const response = await listUpVPC(userId!, region!);

                    await interaction.reply({
                        content : `**VPC 목록**\n\n**리전:** (${region})\n\n${response}`,
                        flags : 64
                    });

                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content : `VPC 목록을 불러오기 실패했습니다. : ${errorMessage}`,
                        flags : 64
                    });
                }
            } else if(subcommand === "add-subnet") {
                try {
                    const region = interaction.options.getString("region");
                    const vpcId = interaction.options.getString("vpc-id");
                    const subnetName = interaction.options.getString("subnet-name");
                    const cidr = interaction.options.getString("cidr");
                    
                    // function call
                    await addSubnet(userId!, region!, vpcId!, subnetName!, cidr!);

                    await interaction.reply({
                        content : `**서브넷 추가**\n\n**리전:** (${region})\n**VPC ID:** ${vpcId}\n**서브넷 이름:** ${subnetName}\n**CIDR:** ${cidr}`,
                        flags : 64
                    });

                } catch(error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content : `서브넷 추가에 실패했습니다. : ${errorMessage}`,
                        flags : 64
                    });
                }
            } else if(subcommand === "subnet-delete") {
                try {
                    const region = interaction.options.getString("region");
                    const subnetId = interaction.options.getString("subnetId");

                    await deleteSubnet(userId!, region!, subnetId!);

                    await interaction.reply({
                        content : `**서브넷 삭제**\n\n**리전:** (${region})\n**서브넷 아이디:** ${subnetId}`,
                        flags : 64
                    });

                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content : `서브넷 삭제에 실패했습니다. : ${errorMessage}`,
                        flags : 64
                    });
                }
            }
        }
}