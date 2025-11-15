import { AccountService } from "../Services/AccountService.js";

const getAllAccount = async (req, res) => {
  const { keyword, status, sortBy, order, page, limit } = req.query;
  try {
    const result = AccountService.getAllAccount(
      keyword,
      status,
      sortBy,
      order,
      page,
      limit
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const AcccountController = {
    getAllAccount
};
