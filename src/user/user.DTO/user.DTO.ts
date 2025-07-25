export interface userInfo {
    name : string;
    email : string;
    personalInfo : string;
    grade : string;
    gonggang : gonggangSchedule;
};

export interface gonggangSchedule {
    mon ?: string;
    tue ?: string;
    wednes ?: string;
    thrus ?: string;
    fri ?: string;
}