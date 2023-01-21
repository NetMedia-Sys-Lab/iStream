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
   Transcoder: {
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
   transcoderComponentExistence: false,
   networkComponentExistence: false,
   repetition: 1,
   runningInXterm: false,
};

exports.experimentDataModel = experimentDataModel;
exports.experimentConfigJSONData = experimentConfigJSONData;
