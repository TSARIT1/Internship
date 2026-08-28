import React from 'react';
import CourseTemplate from '../components/CourseTemplate';

const DataScience = () => {
    const courseData = {
        title: "Data Science",
        description: "Master exploratory data analysis, statistical modeling, machine learning pipelines, Tableau BI dashboards, and end-to-end data storytelling.",
        duration: "4-6 Months",
        level: "Beginner to Advanced",
        heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
        tools: [
            "Python 3.12", "NumPy", "Pandas", "Matplotlib & Seaborn", "Scikit-Learn",
            "SQL & PostgreSQL", "Tableau BI", "Jupyter Labs", "Statsmodels", "Git & GitHub"
        ],
        curriculum: [
            {
                title: "Phase 1: Python for Data Analysis & Statistical Foundations",
                duration: "Weeks 1 - 4",
                topics: [
                    "Python programming fundamentals, OOP concepts, and data structures",
                    "NumPy array operations, linear algebra, and vectorization",
                    "Pandas DataFrames: data ingestion, wrangling, transformation, and merging",
                    "Descriptive & Inferential Statistics: hypothesis testing, p-values, distributions",
                    "Exploratory Data Analysis (EDA) and cleaning real-world messy datasets"
                ]
            },
            {
                title: "Phase 2: Advanced Visual Storytelling & SQL Data Engineering",
                duration: "Weeks 5 - 8",
                topics: [
                    "Data visualization with Matplotlib, Seaborn, and interactive Plotly",
                    "Relational Database querying: Complex SQL Joins, Aggregations, Window functions",
                    "Building interactive Business Intelligence (BI) dashboards in Tableau & Power BI",
                    "Feature Engineering, Outlier Detection, Encoding techniques, and Scalers"
                ]
            },
            {
                title: "Phase 3: Machine Learning Algorithms & Predictive Modeling",
                duration: "Weeks 9 - 14",
                topics: [
                    "Supervised Learning: Linear Regression, Logistic Regression, Decision Trees",
                    "Ensemble Methods: Random Forests, Gradient Boosting, XGBoost, LightGBM",
                    "Unsupervised Learning: K-Means Clustering, Hierarchical Clustering, PCA Dimensionality Reduction",
                    "Model Evaluation Metrics: ROC-AUC, Precision-Recall, F1-Score, Cross-Validation",
                    "Hyperparameter Tuning with GridSearchCV and Optuna"
                ]
            },
            {
                title: "Phase 4: Real-time Capstone Deployment & MLOps Pipeline",
                duration: "Weeks 15 - 18",
                topics: [
                    "Deploying ML models as REST APIs using FastAPI & Flask",
                    "Cloud deployment on AWS/Streamlit Cloud with automated monitoring",
                    "End-to-End Capstone Project execution with live mentor code reviews",
                    "Resume building, GitHub portfolio presentation, and Mock Technical Interviews"
                ]
            }
        ],
        projects: [
            {
                title: "E-Commerce Customer Lifetime Value & Churn Predictor",
                desc: "Analyzed 1M+ transactions to segment customers using RFM analysis and predict churn risk with 92% precision.",
                tags: ["Python", "XGBoost", "RFM Segmentation", "FastAPI"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Real Estate Valuation & Predictive Market Pricing Model",
                desc: "Built a multivariate regression pipeline estimating residential property values across major metropolitan regions.",
                tags: ["Scikit-Learn", "Feature Engineering", "Tableau", "Streamlit"],
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Financial Fraud & Anomaly Detection System",
                desc: "Engineered an anomaly detection engine identifying fraudulent credit card transactions in real-time streaming data.",
                tags: ["Isolation Forest", "Imbalanced-Learn", "SQL", "Plotly"],
                image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Healthcare Diagnostics & Disease Prediction System",
                desc: "Developed a clinical predictive diagnostic classification tool utilizing ensemble models and patient health indicators.",
                tags: ["Random Forest", "Pandas", "Matplotlib", "FastAPI"],
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Master Python, Pandas, NumPy, and SQL for enterprise data analysis",
            "Build, validate, and deploy production machine learning models",
            "Create executive-ready Tableau and Power BI interactive dashboards",
            "Develop 4 portfolio capstone projects with full GitHub documentation",
            "Receive industry-recognized verified certificate and placement referrals"
        ],
        careerRoles: [
            { title: "Data Scientist / Junior Data Scientist", salary: "₹6.5 LPA - ₹16.0 LPA" },
            { title: "Business Intelligence (BI) Analyst", salary: "₹5.5 LPA - ₹12.0 LPA" },
            { title: "Data Analyst / Analytics Consultant", salary: "₹4.5 LPA - ₹10.0 LPA" },
            { title: "Machine Learning Associate", salary: "₹6.0 LPA - ₹14.0 LPA" }
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default DataScience;
