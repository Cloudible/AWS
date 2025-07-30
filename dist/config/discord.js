"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("../router.Command/router"));
dotenv_1.default.config();
const Token = process.env.DISCORD_TOKEN;
const client = new discord_js_1.Client({
    // 봇 권한 설정
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
const startDiscordBot = async () => {
    await client.login(Token);
    console.log('Discord bot is running');
    client.on('ready', async () => {
        if (client.application) {
            await client.application.commands.set(router_1.default);
            console.log('Slash commands registered');
        }
    });
};
client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const currentCommand = router_1.default.find(command => command.name === interaction.commandName);
        if (currentCommand) {
            currentCommand.execute(client, interaction);
        }
    }
});
exports.default = startDiscordBot;
