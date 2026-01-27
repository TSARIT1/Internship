const INITIAL_DATA = [
    { id: 1, name: "Alice Johnson", course: "Data Science", message: "Amazing course! Highly recommended.", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 2, name: "Bob Smith", course: "Web Development", message: "Learned so much in just 4 weeks.", image: "https://randomuser.me/api/portraits/men/32.jpg" },
];

const getLocalData = () => {
    const data = localStorage.getItem('testimonials');
    if (data) return JSON.parse(data);
    localStorage.setItem('testimonials', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
};

const setLocalData = (data) => {
    localStorage.setItem('testimonials', JSON.stringify(data));
};

export const getTestimonials = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: getLocalData() }), 500);
    });
};

export const addTestimonial = async (testimonial) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const currentData = getLocalData();
            const newTestimonial = { ...testimonial, id: Date.now() };
            const updatedData = [...currentData, newTestimonial];
            setLocalData(updatedData);
            resolve({ data: newTestimonial });
        }, 500);
    });
};

export const deleteTestimonial = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const currentData = getLocalData();
            const updatedData = currentData.filter(t => t.id !== id);
            setLocalData(updatedData);
            resolve({ data: { success: true } });
        }, 500);
    });
};

const INITIAL_VIDEO_DATA = [
    {
        id: 1,
        name: "Sarah Jenkins",
        course: "Full Stack Web Development",
        message: "The practical projects gave me the confidence to apply for senior roles. Absolutely game-changing!",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder (Rick Roll for testing, but works) -> Better real tech talks? Let's use generic tech ones.
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
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = localStorage.getItem('videoTestimonials');
            if (data) {
                resolve({ data: JSON.parse(data) });
            } else {
                localStorage.setItem('videoTestimonials', JSON.stringify(INITIAL_VIDEO_DATA));
                resolve({ data: INITIAL_VIDEO_DATA });
            }
        }, 500);
    });
};

export const addVideoTestimonial = async (testimonial) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const currentData = JSON.parse(localStorage.getItem('videoTestimonials') || JSON.stringify(INITIAL_VIDEO_DATA));
            const newTestimonial = { ...testimonial, id: Date.now(), rating: 5 }; // Default rating 5 for now
            const updatedData = [...currentData, newTestimonial];
            localStorage.setItem('videoTestimonials', JSON.stringify(updatedData));
            resolve({ data: newTestimonial });
        }, 500);
    });
};

export const deleteVideoTestimonial = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const currentData = JSON.parse(localStorage.getItem('videoTestimonials') || JSON.stringify(INITIAL_VIDEO_DATA));
            const updatedData = currentData.filter(t => t.id !== id);
            localStorage.setItem('videoTestimonials', JSON.stringify(updatedData));
            resolve({ data: { success: true } });
        }, 500);
    });
};
