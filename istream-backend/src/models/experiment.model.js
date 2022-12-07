const experimentDataModel = {
   Video: {
      id: "",
      machineID: "",
   },
   Server: {
      type: "",
      name: "",
      customConfig: "",
      configName: "",
      machineID: "",
   },
   Transcoder: {
      type: "",
      name: "",
      customConfig: "",
      configName: "",
      machineID: "",
   },
   Network: {
      type: "",
      name: "",
      customConfig: "",
      configName: "",
      machineID: "",
   },
   Client: {
      type: "",
      name: "",
      customConfig: "",
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
