import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import CourseTemplate from '../components/CourseTemplate';

const courseMap = {
    'data-science': {
        title: "Data Science",
        description: "Master exploratory data analysis, statistical modeling, machine learning pipelines, Tableau BI dashboards, and end-to-end data storytelling.",
        duration: "4-6 Months",
        level: "Beginner to Advanced",
        heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
        tools: ["Python", "Pandas", "Scikit-Learn", "SQL", "Tableau", "Jupyter", "Git"],
        curriculum: [
            {
                title: "Phase 1: Python for Data Analysis & Statistical Foundations",
                duration: "Weeks 1 - 4",
                topics: ["Python fundamentals", "NumPy arrays", "Pandas DataFrames", "EDA & Data Cleaning"]
            },
            {
                title: "Phase 2: Machine Learning & Predictive Modeling",
                duration: "Weeks 5 - 10",
                topics: ["Regression & Classification", "Random Forests & XGBoost", "Hyperparameter Tuning"]
            },
            {
                title: "Phase 3: Real-Time Capstone Deployment",
                duration: "Weeks 11 - 16",
                topics: ["FastAPI Model Deployment", "Tableau Dashboards", "Portfolio Presentation"]
            }
        ],
        projects: [
            {
                title: "Customer Lifetime Value & Churn Predictor",
                desc: "Analyzed 1M+ transactions to segment customers and predict churn with 92% precision.",
                tags: ["Python", "XGBoost", "FastAPI"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Master Python, Pandas, NumPy, and SQL for enterprise data analysis",
            "Build and deploy production machine learning models",
            "Receive industry-recognized verified certificate and placement assistance"
        ],
        careerRoles: [
            { title: "Data Scientist", salary: "₹6.5 LPA - ₹16.0 LPA" },
            { title: "BI Analyst", salary: "₹5.5 LPA - ₹12.0 LPA" }
        ]
    }
};

const slugRedirectMap = {
    'data-science': '/data-science',
    'machine-learning': '/machine-learning',
    'ai': '/ai',
    'mern-stack': '/mern-stack',
    'java-full-stack': '/java-full-stack',
    'python-programming': '/python-programming',
    'aws-cloud-computing': '/aws-cloud-computing',
    'devops': '/devops',
    'cyber-security': '/cyber-security'
};

const InternshipDetails = () => {
    const { id } = useParams();
    const cleanId = id?.toLowerCase();

    if (cleanId && slugRedirectMap[cleanId]) {
        return <Navigate to={slugRedirectMap[cleanId]} replace />;
    }

    const fallbackData = courseMap[cleanId] || courseMap['data-science'];
    return <CourseTemplate data={fallbackData} />;
};

export default InternshipDetails;
