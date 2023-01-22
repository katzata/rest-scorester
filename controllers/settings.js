module.exports = {
    async changeSetting(req) {
        req.user.updateSettings();
    }
};