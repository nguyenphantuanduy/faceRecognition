import axios from "axios";

const AI_SERVER = "http://localhost:8000";

export const loginAPI = async (username) => {
  const res = await axios.get(`${AI_SERVER}/cameras`, {
    params: { account: username },
  });

  return res.data.servers;
};

export const getCamerasAPI = async (url) => {
  const res = await axios.get(`${url}/cameras`);

  return res.data.cameras;
};

export const detectFacesAPI = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await axios.post(`${AI_SERVER}/register/detect`, formData);

  return res.data.faces;
};

export const saveFacesAPI = async (payload) => {
  const res = await axios.post(`${AI_SERVER}/register/save`, {
    faces: payload,
  });

  return res.data;
};
