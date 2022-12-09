const modulesDockerConfigModel = {
   Server: {
      port: 6060,
      cpus: 0,
      memory: 0,
   },
   Network: {
      port: 8080,
      cpus: 0,
      memory: 0,
   },
   Client: {
      port: 9090,
      cpus: 0,
      memory: 0,
   },
};

const dockerConfigForm = {
   type: "object",
   title: "Docker Config",
   properties: {
      port: {
         title: "Port",
         type: "number",
         default: 0,
      },
      cpus: {
         title: "CPU Limit",
         type: "number",
         default: 0,
         description: "The zero value means there is no limitation on CPU",
      },
      memory: {
         title: "Memory Limit (GB)",
         type: "number",
         default: 0,
         description: "The zero value means there is no limitation on memory",
      },
   },
};

exports.modulesDockerConfigModel = modulesDockerConfigModel;
exports.dockerConfigForm = dockerConfigForm;
