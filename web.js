// KingCh1ll //
// Last Edited: 2/18/2021 //
// website.js //

// Librarys //
const express = require("express");
const path = require("path");

// App //
const app = express();

// Code //
console.log("-------- Website --------");
app.use(
	require("serve-favicon")(
		path.resolve(`${process.cwd()}${path.sep}assets${path.sep}images${path.sep}site${path.sep}favicon.ico`),
	),
);

app.use("*", (req, res) => res.status(200).send({ status: 200, message: "SparkV is online." }));
app.listen(process.env.PORT || 3000, () => console.log("💻 | Server listening to port 3000."));
