export const CreateMSGV = (role) => {
    let msgv = ''
    if (role === 'Giảng viên cơ hữu'){
        msgv = '0100' + Math.floor(Math.random() * 9999)
    }
    else {
        msgv = 'TG0100' + Math.floor(Math.random() * 9999)
    }

    return msgv

}