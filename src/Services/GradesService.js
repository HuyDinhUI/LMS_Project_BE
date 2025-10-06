import {pool} from "../Db/connection.js"

const getGradesByStudent = async (masv) => {
    try{
        const [grades] = await pool.query(
            `
            select bd.MaSV ,
            bd.MaHP ,
            bd.diem_chuyencan ,
            bd.diem_quatrinh ,
            bd.diem_thi ,
            bd.diem_tong ,
            bd.diem_thang_4 ,
            bd.diem_chu  , 
            bd.XepLoai ,
            bd.TrangThai ,
            hp.ten_hocphan ,
            hp.so_tinchi
            from BangDiem bd 
            join HocPhan hp on bd.MaHP = hp.MaHP 
            where bd.MaSV = ?
            `
            ,[masv]
        )

        return {data: grades}
    }
    catch(err){
        throw err
    }
}

export const GradesService = {
    getGradesByStudent
}