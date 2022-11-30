const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit : 1,
    host: "localhost",
    user: "root",
    password: "",
    database: "scorester"
});

/**
 * Create a database entry.
 * @param {Object} data Contains one key value pair.
 * The key represents the table that will be queried.
 * The value represents the fields that will be created.
 */
function createEntry(data) {
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
 * The value represents the fields that will form the query, which again are key value pairs.
 */
function getEntry(data) {
    const table = Object.keys(data)[0];
    const fields = formatFields(data[table]);
    const query = `SELECT * FROM ${table} WHERE ${fields.join(" AND ")};`;
    return makeQuery(query);
    // return new Promise((res, rej) => res([]));
};

/**
 * Update a database entry.
 * @param {Object} data Contains one key value pair.
 * The key represents the table that will be queried.
 * The value represents the fields that will be updated.
 */
function updateEntry(id, data) {
    const table = Object.keys(data)[0];
    const fields = formatFields(data[table]);
    const query = `UPDATE ${table} SET ${fields} WHERE id='${id}';`;

    return makeQuery(query);
};

/**
 * Delete a database entry.
 * @param {Object} data Contains one key value pair.
 * The key represents the table that will be queried.
 * The value represents the id(row) that will be deleted.
 */
async function deleteEntry(data) {
    
};

/**
 * Makes a database query.
 * @param {String} query An SQL statement (SELECT, INSERT, UPDATE, DELETE).
 * @returns Alwayes a resolved promise in order to keep the error handling here.
 */
async function makeQuery(query) {
    return new Promise((resolve, reject) => {
        db.query(query, function (error, results, fields) {
            let res = [];
            
            if (error) {
                // !!!ERROR!!!
                const { stack, message, errno, code, syscall, address, port, fatal } = error;
                res.push({ error: { code: 503, list: ["No connection to the database."]} });
                console.log("makeQuery", `stack: ${stack}\n`, `message: ${message}\n`, `errno: ${errno}\n`, `code: ${code}\n`,`syscall: ${syscall}\n`, `address: ${address}\n`, `port: ${port}\n`, fatal)
            } else {
                res = results;
            };

            return resolve(res);
        });
    });
};

/**
 * Formats the key value pairs for a query.
 * @param {Object} data An object containing key value pairs representing columns and values.
 * @returns An array of strings that are ready to form a query.
 */
function formatFields(data) {
    return Object.entries(data).map(el => {
        el[1] = `'${el[1]}'`;
        return el.join("=");
    });
};

module.exports = () => (req, res, next) => {
    req.db = {
        createEntry: (data) => createEntry(data),
        getEntry: (data) => getEntry(data),
        updateEntry: (...params) => updateEntry(...params),
        deleteEntry: (data) => deleteEntry(data)
    };

    next();
};