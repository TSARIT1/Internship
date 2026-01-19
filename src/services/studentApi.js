
// Mock data for registered students
const INITIAL_STUDENTS = [
    { id: 1, name: "John Doe", email: "john@example.com", password: "password123", webinar: "Data Science", date: "2024-03-15", totalFee: 5000, discount: 0 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", password: "password123", webinar: "AI & ML Workshop", date: "2024-03-14", totalFee: 8000, discount: 1000 },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", password: "password123", webinar: "React Masterclass", date: "2024-03-12", totalFee: 5000, discount: 0 },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", password: "password123", webinar: "Data Science Bootcamp", date: "2024-03-10", totalFee: 12000, discount: 2000 },
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

export const getStudents = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: getLocalStudents() }), 500);
    });
};

// Enriched Course Data
const INTERNSHIP_COURSES = {
    "Data Science": { 
        totalFee: 12000, 
        discount: 2000,
        domain: "Data & AI",
        level: "Intermediate",
        duration: "8 Weeks",
        description: "Master data analysis, visualization, and Python libraries like Pandas and NumPy."
    },
    "Machine Learning": { 
        totalFee: 12000, 
        discount: 2000,
        domain: "Data & AI",
        level: "Advanced",
        duration: "10 Weeks",
        description: "Build predictive models and neural networks using Scikit-learn and TensorFlow."
    },
    "AI": { 
        totalFee: 15000, 
        discount: 2500,
        domain: "Data & AI",
        level: "Advanced",
        duration: "12 Weeks",
        description: "Explore deep learning, NLP, and computer vision in this comprehensive AI program."
    },
    "MERN Stack": { 
        totalFee: 10000, 
        discount: 1500,
        domain: "Web Development",
        level: "Intermediate",
        duration: "8 Weeks",
        description: "Build full-stack web applications using MongoDB, Express, React, and Node.js."
    },
    "DevOps": { 
        totalFee: 11000, 
        discount: 1500,
        domain: "Cloud & Ops",
        level: "Intermediate",
        duration: "8 Weeks",
        description: "Learn CI/CD, Docker, Kubernetes, and cloud infrastructure automation."
    },
    "Java Full Stack": { 
        totalFee: 10000, 
        discount: 1500,
        domain: "Web Development",
        level: "Beginner",
        duration: "10 Weeks",
        description: "Master Java, Spring Boot, and frontend technologies for enterprise development."
    },
    "Python Programming": { 
        totalFee: 8000, 
        discount: 1000,
        domain: "Programming",
        level: "Beginner",
        duration: "6 Weeks",
        description: "A solid foundation in Python programming, covering syntax, data structures, and algorithms."
    },
    "AWS Cloud Computing": { 
        totalFee: 11000, 
        discount: 1500,
        domain: "Cloud & Ops",
        level: "Intermediate",
        duration: "8 Weeks",
        description: "Become an AWS expert. Learn EC2, S3, Lambda, and cloud architecture best practices."
    },
    "Cyber Security": { 
        totalFee: 13000, 
        discount: 2000,
        domain: "Security",
        level: "Advanced",
        duration: "8 Weeks",
        description: "Learn network security, ethical hacking, and how to protect systems from cyber threats."
    }
};

export const getPricing = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ 
            data: Object.entries(INTERNSHIP_COURSES).map(([course, details]) => ({
                course,
                ...details
            }))
        }), 500);
    });
};

export const updatePricing = async (courseName, newFee, newDiscount) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (INTERNSHIP_COURSES[courseName]) {
                INTERNSHIP_COURSES[courseName] = { 
                    ...INTERNSHIP_COURSES[courseName],
                    totalFee: Number(newFee), 
                    discount: Number(newDiscount) 
                };
                resolve({ success: true, data: INTERNSHIP_COURSES[courseName] });
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

export const enrollStudent = async (studentData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const students = getLocalStudents();
            const course = studentData.course || studentData.webinar; 
            const feeInfo = INTERNSHIP_COURSES[course] || { totalFee: 5000, discount: 0 }; 

            const newStudent = {
                id: Date.now(),
                ...studentData,
                webinar: course,
                date: new Date().toISOString().split('T')[0],
                totalFee: feeInfo.totalFee,
                discount: feeInfo.discount
            };
            
            const updatedStudents = [...students, newStudent];
            setLocalStudents(updatedStudents);
            resolve({ success: true, data: newStudent });
        }, 1000);
    });
};

export const applyForInternship = async (studentId, courseName) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const students = getLocalStudents();
            const studentIndex = students.findIndex(s => s.id === studentId);
            
            if (studentIndex !== -1) {
                const feeInfo = INTERNSHIP_COURSES[courseName] || { totalFee: 5000, discount: 0 };
                
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

export const loginStudent = async (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const students = getLocalStudents();
            const student = students.find(s => s.email === email && s.password === password);
            if (student) {
                resolve({ success: true, data: student });
            } else {
                reject({ success: false, message: "Invalid email or password" });
            }
        }, 1000);
    });
};

// Mock Course Content
const COURSE_CONTENT = {
    "Data Science": [
        {
            id: 1,
            title: "Introduction to Data Science",
            videos: [
                { id: "v1", title: "What is Data Science?", url: "https://www.youtube.com/embed/ua-CiDNNj30", duration: "10:30" },
                { id: "v2", title: "Python Setup", url: "https://www.youtube.com/embed/t8pPdKYpowI", duration: "15:20" }
            ]
        },
        {
            id: 2,
            title: "Python for Data Analysis",
            videos: [
                { id: "v3", title: "NumPy Basics", url: "https://www.youtube.com/embed/QUT1VHiLmmI", duration: "20:15" },
                { id: "v4", title: "Pandas DataFrame", url: "https://www.youtube.com/embed/vmEHCJofslg", duration: "18:45" }
            ]
        }
    ],
    "Java Full Stack": [
         {
            id: 1,
            title: "Java Core",
            videos: [
                { id: "j1", title: "Java Basics", url: "https://www.youtube.com/embed/grEKMHGYyns", duration: "12:00" },
                { id: "j2", title: "OOPs Concepts", url: "https://www.youtube.com/embed/pTB0EiLXUC8", duration: "25:00" }
            ]
        }
    ],
    // Default fallback for others
    "default": [
        {
            id: 1,
            title: "Course Overview",
            videos: [
                { id: "d1", title: "Welcome to the Course", url: "https://www.youtube.com/embed/9bZkp7q19f0", duration: "05:00" }
            ]
        }
    ]
};

export const getCourseContent = async (courseName) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const content = COURSE_CONTENT[courseName] || COURSE_CONTENT["default"];
            resolve({ success: true, data: content });
        }, 800);
    });
};

