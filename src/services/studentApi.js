
// Mock data for registered students
const students = [
    { id: 1, name: "John Doe", email: "john@example.com", webinar: "React Masterclass", date: "2024-03-15", totalFee: 5000, discount: 0 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", webinar: "AI & ML Workshop", date: "2024-03-14", totalFee: 8000, discount: 1000 },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", webinar: "React Masterclass", date: "2024-03-12", totalFee: 5000, discount: 0 },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", webinar: "Data Science Bootcamp", date: "2024-03-10", totalFee: 12000, discount: 2000 },
    { id: 5, name: "David Brown", email: "david@example.com", webinar: "AI & ML Workshop", date: "2024-03-09", totalFee: 8000, discount: 0 },
    { id: 6, name: "Emily Davis", email: "emily@example.com", webinar: "Cyber Security Basics", date: "2024-03-08", totalFee: 6000, discount: 500 },
    { id: 7, name: "Chris Wilson", email: "chris@example.com", webinar: "AWS Cloud Fundamentals", date: "2024-03-07", totalFee: 7000, discount: 0 },
];


export const getStudents = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: [...students] }), 500);
    });
};

// Fee Structure Configuration
let INTERNSHIP_FEES = {
    "Data Science": { totalFee: 12000, discount: 2000 },
    "Machine Learning": { totalFee: 12000, discount: 2000 },
    "AI": { totalFee: 15000, discount: 2500 },
    "MERN Stack": { totalFee: 10000, discount: 1500 },
    "DevOps": { totalFee: 11000, discount: 1500 },
    "Java Full Stack": { totalFee: 10000, discount: 1500 },
    "Python Programming": { totalFee: 8000, discount: 1000 },
    "AWS Cloud Computing": { totalFee: 11000, discount: 1500 },
    "Cyber Security": { totalFee: 13000, discount: 2000 }
};

export const getPricing = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ 
            data: Object.entries(INTERNSHIP_FEES).map(([course, fees]) => ({
                course,
                ...fees
            }))
        }), 500);
    });
};

export const updatePricing = async (courseName, newFee, newDiscount) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (INTERNSHIP_FEES[courseName]) {
                INTERNSHIP_FEES[courseName] = { 
                    totalFee: Number(newFee), 
                    discount: Number(newDiscount) 
                };
                resolve({ success: true, data: INTERNSHIP_FEES[courseName] });
            } else {
                resolve({ success: false, message: "Course not found" });
            }
        }, 500);
    });
};

export const updateStudentFee = async (id, fee, discount) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const studentIndex = students.findIndex(s => s.id === id);
            if (studentIndex !== -1) {
                students[studentIndex] = { 
                    ...students[studentIndex], 
                    totalFee: Number(fee), 
                    discount: Number(discount) 
                };
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
            const course = studentData.course || studentData.webinar; // "course" from form, "webinar" in mock data
            const feeInfo = INTERNSHIP_FEES[course] || { totalFee: 5000, discount: 0 }; // Default fallback

            const newStudent = {
                id: students.length + 1,
                ...studentData,
                webinar: course, // Normalize to "webinar" key to match existing data
                date: new Date().toISOString().split('T')[0],
                totalFee: feeInfo.totalFee,
                discount: feeInfo.discount
            };
            students.push(newStudent);
            resolve({ success: true, data: newStudent });
        }, 1000);
    });
};
