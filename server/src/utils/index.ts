export function generateAccessCode(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let accessCode = '';
    for (let i = 0; i < length; i++) {
        accessCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return accessCode;
}


