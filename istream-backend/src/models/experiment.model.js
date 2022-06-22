const experimentJSONData = {
   Video: {
      id: "",
      machineID: "",
   },
   Server: {
      name: "",
      config: "",
      type: "",
      machineID: "",
   },
   Transcoder: {
      name: "",
      config: "",
      type: "",
      machineID: "",
   },
   Network: {
      name: "",
      config: "",
      type: "",
      manualConfig: "",
      machineID: "",
   },
   Client: {
      name: "",
      config: "",
      type: "",
      machineID: "",
   },
};

const networkConfigJSONData = {
   port: 9090,
   delay: 0,
   packetLoss: 0,
   corruptPacket: 0,
   bandwidth: 0,
};

const serverConfigJSONData = {
   port: 8080,
};

const experimentConfigJSONData = {
   repetition: 1,
   serverCPU: 1,
   serverMemoryLimit: 0,
   clientCPU: 1,
   clientMemoryLimit: 0,
};

exports.experimentJSONData = experimentJSONData;
exports.networkConfigJSONData = networkConfigJSONData;
exports.serverConfigJSONData = serverConfigJSONData;
exports.experimentConfigJSONData = experimentConfigJSONData;
