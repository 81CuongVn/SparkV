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
app.use("*", (req, res) => res.status(404).send({ status: 404, message: "This API route does not exist." }));
app.listen(process.env.PORT || 3000, () => console.log("💻 | Server listening to port 3000."));
