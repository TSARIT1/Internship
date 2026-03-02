import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
const API_BASE = `${API_BASE_URL}/anticheat`;

/**
 * Log a tab switch event to the backend.
 * Called automatically by useAntiCheat when tabSwitchCount changes.
 */
export const logTabSwitch = async (userId, hackathonId, tabSwitchCount) => {
    try {
        const res = await axios.post(`${API_BASE}/log`, {
            userId,
            hackathonId,
            tabSwitchCount
        });
        return res.data;
    } catch (err) {
        console.error('Failed to log tab switch:', err);
    }
};

/**
 * Admin: get all violations for a hackathon, sorted by worst offenders.
 */
export const getHackathonViolations = async (hackathonId) => {
    const res = await axios.get(`${API_BASE}/hackathon/${hackathonId}`);
    return res.data;
};

/**
 * Get a specific student's violation count for a hackathon.
 */
export const getStudentViolation = async (userId, hackathonId) => {
    const res = await axios.get(`${API_BASE}/student/${userId}/hackathon/${hackathonId}`);
    return res.data;
};
