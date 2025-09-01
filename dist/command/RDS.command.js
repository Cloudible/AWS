"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rdsCommand = void 0;
const discord_js_1 = require("discord.js");
const RDS_function_1 = require("../function/RDS.function");
// DB 인스턴스 식별자 유효성 검사
const isValidDBIdentifier = (identifier) => {
    // AWS RDS DB 인스턴스 식별자 규칙
    const regex = /^[a-z][a-z0-9-]*[a-z0-9]$/;
    // 기본 규칙 검사
    if (identifier.length < 1 || identifier.length > 63)
        return false;
    if (!regex.test(identifier))
        return false;
    if (identifier.includes("--"))
        return false; // 연속된 하이픈 불가
    return true;
};
// 비밀번호 유효성 검사
const isValidPassword = (password) => {
    // AWS RDS 비밀번호 규칙
    if (password.length < 8 || password.length > 128)
        return false;
    // 사용 불가 문자 검사 (AWS RDS에서 금지된 문자들)
    const invalidChars = ['"', "/", " ", "\\"];
    for (const char of invalidChars) {
        if (password.includes(char))
            return false;
    }
    return true;
};
exports.rdsCommand = {
    name: "rds",
    description: "RDS 인스턴스 관리",
    options: [
        {
            name: "list",
            description: "RDS 인스턴스 목록을 조회합니다",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "region",
                    description: "리전 선택",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        {
                            name: "🇺🇸 미국 - 버지니아 북부",
                            value: "us-east-1",
                        },
                        { name: "🇺🇸 미국 - 오하이오", value: "us-east-2" },
                        { name: "🇺🇸 미국 - 캘리포니아", value: "us-west-1" },
                        { name: "🇺🇸 미국 - 오레곤", value: "us-west-2" },
                        { name: "🇮🇳 아시아 - 뭄바이", value: "ap-south-1" },
                        {
                            name: "🇯🇵 아시아 - 도쿄",
                            value: "ap-northeast-1",
                        },
                        {
                            name: "🇰🇷 아시아 - 서울",
                            value: "ap-northeast-2",
                        },
                        {
                            name: "🇯🇵 아시아 - 오사카",
                            value: "ap-northeast-3",
                        },
                        {
                            name: "🇸🇬 아시아 - 싱가포르",
                            value: "ap-southeast-1",
                        },
                        {
                            name: "🇦🇺 아시아 - 시드니",
                            value: "ap-southeast-2",
                        },
                        { name: "🇨🇦 캐나다 - 중부", value: "ca-central-1" },
                        {
                            name: "🇩🇪 유럽 - 프랑크푸르트",
                            value: "eu-central-1",
                        },
                        { name: "🇮🇪 유럽 - 아일랜드", value: "eu-west-1" },
                        { name: "🇬🇧 유럽 - 런던", value: "eu-west-2" },
                        { name: "🇫🇷 유럽 - 파리", value: "eu-west-3" },
                        { name: "🇸🇪 유럽 - 스톡홀름", value: "eu-north-1" },
                        {
                            name: "🇧🇷 남아메리카 - 상파울루",
                            value: "sa-east-1",
                        },
                    ],
                },
            ],
        },
        {
            name: "status",
            description: "특정 RDS 인스턴스의 상태를 조회합니다",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "id",
                    description: "DB 인스턴스 ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "region",
                    description: "리전 선택",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        {
                            name: "🇺🇸 미국 - 버지니아 북부",
                            value: "us-east-1",
                        },
                        { name: "🇺🇸 미국 - 오하이오", value: "us-east-2" },
                        { name: "🇺🇸 미국 - 캘리포니아", value: "us-west-1" },
                        { name: "🇺🇸 미국 - 오레곤", value: "us-west-2" },
                        { name: "🇮🇳 아시아 - 뭄바이", value: "ap-south-1" },
                        {
                            name: "🇯🇵 아시아 - 도쿄",
                            value: "ap-northeast-1",
                        },
                        {
                            name: "🇰🇷 아시아 - 서울",
                            value: "ap-northeast-2",
                        },
                        {
                            name: "🇯🇵 아시아 - 오사카",
                            value: "ap-northeast-3",
                        },
                        {
                            name: "🇸🇬 아시아 - 싱가포르",
                            value: "ap-southeast-1",
                        },
                        {
                            name: "🇦🇺 아시아 - 시드니",
                            value: "ap-southeast-2",
                        },
                        { name: "🇨🇦 캐나다 - 중부", value: "ca-central-1" },
                        {
                            name: "🇩🇪 유럽 - 프랑크푸르트",
                            value: "eu-central-1",
                        },
                        { name: "🇮🇪 유럽 - 아일랜드", value: "eu-west-1" },
                        { name: "🇬🇧 유럽 - 런던", value: "eu-west-2" },
                        { name: "🇫🇷 유럽 - 파리", value: "eu-west-3" },
                        { name: "🇸🇪 유럽 - 스톡홀름", value: "eu-north-1" },
                        {
                            name: "🇧🇷 남아메리카 - 상파울루",
                            value: "sa-east-1",
                        },
                    ],
                },
            ],
        },
        {
            name: "create",
            description: "RDS 인스턴스를 생성합니다",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "region",
                    description: "리전 선택",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "🇺🇸 미국 - 버지니아 북부",
                            value: "us-east-1",
                        },
                        { name: "🇺🇸 미국 - 오하이오", value: "us-east-2" },
                        { name: "🇺🇸 미국 - 캘리포니아", value: "us-west-1" },
                        { name: "🇺🇸 미국 - 오레곤", value: "us-west-2" },
                        { name: "🇮🇳 아시아 - 뭄바이", value: "ap-south-1" },
                        {
                            name: "🇯🇵 아시아 - 도쿄",
                            value: "ap-northeast-1",
                        },
                        {
                            name: "🇰🇷 아시아 - 서울",
                            value: "ap-northeast-2",
                        },
                        {
                            name: "🇯🇵 아시아 - 오사카",
                            value: "ap-northeast-3",
                        },
                        {
                            name: "🇸🇬 아시아 - 싱가포르",
                            value: "ap-southeast-1",
                        },
                        {
                            name: "🇦🇺 아시아 - 시드니",
                            value: "ap-southeast-2",
                        },
                        { name: "🇨🇦 캐나다 - 중부", value: "ca-central-1" },
                        {
                            name: "🇩🇪 유럽 - 프랑크푸르트",
                            value: "eu-central-1",
                        },
                        { name: "🇮🇪 유럽 - 아일랜드", value: "eu-west-1" },
                        { name: "🇬🇧 유럽 - 런던", value: "eu-west-2" },
                        { name: "🇫🇷 유럽 - 파리", value: "eu-west-3" },
                        { name: "🇸🇪 유럽 - 스톡홀름", value: "eu-north-1" },
                        {
                            name: "🇧🇷 남아메리카 - 상파울루",
                            value: "sa-east-1",
                        },
                    ],
                },
                {
                    name: "id",
                    description: "DB 인스턴스 ID (소문자, 숫자, 하이픈만 사용)",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "username",
                    description: "마스터 유저 이름",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "password",
                    description: "마스터 유저 비밀번호 (8자 이상)",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "engine",
                    description: "데이터베이스 엔진",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        { name: "MySQL", value: "mysql" },
                        { name: "PostgreSQL", value: "postgres" },
                        { name: "MariaDB", value: "mariadb" },
                        { name: "Oracle Database", value: "oracle-ee" },
                        {
                            name: "Microsoft SQL Server Express",
                            value: "sqlserver-ex",
                        },
                        {
                            name: "Microsoft SQL Server Web",
                            value: "sqlserver-web",
                        },
                        {
                            name: "Microsoft SQL Server Standard",
                            value: "sqlserver-se",
                        },
                    ],
                },
                {
                    name: "instance-class",
                    description: "인스턴스 클래스 (전체 엔진 호환)",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        // 🔹 Intel 4세대 Xeon (db.m7i) - 모든 엔진 호환
                        {
                            name: "db.m7i.large (8GB RAM)",
                            value: "db.m7i.large",
                        },
                        {
                            name: "db.m7i.xlarge (16GB RAM)",
                            value: "db.m7i.xlarge",
                        },
                        {
                            name: "db.m7i.2xlarge (32GB RAM)",
                            value: "db.m7i.2xlarge",
                        },
                        {
                            name: "db.m7i.4xlarge (64GB RAM)",
                            value: "db.m7i.4xlarge",
                        },
                        // 🔹 Intel 3세대 Xeon (db.m6i) - 모든 엔진 호환
                        {
                            name: "db.m6i.large (8GB RAM)",
                            value: "db.m6i.large",
                        },
                        {
                            name: "db.m6i.xlarge (16GB RAM)",
                            value: "db.m6i.xlarge",
                        },
                        {
                            name: "db.m6i.2xlarge (32GB RAM)",
                            value: "db.m6i.2xlarge",
                        },
                        {
                            name: "db.m6i.4xlarge (64GB RAM)",
                            value: "db.m6i.4xlarge",
                        },
                        // 🔹 Intel Platinum (db.m5) - 모든 엔진 호환
                        {
                            name: "db.m5.large (8GB RAM)",
                            value: "db.m5.large",
                        },
                        {
                            name: "db.m5.xlarge (16GB RAM)",
                            value: "db.m5.xlarge",
                        },
                        {
                            name: "db.m5.2xlarge (32GB RAM)",
                            value: "db.m5.2xlarge",
                        },
                        {
                            name: "db.m5.4xlarge (64GB RAM)",
                            value: "db.m5.4xlarge",
                        },
                    ],
                },
                {
                    name: "storage",
                    description: "할당된 스토리지 (GB)",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: false,
                },
            ],
        },
        {
            name: "delete",
            description: "RDS 인스턴스를 삭제합니다",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "id",
                    description: "삭제할 DB 인스턴스 ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "skip-snapshot",
                    description: "최종 스냅샷 건너뛰기 (기본값: true)",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
        },
    ],
    execute: async (client, interaction) => {
        const sub = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        try {
            if (sub === "list") {
                const region = interaction.options.getString("region") ||
                    "ap-northeast-2";
                const list = await (0, RDS_function_1.listRDSInstances)(userId, region);
                if (!list || !list.length) {
                    await interaction.reply({
                        content: `📋 **${region} 리전에 RDS 인스턴스가 없습니다.**`,
                        ephemeral: true,
                        flags: 64,
                    });
                    return;
                }
                const msg = list
                    .map((rds) => `🔹 **${rds.id}**\n` +
                    `   • 상태: ${rds.status}\n` +
                    `   • 엔진: ${rds.engine}\n` +
                    `   • 인스턴스 클래스: ${rds.instanceClass}\n` +
                    `   • 엔드포인트: ${rds.endpoint}:${rds.port}\n` +
                    `   • 가용 영역: ${rds.availabilityZone}\n` +
                    `   • 스토리지: ${rds.allocatedStorage}GB\n` +
                    `   • Multi-AZ: ${rds.multiAZ ? "✅" : "❌"}\n` +
                    `   • 암호화: ${rds.storageEncrypted ? "🔒" : "🔓"}`)
                    .join("\n\n");
                await interaction.reply({
                    content: `📋 **RDS 인스턴스 목록 (${region})**\n\n${msg}`,
                    flags: 64,
                });
            }
            else if (sub === "status") {
                const region = interaction.options.getString("region") ||
                    "ap-northeast-2";
                const id = interaction.options.getString("id", true);
                const status = await (0, RDS_function_1.getRDSInstanceStatus)(userId, id, region);
                const statusEmoji = status.status === "available"
                    ? "🟢"
                    : status.status === "stopped"
                        ? "🔴"
                        : status.status === "starting"
                            ? "🟡"
                            : status.status === "stopping"
                                ? "🟠"
                                : "⚪";
                await interaction.reply({
                    content: `${statusEmoji} **RDS 인스턴스 상태 (${region})**\n\n` +
                        `**ID:** ${status.id}\n` +
                        `**상태:** ${status.status}\n` +
                        `**엔진:** ${status.engine}\n` +
                        `**인스턴스 클래스:** ${status.instanceClass}\n` +
                        `**엔드포인트:** ${status.endpoint}:${status.port}\n` +
                        `**가용 영역:** ${status.availabilityZone}`,
                    flags: 64,
                });
            }
            else if (sub === "create") {
                const region = interaction.options.getString("region", true);
                const id = interaction.options.getString("id", true);
                const username = interaction.options.getString("username", true);
                const password = interaction.options.getString("password", true);
                const engine = interaction.options.getString("engine") || "mysql";
                const instanceClass = interaction.options.getString("instance-class") ||
                    "db.m7i.large"; // 🔄 SQL Server 호환 인스턴스로 기본값 변경
                const storage = interaction.options.getInteger("storage") || 20;
                // DB 인스턴스 식별자 유효성 검사
                if (!isValidDBIdentifier(id)) {
                    await interaction.reply({
                        content: `❌ **잘못된 DB 인스턴스 ID**\n\n` +
                            `**입력값:** ${id}\n\n` +
                            `**DB 인스턴스 ID 규칙:**\n` +
                            `• 1-63자 길이\n` +
                            `• 영문 소문자, 숫자, 하이픈(-) 만 사용 가능\n` +
                            `• 영문 소문자로 시작해야 함\n` +
                            `• 하이픈(-)으로 끝날 수 없음\n` +
                            `• 연속된 하이픈(-) 사용 불가\n\n` +
                            `**올바른 예시:** my-database, test-db-1, production-mysql`,
                        ephemeral: true,
                        flags: 64,
                    });
                    return;
                }
                // 비밀번호 유효성 검사
                if (!isValidPassword(password)) {
                    await interaction.reply({
                        content: `❌ **잘못된 비밀번호**\n\n` +
                            `**비밀번호 규칙:**\n` +
                            `• 최소 8자 이상, 최대 128자 이하\n` +
                            `• 영문 대/소문자, 숫자, 특수문자 사용 가능\n` +
                            `• 사용 불가 문자: 쌍따옴표("), 슬래시(/), 공백( ), 백슬래시(\\)\n` +
                            `• 사용 가능한 특수문자: !@#$%^&*()_+-=[]{}|;:,.<>?`,
                        ephemeral: true,
                        flags: 64,
                    });
                    return;
                }
                // 🚀 즉시 응답하여 Discord 타임아웃 방지
                await interaction.reply({
                    content: `⏳ **RDS 인스턴스 생성 시작**\n\n` +
                        `**리전:** ${region}\n` +
                        `**ID:** ${id}\n` +
                        `**엔진:** ${engine}\n` +
                        `**인스턴스 클래스:** ${instanceClass}\n` +
                        `**스토리지:** ${storage}GB\n\n` +
                        `🔄 생성 중입니다... 완료되면 알려드리겠습니다.`,
                    flags: 64,
                });
                try {
                    // 백그라운드에서 RDS 인스턴스 생성
                    await (0, RDS_function_1.createRDSInstance)(userId, {
                        dbInstanceIdentifier: id,
                        masterUsername: username,
                        masterUserPassword: password,
                        engine,
                        dbInstanceClass: instanceClass,
                        allocatedStorage: storage,
                        region,
                    });
                    // 성공 시 후속 메시지 전송
                    await interaction.followUp({
                        content: `✅ **RDS 인스턴스 생성 완료!**\n\n` +
                            `**ID:** ${id}\n` +
                            `**엔진:** ${engine}\n` +
                            `**인스턴스 클래스:** ${instanceClass}\n` +
                            `**리전:** ${region}\n\n` +
                            `🎉 데이터베이스가 준비되었습니다!`,
                        flags: 64,
                    });
                }
                catch (createError) {
                    // 실패 시 에러 메시지 전송
                    await interaction.followUp({
                        content: `❌ **RDS 인스턴스 생성 실패**\n\n` +
                            `**오류:** ${createError.message || "알 수 없는 오류"}\n\n` +
                            `다시 시도해주세요.`,
                        flags: 64,
                    });
                }
            }
            else if (sub === "delete") {
                const id = interaction.options.getString("id", true);
                const skipSnapshot = interaction.options.getBoolean("skip-snapshot") ??
                    true;
                await (0, RDS_function_1.deleteRDSInstance)(userId, id, skipSnapshot);
                await interaction.reply({
                    content: `🗑️ **RDS 인스턴스 삭제 요청 완료**\n\n` +
                        `**ID:** ${id}\n` +
                        `**최종 스냅샷:** ${skipSnapshot ? "건너뜀" : "생성"}\n\n` +
                        `⏳ 삭제 작업에는 몇 분이 소요될 수 있습니다.`,
                    flags: 64,
                });
            }
        }
        catch (err) {
            console.error("RDS 명령어 오류:", err);
            const errorMessage = err.message || "알 수 없는 오류가 발생했습니다.";
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: `❌ **오류 발생**\n\n${errorMessage}`,
                    ephemeral: true,
                    flags: 64,
                });
            }
            else {
                console.error("상호작용이 이미 응답됨:", errorMessage);
            }
        }
    },
};
