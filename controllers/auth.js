module.exports = {
    async post(req, res) {
        const { url, user } = req;
        const currentAction = url.slice(1);
        const actions = {
            login: user.login,
            register: user.register,
            checkIfLogged: user.checkIfLogged
        };

        actions[currentAction]();
    },
    async logout(req, res) {
        req.user.logout();
    },
    async delete(req, res) {
        req.user.delete();
    },
};