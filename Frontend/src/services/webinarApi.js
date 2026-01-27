import axios from 'axios';

// Toggle this to false when backend is ready
const MOCK_MODE = true;

const API_URL = 'http://localhost:5000/api/webinars'; // Replace with actual backend URL

// Initial Mock Data (Fallback)
const INITIAL_DATA = [
    {
        id: 1,
        title: "Mastering React & Tailwind CSS",
        speaker: "Nikhil Nawale",
        date: "2024-03-25",
        time: "10:00 AM",
        description: "Learn how to build modern, responsive web applications using React and Tailwind CSS. We will cover components, hooks, and advanced styling techniques.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
        meetingLink: "https://meet.google.com/abc-defg-hij"
    },
    {
        id: 2,
        title: "AI & Machine Learning Roadmap",
        speaker: "Dr. Sarah Johnson",
        date: "2024-03-28",
        time: "02:00 PM",
        description: "A comprehensive guide to starting your career in AI. Concepts covered: Python, Neural Networks, and deployment.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        meetingLink: "https://meet.google.com/xyz-uvwx-yz"
    },
    {
        id: 3,
        title: "DevOps: From Zero to Hero",
        speaker: "Mark Anderson",
        date: "2024-04-05",
        time: "11:00 AM",
        description: "Understand the CI/CD pipeline, Docker, Kubernetes, and how to automate deployment workflows.",
        image: "https://images.unsplash.com/photo-1667372393119-c81c0cda1a29?q=80&w=2070&auto=format&fit=crop",
        meetingLink: "https://meet.google.com/docker-kube-dev"
    }
];

// Helper to get data from local storage
const getLocalData = () => {
    const data = localStorage.getItem('webinars');
    if (data) return JSON.parse(data);
    localStorage.setItem('webinars', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
};

// Helper to set data to local storage
const setLocalData = (data) => {
    localStorage.setItem('webinars', JSON.stringify(data));
};

export const getWebinars = async () => {
    if (MOCK_MODE) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ data: getLocalData() }), 500);
        });
    }
    return axios.get(API_URL);
};

export const addWebinar = async (webinarData) => {
    if (MOCK_MODE) {
        return new Promise((resolve) => {
            const currentData = getLocalData();
            const newWebinar = { ...webinarData, id: Date.now() };
            const updatedData = [...currentData, newWebinar];
            setLocalData(updatedData);
            setTimeout(() => resolve({ data: newWebinar }), 500);
        });
    }
    return axios.post(API_URL, webinarData);
};

export const deleteWebinar = async (id) => {
    if (MOCK_MODE) {
        return new Promise((resolve) => {
            const currentData = getLocalData();
            const updatedData = currentData.filter(w => w.id !== id);
            setLocalData(updatedData);
            setTimeout(() => resolve({ data: { success: true } }), 500);
        });
    }
    return axios.delete(`${API_URL}/${id}`);
};

export const updateWebinar = async (id, updatedData) => {
    if (MOCK_MODE) {
        return new Promise((resolve) => {
            const currentData = getLocalData();
            const updatedList = currentData.map(w => w.id === id ? { ...w, ...updatedData } : w);
            setLocalData(updatedList);
            setTimeout(() => resolve({ data: { ...updatedData, id } }), 500);
        });
    }
    return axios.put(`${API_URL}/${id}`, updatedData);
};

export const registerForWebinar = async (id, studentData) => {
    if (MOCK_MODE) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ data: { success: true, message: "Registration Successful!" } }), 800);
        });
    }
    return axios.post(`${API_URL}/${id}/register`, studentData);
};
