import { pool } from "../Db/connection.js"


const StatisticalAssignmentStatus = async (MaLop, MSGV) => {
    try{
        const [assignments] = await pool.query(
            `
            SELECT 
            SUM(CASE WHEN nb.MaSV IS NULL THEN 1 ELSE 0 END) AS unsubmitted,
            SUM(CASE WHEN nb.MaSV IS NOT NULL AND nb.thoigian_nop <= bt.HanNop THEN 1 ELSE 0 END) AS submitted,
            SUM(CASE WHEN nb.MaSV IS NOT NULL AND nb.thoigian_nop > bt.HanNop THEN 1 ELSE 0 END) AS lated
            FROM BaiTap bt
            JOIN LopHoc lh ON bt.MaLop = lh.MaLop
            JOIN DangKyHocPhan dkhp ON dkhp.MaLop = lh.MaLop
            JOIN SinhVien sv ON sv.MaSV = dkhp.MaSV
            LEFT JOIN NopBai nb 
                ON nb.MaSV = sv.MaSV 
                AND nb.MaBaiTap = bt.MaBaiTap
            WHERE bt.MaLop = ? and lh.MSGV = ?
            ORDER BY bt.NgayTao DESC;
            `,[MaLop, MSGV]
        )

        return {data: assignments}
    }
    catch(err){
        throw err
    }
}

export const StatisticalService = {
    StatisticalAssignmentStatus
}