import { ApplicationCommandOptionType, Options } from "discord.js";
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
    getIAMList
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
                        flags: 64
                    });
                } else {
                    await interaction.reply({
                        content: `❌ 저장된 자격 증명이 없습니다`,
                        flags: 64
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
                try {
                    const accountInfo = await getAccountInfo(userId);
                    await interaction.reply(`AWS 계정 정보:\n\n**사용자:** <@${userId}>\n**계정 ID:** ${accountInfo.Account}\n**사용자 ID:** ${accountInfo.UserId}\n**ARN:** ${accountInfo.Arn}`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content: `AWS 계정 정보 조회 실패:\n\n**오류:** ${errorMessage}\n\n**해결 방법:**\n1. 자격 증명이 올바른지 확인하세요\n2. \`/aws validate\` 명령어로 유효성을 확인하세요`,
                        flags: 64
                    });
                }
                
            } else if(subcommand === "iam-user") {
                try {
                    const username = interaction.options.getString("username");
                    const userInfo = await getIAMUserInfo(userId, username!);
                    // 타입 안전성을 위해 타입 가드 사용
                    const userData = userInfo as any;
                    await interaction.reply(`IAM 사용자 정보:\n\n**사용자:** <@${userId}>\n**사용자명:** ${userData.User?.UserName || 'N/A'}\n**사용자 ID:** ${userData.User?.UserId || 'N/A'}\n**ARN:** ${userData.User?.Arn || 'N/A'}`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content: `IAM 사용자 정보 조회 실패:\n\n**오류:** ${errorMessage}\n\n**해결 방법:**\n1. 자격 증명이 올바른지 확인하세요\n2. IAM 권한이 있는지 확인하세요\n3. 사용자명이 올바른지 확인하세요`,
                        flags: 64
                    });
                }
            } else if (subcommand === "iam-list-up") {
                try {
                    const iamList = await getIAMList(userId);
                    await interaction.reply(`IAM 사용자 목록:\n\n**사용자:** <@${userId}>\n\n${iamList}`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content: `IAM 사용자 목록 조회 실패:\n\n**오류:** ${errorMessage}`,
                        flags: 64
                    });
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            await interaction.reply({
                content: `오류가 발생했습니다: ${errorMessage}`,
                flags: 64
            });
        }
    }
}