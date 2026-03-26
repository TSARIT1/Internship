import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
const API_URL = `${API_BASE}/auth`;
const ENROLLMENT_URL = `${API_BASE}/enrollments`;

// AXIOS INTERCEPTOR TO ADD TOKEN
axios.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token');
        if (token && token !== 'dummy-token') {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => Promise.reject(error)
);

// --- API Functions ---

export const getPricing = async () => {
    try {
        const response = await axios.get(`${API_BASE}/courses`);
        const mappedData = response.data.map(c => ({
            course: c.name,
            title: c.name,
            id: c.id,
            totalFee: c.totalFee,
            discount: c.discount,
            description: c.description,
            duration: c.duration,
            level: c.level,
            domain: c.domain,
            slug: c.slug,
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
        const payload = {
            name: courseName,
            ...existingCourseData,
            totalFee: Number(newFee),
            discount: Number(newDiscount)
        };
        if (payload.course) delete payload.course;
        if (payload.title) delete payload.title;

        const response = await axios.put(`${API_BASE}/courses/${courseName}`, payload);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Update Pricing Error:", error);
        return { success: false, message: error.response?.data?.message || "Failed to update pricing" };
    }
};

export const updateStudentFee = async (id, fee, discount) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const students = getLocalStudents();
            const studentIndex = students.findIndex(s => s.id === id);
            if (studentIndex !== -1) {
                students[studentIndex] = { ...students[studentIndex], totalFee: Number(fee), discount: Number(discount) };
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
        const response = await axios.put(`${ENROLLMENT_URL}/${enrollmentId}/certificate`, { status });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: "Update failed" };
    }
};

export const enrollStudent = async (studentData) => {
    return registerStudent(studentData);
};

export const applyForInternship = async (studentId, courseName, paymentData = {}) => {
    try {
        const pricingRes = await getPricing();
        const courseData = pricingRes.data.find(c => c.course === courseName) || { totalFee: 5000, discount: 0 };
        const amountPaid = (courseData.totalFee - courseData.discount);

        const response = await enrollInCourse(
            studentId, 
            courseName, 
            courseData.totalFee, 
            courseData.discount,
            paymentData.razorpay_payment_id || "OFFLINE_OR_TEST",
            amountPaid
        );

        if (response.success) {
            const currentStudent = JSON.parse(sessionStorage.getItem('student') || '{}');
            if (currentStudent.id === studentId) {
                const enrollments = currentStudent.enrollments || [];
                enrollments.push({ course: courseName, ...courseData });
                currentStudent.enrollments = enrollments;
                currentStudent.course = courseName;
                sessionStorage.setItem('student', JSON.stringify(currentStudent));
            }
            return { success: true, data: currentStudent };
        } else {
             return { success: false, message: response.message };
        }
    } catch (error) {
        return { success: false, message: "Enrollment process failed." };
    }
};

export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_BASE}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: "File upload failed" };
    }
};

export const enrollInCourse = async (userId, courseName, fee, discount, transactionId, amountPaid) => {
    try {
        const response = await axios.post(`${ENROLLMENT_URL}/enroll`, {
            userId, courseName, fee: Number(fee), discount: Number(discount), transactionId, amountPaid: Number(amountPaid)
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: error.response?.data || "Enrollment failed" };
    }
};

export const getMyEnrollments = async (userId) => {
    try {
        const response = await axios.get(`${ENROLLMENT_URL}/my-enrollments/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, data: [] };
    }
};

export const checkEnrollmentStatus = async (userId, courseName) => {
    try {
        const response = await axios.get(`${ENROLLMENT_URL}/check`, { params: { userId, courseName } });
        return { success: true, enrolled: response.data.enrolled };
    } catch (error) {
        return { success: false, enrolled: false };
    }
};

export const getAllCourses = async () => {
    try {
        const response = await axios.get(`${API_BASE}/courses`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, data: [] };
    }
};

// ... other course methods ...
export const addCourse = async (courseData) => {
    try {
        const response = await axios.post(`${API_BASE}/courses`, courseData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: "Failed to add course" };
    }
};

export const deleteCourse = async (courseId) => {
    try {
        await axios.delete(`${API_BASE}/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to delete course" };
    }
};


export const getAllEnrollments = async () => {
    try {
        const response = await axios.get(`${ENROLLMENT_URL}/all`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, data: [] };
    }
};

export const loginStudent = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username: email, password });
        if (response.status === 200) {
            const { token, user } = response.data;
            if(token) {
                sessionStorage.setItem('token', token);
                if (user.role) sessionStorage.setItem('role', user.role);
            }
            return { success: true, data: { user, token } };
        }
    } catch (error) {
        return { success: false, message: error.response?.data || "Login failed" };
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return { success: true, message: response.data.message };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "This mail id is not registered" };
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
        return { success: true, message: response.data.message, resetToken: response.data.resetToken };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Invalid or expired OTP" };
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
        return { success: true, message: response.data.message };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to reset password" };
    }
};

export const registerStudent = async (studentData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username: studentData.name || studentData.email,
            email: studentData.email,
            password: studentData.password,
            phone: studentData.phone,
            course: studentData.course || studentData.webinar
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: error.response?.data || "Registration failed" };
    }
};

export const updateStudentProfile = async (id, profileData) => {
    try {
        const payload = {
            username: profileData.name,
            phone: profileData.phone,
            profilePicture: profileData.profilePicture
        };
        const response = await axios.put(`${API_URL}/update-user/${id}`, payload);
        if (response.status === 200) {
            const currentStudent = JSON.parse(sessionStorage.getItem('student') || '{}');
            const updatedStudent = { ...currentStudent, ...profileData, name: profileData.name };
            sessionStorage.setItem('student', JSON.stringify(updatedStudent));
            return { success: true, message: "Profile updated successfully" };
        }
    } catch (error) {
        return { success: false, message: "Update failed" };
    }
};

export const changePassword = async (id, { currentPassword, newPassword }) => {
    try {
        const response = await axios.post(`${API_URL}/change-password/${id}`, { currentPassword, newPassword });
        if (response.status === 200) return { success: true, message: "Password changes successfully" };
    } catch (error) {
        return { success: false, message: "Password change failed" };
    }
};

export const getStudents = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        const mappedData = response.data.map(user => ({
            id: user.id,
            name: user.username,
            email: user.email,
            webinar: user.course || "Not Selected",
            date: "2024-03-15",
            totalFee: 0,
            discount: 0
        }));
        return { data: mappedData };
    } catch (error) {
        return { data: [] };
    }
};

export const getCourseContent = async (courseName) => {
    try {
        const response = await axios.get(`${API_BASE}/courses/${courseName}`);
        if (response.status === 200) return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: "Course content not found" };
    }
};

export const updateLiveClassLink = async (courseName, link) => {
    try {
        const response = await axios.put(`${API_BASE}/courses/${courseName}/live-link`, { link });
        return { success: true, data: link };
    } catch (error) {
        return { success: false, message: "Failed to update link" };
    }
};

export const addCourseVideo = async (courseName, sectionTitle, videoData) => {
    try {
        const payload = {
            title: videoData.title,
            url: videoData.url,
            duration: videoData.duration,
            type: videoData.type,
            section: sectionTitle
        };
        const response = await axios.post(`${API_BASE}/courses/${courseName}/videos`, payload);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: "Failed to add video" };
    }
};

export const deleteCourseVideo = async (courseName, sectionId, videoId) => {
    try {
        await axios.delete(`${API_BASE}/courses/${courseName}/sections/${sectionId}/videos/${videoId}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to delete video" };
    }
};

export const deleteCourseSection = async (courseName, sectionId) => {
    try {
        await axios.delete(`${API_BASE}/courses/${courseName}/sections/${sectionId}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to delete section" };
    }
};

export const sendContactMessage = async (contactData) => {
    try {
        const response = await axios.post(`${API_BASE}/contact`, contactData);
        return { success: true, message: response.data };
    } catch (error) {
        return { success: false, message: "Failed to send message" };
    }
};

export const getAdminStats = async () => {
    try {
        const response = await axios.get(`${API_BASE}/admin/stats`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch stats" };
    }
};

export const createQuiz = async (quizData) => {
    try {
        const payload = {
            title: quizData.title,
            description: quizData.description,
            questions: quizData.questions
        };
        const response = await axios.post(`${API_BASE}/quizzes/create?courseName=${encodeURIComponent(quizData.courseName)}&sectionId=${quizData.sectionId}`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: "Failed to create quiz" };
    }
};

// --- HACKATHON API ---

export const getHackathons = async () => {
    try {
        const response = await axios.get(`${API_BASE}/hackathons`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Failed to fetch hackathons:", error);
        return { success: false, data: [] };
    }
};

export const registerForHackathon = async (hackathonId, userId) => {
    try {
        // Fix: API_URL is /api/auth, so we need to step back to /api/hackathons
        const response = await axios.post(`${API_BASE}/hackathons/${hackathonId}/register`, { userId });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error registering for hackathon:", error);
        return { success: false, error };
    }
};

export const getMyHackathonRegistrations = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE}/hackathons/my-registrations/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Fetch my hackathons error:", error);
        return { success: false, data: [] };
    }
};

export const submitProject = async (submissionData) => {
    try {
        const response = await axios.post(`${API_BASE}/submissions/submit`, submissionData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Submission error:", error);
        return { success: false, message: error.response?.data || "Submission failed" };
    }
};

export const getMySubmission = async (hackathonId, userId) => {
    try {
        const response = await axios.get(`${API_BASE}/submissions/hackathon/${hackathonId}/my-submission/${userId}`);
        return { success: true, data: response.data }; 
    } catch (error) {
        console.error("Fetch submission error:", error);
        return { success: false };
    }
};

export const updateEnrollmentStatus = async (enrollmentId, status) => {
    try {
        const response = await axios.put(`${ENROLLMENT_URL}/${enrollmentId}/status`, { status });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, message: "Status update failed" };
    }
};
