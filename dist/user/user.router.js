"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_Controller_1 = require("./user.Controller/user.Controller");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ message: 'user router' });
});
router.post('/info', user_Controller_1.postUserInfoController);
exports.default = router;
