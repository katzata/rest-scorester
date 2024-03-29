const fs = require("fs");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");

require("dotenv").config();

const userService = require("./services/user");
const dbService = require("./services/db");
const errorHandlingService = require("./services/errorHandling");

const auth = require("./controllers/auth");
const settings = require("./controllers/settings");

const { setResponseHeaders, send404 } = require("./utils/utils");

const init = () => {
	const port = process.env.NODE_ENV.trim() === "development" ? 5000 : 3000;
	const app = express();

	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());

	app.use(dbService());
	app.use(userService());
	app.use(errorHandlingService());

	app.get("/", (req, res) => {
		setResponseHeaders(req, res)
			.send(JSON.stringify({"res": "yay"}, null, 4));
	});

	app.post("/register",
		body("username")
			.trim()
			.isLength({ min: 3 })
			.withMessage("length")
			.matches(/[a-zA-Zа-яА-Я0-9.'\s]+/)
			.withMessage("language"),
		body("password")
			.trim()
			.isLength({ min: 6 })
			.withMessage("length")
			.matches(/[a-zA-Zа-яА-Я0-9]+/)
			.withMessage("language"),
		body("rePassword")
			.trim()
			.custom((value, { req }) => {
				return value === req.body.password
			})
			.withMessage("passMatch"),
		(req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// !!!ERROR!!!
				return console.log({ errors: errors.array() });
			};

			auth.post(req, res);
		}
	);

	app.post("/login",
		body("username")
			.trim()
			.matches(/[a-zA-Zа-яА-Я0-9.'\s]+/)
			.withMessage("language"),
		body("password")
			.trim()
			.matches(/[a-zA-Zа-яА-Я0-9]+/)
			.withMessage("language"),
		(req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// !!!ERROR!!!
				return console.log({ errors: errors.array() });
			};
			auth.post(req, res);
		}
	);

	app.post("/logout", (req, res) => {
		auth.logout(req, res);
	});

	app.post("/delete", (req, res) => {
		auth.delete(req, res);
	});

	app.post("/checkIfLogged", (req, res) => {
		auth.post(req, res);
	});

	app.post("/userSettings", (req, res) => {
		settings.changeSetting(req, res);
	});

	app.post("/gameSettings", (req, res) => {
		settings.changeSetting(req, res);
	});

	app.route("*")
		.get((req, res) => {
			setResponseHeaders(req, res);
			send404(res);
		})
		.post((req, res) => {
			setResponseHeaders(req, res);
			send404(res);
		});

	app.listen(port);

	// if (process.env.NODE_ENV.trim() === "development") {
	// 	const httpsPort = port + 1;
	// 	const secured = https.createServer(
	// 		{
	// 			// key: fs.readFileSync("./ssl/localhost.pem"),
	// 			// cert: fs.readFileSync("./ssl/localhost.crt")
	// 			key: fs.readFileSync("./ssl/localhost.pem"),
	// 			cert: fs.readFileSync("./ssl/localhost.crt")
	// 		},
	// 		app
	// 	);

	// 	secured.listen(httpsPort, function() {
	// 		console.log(`rest scorester listening on https://192.168.0.185:${httpsPort}`)
	// 	});
	// };
};

init();