const mysql = require('mysql');

class Connection {
    constructor() {
        this.dbParams = {
            host: "localhost",
            user: "root",
            password: "",
            database: "scorester"
        };

        this.db = mysql.createConnection(this.dbParams);
        this.models = {};
    };

    /**
     * Initialise the database connection.
     * Adds all available models for comparison before saving data to the database.
     * @param {...any} models All available database models.
     */
    init(...models) {
        for (const model of models) {
            const modelName = Object.keys(model)[0];
            this.models[modelName] = model[modelName];
        };
        
        /**
         * Make handshake.
         */
        this.db.connect(function(err) {
            if (err) throw err;
            console.log("Connection to database established!");
        });
    };
};

module.exports = (req, res, next) => {
    req.db = {
        register: (...params) => register(req.session, ...params),
        login: (...params) => login(req, ...params),
        logout: () => logout(req.session),
        getById: (...params) => getById(req.session, ...params),
        update: (...params) => update(req.session, ...params),
        search
    };
    next();
};
// module.exports = new Connection();