import { Client } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const Token = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: []
});

const startDiscordBot = async () => {
    await client.login(Token);
    console.log('Discord bot is running');
}

export default startDiscordBot;