import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const createTeacher = async (req, res, next) => {
  const createTeacherSchema = Joi.object({
    hoten: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    sdt: Joi.string()
      .pattern(/^(0[1-9][0-9]{8})$/) // ví dụ regex số VN: 10 số, bắt đầu bằng 0x
      .message("Số điện thoại không hợp lệ")
      .optional(),
    khoa: Joi.string().required(),
    trinhdo: Joi.string().valid("Cử nhân", "Thạc sĩ", "Tiến sĩ").optional(),
    ngaysinh: Joi.date().less("now").optional(),
    diachi: Joi.string().required(),
    gioitinh: Joi.string().required(),
    chucdanh: Joi.string().required(),
    hinhanh: Joi.string().optional(),
    role: Joi.string().required()
  });

  try {
    await createTeacherSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      message: err.message,
    });
  }
};

export const TeacherValidation = {
    createTeacher
}
