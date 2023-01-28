const experimentDataModel = {
   Video: {
      id: "",
   },
   Server: {
      type: "",
      name: "",
      advanceConfig: "",
      configName: "",
      machineID: "",
   },
   Network: {
      type: "",
      name: "",
      advanceConfig: "",
      configName: "",
      machineID: "",
   },
   Client: {
      type: "",
      name: "",
      advanceConfig: "",
      configName: "",
      machineID: "",
   },
};

const experimentConfigJSONData = {
   componentExistence: {
      video: true,
      server: true,
      transcoder: false,
      network: false,
      client: true,
   },
   repetition: 1,
   runningInXterm: false,
};

exports.experimentDataModel = experimentDataModel;
exports.experimentConfigJSONData = experimentConfigJSONData;
