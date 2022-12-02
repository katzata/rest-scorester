// const { validationResult } = require('express-validator');

module.exports = {
    async post(req, res) {
        const { url, user } = req;
        const currentAction = url.slice(1);
        const actions = {
            login: user.login,
            register: user.register,
            logout: user.logout,
            checkIfLogged: user.checkIfLogged
        };

        actions[currentAction]();
    },
    async logout(req, res) {
        req.user.logout();
    }
};