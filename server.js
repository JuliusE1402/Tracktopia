const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

app.use(express.static("public/html"));
app.use(express.static("public/javascript"));
app.use(express.static("public/stylesheets"));
app.use(express.static("public/src"));
app.use(bodyParser.json());

require("./app/routes.js")(app);

app.listen(process.env.PORT, () => {
	console.log("app listen on port", process.env.PORT);
});
