const experimentDataModel = {
   Video: {
      id: "",
      machineID: "",
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
};

exports.experimentDataModel = experimentDataModel;
exports.experimentConfigJSONData = experimentConfigJSONData;
