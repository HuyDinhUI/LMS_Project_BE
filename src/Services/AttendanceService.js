import { pool } from "../Db/connection.js";

const getAttendanceByTeacher = async (MaLop) => {
    try{
        const [titles] = await pool.query(
            `SELECT DISTINCT ngay_day FROM LichDay ld
            JOIN LopHoc lh ON ld.MaLop = lh.MaLop 
            WHERE lh.MaLop = ?
            ORDER BY ngay_day ASC`
            ,[MaLop]
        )

        const pivotColumns = titles
        .map(
            (ld) => 
                `MAX(
            CASE
                WHEN ld.ngay_day = '${ld.ngay_day}' THEN
                    CASE 
                        WHEN dd.MaSV IS NULL THEN 0
                        ELSE 1
                    END
            END
            ) AS \`${ld.ngay_day}\`
            `
        ).join(", ");

        

        const sql = `
        SELECT 
            sv.MaSV, 
            sv.hoten,
            ${pivotColumns}
        from LichDay ld 
        join LopHoc lh on lh.MaLop = ld.MaLop
        join DangKyHocPhan dkhp on dkhp.Malop = lh.MaLop 
        join SinhVien sv on dkhp.MaSV = sv.MaSV
        left join DiemDanh dd on dd.MaSV = sv.MaSV and dd.MaLop = lh.MaLop and dd.ThoiGian = ld.ngay_day
        WHERE lh.MaLop = ?
        GROUP BY sv.MaSV, sv.hoten
        `;

        

        const [attendance] = await pool.query(sql, [MaLop]);
        return { data: attendance }
    }
    catch(error){
        throw error;
    }
}

const getAttendanceByStudent = async (MaLop,MaSV) => {
    try{
        const [attendance] = await pool.query(
            `
            select sv.MaSV , sv.hoten , ld.ngay_day,
            CASE
                when dd.MaSV IS NOT NULL THEN 1 ELSE 0
            END as DaDiemDanh
            from LichDay ld 
            join LopHoc lh on lh.MaLop = ld.MaLop
            join DangKyHocPhan dkhp on dkhp.Malop = lh.MaLop 
            join SinhVien sv on dkhp.MaSV = sv.MaSV
            left join DiemDanh dd on dd.MaSV = sv.MaSV and dd.MaLop = lh.MaLop and dd.ThoiGian = ld.ngay_day
            where lh.MaLop = ? and sv.MaSV = ?
            group by sv.MaSV, sv.hoten, ld.ngay_day
            order by ld.ngay_day 

            `,[MaLop,MaSV]
        )

        return { data: attendance }
    }
    catch(error){
        throw error;
    }
}

const record = async (MaSV, MaLop, status, ngay_day) => {
    
    try{
        // if (new Date(ngay_day).toDateString() !== new Date().toDateString()){
        //     throw new Error("Chỉ được điểm danh trong ngày học")
        // }
        if (status){
            await pool.query(
                `INSERT INTO DiemDanh (MaSV, MaLop, ThoiGian) VALUES (?, ?, ?)`,
                [MaSV, MaLop, ngay_day]
            )
        } else {
            await pool.query(
                `DELETE FROM DiemDanh WHERE MaSV = ? AND MaLop = ?`,
                [MaSV, MaLop]
            )
        }
    }
    catch(error){
        throw error;
    }
}

export const AttendanceService = {
    getAttendanceByTeacher,
    getAttendanceByStudent,
    record
}