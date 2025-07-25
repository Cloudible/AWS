import nodemail from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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
export const transporter = nodemail.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_SECURITY
    }
});

// 이메일 전송 함수
export const sendEmail = async(
    email: string,
    code: string
) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: '공강 친구를 찾았습니다!!',
        text: `그 친구의 정보 : ${code}
               지금 바로 연락해보자!!`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};