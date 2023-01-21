import { API, DOMAIN } from "./API";

import openSocket from "socket.io-client";

export function getExperimentConfig(user, experimentId) {
   return API.get("/experiment/getExperimentConfig", {
      params: {
         user,
         experimentId,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export function getExperimentDependency(user, experimentId) {
   return API.get("/experiment/getExperimentData", {
      params: {
         user,
         experimentId,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export function subscribeToBuildExperiment(userInfo, cb) {
   const SOCKET = openSocket(DOMAIN + "build");
   SOCKET.on("getExperiment‌BuildInfo", (data) => {
      cb(null, data);
   });
   SOCKET.emit("subscribeToBuildExperiment", userInfo);
}

export function runExperiment(experimentInfo, serverCb, clientCb, networkCb) {
   const socket = openSocket(DOMAIN + "runExperiment");
   socket.emit("experimentInfo", experimentInfo);

   socket.on("getServerOfExperimentInfo", (err, data) => serverCb(err, data));
   socket.on("getClientOfExperimentInfo", (err, data) => clientCb(err, data));
   socket.on("getNetworkOfExperimentInfo", (err, data) => networkCb(err, data));
}

// export function subscribeServerOfExperiment(userInfo, cb) {
//    const SOCKET = openSocket(DOMAIN + "runServer");
//    SOCKET.on("getServerOfExperimentInfo", (data) => cb(null, data));
//    SOCKET.emit("subscribeServerOfExperiment", userInfo);
// }

// export function subscribeClientOfExperiment(userInfo, cb) {
//    const SOCKET = openSocket(DOMAIN + "runClient");
//    SOCKET.on("getClientOfExperimentInfo", (data) => cb(null, data));
//    SOCKET.emit("subscribeClientOfExperiment", userInfo);
// }

// export function subscribeNetworkOfExperiment(userInfo, cb) {
//    const SOCKET = openSocket(DOMAIN + "runNetwork");
//    SOCKET.on("getNetworkOfExperimentInfo", (data) => cb(null, data));
//    SOCKET.emit("subscribeNetworkOfExperiment", userInfo);
// }

export function downloadExperimentResult(username, experimentId) {
   return API.get("/experiment/downloadExperimentResult", {
      params: {
         username,
         experimentId,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         return error.response;
      }
   );
}

// export function deleteUserMachine(user, machineID) {
//    return API.delete("/experiment/userMachine", {
//       params: {
//          user,
//          machineID,
//       },
//    }).then(
//       (response) => {
//          return response.data;
//       },
//       (error) => {
//          throw error.response;
//       }
//    );
// }
