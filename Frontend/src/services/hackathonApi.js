import axios from 'axios';

const API_URL = "http://localhost:8080/api/hackathons";

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
        console.error("Error deleting hackathon:", error);
        return { success: false, error };
    }
};
