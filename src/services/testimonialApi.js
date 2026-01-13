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
