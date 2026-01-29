
// Mock data for registered students
const INITIAL_STUDENTS = [
    { id: 1, name: "John Doe", email: "john@example.com", password: "password123", webinar: "Data Science", date: "2024-03-15", totalFee: 5000, discount: 0 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", password: "password123", webinar: "AI & ML Workshop", date: "2024-03-14", totalFee: 8000, discount: 1000 },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", password: "password123", webinar: "React Masterclass", date: "2024-03-12", totalFee: 5000, discount: 0 },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", password: "password123", webinar: "Data Science Bootcamp", date: "2024-03-10", totalFee: 12000, discount: 2000, certificateIssued: true, certificateDate: "2024-05-10" },
    { id: 5, name: "David Brown", email: "david@example.com", password: "password123", webinar: "AI & ML Workshop", date: "2024-03-09", totalFee: 8000, discount: 0 },
    { id: 6, name: "Emily Davis", email: "emily@example.com", password: "password123", webinar: "Cyber Security Basics", date: "2024-03-08", totalFee: 6000, discount: 500 },
    { id: 7, name: "Chris Wilson", email: "chris@example.com", password: "password123", webinar: "AWS Cloud Fundamentals", date: "2024-03-07", totalFee: 7000, discount: 0 },
];

const getLocalStudents = () => {
    const data = localStorage.getItem('students');
    if (data) return JSON.parse(data);
    localStorage.setItem('students', JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
};

const setLocalStudents = (data) => {
    localStorage.setItem('students', JSON.stringify(data));
};

// getStudents removed from here, defined later

// Enriched Course Data
// Enriched Course Data
const INITIAL_INTERNSHIP_COURSES = {
    "Data Science": { 
        totalFee: 1, 
        discount: 0,
        domain: "Data & AI",
        level: "Intermediate",
        duration: "8 Weeks",
        description: "Master data analysis, visualization, and Python libraries like Pandas and NumPy."
    },
    "Machine Learning": { 
        totalFee: 1, 
        discount: 0,
        domain: "Data & AI",
        level: "Advanced",
        duration: "10 Weeks",
        description: "Build predictive models and neural networks using Scikit-learn and TensorFlow."
    },
    "AI": { 
        totalFee: 10, 
        discount: 0,
        domain: "Data & AI",
        level: "Advanced",
        duration: "12 Weeks",
        description: "Explore deep learning, NLP, and computer vision in this comprehensive AI program."
    },
    "MERN Stack": { 
        totalFee: 1, 
        discount: 0,
        domain: "Web Development",
        level: "Intermediate",
        duration: "8 Weeks",
        description: "Build full-stack web applications using MongoDB, Express, React, and Node.js."
    },
    "DevOps": { 
        totalFee: 1, 
        discount: 0,
        domain: "Cloud & Ops",
        level: "Intermediate",
        duration: "8 Weeks",
        description: "Learn CI/CD, Docker, Kubernetes, and cloud infrastructure automation."
    },
    "Java Full Stack": { 
        totalFee: 1, 
        discount: 0,
        domain: "Web Development",
        level: "Beginner",
        duration: "10 Weeks",
        description: "Master Java, Spring Boot, and frontend technologies for enterprise development."
    },
    "Python Programming": { 
        totalFee: 1, 
        discount: 0,
        domain: "Programming",
        level: "Beginner",
        duration: "6 Weeks",
        description: "A solid foundation in Python programming, covering syntax, data structures, and algorithms."
    },
    "AWS Cloud Computing": { 
        totalFee: 1, 
        discount: 0,
        domain: "Cloud & Ops",
        level: "Intermediate",
        duration: "8 Weeks",
        description: "Become an AWS expert. Learn EC2, S3, Lambda, and cloud architecture best practices."
    },
    "Cyber Security": { 
        totalFee: 1, 
        discount: 0,
        domain: "Security",
        level: "Advanced",
        duration: "8 Weeks",
        description: "Learn network security, ethical hacking, and how to protect systems from cyber threats."
    }
};

const getLocalPricingData = () => {
    const data = localStorage.getItem('pricing');
    if (data) return JSON.parse(data);
    localStorage.setItem('pricing', JSON.stringify(INITIAL_INTERNSHIP_COURSES));
    return INITIAL_INTERNSHIP_COURSES;
};

const setLocalPricingData = (data) => {
    localStorage.setItem('pricing', JSON.stringify(data));
};

export const getPricing = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const pricingData = getLocalPricingData();
            resolve({ 
                data: Object.entries(pricingData).map(([course, details]) => ({
                    course,
                    ...details
                }))
            });
        }, 500);
    });
};

export const updatePricing = async (courseName, newFee, newDiscount) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const pricingData = getLocalPricingData();
            if (pricingData[courseName]) {
                pricingData[courseName] = { 
                    ...pricingData[courseName],
                    totalFee: Number(newFee), 
                    discount: Number(newDiscount) 
                };
                setLocalPricingData(pricingData);
                resolve({ success: true, data: pricingData[courseName] });
            } else {
                resolve({ success: false, message: "Course not found" });
            }
        }, 500);
    });
};

export const updateStudentFee = async (id, fee, discount) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const students = getLocalStudents();
            const studentIndex = students.findIndex(s => s.id === id);
            if (studentIndex !== -1) {
                students[studentIndex] = { 
                    ...students[studentIndex], 
                    totalFee: Number(fee), 
                    discount: Number(discount) 
                };
                setLocalStudents(students);
                resolve({ success: true, data: students[studentIndex] });
            } else {
                resolve({ success: false, message: "Student not found" });
            }
        }, 500);
    });
};

export const updateStudentCertificate = async (id, status) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const students = getLocalStudents();
            const studentIndex = students.findIndex(s => s.id === id);
            if (studentIndex !== -1) {
                const today = new Date().toISOString().split('T')[0];
                students[studentIndex] = { 
                    ...students[studentIndex], 
                    certificateIssued: status,
                    certificateDate: status ? today : null
                };
                setLocalStudents(students);
                // Also update the current logged in student in session if it matches
                const currentStudent = JSON.parse(localStorage.getItem('student') || '{}');
                if (currentStudent.id === id) {
                     localStorage.setItem('student', JSON.stringify(students[studentIndex]));
                }
                resolve({ success: true, data: students[studentIndex] });
            } else {
                resolve({ success: false, message: "Student not found" });
            }
        }, 500);
    });
};

export const enrollStudent = async (studentData) => {
    // For now, enrolling acts as registering a new user in the backend.
    // NOTE: The backend 'User' entity only stores username, email, password.
    // It does NOT yet store the 'course' or 'fee' info.
    // We will call the register API to at least create the account.
    
    return registerStudent(studentData);
};

export const applyForInternship = async (studentId, courseName) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const students = getLocalStudents();
            const studentIndex = students.findIndex(s => s.id === studentId);
            
            if (studentIndex !== -1) {
                const pricingData = getLocalPricingData();
                const feeInfo = pricingData[courseName] || { totalFee: 5000, discount: 0 };
                
                // Update student record
                // We update both 'webinar' (legacy) and a new 'course' field to be sure
                students[studentIndex] = {
                    ...students[studentIndex],
                    course: courseName,
                    webinar: courseName, // Keep compatible for now
                    totalFee: feeInfo.totalFee,
                    discount: feeInfo.discount
                };
                
                setLocalStudents(students);
                resolve({ success: true, data: students[studentIndex] });
            } else {
                resolve({ success: false, message: "Student not found" });
            }
        }, 800);
    });
};

import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth";

// Keep existing helper for other mock features like pricing/courses for now unless requested
// But REPLACE the login/register functions to use the backend

export const loginStudent = async (email, password) => {
    try {
        // Send login request to backend
        // Note: Backend currently expects username, but frontend uses email. 
        // We might need to adjust backend to accept email or frontend to send username.
        // For this specific interaction, assuming backend can handle login by username, 
        // we'll temporarily map email to username field if that's how your User entity works
        // OR we should have updated the backend to login by email.
        
        // Let's assume for now we send the email as the "username" field since that's a common pattern,
        // or valid JSON structure matching User entity.
        
        // Backend AuthController expects: { username, password }
        // Frontend uses email.
        // ADAPTATION: We will send email as the username for now to match backend expectations
        // OR better: Update backend to support email login later.
        
        const response = await axios.post(`${API_URL}/login`, { 
            username: email, // Temporary mapping: treating email as username
            password 
        });
        
        if (response.status === 200) {
            // Mocking the returned user object since backend currently just returns text "Login successful"
            // We need to store session state. 
            // Ideally backend should return the User object.
            const mockUserForSession = { email, password }; 
            return { success: true, data: mockUserForSession };
        }
    } catch (error) {
        return { success: false, message: error.response?.data || "Login failed" };
    }
};

export const registerStudent = async (studentData) => {
    try {
        // studentData contains { name, email, password, ... }
        // Backend User entity has { username, password, email }
        
        const response = await axios.post(`${API_URL}/register`, {
            username: studentData.name || studentData.email, // Map name or email to username
            email: studentData.email,
            password: studentData.password,
            phone: studentData.phone,
            course: studentData.course || studentData.webinar // Handle both potential field names
        });
        
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: error.response?.data || "Registration failed" };
    }
};

// ... keep other mock functions for now (getStudents, etc) if they are used for admin panels
// that we haven't built backend for yet.

export const getStudents = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        // Backend returns list of Users.
        // AdminStudents expects { data: [...] }
        
        // Map backend fields to frontend expected fields if necessary
        // Backend: username, email, phone, course (no totalFee, discount yet)
        // Frontend expects: name, email, webinar(course), totalFee, discount
        
        const mappedData = response.data.map(user => ({
            id: user.id,
            name: user.username, // mapping username to name
            email: user.email,
            password: user.password,
            webinar: user.course || "Not Selected", // mapping course to webinar
            date: "2024-03-15", // Mock date for now as backend doesn't store created_at yet
            totalFee: 0, // Default as backend doesn't have it
            discount: 0  // Default as backend doesn't have it
        }));

        return { data: mappedData };
    } catch (error) {
        console.error("Failed to fetch students", error);
        return { data: [] };
    }
};


// Mock Course Content - Initial Data
const INITIAL_COURSE_CONTENT = {
    "Data Science": {
        liveLink: "",
        sections: [
            {
                id: 1,
                title: "Introduction to Data Science",
                videos: [
                    { id: "v1", title: "What is Data Science?", url: "https://www.youtube.com/embed/ua-CiDNNj30", duration: "10:30", type: "youtube" },
                    { id: "v2", title: "Python Setup", url: "https://www.youtube.com/embed/t8pPdKYpowI", duration: "15:20", type: "youtube" }
                ]
            },
            {
                id: 2,
                title: "Python for Data Analysis",
                videos: [
                    { id: "v3", title: "NumPy Basics", url: "https://www.youtube.com/embed/QUT1VHiLmmI", duration: "20:15", type: "youtube" },
                    { id: "v4", title: "Pandas DataFrame", url: "https://www.youtube.com/embed/vmEHCJofslg", duration: "18:45", type: "youtube" }
                ]
            }
        ]
    },
    "Java Full Stack": {
        liveLink: "",
        sections: [
            {
                id: 1,
                title: "Java Core",
                videos: [
                    { id: "j1", title: "Java Basics", url: "https://www.youtube.com/embed/grEKMHGYyns", duration: "12:00", type: "youtube" },
                    { id: "j2", title: "OOPs Concepts", url: "https://www.youtube.com/embed/pTB0EiLXUC8", duration: "25:00", type: "youtube" }
                ]
            }
        ]
    },
    // Default fallback
    "default": {
        liveLink: "",
        sections: [
            {
                id: 1,
                title: "Course Overview",
                videos: [
                    { id: "d1", title: "Welcome to the Course", url: "https://www.youtube.com/embed/9bZkp7q19f0", duration: "05:00", type: "youtube" }
                ]
            }
        ]
    }
};

const getLocalCourseContent = () => {
    const data = localStorage.getItem('courseContent');
    if (data) return JSON.parse(data);
    localStorage.setItem('courseContent', JSON.stringify(INITIAL_COURSE_CONTENT));
    return INITIAL_COURSE_CONTENT;
};

const setLocalCourseContent = (data) => {
    localStorage.setItem('courseContent', JSON.stringify(data));
};

export const getCourseContent = async (courseName) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const contentStore = getLocalCourseContent();
            // Fallback to default if course not found, but try to preserve the courseName structure if we want to prompt admin to create it?
            // For now, if not found, return default structure but maybe empty? 
            // Better to return default content so it's not empty.
            const content = contentStore[courseName] || contentStore["default"];
            resolve({ success: true, data: content });
        }, 500);
    });
};

export const updateLiveClassLink = async (courseName, link) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const contentStore = getLocalCourseContent();
            if (!contentStore[courseName]) {
                contentStore[courseName] = { liveLink: "", sections: [] };
            }
            contentStore[courseName].liveLink = link;
            setLocalCourseContent(contentStore);
            resolve({ success: true, data: link });
        }, 500);
    });
};

export const addCourseVideo = async (courseName, sectionTitle, videoData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const contentStore = getLocalCourseContent();
            if (!contentStore[courseName]) {
                contentStore[courseName] = { liveLink: "", sections: [] };
            }
            
            const courseData = contentStore[courseName];
            let section = courseData.sections.find(s => s.title === sectionTitle);
            
            if (!section) {
                // Create new section if it doesn't exist
                section = {
                    id: Date.now(),
                    title: sectionTitle,
                    videos: []
                };
                courseData.sections.push(section);
            }

            const newVideo = {
                id: Date.now().toString(), // Simple ID generation
                ...videoData
            };

            section.videos.push(newVideo);
            setLocalCourseContent(contentStore);
            resolve({ success: true, data: newVideo });
        }, 500);
    });
};

export const deleteCourseVideo = async (courseName, sectionId, videoId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const contentStore = getLocalCourseContent();
            if (contentStore[courseName]) {
                const courseData = contentStore[courseName];
                const section = courseData.sections.find(s => s.id === sectionId);
                if (section) {
                    section.videos = section.videos.filter(v => v.id !== videoId);
                    // Cleanup empty sections if desired? Let's keep them for now.
                    setLocalCourseContent(contentStore);
                    resolve({ success: true });
                    return;
                }
            }
            resolve({ success: false, message: "Video not found" });
        }, 500);
    });
};

export const deleteCourseSection = async (courseName, sectionId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const contentStore = getLocalCourseContent();
             if (contentStore[courseName]) {
                contentStore[courseName].sections = contentStore[courseName].sections.filter(s => s.id !== sectionId);
                setLocalCourseContent(contentStore);
                resolve({ success: true });
            } else {
                resolve({ success: false });
            }
        }, 500);
    });
};


