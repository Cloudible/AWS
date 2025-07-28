import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../DTO/slashCommand.DTO";

export const rdsCommand : SlashCommand = {
    name : "rds",
    description : "RDS 관리",
    options : [
        {
            name : "list-up",
            description : "RDS 목록 조회",
            type : ApplicationCommandOptionType.SubcommandGroup,
            options : [

            ]
        }
    ],
    execute : async(client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === "list-up") {
            const state = interaction.options.getString("state");
            await interaction.reply(`RDS list : ${state}`);
        }
    }
}   