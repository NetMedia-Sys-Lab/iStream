const experimentJSONData = {
   Input: {
      name: "",
   },
   Transcoder: {
      name: "",
      config: "",
      type: "",
   },
   Network: {
      name: "",
      config: "",
      type: "",
      manualConfig: "",
   },
   Server: {
      name: "",
      config: "",
      type: "",
   },
   Client: {
      name: "",
      config: "",
      type: "",
   },
   Status: {
      type: "",
      time: "",
   },
   Script: {
      name: "",
      type: "",
   },
   Machine: {
      name: "",
   },
};

const networkConfigJSONData = {
   delay: 0,
   packetLoss: 0,
   corruptPacket: 0,
   bandwidth: 0,
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
exports.experimentConfigJSONData = experimentConfigJSONData;