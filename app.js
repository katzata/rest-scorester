const fs = require("fs");
const express = require("express");
const https = require('https');
const { body, validationResult } = require('express-validator');

require('dotenv').config();

const userService = require("./services/user");
const dbService = require("./services/db");

const auth = require("./controllers/auth");

// const userModel = require("./models/User");
const headers = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST",
	"Access-Control-Allow-Private-Network": "true",
	"Access-Control-Allow-Headers": "headers, method, content-type, body, id, apiKey"
};

const init = () => {
	const port = process.env.NODE_ENV.trim() === "development" ? 5000 : 3000;
	const app = express();
	
	app.use(express.urlencoded({ extended: true }));
	
	app.use(dbService());
	app.use(userService());

	app.get("/", (req, res) => {
		res.set(headers);
		res.send(JSON.stringify({"test": "yay"}, null, 4));
		// res.send("Hello World!");
	});

	app.route("/register")
		.get((req, res) => {
			res.set(headers);
			res.send(JSON.stringify({Errors: "You shouldn't be trying this..."}, null, 4));
		})
		.post(
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
					}

					auth.post(req, res);
				}
		);

	app.route("/login")
		.get((req, res) => {
			res.set(headers);
			res.send(JSON.stringify({Errors: "You shouldn't be trying this..."}, null, 4));
		})
		.post(
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
			auth.post
		);

	app.listen(port, () => {
		console.log(`rest scorester listening on http://localhost:${port}`);
	});

	if (process.env.NODE_ENV === "development ") {
		const httpsPort = port + 1;
		const secured = https.createServer(
			{ key: fs.readFileSync("./ssl/localhost.pem"), cert: fs.readFileSync("./ssl/localhost.pem") },
			app
		);
		
		secured.listen(httpsPort, function() {
			console.log(`rest scorester listening on https://localhost:${httpsPort}`)
		});
	};
};

init();