const jwt = require("jsonwebtoken");
const accessTokenPassPhrase = process.env.JWT_ACCESS_TOKEN_PASSPHRASE;
const refreshTokenPassPhrase = process.env.JWT_ACCESS_TOKEN_PASSPHRASE;

function generateAccessToken(data) {
    return generateToken("access", data);
};

function validateAccessToken(token) {
    return validateToken("access", token);
};

function generateRefreshToken(data) {
    return generateToken("refresh", data);
}

function validateRefreshToken(token) {
    return validateToken("refresh", token);
};

function generateToken(type, data) {
    const passPhrase = type === "access" ? accessTokenPassPhrase : refreshTokenPassPhrase;
    const expiresIn = type === "access" ? "15m" : "30d";

    return jwt.sign(data, passPhrase, { expiresIn });
};

function validateToken(type, token) {
    const passPhrase = type === "access" ? accessTokenPassPhrase : refreshTokenPassPhrase;
    try {
        return jwt.verify(token, passPhrase);
    } catch (err) {
        // !!!ERROR!!!
        console.log(err.message);
    }
    
};

module.exports = {
    generateAccessToken,
    validateAccessToken,
    generateRefreshToken,
    validateRefreshToken
};