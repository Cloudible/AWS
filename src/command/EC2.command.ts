import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../DTO/slashCommand.DTO";
import { ec2 } from "../function/EC2.function";

export const ec2Command : SlashCommand = {
    name : "ec2",
    description : "EC2 관리",
    options : [
        {
            name : "status-check",
            description : "EC2 상태 확인",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "state",
                    description : "EC2 상태를 확인 합니다. (run/stop)",
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
                        }
                    ]
                }
            ]
        }, {
            name : "list-up",
            description : "EC2 목록 조회",
            type : ApplicationCommandOptionType.Subcommand
        }
    ],
    execute : async(client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === "status-check") {
            const state = interaction.options.getString("state");
            await interaction.reply(`EC2 상태 : ${state}`);
        } else if (subcommand === "list-up") {
            try {
                const list = await ec2.describeInstances().promise();
                await interaction.reply(`EC2 list : ${JSON.stringify(list, null, 2)}`);
            } catch (error) {
                console.error('AWS Error:', error);
                await interaction.reply("AWS 자격 증명이 설정되지 않았습니다. 환경 변수를 확인해주세요.");
            }
        }
    }
}   