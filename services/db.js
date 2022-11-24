const mysql = require('mysql');

const dbParams = {
    host: "localhost",
    user: "root",
    password: "",
    database: "scorester"
};

const db = mysql.createConnection(dbParams);

/**
 * Create a database entry.
 * @param {Object} data Contains one key value pair.
 * The key represents the table that will be queried.
 * The value represents the fields that will be created.
 */
async function createEntry(data) {
    const table = Object.keys(data)[0];
    const fieldKeys = Object.keys(data[table]).join(", ");
    const fieldValues = Object.values(data[table]).map(el => `'${el}'`).join(", ");
    const query = `INSERT INTO ${table} (${fieldKeys}) VALUES (${fieldValues});`;

    return makeQuery(query);
};

/**
 * Get a database entry.
 * @param {Object} data Contains one key value pair.
 * The key represents the table that will be queried.
 * The value represents the fields that will form the query.
 */
function getEntry(res, data) {
    const fields = getQueryFields(data);
    const query = `SELECT * FROM users WHERE ${fields.join(" AND ")};`;

    return makeQuery(query);
};

/**
 * Update a database entry.
 * @param {Object} data Contains one key value pair.
 * The key represents the table that will be queried.
 * The value represents the fields that will be updated.
 */
async function updateEntry(data) {

};

/**
 * Delete a database entry.
 * @param {Object} data Contains one key value pair.
 * The key represents the table that will be queried.
 * The value represents the id(row) that will be deleted.
 */
async function deleteEntry(data) {

};

async function makeQuery(query) {
    return new Promise((resolve, reject) => {
        db.query(query, function (error, results, fields) {
            if (error) {
                // !!!ERROR!!!
                console.log(error)
                return resolve([]);
            };

            return resolve(results);
        });
    });
};

function getQueryFields(data) {
    return Object.entries(data).map(el => {
        el[1] = `'${el[1]}'`;
        return el.join("=");
    });
};

module.exports = () => (req, res, next) => {
    req.db = {
        createEntry: (data) => createEntry(data),
        getEntry: (...params) => getEntry(res, ...params),
        updateEntry: () => updateEntry(req.session),
        deleteEntry: (...params) => deleteEntry(req.session, ...params)
    };
    next();
};