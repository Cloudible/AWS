export interface successMessage {
    statusCode : number;
    customSuccess : string;
    user_id? : number;
    message : String;
};

export interface errorMessage {
    statusCode : number;
    customError : String;
    message : String;
};

// 에러 메시지 모음
export const addnewUsererrorMessages: Record<string, errorMessage> = {
    missingNickname: { statusCode: 400, customError : "401", message: "닉네임이 누락되었습니다." },
    serverError: { statusCode: 500, customError : "500", message: "서버 에러입니다." },
};


// 성공 메시지 모음
export const addnewUsersuccessMessages = (userId : number):successMessage => ({
    statusCode: 201, customSuccess : "20", user_id : userId, message: "사용자가 등록되었습니다." 
});