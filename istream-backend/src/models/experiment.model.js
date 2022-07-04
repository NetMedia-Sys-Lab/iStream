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

const experimentConfigJSONData = {
   repetition: 1,
   serverCPU: 1,
   serverMemoryLimit: 0,
   clientCPU: 1,
   clientMemoryLimit: 0,
};

exports.experimentJSONData = experimentJSONData;
exports.experimentConfigJSONData = experimentConfigJSONData;
