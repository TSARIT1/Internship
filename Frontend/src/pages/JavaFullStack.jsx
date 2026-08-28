import React from 'react';
import CourseTemplate from '../components/CourseTemplate';

const JavaFullStack = () => {
    const courseData = {
        title: "Java Full Stack",
        description: "Build robust enterprise applications using Core Java 21, Spring Boot 3, Spring Security, Spring Cloud Microservices, Hibernate / JPA, and React 19.",
        duration: "6 Months",
        level: "Beginner to Enterprise",
        heroImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
        tools: [
            "Java 21", "Spring Boot 3", "Spring Security 6", "Hibernate / JPA", "Microservices",
            "React 19", "MySQL & PostgreSQL", "Apache Kafka", "Docker", "Postman & Swagger"
        ],
        curriculum: [
            {
                title: "Phase 1: Core & Advanced Java Foundations",
                duration: "Weeks 1 - 5",
                topics: [
                    "Java Fundamentals: Syntax, Memory management, JVM architecture, Garbage Collection",
                    "Object-Oriented Programming (OOP): Inheritance, Polymorphism, Encapsulation, Abstraction",
                    "Java Collections Framework: Lists, Sets, Maps, Queues, Generics, Comparator/Comparable",
                    "Java 8+ Features: Lambdas, Streams API, Optional, Functional Interfaces, CompletableFuture",
                    "Exception Handling, Multithreading, Concurrency utilities, File I/O & Serialization"
                ]
            },
            {
                title: "Phase 2: Database Management & Hibernate ORM / JPA",
                duration: "Weeks 6 - 9",
                topics: [
                    "Relational Database Design, SQL Query Optimization, Indexing, Transactions (ACID)",
                    "JDBC vs ORM Frameworks, Hibernate architecture and configuration",
                    "JPA Annotations: Entity, Id, Table, Column, Temporal, Relationships (1-1, 1-N, N-N)",
                    "Spring Data JPA: Repositories, Query Methods, JPQL, Criteria API, Pagination & Sorting"
                ]
            },
            {
                title: "Phase 3: Enterprise Spring Boot 3, REST APIs & Spring Security",
                duration: "Weeks 10 - 15",
                topics: [
                    "Spring Framework Core: Dependency Injection (DI), Inversion of Control (IoC), Beans lifecycle",
                    "Building RESTful Web Services with Spring Boot: Controllers, Services, DTOs, Exception Handlers",
                    "Spring Security 6: JWT stateless authentication, Role-Based Access Control (RBAC), OAuth2",
                    "Frontend integration with React 19: Axios HTTP clients, State Management, UI forms",
                    "Microservices Architecture: Eureka Service Discovery, Spring Cloud Gateway, Feign Clients, Kafka messaging"
                ]
            },
            {
                title: "Phase 4: Enterprise Capstone Project & Cloud Deployment",
                duration: "Weeks 16 - 24",
                topics: [
                    "Building a multi-tier Microservices banking / healthcare system",
                    "Dockerizing Spring Boot and React containers, Docker Compose orchestration",
                    "Unit and Integration testing with JUnit 5, Mockito, and Testcontainers",
                    "Mock technical interviews (Data Structures & System Design) and guaranteed placement support"
                ]
            }
        ],
        projects: [
            {
                title: "Enterprise Core Banking & Financial Transaction Microservices",
                desc: "Architected a scalable banking backend with money transfers, account ledgering, JWT authentication, and Kafka event streaming.",
                tags: ["Spring Boot 3", "Microservices", "Kafka", "PostgreSQL"],
                image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Hospital Management & Telemedicine Patient Portal",
                desc: "Engineered a full-stack clinical ERP system managing appointments, electronic medical records (EMR), and doctor scheduling.",
                tags: ["Java 21", "Spring Security", "React 19", "MySQL"],
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Corporate HRMS & Payroll Automation Enterprise Suite",
                desc: "Developed a distributed human resource management system with automated payroll calculation and PDF payslip generation.",
                tags: ["Spring Boot", "Hibernate", "React", "Docker"],
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "High-Throughput E-Commerce Order Fulfillment Engine",
                desc: "Created an asynchronous order processing microservice utilizing Redis caching and Apache Kafka event-driven architecture.",
                tags: ["Microservices", "Redis", "Kafka", "Swagger"],
                image: "https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Master Java 21, Spring Boot 3, and Microservices architecture",
            "Design enterprise RESTful APIs with Spring Security and JWT authentication",
            "Integrate relational databases using Hibernate ORM and Spring Data JPA",
            "Build full-stack responsive web applications connecting Java backends with React",
            "Receive industry-recognized verified certificate and high-volume corporate placement drives"
        ],
        careerRoles: [
            { title: "Java Full Stack Developer", salary: "₹6.5 LPA - ₹17.0 LPA" },
            { title: "Backend Java / Spring Boot Engineer", salary: "₹6.0 LPA - ₹15.0 LPA" },
            { title: "Enterprise Software Developer", salary: "₹7.0 LPA - ₹18.0 LPA" },
            { title: "Associate Java Consultant", salary: "₹5.5 LPA - ₹12.0 LPA" }
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default JavaFullStack;
