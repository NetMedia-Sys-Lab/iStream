const moduleDataModel = {
   type: "",
   name: "",
   id:"",
   advanceConfiguration: "",
   machineID: "",
   advanceConfig: {
      names: [],
      selected: "",
   },
   simpleConfig: {
      parameters: {},
      values: {},
      uiSchema: {},
   },
};

const userModulesInfoModel = {
   Server: [],
   Network: [],
   Client: [],
};

const moduleInfoModel = {
   id: "",
   name: "",
   description: "",
};

exports.moduleDataModel = moduleDataModel;
exports.userModulesInfoModel = userModulesInfoModel;
exports.moduleInfoModel = moduleInfoModel;
