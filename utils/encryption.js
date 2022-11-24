const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(password) {
    return new Promise((resolve) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            resolve(hash);
        });
    });
};

async function checkPassword(password, hash) {
    return new Promise((resolve) => {
        bcrypt.compare(password, hash).then(function(result) {
            resolve("yay");
            // result == true
        });
    });
};

module.exports = {
    hashPassword,
    checkPassword
};