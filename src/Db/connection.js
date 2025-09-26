import mysql from "mysql2/promise.js"

export const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: process.env.PASSWORD_MYSQL,
    database: 'Quản lý học tập',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true
})