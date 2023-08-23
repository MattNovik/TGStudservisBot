import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://api.unsplash.com/',
  headers: {
    Authorization: 'Client-ID VZHtT-GKih4teLpGjyx_O_KK4nrlhN3iVKAG_a0GTGc'
  },
});

export {apiClient};