// const { hashPassword, checkPass } = require("../services/utils");

class Schema {
    constructor(fields) {
        this.availableFields = {};

        for (const field in fields) {
            this.availableFields[field] = fields[field];
        };

        return this.availableFields;
    };

    compareData(data) {
        for (const inputField in data) {
            if (this.availableFields[inputField]) {
                // console.log(data[inputField]);
            }
        };
    };
};

const user = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    user_settings: { type: String, required: true },
    game_settings: { type: String, required: true },
    apiKey: { type: String, required: true },
    ip: { type: String, required: true }
});

// userSchema.methods.checkPassword = async function(password) {
//     return await checkPass(password, this.password);
// };

// userSchema.pre("save", async function(next) {
//     if (this.isModified("password")) {
//         this.password = await hashPassword(this.password);
//     };

//     next();
// });

module.exports = { user };