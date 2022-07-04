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

const headlessPlayerJSONData = {
   adaptationAlgorithm: "Bandwidth-based ABR",
   mpdFileName: "output.mpd",
   connectingPort: 8080,
};

exports.networkConfigJSONData = networkConfigJSONData;
exports.serverConfigJSONData = serverConfigJSONData;
exports.headlessPlayerJSONData = headlessPlayerJSONData;
