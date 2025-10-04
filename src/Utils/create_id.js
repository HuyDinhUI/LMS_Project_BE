

export const CreateMSGV = (type, Makhoa) => {
  let msgv = "";
  if (type === "Cơ hữu") {
    msgv = Makhoa + `${Math.floor(Math.random() * 9000) + 1000}`.padStart(0,4);
  } else {
    msgv = "TG" + Makhoa + `${Math.floor(Math.random() * 9000) + 1000}`.padStart(0,4);
  }

  return msgv;
};

export const CreateMaHP = (MaKhoa) => {
  return MaKhoa + `${Math.floor(Math.random() * 9000) + 1000}`.padStart(0,4)

}

export const CreateMaLop = (MaHP) => {
  return MaHP + `${Math.floor(Math.random() * 9000) + 1000}`.padStart(0,4)
}

export const createMaLichDay = (MaLop) => {
  return MaLop + `${Math.floor(Math.random() * 9000) + 1000}`.padStart(0,4)
}

export const CreateMaSV = (MaKhoa) => {
  return MaKhoa + new Date().getFullYear().toString().slice(2,4) + `${Math.floor(Math.random() * 9000) + 1000}`.padStart(0,4)
}

export const CreateMaCongNo = (MaSV) => {
  return 'CN' + MaSV + `${Math.floor(Math.random() * 9000) + 1000}`.padStart(0,4)
}