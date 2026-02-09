
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
    try {
        const response = await axios.get(`${API_URL.replace('/auth', '')}/courses`);
        // Map backend list to the expected format
        const mappedData = response.data.map(c => ({
            course: c.name, // "course" is legacy name used in frontend
            title: c.name, // "title" used in some components
            id: c.id,
            totalFee: c.totalFee,
            discount: c.discount,
            description: c.description,
            duration: c.duration,
            level: c.level,
            domain: c.domain,
            slug: c.slug,
            // Styling
            iconName: c.iconName,
            color: c.color,
            bgColor: c.bgColor,
            borderColor: c.borderColor,
            gradient: c.gradient,
            shadow: c.shadow
        }));
        return { data: mappedData };
    } catch (error) {
        console.error("Fetch pricing error:", error);
        return { data: [] };
    }
};

export const updatePricing = async (courseName, newFee, newDiscount, existingCourseData = {}) => {
    try {
        // Backend validation requires all @NotBlank fields (duration, level, domain, etc.)
        // We ensure they are present by merging existingCourseData.
        
        // Map frontend "course" key back to backend "name" if needed, though usually "name" is what backend expects
        // The existingCourseData from AdminPricing likely has "course" instead of "name" property sometimes?
        // Let's ensure proper mapping if the input object comes from getPricing mapper.
        
        const payload = {
            name: courseName, // Ensure name is set
            ...existingCourseData, // Merge all other fields (duration, level, domain, description, etc.)
            totalFee: Number(newFee),
            discount: Number(newDiscount)
        };
        
        // Remove "course" key if it exists from frontend mapping to avoid confusion, though backend ignores unknown fields
        // But let's be clean.
        if (payload.course) delete payload.course;

        const response = await axios.put(`${API_URL.replace('/auth', '')}/courses/${courseName}`, payload);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Update Pricing Error:", error);
        return { success: false, message: "Failed to update pricing" };
    }
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

export const updateStudentCertificate = async (enrollmentId, status) => {
    try {
        const response = await axios.put(`${ENROLLMENT_URL}/${enrollmentId}/certificate`, {
            status
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Certificate update error:", error);
         return { success: false, message: "Update failed" };
    }
};

export const enrollStudent = async (studentData) => {
    // For now, enrolling acts as registering a new user in the backend.
    // NOTE: The backend 'User' entity only stores username, email, password.
    // It does NOT yet store the 'course' or 'fee' info.
    // We will call the register API to at least create the account.
    
    return registerStudent(studentData);
};

// Replaced by enrollInCourse but keeping for legacy compatibility if strictly needed
export const applyForInternship = async (studentId, courseName, paymentData = {}) => {
    try {
        // 1. Get Pricing Data
        const pricingRes = await getPricing();
        const courseData = pricingRes.data.find(c => c.course === courseName) || { totalFee: 5000, discount: 0 };
        const amountPaid = (courseData.totalFee - courseData.discount);

        // 2. Call new enrollment endpoint
        const response = await enrollInCourse(
            studentId, 
            courseName, 
            courseData.totalFee, 
            courseData.discount,
            paymentData.razorpay_payment_id || "OFFLINE_OR_TEST",
            amountPaid
        );

        if (response.success) {
            // 3. Update Local Storage for session consistency
            // We still update the "student" object in local storage to have the *latest* course 
            // even though strictly they have multiple.
            const currentStudent = JSON.parse(localStorage.getItem('student') || '{}');
            if (currentStudent.id === studentId) {
                // We add a 'enrollments' array to local storage student for UI convenience
                const enrollments = currentStudent.enrollments || [];
                enrollments.push({ course: courseName, ...courseData });
                currentStudent.enrollments = enrollments;
                currentStudent.course = courseName; // Legacy field
                localStorage.setItem('student', JSON.stringify(currentStudent));
            }
            return { success: true, data: currentStudent };
        } else {
             return { success: false, message: response.message };
        }
    } catch (error) {
        console.error("Enrollment logic failed in applyForInternship", error);
        return { 
            success: false, 
            message: error.response?.data || error.message || "Enrollment process failed." 
        };
    }
};

import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth";
const ENROLLMENT_URL = "http://localhost:8080/api/enrollments";

// AXIOS INTERCEPTOR TO ADD TOKEN
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token && token !== 'dummy-token') { // Don't send dummy token if we have real one
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// File Upload Function
export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`http://localhost:8080/api/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return { success: true, data: response.data }; // Returns { fileName, fileUrl }
    } catch (error) {
        console.error("File upload error:", error);
        return { success: false, message: "File upload failed" };
    }
};

// New Enrollment functions
export const enrollInCourse = async (userId, courseName, fee, discount, transactionId, amountPaid) => {
    try {
        const response = await axios.post(`${ENROLLMENT_URL}/enroll`, {
            userId,
            courseName,
            fee: Number(fee),
            discount: Number(discount),
            transactionId,
            amountPaid: Number(amountPaid)
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Enrollment error:", error);
        return { success: false, message: error.response?.data || "Enrollment failed" };
    }
};

export const getMyEnrollments = async (userId) => {
    try {
        const response = await axios.get(`${ENROLLMENT_URL}/my-enrollments/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Fetch enrollment error:", error);
        return { success: false, data: [] };
    }
};

export const checkEnrollmentStatus = async (userId, courseName) => {
    try {
        const response = await axios.get(`${ENROLLMENT_URL}/check`, {
            params: { userId, courseName }
        });
        return { success: true, enrolled: response.data.enrolled };
    } catch (error) {
        console.error("Check enrollment error:", error);
        return { success: false, enrolled: false };
    }
};

export const getAllCourses = async () => {
    try {
        const response = await axios.get(`${API_URL.replace('/auth', '')}/courses`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Fetch all courses error:", error);
        return { success: false, data: [] };
    }
};

export const addCourse = async (courseData) => {
    try {
        const response = await axios.post(`${API_URL.replace('/auth', '')}/courses`, courseData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Add course error:", error);
        return { 
            success: false, 
            message: error.response?.data?.message || error.response?.data || error.message || "Failed to add course" 
        };
    }
};

export const deleteCourse = async (courseId) => {
    try {
        await axios.delete(`${API_URL.replace('/auth', '')}/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Delete course error:", error);
        return { success: false, message: "Failed to delete course" };
    }
};

export const getAllEnrollments = async () => {
    try {
        const response = await axios.get(`${ENROLLMENT_URL}/all`);
        return { success: true, data: response.data };
    } catch (error) {
         console.error("Fetch all enrollments error:", error);
        return { success: false, data: [] };
    }
};


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
            // Backend returns: { token: "...", user: { ... } }
            const { token, user } = response.data;
            
            // Save token
            if(token) {
                localStorage.setItem('token', token);
                // Also save user role if present
                if (user.role) {
                    localStorage.setItem('role', user.role);
                }
            }
            
            return { success: true, data: user };
        }
    } catch (error) {
        return { success: false, message: error.response?.data || "Login failed" };
    }
};

// --- AUTHENTICATION ---
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return { success: true, message: response.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.response?.data || "Failed to send reset link" };
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
        return { success: true, message: response.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.response?.data || "Failed to reset password" };
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



export const updateStudentProfile = async (id, profileData) => {
    try {
        // profileData: { username(name), phone }
        // Note: Backend expects 'username' for name update based on User entity
        // We might want to sending 'username' instead of 'name' or map it here.
        // User entity has 'username', 'email', 'phone'.
        
        const payload = {
            username: profileData.name,
            phone: profileData.phone,
            profilePicture: profileData.profilePicture
        };
        
        const response = await axios.put(`${API_URL}/update-user/${id}`, payload);
        
        if (response.status === 200) {
            // Update local storage to reflect changes immediately
            const currentStudent = JSON.parse(localStorage.getItem('student') || '{}');
            const updatedStudent = { ...currentStudent, ...profileData };
            // Ensure we update the name/username correctly
            updatedStudent.name = profileData.name; 
            localStorage.setItem('student', JSON.stringify(updatedStudent));
            
            return { success: true, message: "Profile updated successfully" };
        }
    } catch (error) {
        return { success: false, message: error.response?.data || "Update failed" };
    }
};

export const changePassword = async (id, { currentPassword, newPassword }) => {
    try {
        const response = await axios.post(`${API_URL}/change-password/${id}`, {
            currentPassword,
            newPassword
        });
        
        if (response.status === 200) {
            return { success: true, message: "Password changes successfully" };
        }
    } catch (error) {
         return { success: false, message: error.response?.data || "Password change failed" };
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
    try {
        // Backend expects course name. Encoding handled by axios/browser usually, but check spaces.
        const response = await axios.get(`${API_URL.replace('/auth', '')}/courses/${courseName}`);
        
        if (response.status === 200) {
            return { success: true, data: response.data };
        }
    } catch (error) {
        console.error("Failed to fetch course content", error);
        // Fallback or error handling
        return { success: false, message: "Course content not found" };
    }
};

export const updateLiveClassLink = async (courseName, link) => {
    try {
        const response = await axios.put(`${API_URL.replace('/auth', '')}/courses/${courseName}/live-link`, { link });
        return { success: true, data: link };
    } catch (error) {
        console.error("Update Live Link Error:", error);
        return { success: false, message: "Failed to update link" };
    }
};

export const addCourseVideo = async (courseName, sectionTitle, videoData) => {
    try {
        // Backend expects: { title, url, duration, type, section }
        const payload = {
            title: videoData.title,
            url: videoData.url,
            duration: videoData.duration,
            type: videoData.type,
            section: sectionTitle
        };
        const response = await axios.post(`${API_URL.replace('/auth', '')}/courses/${courseName}/videos`, payload);
        return { success: true, data: response.data }; // Returns success message mostly
    } catch (error) {
        console.error("Add Video Error:", error);
        return { success: false, message: "Failed to add video" };
    }
};

export const deleteCourseVideo = async (courseName, sectionId, videoId) => {
    try {
        await axios.delete(`${API_URL.replace('/auth', '')}/courses/${courseName}/sections/${sectionId}/videos/${videoId}`);
        return { success: true };
    } catch (error) {
        console.error("Delete Video Error:", error);
        return { success: false, message: "Failed to delete video" };
    }
};

export const deleteCourseSection = async (courseName, sectionId) => {
    try {
        await axios.delete(`${API_URL.replace('/auth', '')}/courses/${courseName}/sections/${sectionId}`);
        return { success: true };
    } catch (error) {
        console.error("Delete Section Error:", error);
        return { success: false, message: "Failed to delete section" };
    }
};



export const sendContactMessage = async (contactData) => {
    try {
        const response = await axios.post(`${API_URL.replace('/auth', '')}/contact`, contactData);
        return { success: true, message: response.data };
    } catch (error) {
        console.error("Contact form error:", error);
        return { success: false, message: error.response?.data || "Failed to send message" };
    }
};

export const getAdminStats = async () => {
    try {
        const response = await axios.get(`${API_URL.replace('/auth', '')}/admin/stats`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Fetch admin stats error:", error);
        return { success: false, message: "Failed to fetch stats" };
    }
};

export const createQuiz = async (quizData) => {
    try {
        const payload = {
            title: quizData.title,
            description: quizData.description,
            questions: quizData.questions
        };
        const response = await axios.post(`${API_URL.replace('/auth', '')}/quizzes/create?courseName=${encodeURIComponent(quizData.courseName)}&sectionId=${quizData.sectionId}`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Create Quiz Error:", error);
        return { 
            success: false, 
            message: error.response?.data || "Failed to create quiz" 
        };
    }
};

export const getHackathons = async () => {
    try {
        const response = await axios.get(`${API_URL.replace('/auth', '')}/hackathons`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Failed to fetch hackathons:", error);
        return { success: false, data: [] };
    }
};

export const updateEnrollmentStatus = async (enrollmentId, status) => {
    try {
        const response = await axios.put(`${ENROLLMENT_URL}/${enrollmentId}/status`, {
            status
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Status update error:", error);
         return { success: false, message: "Status update failed" };
    }
};

