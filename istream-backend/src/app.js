//IMPORTS
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const cors = require("cors");
const fileUpload = require("express-fileupload");

//CONSTANTS
const PORT = process.env.PORT || 8888;

//MIDDLEWARES
app.use(express.json()); //to return files as json
app.use(cors()); //for cross origin  files
app.use(fileUpload());

//ROUTES
app.use("/auth", require("./api/user.route"));
app.use("/experiment", require("./api/experiment.route"));
app.use("/modules", require("./api/modules.route"));

//SERVER PORT
server.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`);
});

process.on("uncaughtException", (error) => {
   console.error(error);
});

const io = new Server(server, {
   cors: {
      methods: ["GET", "POST"],
      credentials: true,
   },
});

let experimentController = require("./controllers/experiment.controller");

let build = io.of("/build").on("connection", (socket) => {
   experimentController.build(build, socket);
});

var run = io.of("/run").on("connection", function (socket) {
   experimentController.run(run, socket);
});
