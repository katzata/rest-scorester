const User = require("../models/user");
const { hashPassword, checkPassword } = require("../utils/encryption");
const { generateAccessToken, validateAccessToken, generateRefreshToken, validateRefreshToken } = require("../utils/jwt");

async function register(req, res) {
    const { username, password } = req.body;
    const hashedPass = await hashPassword(password);
    const userSettings = { "keepRecord":true };
    const gameSettings = {
        "numberOfPlayers": 1,
        "scoreBelowZero": false,
        "scoreTarget": 0,
        "mainTimer": false,
        "individualTimers": false
    };
    const accessToken = generateAccessToken({ username, password: hashedPass });
    const data = {
        users: {
            username,
            password: hashedPass,
            user_settings: JSON.stringify(userSettings),
            game_settings: JSON.stringify(gameSettings),
            token: accessToken,
            ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress
        }
    };

    const refreshToken = generateRefreshToken({ username, password, token: accessToken });
    // res.cookie('jwt', refreshToken, { httpOnly: true, 
    //     sameSite: 'None', secure: true, 
    //     maxAge: 24 * 60 * 60 * 1000 });

    const {token} = data.users;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Private-Network": "true",
        "Access-Control-Allow-Headers": "headers, method, content-type, body, id, apiKey"
    };
    // res.cookie(
    //     "token",
    //     refreshToken, 
    //     {
    //         httpOnly: true,
    //         sameSite: "None", secure: true,
    //         maxAge: 24 * 60 * 60 * 1000
    //     }
    // );
    console.log("x");
    res.set(headers)
        .cookie(
            "token",
            refreshToken, 
            {
                httpOnly: true,
                sameSite: "None", secure: true,
                maxAge: 24 * 60 * 60 * 1000
            }
        );
    res.send(JSON.stringify({"test": "yay"}, null, 4));
    
    // console.log("x", validateAccessToken(token));
    // console.log("y", validateRefreshToken(refreshToken));
    // req.db.createEntry(data).then(res => {
        // DONE
        // console.log(res);
    // });






    // const { email, password, skillDescriptions } = data;
    // const errors = [];
    
    // const userQuery = await User.exists({ email });
    
    // if (userQuery) {
    //     throw new Error("User name already exists!");
    // };

    // const newUser = new User({ email, password, skillDescriptions });
    // await newUser.save();

    // setSession(session, newUser);
    // return true;
};

async function login(req, res) {
    const query = { username: req.body.username };

    return req.db.getEntry(query).then(res => {
        const user = formatUser(res[0]);

        if (user) {
            
            console.log(user);
            // if (passwordCheck) {
            //     setSession(req.session, user);
            // } else {
            //     throw new Error(errMessage);
            // };

            // return true;
        } else {
            // throw new Error(errMessage);
        };
    });
    // const { email, password } = data;
    // const user = await User.findOne({ email });
    // const errMessage = "Wrong user name or password!";
    
    // if (user) {
    //     const passwordCheck = await user.checkPassword(password);
        
    //     if (passwordCheck) {
    //         setSession(req.session, user);
    //     } else {
    //         throw new Error(errMessage);
    //     };

    //     return true;
    // } else {
    //     throw new Error(errMessage);
    // };
};

async function logout(session) {
    // delete session.user;
};

async function checkIfLogged(session, additional) {
    
};

async function update(session, data) {
    // const user = await User.findById(session.user.id);

    // Object.entries(data).forEach(el => {
    //     const [key, value] = el;

    //     if (user[key]) {
    //         if (Array.isArray(user[key])) {
    //             if (user[key].every(el => el.toString() !== value)) {
    //                 user[key].push(value);
    //             } else {
    //                 user[key].splice(value, 1);
    //             };
    //         } else {
    //             user[key] = value;
    //         };
    //     };
    // });

    // await user.save();
    // return true;
};

async function setSession(session, user) {
    // session.user = {
    //     id: user._id,
    //     email: user.email
    // };
};

function formatUser(data) {
    return {
        id: data.id,
        username: data.username,
        userSettings: JSON.parse(data.user_settings),
        gameSettings: JSON.parse(data.game_settings),
        apiKey: data.api_key
    };
};

module.exports = () => (req, res, next) => {
    // if (req.session.user) {
    //     res.locals.user = req.session.user;
    //     res.locals.isLogged = true;
    // };

    req.user = {
        register: (...params) => register(req, res, ...params),
        login: () => login(req),
        logout: () => logout(req.session),
        getById: (...params) => getById(req.session, ...params),
        update: (...params) => update(req.session, ...params)
    };
    next();
};