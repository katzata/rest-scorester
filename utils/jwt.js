const jwt = require("jsonwebtoken");
const accessTokenPassPhrase = process.env.JWT_ACCESS_TOKEN_PASSPHRASE;
const refreshTokenPassPhrase = process.env.JWT_ACCESS_TOKEN_PASSPHRASE;

/**
 * Generates a JWT access token.
 * @param {Object} data The data that will be ancrypted.
 * @returns The JWT access token.
 */
function generateAccessToken(data) {
    return generateToken("access", data);
};

/**
 * Validatess a JWT access token.
 * @param {Object} data The token that will be validated.
 * @returns The decryptrd access token.
 */
function validateAccessToken(token) {
    return validateToken("access", token);
};

/**
 * Generates a JWT refresh token.
 * @param {Object} data The data that will be ancrypted.
 * @returns The JWT refresh token.
 */
function generateRefreshToken(data) {
    return generateToken("refresh", data);
}

/**
 * Validatess a JWT refresh token.
 * @param {Object} data The token that will be validated.
 * @returns The decryptrd refresh token.
 */
function validateRefreshToken(token) {
    return validateToken("refresh", token);
};

/**
 * Generate an access or refresh token.
 * @param {String} type The type of token that will be generated.
 * @param {Object} data The data that will be encrypted.
 * @returns The appropriate access token.
 */
function generateToken(type, data) {
    const passPhrase = type === "access" ? accessTokenPassPhrase : refreshTokenPassPhrase;
    const expiresIn = type === "access" ? "15m" : "30d";

    return jwt.sign(data, passPhrase, { expiresIn });
};

/**
 * Validates an access or refresh token.
 * @param {String} type The type of token that will be validated.
 * @param {String} token The token that will be validated.
 * @returns The decrypted token content.
 */
function validateToken(type, token) {
    const passPhrase = type === "access" ? accessTokenPassPhrase : refreshTokenPassPhrase;
    try {
        return jwt.verify(token, passPhrase);
    } catch (err) {
        return null;
    };
};

module.exports = {
    generateAccessToken,
    validateAccessToken,
    generateRefreshToken,
    validateRefreshToken
};