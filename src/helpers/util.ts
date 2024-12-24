const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds)
    } catch (error) {
        console.log(error);

    }
}

export const compareHashPasswordHelper = async (plainPassword: string, hashPassword: string): Promise<boolean> => {
    try {
        const match = bcrypt.compare(plainPassword, hashPassword)
        // console.log(match);
        
        return match;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// export const compareHashPasswordHelper = async (plainPassword: string, hashPassword: string) => {
//     try {
//         const match = bcrypt.compare(plainPassword, hashPassword)
//         return match
//     } catch (error) {
//         console.log(error);

//     }
// }