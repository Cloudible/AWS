import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../DTO/slashCommand.DTO";

export const rdsCommand : SlashCommand = {
    name : "rds",
    description : "RDS 관리",
    options : [
        {
            name : "list-up",
            description : "RDS 목록 조회",
            type : ApplicationCommandOptionType.Subcommand
        }
    ],
    execute : async(client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === "list-up") {
            await interaction.reply("RDS 목록을 조회합니다.");
        }
    }
}   