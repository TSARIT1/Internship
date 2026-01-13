
// Mock data for registered students
const students = [
    { id: 1, name: "John Doe", email: "john@example.com", webinar: "React Masterclass", date: "2024-03-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", webinar: "AI & ML Workshop", date: "2024-03-14" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", webinar: "React Masterclass", date: "2024-03-12" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", webinar: "Data Science Bootcamp", date: "2024-03-10" },
    { id: 5, name: "David Brown", email: "david@example.com", webinar: "AI & ML Workshop", date: "2024-03-09" },
    { id: 6, name: "Emily Davis", email: "emily@example.com", webinar: "Cyber Security Basics", date: "2024-03-08" },
    { id: 7, name: "Chris Wilson", email: "chris@example.com", webinar: "AWS Cloud Fundamentals", date: "2024-03-07" },
];


export const getStudents = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: [...students] }), 500);
    });
};

export const enrollStudent = async (studentData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newStudent = {
                id: students.length + 1,
                ...studentData,
                date: new Date().toISOString().split('T')[0]
            };
            students.push(newStudent);
            resolve({ success: true, data: newStudent });
        }, 1000);
    });
};
