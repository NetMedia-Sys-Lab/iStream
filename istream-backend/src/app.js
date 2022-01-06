//IMPORTS
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");

//CONSTANTS
const PORT = process.env.PORT || 8080;

//MIDDLEWARES
app.use(express.json()); //to return files as json
// app.options("*", cors());
app.use(cors()); //for cross origin  files

//ROUTES
app.use("/auth", require("./api/user/user.route"));

//SERVER PORT
server.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`);
});

// const { logError, isOperationalError } = require("./errorHandler");

process.on("uncaughtException", (error) => {
   console.error(error);
});
