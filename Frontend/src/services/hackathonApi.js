import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8080/api' : '/api');
const API_URL = `${API_BASE}/hackathons`;

export const getHackathons = async () => {
    try {
        const response = await axios.get(API_URL);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching hackathons:", error);
        return { success: false, error };
    }
};

export const addHackathon = async (hackathonData) => {
    try {
        const response = await axios.post(API_URL, hackathonData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error adding hackathon:", error);
        return { success: false, error };
    }
};

export const updateHackathon = async (id, hackathonData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, hackathonData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating hackathon:", error);
        return { success: false, error };
    }
};

export const deleteHackathon = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getSubmissions = async (hackathonId) => {
    try {
        const response = await axios.get(`${API_URL.replace('/hackathons', '')}/submissions/hackathon/${hackathonId}/all`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const gradeSubmission = async (id, score, feedback) => {
    try {
        const response = await axios.put(`${API_URL.replace('/hackathons', '')}/submissions/${id}/grade`, { score, feedback });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const registerForHackathon = async (hackathonId, userId) => {
    try {
        const response = await axios.post(`${API_URL}/${hackathonId}/register`, { userId }); // Corrected to body
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getMyHackathonRegistrations = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/my-registrations/${userId}`); // Corrected path
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const submitProject = async (submissionData) => {
    try {
        // Backend: @PostMapping("/submit") in SubmissionController (mapped to /api/submissions)
        // Check SubmissionController.java to confirm if it is /api/submissions/submit or /api/submissions
        const response = await axios.post(`${API_URL.replace('/hackathons', '')}/submissions/submit`, submissionData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getMySubmission = async (hackathonId, userId) => {
    try {
        const response = await axios.get(`${API_URL.replace('/hackathons', '')}/submissions/hackathon/${hackathonId}/my-submission/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const markAsWinner = async (submissionId) => {
    try {
        const response = await axios.put(`${API_URL.replace('/hackathons', '')}/submissions/${submissionId}/mark-winner`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
