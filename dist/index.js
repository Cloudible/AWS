"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const discord_1 = __importDefault(require("./config/discord"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
dotenv_1.default.config();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// discord bot opperator    
(0, discord_1.default)();
router.get('/', (req, res) => {
    res.json('aws discord bot');
});
// app.use('/user', userRouter);
app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});
