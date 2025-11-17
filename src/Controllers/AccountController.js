import { AccountService } from "../Services/AccountService.js";
import bcrybt from "bcryptjs";

const getAllAccount = async (req, res) => {
  const { keyword, status, role, sortBy, order, page, limit } = req.query;
  try {
    const result = await AccountService.getAllAccount(
      keyword,
      status,
      role,
      sortBy,
      order,
      page,
      limit
    );
    res.status(200).json({message: 'Lấy danh sách tài khoản thành công', result})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  
}

export const AcccountController = {
    getAllAccount,
    changePassword
};
