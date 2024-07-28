import bcrypt from "bcryptjs"

function hashPassword(password: string){
    const salt=bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

function comparePassword(raw: string, hash: string){
    return bcrypt.compareSync(raw, hash);
}

export default {
    hashPassword,
    comparePassword, 
}
// module.exports = {
//     hashPassword,
//     comparePassword,
// }