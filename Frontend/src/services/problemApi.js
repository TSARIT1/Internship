import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8080/api' : '/api');
const API_URL = API_BASE;

const getAuthHeaders = () => {
    const adminToken = sessionStorage.getItem('adminToken');
    const studentToken = sessionStorage.getItem('token');
    const token = adminToken || studentToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProblems = async (hackathonId = null) => {
    try {
        const url = hackathonId ? `${API_URL}/problems?hackathonId=${hackathonId}` : `${API_URL}/problems`;
        const response = await axios.get(url, { headers: getAuthHeaders() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

export const getProblem = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/problems/${id}`, { headers: getAuthHeaders() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

export const createProblem = async (problemData) => {
    try {
        const response = await axios.post(`${API_URL}/problems`, problemData, { headers: getAuthHeaders() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

export const updateProblem = async (id, problemData) => {
    try {
        const response = await axios.put(`${API_URL}/problems/${id}`, problemData, { headers: getAuthHeaders() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

export const deleteProblem = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/problems/${id}`, { headers: getAuthHeaders() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

// Test Case Management
export const addTestCase = async (problemId, testCaseData) => {
    try {
        const response = await axios.post(`${API_URL}/problems/${problemId}/test-cases`, testCaseData, { headers: getAuthHeaders() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

export const deleteTestCase = async (problemId, testCaseId) => {
    try {
        const response = await axios.delete(`${API_URL}/problems/${problemId}/test-cases/${testCaseId}`, { headers: getAuthHeaders() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

// Code Execution
export const runCode = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/submissions/run`, payload, { headers: getAuthHeaders() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

export const submitCode = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/submissions/submit-code`, payload, { headers: getAuthHeaders() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};
