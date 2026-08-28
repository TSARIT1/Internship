import React from 'react';
import CourseTemplate from '../components/CourseTemplate';

const AWSCloudComputing = () => {
    const courseData = {
        title: "AWS Cloud Computing",
        description: "Master Amazon Web Services (AWS). Prepare for AWS Certified Solutions Architect Associate certification with hands-on enterprise cloud architecture labs.",
        duration: "5 Months",
        level: "Intermediate",
        heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
        tools: [
            "AWS EC2 & S3", "AWS VPC & Subnets", "AWS Lambda (Serverless)", "AWS IAM & Security", "Amazon RDS & DynamoDB",
            "AWS CloudFormation", "AWS CloudWatch", "AWS ECS & ECR", "Route 53 & CloudFront", "Terraform"
        ],
        curriculum: [
            {
                title: "Phase 1: Cloud Computing Fundamentals & AWS Core Infrastructure",
                duration: "Weeks 1 - 4",
                topics: [
                    "Introduction to Cloud Paradigms (IaaS, PaaS, SaaS) and AWS Global Infrastructure (Regions, AZs)",
                    "AWS Identity & Access Management (IAM): Users, Groups, Roles, Policies, MFA, Least Privilege",
                    "Amazon EC2 (Elastic Compute Cloud): Instance Types, AMIs, Key Pairs, EBS Volumes, Snapshots",
                    "Elastic Load Balancers (ALB, NLB) and Auto Scaling Groups for high availability"
                ]
            },
            {
                title: "Phase 2: Storage Solutions, Databases & Custom VPC Networking",
                duration: "Weeks 5 - 9",
                topics: [
                    "Amazon S3 (Simple Storage Service): Buckets, Storage Classes, Versioning, Lifecycle Rules, Static Web Hosting",
                    "Database Services on AWS: Amazon RDS (MySQL/PostgreSQL), DynamoDB NoSQL, ElastiCache",
                    "Custom VPC Architecture: CIDR Blocks, Public & Private Subnets, Internet Gateways, NAT Gateways, Route Tables",
                    "Network Security: Security Groups, Network ACLs, Bastion Hosts, and VPC Peering"
                ]
            },
            {
                title: "Phase 3: Serverless Architecture, Containers & Infrastructure as Code",
                duration: "Weeks 10 - 15",
                topics: [
                    "Serverless Computing with AWS Lambda, API Gateway, and Step Functions",
                    "Application Integration: Amazon SQS, SNS, EventBridge, and SES email service",
                    "Containerization on AWS: Elastic Container Service (ECS), ECR, and introduction to EKS",
                    "Infrastructure as Code (IaC) using AWS CloudFormation and Terraform"
                ]
            },
            {
                title: "Phase 4: Monitoring, Security Hardening & Enterprise Capstone",
                duration: "Weeks 16 - 20",
                topics: [
                    "Monitoring & Observability with Amazon CloudWatch, CloudTrail, and AWS Config",
                    "Content Delivery with Amazon CloudFront CDN and DNS management via Route 53",
                    "AWS Well-Architected Framework: Security, Reliability, Cost Optimization, Performance",
                    "AWS Certified Solutions Architect Exam prep, resume workshops, and placement interviews"
                ]
            }
        ],
        projects: [
            {
                title: "Highly Available Multi-Tier Web Application on Custom VPC",
                desc: "Designed and deployed a fault-tolerant 3-tier architecture with Auto Scaling, Application Load Balancers, and Multi-AZ RDS.",
                tags: ["AWS VPC", "EC2 AutoScaling", "ALB", "Multi-AZ RDS"],
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Serverless Event-Driven Image Processing & Notification Pipeline",
                desc: "Built a zero-server architecture triggering AWS Lambda upon S3 uploads to resize media and dispatch SNS push alerts.",
                tags: ["AWS Lambda", "S3 Triggers", "API Gateway", "SNS"],
                image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Terraform Infrastructure as Code Automated Cloud Deployment",
                desc: "Automated the entire provisioning of VPC, EC2 clusters, security groups, and S3 buckets using reusable Terraform modules.",
                tags: ["Terraform", "IaC", "AWS IAM", "CloudWatch"],
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Global Video Streaming Distribution with CloudFront CDN & Route 53",
                desc: "Configured a low-latency global media streaming distribution system with CloudFront edge caching and geo-routing.",
                tags: ["CloudFront", "Route 53", "S3", "Security"],
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Master core AWS cloud services (Compute, Storage, Networking, Databases)",
            "Design highly available, fault-tolerant, and secure cloud architectures",
            "Build serverless applications with AWS Lambda and API Gateway",
            "Automate infrastructure provisioning using Terraform and CloudFormation",
            "Prepare for AWS Solutions Architect certification and corporate placement"
        ],
        careerRoles: [
            { title: "Cloud Solutions Architect", salary: "₹7.5 LPA - ₹20.0 LPA" },
            { title: "AWS Cloud Engineer", salary: "₹6.0 LPA - ₹16.0 LPA" },
            { title: "Cloud Infrastructure Specialist", salary: "₹6.5 LPA - ₹17.0 LPA" },
            { title: "Associate Cloud Consultant", salary: "₹5.5 LPA - ₹13.0 LPA" }
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default AWSCloudComputing;
