import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import startDiscordBot from './config/discord';

const app = express();
const router = express.Router();
dotenv.config();
const port = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// discord bot opperator    
startDiscordBot();

router.get('/', (req, res) => {
    res.json('aws discord bot');
});

// app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});