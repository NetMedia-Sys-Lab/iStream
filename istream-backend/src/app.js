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
app.use("/video", require("./api/video.route"));
app.use("/components", require("./api/components.route"));
app.use("/machines", require("./api/machines.route"));

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

let experimentHandlerController = require("./controllers/experimentHandler.controller");

let build = io.of("/build").on("connection", (socket) => {
   experimentHandlerController.build(build, socket);
});

// app.set('socketIO', io);

let run = io.of("/runExperiment").on("connection", function (socket) {
   experimentHandlerController.run(run, socket);
});

// let runClient = io.of("/runClient").on("connection", function (socket) {
//    experimentController.runClient(runClient, socket);
// });

// let runNetwork = io.of("/runNetwork").on("connection", function (socket) {
//    experimentController.runNetwork(runNetwork, socket);
// });
