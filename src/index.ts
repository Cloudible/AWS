import dotenv from 'dotenv';
import startDiscordBot from './config/discord';

dotenv.config();
const port = process.env.PORT;

// discord bot opperator    
startDiscordBot();
