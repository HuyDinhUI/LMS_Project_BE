import { pool } from "../Db/connection.js"

const getAllMajor = async () => {
    try{
        const [major] = await pool.query("select * from ChuyenNganh")

        return {data: major}
    }
    catch(err){
        throw err
    }
}

export const MajorService = {
    getAllMajor
}