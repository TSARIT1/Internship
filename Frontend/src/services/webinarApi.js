import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
const API_URL = `${API_BASE}/webinars`;

// ---- WEBINAR CRUD ----

export const getWebinars = async (userId = null) => {
    const params = userId ? { userId } : {};
    return axios.get(API_URL, { params });
};

export const getWebinarsAdmin = async () => {
    return axios.get(`${API_URL}/admin`);
};

export const addWebinar = async (webinarData) => {
    return axios.post(API_URL, webinarData);
};

export const deleteWebinar = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

export const updateWebinar = async (id, updatedData) => {
    return axios.put(`${API_URL}/${id}`, updatedData);
};

// ---- REGISTRATION ----

export const registerForWebinar = async (webinarId, userId) => {
    return axios.post(`${API_URL}/${webinarId}/register`, { userId });
};

export const checkWebinarRegistration = async (webinarId, userId) => {
    return axios.get(`${API_URL}/${webinarId}/check-registration`, { params: { userId } });
};

export const getMyWebinarRegistrations = async (userId) => {
    return axios.get(`${API_URL}/my-registrations/${userId}`);
};

export const getWebinarRegistrations = async (webinarId) => {
    return axios.get(`${API_URL}/${webinarId}/registrations`);
};

// ---- GUEST REGISTRATION (no login required) ----

export const guestRegisterForWebinar = async (webinarId, name, email) => {
    return axios.post(`${API_URL}/${webinarId}/guest-register`, { name, email });
};

export const checkGuestRegistration = async (webinarId, email) => {
    return axios.get(`${API_URL}/${webinarId}/check-guest-registration`, { params: { email } });
};
