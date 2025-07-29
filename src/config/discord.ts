import { ChatInputCommandInteraction, Client, Interaction, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import commandRouter from '../router.Command/EC2.Router';

dotenv.config();

const Token = process.env.DISCORD_TOKEN;

const client = new Client({
    // 봇 권한 설정
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const startDiscordBot = async () => {
    await client.login(Token);
    console.log('Discord bot is running');

    client.on('ready', async () => {
        if(client.application) {
            await client.application.commands.set(commandRouter);
            console.log('Slash commands registered');
        }
    });
};

client.on('interactionCreate', async(interaction: Interaction) => {
    if(interaction.isCommand()) {
        const currentCommand = commandRouter.find(command => command.name === interaction.commandName);
        if(currentCommand) {
            currentCommand.execute(client, interaction as ChatInputCommandInteraction);
        }
    }
});

export default startDiscordBot;