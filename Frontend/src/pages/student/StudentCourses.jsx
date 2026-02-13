import React, { useEffect, useState } from 'react';
import { getPricing } from '../../services/studentApi';
import CourseCard from '../../components/CourseCard';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const student = JSON.parse(sessionStorage.getItem('student') || '{}');
    const enrolledCourseName = student.webinar || student.course;

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await getPricing();
            setCourses(response.data || []);
        };
        fetchCourses();
    }, []);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 font-display">Internship Programs</h1>
                <p className="text-slate-500 mt-2 text-lg">Industry-standard curriculums designed to get you hired.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => {
                    const isEnrolled = enrolledCourseName === course.course;
                    return (
                        <CourseCard
                            key={index}
                            course={course}
                            isEnrolled={isEnrolled}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default StudentCourses;
