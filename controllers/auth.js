const { validationResult } = require('express-validator');

module.exports = {
    async post(req, res) {
        const { url, user } = req;
        const currentAction = url.slice(1);
        const actions = {
            login: user.login,
            register: user.register,
            logout: user.logout
        };

        actions[currentAction]();
        // if (req.user[action]) {
        //     try {
        //         let { errors } = validationResult(req);
        
        //         if (errors.length > 0) {
        //             throw errors.map(req.errorFormating);
        //         };

        //         const result = await req.user[action](req.body);
                
        //         if (result) {
        //             res.redirect("/");
        //         };
        //     } catch (err) {
        //         res.locals.errorMessages.push(err.message);
        //         res.render(action, { title: action });
        //     };
        // } else {
        //     res.redirect("404")
        // };
    },
    logout(req, res) {
        req.user.logout(req.session);
        res.redirect("/");
    }
};