import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
const API_URL = `${API_BASE}/testimonials`;

// --- TEXT TESTIMONIALS (REAL BACKEND) ---

export const getTestimonials = async () => {
    try {
        const response = await axios.get(`${API_URL}?type=TEXT`);
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return { data: [] };
    }
};

export const addTestimonial = async (testimonial) => {
    try {
        const payload = { ...testimonial };
        const response = await axios.post(API_URL, payload);
        return { data: response.data };
    } catch (error) {
        console.error("Error adding testimonial:", error);
        throw error;
    }
};

export const deleteTestimonial = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return { data: { success: true } };
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        throw error;
    }
};

// --- VIDEO TESTIMONIALS ---

export const getVideoTestimonials = async () => {
    try {
        const response = await axios.get(`${API_URL}?type=VIDEO`);
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching video testimonials:", error);
        return { data: [] };
    }
};

export const addVideoTestimonial = async (testimonial) => {
    try {
        const payload = { ...testimonial };
        const response = await axios.post(API_URL, payload);
        return { data: response.data };
    } catch (error) {
        console.error("Error adding video testimonial:", error);
        throw error;
    }
};

export const deleteVideoTestimonial = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return { data: { success: true } };
    } catch (error) {
        console.error("Error deleting video testimonial:", error);
        throw error;
    }
};
