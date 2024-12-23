const bcrypt = require('bcrypt');
const saltRounds= 10;

export const hashPasswordHelper= async (plainPassword : string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds)
    } catch (error) {
        console.log(error);
        
    }
}

export const compareHashPasswordHelper= async (plainPassword : string, hashPassword : string): Promise<boolean> => {
    try {
        return  bcrypt.compare(plainPassword, hashPassword)
    } catch (error) {
        console.log(error);
        
    }
}