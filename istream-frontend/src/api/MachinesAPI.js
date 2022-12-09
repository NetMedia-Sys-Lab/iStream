import { API } from "./API";

export function addNewMachine(data) {
   return API.post("/machines/addNewMachine", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export function getUserMachineList(user) {
   return API.get("/machines/getUserMachineList", {
      params: {
         user,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         return error.response;
      }
   );
}

export function saveComponentMachineInfo(data) {
   return API.post("/machines/saveComponentMachineInfo", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export function getComponentSelectedMachine(user, componentName, experimentId) {
   return API.get("/machines/getComponentSelectedMachine", {
      params: {
         user,
         componentName,
         experimentId,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         return error.response;
      }
   );
}
