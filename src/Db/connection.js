import mysql from "mysql2/promise.js"

export const pool = mysql.createPool({
    host:process.env.HOST_MYSQL,
    user: process.env.USER_MYSQL,
    password: process.env.PASSWORD_MYSQL,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
    port: process.env.PORT_MYSQL,
})