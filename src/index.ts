import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { swaggerSpec, swaggerUi } from './config/swagger';
import  userRouter  from './user/user.router';

const app = express();
const router = express.Router();
dotenv.config();
const port = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.get('/', (req, res) => {
    res.json('aws discord bot');
});

app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});