"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vpcCommand = void 0;
const discord_js_1 = require("discord.js");
const VPC_function_1 = require("../function/VPC.function");
exports.vpcCommand = {
    name: "vpc",
    description: "VPC 관리",
    options: [
        {
            name: "create",
            description: "VPC를 생성합니다.",
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
                    name: "cidr",
                    description: "CIDR 세팅",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "vpc-name",
                    description: "VPC 이름 세팅",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "internet-gateway",
                    description: "인터넷 게이트웨이 연결 여부",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: true
                }
            ]
        },
        {
            name: "delete-vpc",
            description: "VPC를 삭제합니다.",
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
                    name: "vpcid",
                    description: "VPC Id",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "list-up",
            description: "VPC 목록 조회",
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
            name: "add-subnet",
            description: "서브넷 추가",
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
                    name: "vpc-id",
                    description: "VPC ID 선택",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "subnet-name",
                    description: "서브넷 이름 세팅",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "cidr",
                    description: "CIDR 세팅",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "delete-subnet",
            description: "서브넷 삭제",
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
                    name: "subnet-id",
                    description: "Subnet 아이디",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "add-routing-table",
            description: "라우팅 테이블을 생성합니다.",
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
                    name: "vpc-id",
                    description: "VPC ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "name",
                    description: "라우팅 테이블 이름",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "attach-routing-table",
            description: "subnet을 routing Table에 연결합니다.",
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
                    name: "routing-table-id",
                    description: "라우팅 테이블 ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "subnet-id",
                    description: "라우팅 테이블에 연결할 서브넷 ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "add-routing-table-rule",
            description: "routing Table 규칙 추가",
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
                    name: "routing-table-id",
                    description: "라우팅 테이블 ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "area",
                    description: "대상 CIDR",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "0.0.0.0/0",
                            value: "0.0.0.0/0"
                        },
                        {
                            name: "0.0.0.0/8",
                            value: "0.0.0.0/8"
                        },
                        {
                            name: "0.0.0.0/16",
                            value: "0.0.0.0/16"
                        },
                        {
                            name: "0.0.0.0/24",
                            value: "0.0.0.0/24"
                        },
                        {
                            name: "0.0.0.0/32",
                            value: "0.0.0.0/32"
                        },
                        {
                            name: "::/0",
                            value: "::/0"
                        },
                        {
                            name: "::/8",
                            value: "::/8"
                        },
                        {
                            name: "::/16",
                            value: "::/16"
                        },
                        {
                            name: "::/32",
                            value: "::/32"
                        },
                        {
                            name: "::/48",
                            value: "::/48"
                        },
                        {
                            name: "::/64",
                            value: "::/64"
                        }
                    ]
                },
                {
                    name: "target",
                    description: "대상 타입",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "캐리어 게이트웨이",
                            value: "carrier-gateway"
                        },
                        {
                            name: "코어 네트워크",
                            value: "core-network"
                        },
                        {
                            name: "외부 전용 인터넷 게이트웨이",
                            value: "external-dedicated-internet-gateway"
                        },
                        {
                            name: "Gateway Load Balancer 엔드포인트",
                            value: "gateway-load-balancer-endpoint"
                        },
                        {
                            name: "인스턴스",
                            value: "instance"
                        },
                        {
                            name: "인터넷 게이트웨이",
                            value: "internet-gateway"
                        },
                        {
                            name: "로컬",
                            value: "local"
                        },
                        {
                            name: "NAT 게이트웨이",
                            value: "nat-gateway"
                        },
                        {
                            name: "네트워크 인터페이스",
                            value: "network-interface"
                        },
                        {
                            name: "Outpost 로컬 게이트웨이",
                            value: "outpost-local-gateway"
                        },
                        {
                            name: "피어링 연결",
                            value: "peering-connection"
                        },
                        {
                            name: "Transit Gateway",
                            value: "transit-gateway"
                        },
                        {
                            name: "가상 프라이빗 게이트웨이",
                            value: "virtual-private-gateway"
                        }
                    ]
                },
                {
                    name: "value",
                    description: "대상 값 (예: igw-xxxxx, nat-xxxxx 등)",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "list-routing-tables",
            description: "VPC의 라우팅 테이블과 서브넷 정보 조회",
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
                    name: "vpc-id",
                    description: "VPC ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "list-subnet",
            description: "VPC의 서브넷 정보 조회",
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
                    name: "vpc-id",
                    description: "VPC ID",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    execute: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        if (subcommand === "create") {
            try {
                const region = interaction.options.getString("region");
                const cidr = interaction.options.getString("cidr");
                const vpcName = interaction.options.getString("vpc-name");
                const internetGateway = interaction.options.getBoolean("internet-gateway");
                // function call
                const response = await (0, VPC_function_1.createVPC)(userId, region, cidr, vpcName, internetGateway);
                await interaction.reply({
                    content: `**VPC 생성**\n\n**리전:** (${region})\n**CIDR:** ${cidr}\n**VPC ID:** ${response.vpcId}\n**VPC 이름:** ${vpcName}\n**InternetGateWay Id:** ${response.internetGatewayId ?? '생성 안함'}\n**InternetGateWay name:** ${response.internetGatewayName ?? '생성 안함'}\n`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `VPC 생성에 실패했습니다 :  ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand === "list-up") {
            try {
                const region = interaction.options.getString("region");
                const response = await (0, VPC_function_1.listUpVPC)(userId, region);
                await interaction.reply({
                    content: `**VPC 목록**\n\n**리전:** (${region})\n\n${response}`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `VPC 목록을 불러오기 실패했습니다. : ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand === "add-subnet") {
            try {
                const region = interaction.options.getString("region");
                const vpcId = interaction.options.getString("vpc-id");
                const subnetName = interaction.options.getString("subnet-name");
                const cidr = interaction.options.getString("cidr");
                // function call
                const response = await (0, VPC_function_1.addSubnet)(userId, region, vpcId, subnetName, cidr);
                await interaction.reply({
                    content: `**서브넷 추가**\n\n**리전:** (${region})\n**Subnet ID:** ${response.subnetId}\n**서브넷 이름:** ${response.subnetName}\n**CIDR:** ${response.cidrBlock}\n**state:** ${response.state}`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `서브넷 추가에 실패했습니다. : ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand === "delete-subnet") {
            try {
                const region = interaction.options.getString("region");
                const subnetId = interaction.options.getString("subnet-id");
                await (0, VPC_function_1.deleteSubnet)(userId, region, subnetId);
                await interaction.reply({
                    content: `**서브넷 삭제**\n\n**리전:** (${region})\n**서브넷 아이디:** ${subnetId}`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `서브넷 삭제에 실패했습니다. : ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand === "delete-vpc") {
            try {
                const region = interaction.options.getString("region");
                const vpcId = interaction.options.getString("vpcid");
                const response = await (0, VPC_function_1.deleteVPC)(userId, region, vpcId);
                await interaction.reply({
                    content: `**VPC 삭제**\n\n**리전:** (${region})\n**VPC 아이디:** ${vpcId}\n**InternetGateWay Id:** ${response.internetGatewayId}\n`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `VPC 삭제에 실패했습니다. : ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand === "add-routing-table") {
            try {
                const region = interaction.options.getString("region");
                const vpcId = interaction.options.getString("vpc-id");
                const name = interaction.options.getString("name");
                // function call
                const response = await (0, VPC_function_1.addSubnetGroup)(userId, region, vpcId, name);
                await interaction.reply({
                    content: `**라우팅 테이블 생성**\n\n**리전:** (${region})\n**VPC ID:** ${vpcId}\n**라우팅 테이블 이름:** ${name}\n**라우팅 테이블 ID:** ${response.routeTableId}\n`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `라우팅 테이블 생성에 실패했습니다. : ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand === "attach-routing-table") {
            try {
                const region = interaction.options.getString("region");
                const routingTableId = interaction.options.getString("routing-table-id");
                const subnetId = interaction.options.getString("subnet-id");
                // function call
                const response = await (0, VPC_function_1.attachSubnetGroup)(userId, region, routingTableId, subnetId);
                await interaction.reply({
                    content: `**라우팅 테이블 연결**\n\n**리전:** (${region})\n**라우팅 테이블 ID:** ${response.routingTableId}\n**서브넷 ID:** ${response.subnetId}\n**상태:** ${response.state}`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `라우팅 테이블 연결에 실패했습니다. : ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand === "add-routing-table-rule") {
            try {
                const region = interaction.options.getString("region");
                const routingTableId = interaction.options.getString("routing-table-id");
                const area = interaction.options.getString("area");
                const target = interaction.options.getString("target");
                const value = interaction.options.getString("value");
                const response = await (0, VPC_function_1.addRoutingTableRule)(userId, region, routingTableId, area, target, value);
                await interaction.reply({
                    content: `**라우팅 테이블 규칙 추가**\n\n**리전:** (${region})\n**라우팅 테이블 ID:** ${routingTableId}\n**대상 CIDR:** ${area}\n**대상 타입:** ${target}\n**대상 값:** ${value}\n**상태:** ${response.state}`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `라우팅 테이블 규칙 추가에 실패했습니다. : ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand === "list-routing-tables") {
            try {
                const region = interaction.options.getString("region");
                const vpcId = interaction.options.getString("vpc-id");
                const response = await (0, VPC_function_1.listRoutingTables)(userId, region, vpcId);
                await interaction.reply({
                    content: `**라우팅 테이블 목록**\n\n**리전:** (${region})\n**VPC ID:** ${vpcId}\n\n${response}`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `라우팅 테이블 목록을 불러오기 실패했습니다. : ${errorMessage}`,
                    flags: 64
                });
            }
        }
        else if (subcommand === "list-subnet") {
            try {
                const region = interaction.options.getString("region");
                const vpcId = interaction.options.getString("vpc-id");
                const response = await (0, VPC_function_1.listSubnet)(userId, region, vpcId);
                await interaction.reply({
                    content: `**서브넷 목록**\n\n**리전:** (${region})\n**VPC ID:** ${vpcId}\n\n${response}`,
                    flags: 64
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await interaction.reply({
                    content: `서브넷 목록을 불러오기 실패했습니다. : ${errorMessage}`,
                    flags: 64
                });
            }
        }
    }
};
