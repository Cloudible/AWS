"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsCommand = void 0;
const discord_js_1 = require("discord.js");
const AWS_function_1 = require("../function/AWS.function");
exports.awsCommand = {
    name: "aws",
    description: "AWS 관리",
    options: [
        {
            name: "console-login",
            description: "AWS Console 로그인 URL 생성",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "region",
                    description: "AWS 리전 (기본값: us-east-1)",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false
                }
            ]
        },
        {
            name: "configure",
            description: "AWS 자격 증명 설정",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "access-key-id",
                    description: "AWS Access Key ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "secret-access-key",
                    description: "AWS Secret Access Key",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "region",
                    description: "AWS 리전 (기본값: us-east-1)",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false
                }
            ]
        },
        {
            name: "save-credentials",
            description: "자격 증명을 파일에 저장",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "access-key-id",
                    description: "AWS Access Key ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "secret-access-key",
                    description: "AWS Secret Access Key",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "region",
                    description: "AWS 리전 (기본값: us-east-1)",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false
                }
            ]
        },
        {
            name: "load-credentials",
            description: "저장된 자격 증명 불러오기",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand
        },
        {
            name: "saved-credentials",
            description: "저장된 자격 증명 정보 확인",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand
        },
        {
            name: "delete-credentials",
            description: "저장된 자격 증명 삭제",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand
        },
        {
            name: "validate",
            description: "AWS 자격 증명 유효성 검사",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand
        },
        {
            name: "credentials",
            description: "현재 설정된 자격 증명 정보 확인",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand
        },
        {
            name: "account-info",
            description: "AWS 계정 정보 조회",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand
        },
        {
            name: "iam-user",
            description: "IAM 사용자 정보 조회",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "username",
                    description: "IAM 사용자명",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "iam-list-up",
            description: "IAM 사용자 목록 조회",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand
        }
    ],
    execute: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id; // Discord 사용자 ID
        try {
            if (subcommand === "console-login") {
                const region = interaction.options.getString("region") || "us-east-1";
                const consoleUrl = (0, AWS_function_1.generateAWSConsoleUrl)(region);
                await interaction.reply({
                    content: `AWS Console 로그인 URL:\n\n**리전:** ${region}\n**사용자:** <@${userId}>\n\n${consoleUrl}`,
                    flags: 64
                });
            }
            else if (subcommand === "configure") {
                const accessKeyId = interaction.options.getString("access-key-id");
                const secretAccessKey = interaction.options.getString("secret-access-key");
                const region = interaction.options.getString("region") || "us-east-1";
                (0, AWS_function_1.configureAWSCredentials)(userId, accessKeyId, secretAccessKey, region);
                await interaction.reply({
                    content: `✅ 자격 증명 설정 완료 (사용자: <@${userId}>)`,
                    flags: 64
                });
            }
            else if (subcommand === "save-credentials") {
                const accessKeyId = interaction.options.getString("access-key-id");
                const secretAccessKey = interaction.options.getString("secret-access-key");
                const region = interaction.options.getString("region") || "us-east-1";
                const success = (0, AWS_function_1.saveCredentials)(userId, accessKeyId, secretAccessKey, region);
                if (success) {
                    await interaction.reply({
                        content: `✅ 자격 증명 저장 완료 (사용자: <@${userId}>)`,
                        flags: 64
                    });
                }
                else {
                    await interaction.reply({
                        content: `❌ 자격 증명 저장 실패`,
                        flags: 64
                    });
                }
            }
            else if (subcommand === "load-credentials") {
                const credentials = (0, AWS_function_1.loadCredentials)(userId);
                if (credentials) {
                    await interaction.reply({
                        content: `✅ 자격 증명 불러오기 완료 (사용자: <@${userId}>)`,
                        flags: 64
                    });
                }
                else {
                    await interaction.reply({
                        content: `❌ 저장된 자격 증명이 없습니다`,
                        flags: 64
                    });
                }
            }
            else if (subcommand === "saved-credentials") {
                const credentials = (0, AWS_function_1.getSavedCredentials)(userId);
                if (credentials) {
                    await interaction.reply({
                        content: `📁 저장된 자격 증명:\n\n**사용자:** <@${userId}>\n**Access Key ID:** ${credentials.accessKeyId}\n**Secret Access Key:** ${credentials.secretAccessKey}\n**리전:** ${credentials.region}`,
                        flags: 64
                    });
                }
                else {
                    await interaction.reply({
                        content: `❌ 저장된 자격 증명이 없습니다`,
                        flags: 64
                    });
                }
            }
            else if (subcommand === "delete-credentials") {
                const success = (0, AWS_function_1.deleteCredentials)(userId);
                if (success) {
                    await interaction.reply({
                        content: `✅ 자격 증명 삭제 완료`,
                        flags: 64
                    });
                }
                else {
                    await interaction.reply({
                        content: `❌ 삭제할 자격 증명이 없습니다`,
                        flags: 64
                    });
                }
            }
            else if (subcommand === "validate") {
                const result = await (0, AWS_function_1.validateCredentials)(userId);
                if (result.valid) {
                    await interaction.reply(`✅ 자격 증명 유효 (사용자: <@${userId}>)`);
                }
                else {
                    await interaction.reply(`❌ 자격 증명이 유효하지 않습니다\n\n**오류:** ${result.error}`);
                }
            }
            else if (subcommand === "credentials") {
                const credentials = (0, AWS_function_1.getCurrentCredentials)(userId);
                if (credentials) {
                    await interaction.reply({
                        content: `현재 자격 증명:\n\n**사용자:** <@${userId}>\n**Access Key ID:** ${credentials.accessKeyId}`,
                        flags: 64
                    });
                }
                else {
                    await interaction.reply(`❌ 설정된 자격 증명이 없습니다`);
                }
            }
            else if (subcommand === "account-info") {
                try {
                    const accountInfo = await (0, AWS_function_1.getAccountInfo)(userId);
                    await interaction.reply(`AWS 계정 정보:\n\n**사용자:** <@${userId}>\n**계정 ID:** ${accountInfo.Account}\n**사용자 ID:** ${accountInfo.UserId}\n**ARN:** ${accountInfo.Arn}`);
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content: `AWS 계정 정보 조회 실패:\n\n**오류:** ${errorMessage}\n\n**해결 방법:**\n1. 자격 증명이 올바른지 확인하세요\n2. \`/aws validate\` 명령어로 유효성을 확인하세요`,
                        flags: 64
                    });
                }
            }
            else if (subcommand === "iam-user") {
                try {
                    const username = interaction.options.getString("username");
                    const userInfo = await (0, AWS_function_1.getIAMUserInfo)(userId, username);
                    // 타입 안전성을 위해 타입 가드 사용
                    const userData = userInfo;
                    await interaction.reply(`IAM 사용자 정보:\n\n**사용자:** <@${userId}>\n**사용자명:** ${userData.User?.UserName || 'N/A'}\n**사용자 ID:** ${userData.User?.UserId || 'N/A'}\n**ARN:** ${userData.User?.Arn || 'N/A'}`);
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content: `IAM 사용자 정보 조회 실패:\n\n**오류:** ${errorMessage}\n\n**해결 방법:**\n1. 자격 증명이 올바른지 확인하세요\n2. IAM 권한이 있는지 확인하세요\n3. 사용자명이 올바른지 확인하세요`,
                        flags: 64
                    });
                }
            }
            else if (subcommand === "iam-list-up") {
                try {
                    const iamList = await (0, AWS_function_1.getIAMList)(userId);
                    await interaction.reply(`IAM 사용자 목록:\n\n**사용자:** <@${userId}>\n\n${iamList}`);
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    await interaction.reply({
                        content: `IAM 사용자 목록 조회 실패:\n\n**오류:** ${errorMessage}`,
                        flags: 64
                    });
                }
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            await interaction.reply({
                content: `오류가 발생했습니다: ${errorMessage}`,
                flags: 64
            });
        }
    }
};
