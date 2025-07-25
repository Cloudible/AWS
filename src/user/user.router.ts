import express from 'express';
import { postUserInfoController } from './user.Controller/user.Controller';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'user router' })
});

router.post('/info', postUserInfoController);

export default router;