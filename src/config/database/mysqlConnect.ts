import mysql from 'mysql2/promise';
import { Client } from 'ssh2';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const sshClient = new Client();
let pool: mysql.Pool;

const createSshTunnel = () => {
  return new Promise<mysql.Pool>((resolve, reject) => {
    sshClient.on('ready', () => {
      sshClient.forwardOut(
        '127.0.0.1',
        0,
        process.env.SSH_DATABASE_HOST!,
        parseInt(process.env.SSH_DATABASE_PORT!, 10),
        (err, stream) => {
          if (err) reject(err);
          
          const newPool = mysql.createPool({
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
        }
      );
    }).connect({
      host: process.env.SSH_HOST,
      port: 22,
      username: process.env.SSH_USER,
      privateKey: fs.readFileSync(path.resolve(process.env.SSH_KEY_PATH!))
    });
  });
};

export const getPool = async (): Promise<mysql.Pool> => {
  if (!pool) {
    try {
      pool = await createSshTunnel();
      console.log('✅ SSH 터널링 연결 성공');
    } catch (error) {
      console.error('❗️ 연결 오류:', error);
      throw new Error('Database connection failed');
    }
  }
  return pool;
};