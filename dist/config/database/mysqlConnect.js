"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const ssh2_1 = require("ssh2");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const sshClient = new ssh2_1.Client();
let pool;
const createSshTunnel = () => {
    return new Promise((resolve, reject) => {
        sshClient.on('ready', () => {
            sshClient.forwardOut('127.0.0.1', 0, process.env.SSH_DATABASE_HOST, parseInt(process.env.SSH_DATABASE_PORT, 10), (err, stream) => {
                if (err)
                    reject(err);
                const newPool = promise_1.default.createPool({
                    host: '127.0.0.1',
                    port: 3306, // 로컬 포트 포워딩
                    user: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_NAME,
                    stream: stream,
                    waitForConnections: true,
                    connectionLimit: 10
                });
                resolve(newPool);
            });
        }).connect({
            host: process.env.SSH_HOST,
            port: 22,
            username: process.env.SSH_USER,
            privateKey: fs_1.default.readFileSync(path_1.default.resolve(process.env.SSH_KEY_PATH))
        });
    });
};
const getPool = async () => {
    if (!pool) {
        try {
            pool = await createSshTunnel();
            console.log('✅ SSH 터널링 연결 성공');
        }
        catch (error) {
            console.error('❗️ 연결 오류:', error);
            throw new Error('Database connection failed');
        }
    }
    return pool;
};
exports.getPool = getPool;
