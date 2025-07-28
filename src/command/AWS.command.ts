import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../DTO/slashCommand.DTO";

export const awsCommand : SlashCommand = {
    name : "aws",
    description : "AWS 관리",
    options : [
        {
            name : "root-login",
            description : "AWS 로그인",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "email",
                    description : "이메일 주소 (root-login 선택시)",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "password",
                    description : "비밀번호",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        }, 
        {
            name : "iam-login",
            description : "IAM 로그인",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "account-id",
                    description : "AWS 계정 ID",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "username",
                    description : "IAM 사용자명",
                    type : ApplicationCommandOptionType.String,
                    required : true
                },
                {
                    name : "password",
                    description : "비밀번호",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        }
    ],
    execute : async(client, interaction) => {
        const subcommand = interaction.options.getSubcommand();

        if(subcommand === "root-login") {
            const email = interaction.options.getString("email");
            const password = interaction.options.getString("password");
            // function call 할 것
            await interaction.reply(`Root 로그인 시도: ${email}`);
        } else if(subcommand === "iam-login") {
            const accountId = interaction.options.getString("account-id");
            const username = interaction.options.getString("username");
            const password = interaction.options.getString("password");
            // function call 할 것
            await interaction.reply(`IAM 로그인 시도: ${accountId}/${username}`);
        }
    }
}