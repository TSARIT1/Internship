import axios from 'axios';

const API_URL = "http://localhost:8080/api/testimonials";

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
        const payload = { ...testimonial, type: 'TEXT' };
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

// --- VIDEO TESTIMONIALS (STILL MOCK - FOR NOW) ---
// If you want to move video testimonials to backend soon, we can replicate the pattern above.
// For now, keeping as local storage mock to avoid breaking that page until backend ready.

const INITIAL_VIDEO_DATA = [
    {
        id: 1,
        name: "Sarah Jenkins",
        course: "Full Stack Web Development",
        message: "The practical projects gave me the confidence to apply for senior roles. Absolutely game-changing!",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
        thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
        rating: 5
    },
    {
        id: 2,
        name: "Michael Chen",
        course: "Data Science Mastery",
        message: "I never thought I could master Python this quickly. The mentorship was top-notch.",
        videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ", 
        thumbnail: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600",
        rating: 5
    },
    {
        id: 3,
        name: "Emma Davis",
        course: "UI/UX Design Specialist",
        message: "From wireframes to prototypes, this course covered everything I needed to know.",
        videoUrl: "https://www.youtube.com/embed/pQN-pnXPaVg",
        thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
        rating: 4
    }
];

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
        const payload = { ...testimonial, type: 'VIDEO' };
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
