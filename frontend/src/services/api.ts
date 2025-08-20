import axios from 'axios';

const API_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (data: any) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const signupUser = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const fetchRoadmaps = async () => {
  const response = await api.get('/roadmaps');
  return response.data.roadmaps;
};

export const fetchRoadmap = async (id: string) => {
  const response = await api.get(`/roadmaps/${id}`);
  return response.data.roadmap;
};

export const createRoadmap = async (data: any) => {
  const response = await api.post('/roadmaps', data);
  return response.data.roadmap;
};

export const updateRoadmap = async (id: string, data: any) => {
  const response = await api.put(`/roadmaps/${id}`, data);
  return response.data;
};

export const deleteRoadmap = async (id: string) => {
  const response = await api.delete(`/roadmaps/${id}`);
  return response.data;
};

export const fetchMilestones = async (roadmapId: string) => {
  const response = await api.get(`/milestones?roadmapId=${roadmapId}`);
  return response.data;
};

export const fetchMilestone = async (id: string) => {
  const response = await api.get(`/milestones/${id}`);
  return response.data;
};

export const createMilestone = async (data: any) => {
  const response = await api.post('/milestones', data);
  return response.data;
};

export const updateMilestone = async (id: string, data: any) => {
  const response = await api.put(`/milestones/${id}`, data);
  return response.data;
};

export const deleteMilestone = async (id: string) => {
  const response = await api.delete(`/milestones/${id}`);
  return response.data;
};

export const fetchTasks = async (milestoneId: string) => {
  const response = await api.get(`/tasks?milestoneId=${milestoneId}`);
  return response.data.tasks;
};

export const createTask = async (data: any) => {
  const response = await api.post('/tasks', data);
  return response.data.task;
};

export const updateTask = async (id: string, data: any) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const fetchResources = async () => {
  const response = await api.get('/resources');
  return response.data.resources;
};

export const createResource = async (data: any) => {
  const response = await api.post('/resources', data);
  return response.data.resource;
};

export const updateResource = async (id: string, data: any) => {
  const response = await api.put(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id: string) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};

export const fetchProgress = async () => {
  const response = await api.get('/progress');
  return response.data;
};

export const updateProgress = async (data: any) => {
  const response = await api.put('/progress', data);
  return response.data;
};

export const fetchSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (data: any) => {
  const response = await api.put('/settings', data);
  return response.data;
};