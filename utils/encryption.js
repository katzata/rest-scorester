const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.JWT_SALT_ROUNDS);

/**
 * Generates a hash.
 * @param {String} input The string to be hashed.
 * @returns A promise that will always be resolved despyte the result.
 */
async function generateHash(input) {
    return new Promise((resolve) => {
        bcrypt.hash(input, saltRounds, function(err, hash) {
            if (err) console.log(err);
            resolve(hash);
        });
    });
};

/**
 * Validates a hash.
 * @param {String} input Standard user input.
 * @param {String} hash The stored hash.
 * @returns A promise that will always be resolved despyte the result.
 */
async function validateHash(input, hash) {
    return await new Promise((resolve) => {
        bcrypt.compare(input, hash).then(function(result) {
            resolve(result);
        });
    });
};

module.exports = {
    generateHash,
    validateHash
};