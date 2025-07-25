"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// // 코드 생성 함수
// export const generateCode = async (
// ) => {
//     let code = "";
//     for(let i = 0; i < 6; i++) {
//         code += Math.floor(Math.random() * 10);
//     }
//     return code;
// }
// 이메일 전송 함수
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_SECURITY
    }
});
// 이메일 전송 함수
const sendEmail = async (email, code) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: '공강 친구를 찾았습니다!!',
        text: `그 친구의 정보 : ${code}
               지금 바로 연락해보자!!`
    };
    exports.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};
exports.sendEmail = sendEmail;
