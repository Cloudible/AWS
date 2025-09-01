import { ApplicationCommandOptionType, Options, VoiceRegion } from "discord.js";
import { SlashCommand } from "../DTO/slashCommand.DTO";
import { 
    generateAWSConsoleUrl,
    configureAWSCredentials,
    saveCredentials,
    loadCredentials,
    getSavedCredentials,
    deleteCredentials,
    validateCredentials, 
    getAccountInfo,
    getIAMUserInfo,
    getCurrentCredentials,
    getIAMList,
    syncAwsAccount
} from "../function/AWS.function";

export const awsCommand : SlashCommand = {
    name : "aws",
    description : "AWS 관리",
    options : [
        {
            name : "console-login",
            description : "AWS Console 로그인 URL 생성",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "region",
                    description : "AWS 리전 (기본값: us-east-1)",
                    type : ApplicationCommandOptionType.String,
                    required : false
                }
            ]
        },
        {
            name : "configure",
            description : "AWS 자격 증명 설정",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "access-key-id",
                    description : "AWS Access Key ID",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "secret-access-key",
                    description : "AWS Secret Access Key",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        },
        {
            name : "save-credentials",
            description : "자격 증명을 파일에 저장",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "access-key-id",
                    description : "AWS Access Key ID",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "secret-access-key",
                    description : "AWS Secret Access Key",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "password",
                    description : "자격 증명 암호화 파일 비밀번호",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        },
        {
            name : "load-credentials",
            description : "저장된 자격 증명 불러오기",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "password",
                    description : "자격 증명 암호화 파일 비밀번호",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        },
        {
            name : "saved-credentials",
            description : "저장된 자격 증명 정보 확인",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "password",
                    description : "자격 증명 암호화 파일 비밀번호",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        },
        {
            name : "delete-credentials",
            description : "저장된 자격 증명 삭제",
            type : ApplicationCommandOptionType.Subcommand
        },
        {
            name : "validate",
            description : "AWS 자격 증명 유효성 검사",
            type : ApplicationCommandOptionType.Subcommand
        },
        {
            name : "credentials",
            description : "현재 설정된 자격 증명 정보 확인",
            type : ApplicationCommandOptionType.Subcommand
        },
        {
            name : "account-info",
            description : "AWS 계정 정보 조회",
            type : ApplicationCommandOptionType.Subcommand
        },
        {
            name : "iam-user",
            description : "IAM 사용자 정보 조회",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "username",
                    description : "IAM 사용자명",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        },
        {
            name : "iam-list-up",
            description : "IAM 사용자 목록 조회",
            type : ApplicationCommandOptionType.Subcommand
        },
        {
            name : "aws-region-sync",
            description : "aws 계정 리소스 동기화 (해당 리전에 맞게)",
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
        }
    ],
    execute : async(client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id; // Discord 사용자 ID

        try {
            if(subcommand === "console-login") {
                const region = interaction.options.getString("region") || "us-east-1";
                
                const consoleUrl = generateAWSConsoleUrl(region);
                
                await interaction.reply({
                    content: `AWS Console 로그인 URL:\n\n**리전:** ${region}\n**사용자:** <@${userId}>\n\n${consoleUrl}`,
                    flags: 64
                });
                
            } else if(subcommand === "configure") {
                const accessKeyId = interaction.options.getString("access-key-id");
                const secretAccessKey = interaction.options.getString("secret-access-key");
                
                configureAWSCredentials(userId, accessKeyId!, secretAccessKey!);
                await interaction.reply({
                    content: `✅ 자격 증명 설정 완료 (사용자: <@${userId}>)`,
                    flags: 64
                });
                
            } else if(subcommand === "save-credentials") {
                const accessKeyId = interaction.options.getString("access-key-id");
                const secretAccessKey = interaction.options.getString("secret-access-key");
                const password = interaction.options.getString("password");
                
                const success = saveCredentials(userId, accessKeyId!, secretAccessKey!, password!);
                
                if(success) {
                    await interaction.reply({
                        content: `✅ 자격 증명 저장 완료 (사용자: <@${userId}>)`,
                        flags: 64
                    });
                } else {
                    await interaction.reply({
                        content: `❌ 자격 증명 저장 실패`,
                        flags: 64
                    });
                }
                
            } else if(subcommand === "load-credentials") {
                const password = interaction.options.getString("password");
                const credentials = loadCredentials(userId, password!);
                
                if(credentials) {
                    await interaction.reply({
                        content: `✅ 자격 증명 불러오기 완료 (사용자: <@${userId}>)`,
                    });
                } else {
                    await interaction.reply({
                        content: `❌ 저장된 자격 증명이 없습니다`,
                    });
                }
                
            } else if(subcommand === "saved-credentials") {
                const password = interaction.options.getString("password");

                const credentials = getSavedCredentials(userId, password!);
                
                if(credentials) {
                    await interaction.reply({
                        content: `📁 저장된 자격 증명:\n\n**사용자:** <@${userId}>\n**Access Key ID:** ${credentials.accessKeyId}\n**Secret Access Key:** ${credentials.secretAccessKey}\n`,
                        flags: 64
                    });
                } else {
                    await interaction.reply({
                        content: `❌ 저장된 자격 증명이 없습니다`,
                        flags: 64
                    });
                }
                
            } else if(subcommand === "delete-credentials") {
                const success = deleteCredentials(userId);
                
                if(success) {
                    await interaction.reply({
                        content: `✅ 자격 증명 삭제 완료`,
                        flags: 64
                    });
                } else {
                    await interaction.reply({
                        content: `❌ 삭제할 자격 증명이 없습니다`,
                        flags: 64
                    });
                }
                
            } else if(subcommand === "validate") {
                const result = await validateCredentials(userId);
                
                if(result.valid) {
                    await interaction.reply(`✅ 자격 증명 유효 (사용자: <@${userId}>)`);
                } else {
                    await interaction.reply(`❌ 자격 증명이 유효하지 않습니다\n\n**오류:** ${result.error}`);
                }
                
            } else if(subcommand === "credentials") {
                const credentials = getCurrentCredentials(userId);
                if (credentials) {
                    await interaction.reply({
                        content: `현재 자격 증명:\n\n**사용자:** <@${userId}>\n**Access Key ID:** ${credentials.accessKeyId}`,
                        flags: 64
                    });
                } else {
                    await interaction.reply(`❌ 설정된 자격 증명이 없습니다`);
                }
                
            } else if(subcommand === "account-info") {
                const accountInfo = await getAccountInfo(userId);
                await interaction.reply({
                    content : `AWS 계정 정보:\n\n**사용자:** <@${userId}>\n**계정 ID:** ${accountInfo.Account}\n**사용자 ID:** ${accountInfo.UserId}\n**ARN:** ${accountInfo.Arn}`,
                    flags : 64
                });
                
            } else if(subcommand === "iam-user") {
                const username = interaction.options.getString("username");
                const userInfo = await getIAMUserInfo(userId, username!);
                // 타입 안전성을 위해 타입 가드 사용
                const userData = userInfo as any;
                await interaction.reply(`IAM 사용자 정보:\n\n**사용자:** <@${userId}>\n**사용자명:** ${userData.User?.UserName || 'N/A'}\n**사용자 ID:** ${userData.User?.UserId || 'N/A'}\n**ARN:** ${userData.User?.Arn || 'N/A'}`);
                
            } else if (subcommand === "iam-list-up") {
                const iamList = await getIAMList(userId);
                await interaction.reply(`IAM 사용자 목록:\n\n**사용자:** <@${userId}>\n\n${iamList}`);
            } else if(subcommand === "aws-region-sync") {
                const region = interaction.options.getString("region");

                await syncAwsAccount(userId!, region!);
                await interaction.reply(`해당 리전에 맞게 AWS 계정 동기화\n\n**사용자:** <@${userId}>\n**리전:** ${region}\n\n`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            
            // 이미 응답했는지 확인
            if (!interaction.replied) {
                await interaction.reply({
                    content: `AWS 명령어 실행 중 오류가 발생했습니다:\n\n**오류:** ${errorMessage}\n\n**해결 방법:**\n1. 자격 증명이 올바른지 확인하세요\n2. \`/aws validate\` 명령어로 유효성을 확인하세요\n3. 필요한 권한이 있는지 확인하세요`,
                    flags: 64
                });
            }
        }
    }
}