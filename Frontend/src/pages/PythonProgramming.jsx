import React from 'react';
import CourseTemplate from '../components/CourseTemplate';

const PythonProgramming = () => {
    const courseData = {
        title: "Python Programming",
        description: "Learn Python from fundamentals to enterprise backend architecture. Master OOP, Django, FastAPI, Web Scraping, Database Automation, and REST APIs.",
        duration: "4 Months",
        level: "Beginner to Intermediate",
        heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
        tools: [
            "Python 3.12", "Django 5", "FastAPI", "SQLAlchemy", "PostgreSQL & SQLite",
            "BeautifulSoup4 & Selenium", "PyTest", "Celery & Redis", "Git & GitHub", "Docker"
        ],
        curriculum: [
            {
                title: "Phase 1: Core Python Programming & Object-Oriented Design",
                duration: "Weeks 1 - 4",
                topics: [
                    "Python Syntax, Variables, Control Flow, Loops, and Built-in Data Structures",
                    "Functions, Lambda Expressions, Decorators, Generators, and Iterators",
                    "Object-Oriented Programming (OOP): Classes, Objects, Inheritance, Encapsulation, Polymorphism",
                    "Exception Handling, Context Managers, File I/O, JSON and CSV processing",
                    "Virtual Environments (venv/pipenv) and Package Management"
                ]
            },
            {
                title: "Phase 2: Web Scraping, Automation & Database Integration",
                duration: "Weeks 5 - 8",
                topics: [
                    "Web Scraping with BeautifulSoup4, Requests, and headless Selenium automation",
                    "Database interactions with SQLite and PostgreSQL using psycopg2 & SQLAlchemy ORM",
                    "Automating repetitive tasks: Excel report generation, email alerts, data extraction bots",
                    "Unit Testing with PyTest and Unittest frameworks"
                ]
            },
            {
                title: "Phase 3: Web Backend Development with Django & FastAPI",
                duration: "Weeks 9 - 13",
                topics: [
                    "Django Framework: MVC/MVT architecture, Models, Views, Templates, Admin Panel, ORM",
                    "Building High-Performance Async REST APIs with FastAPI & Pydantic validation",
                    "Authentication, JWT Tokens, Permissions, and OpenAPI / Swagger documentation",
                    "Asynchronous task queues using Celery and Redis"
                ]
            },
            {
                title: "Phase 4: Capstone Execution, Dockerization & Career Prep",
                duration: "Weeks 14 - 16",
                topics: [
                    "Containerizing Python applications with Docker and multi-stage builds",
                    "Full-Stack Python Capstone project deployment on AWS / Render",
                    "Code reviews with senior developers, algorithm problem solving on LeetCode",
                    "Resume polishing, portfolio showcase, and direct corporate placement support"
                ]
            }
        ],
        projects: [
            {
                title: "Multi-Source Job Aggregator & Real-Time Scraper Engine",
                desc: "Automated bot extracting tech job postings across 5 platforms with duplicate filtering and daily Discord notifications.",
                tags: ["Python 3.12", "Selenium", "BeautifulSoup", "PostgreSQL"],
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "High-Speed Async REST API for Fintech Wallet Transactions",
                desc: "Engineered an asynchronous FastAPI microservice handling ledger updates and JWT-authenticated balance transfers.",
                tags: ["FastAPI", "SQLAlchemy", "Pydantic", "Redis"],
                image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Full-Featured Learning Management System (LMS) Backend",
                desc: "Built a robust Django platform with course enrollments, quiz evaluations, video progress tracking, and admin dashboard.",
                tags: ["Django 5", "Django REST", "PostgreSQL", "Celery"],
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Automated Data Extraction & Financial Report Generator",
                desc: "Scripted an automated pipeline that ingests messy CSVs, parses stock metrics, and outputs formatted executive PDF reports.",
                tags: ["Python", "ReportLab", "Pandas", "Automation"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Master Python 3.12 from syntax to advanced object-oriented design patterns",
            "Build automated web scrapers, data parsers, and task automation scripts",
            "Develop enterprise-ready web backends using Django and FastAPI",
            "Deploy containerized Python services with PostgreSQL and Redis",
            "Receive industry-recognized verified certificate and interview assistance"
        ],
        careerRoles: [
            { title: "Python Backend Developer", salary: "₹5.5 LPA - ₹14.0 LPA" },
            { title: "Django / FastAPI Engineer", salary: "₹6.0 LPA - ₹15.0 LPA" },
            { title: "Python Automation & QA Engineer", salary: "₹4.5 LPA - ₹10.0 LPA" },
            { title: "Junior Software Engineer (Python)", salary: "₹5.0 LPA - ₹12.0 LPA" }
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default PythonProgramming;
