export const CreateMSGV = (type) => {
    let msgv = ''
    if (type === 'Cơ hữu'){
        msgv = '0100' + Math.floor(Math.random() * 9999)
    }
    else {
        msgv = 'TG0100' + Math.floor(Math.random() * 9999)
    }

    return msgv

}