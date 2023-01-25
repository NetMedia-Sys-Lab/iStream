import { API } from "./API";

export const getUserVideosList = (user) => {
   return API.get("/video/getUserVideosList", {
      params: {
         user,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getDefaultVideosList = () => {
   return API.get("/video/getDefaultVideosList").then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const saveVideoModuleData = (data) => {
   return API.post("/video/saveVideoModuleData", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getVideoModuleData = (user, componentName, experimentId) => {
   return API.get("/video/getVideoModuleData", {
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
         throw error.response;
      }
   );
};

export const AddNewVideo = (request) => {
   return API.post("/video/addNewVideo", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const AddNewVideoDataset = (request) => {
   return API.post("/video/addNewVideoDataset", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const deleteUserVideo = (user, videoID) => {
   return API.delete("/video/userVideo", {
      params: {
         user,
         videoID,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};