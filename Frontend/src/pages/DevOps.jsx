import React from 'react';
import CourseTemplate from '../components/CourseTemplate';

const DevOps = () => {
    const courseData = {
        title: "DevOps",
        description: "Master DevOps Engineering, CI/CD automation, Docker containerization, Kubernetes cluster orchestration, Terraform Infrastructure as Code, and Cloud monitoring.",
        duration: "5-6 Months",
        level: "Advanced",
        heroImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1600&q=80",
        tools: [
            "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform",
            "Ansible", "Linux & Shell Scripting", "Prometheus & Grafana", "AWS Cloud", "ArgoCD"
        ],
        curriculum: [
            {
                title: "Phase 1: Linux Administration, Shell Scripting & Git Mastery",
                duration: "Weeks 1 - 4",
                topics: [
                    "Linux System Administration: File permissions, Process management, Systemd, Networking, SSH",
                    "Advanced Bash / Shell Scripting for system automation and log analysis",
                    "Git & GitHub Advanced Workflows: Branching strategies, Merge conflicts, GitOps fundamentals, Submodules",
                    "Web Servers configuration: Nginx reverse proxies, SSL certificates, load balancing"
                ]
            },
            {
                title: "Phase 2: Docker Containerization & Microservices Packaging",
                duration: "Weeks 5 - 8",
                topics: [
                    "Containerization fundamentals: Namespaces, Cgroups, Docker Engine architecture",
                    "Writing production Dockerfiles: Multi-stage builds, Layer caching, Base image hardening",
                    "Docker Networking, Storage Volumes, Bind Mounts, and Docker Compose orchestration",
                    "Security scanning with Trivy, Docker Hub & AWS ECR registries"
                ]
            },
            {
                title: "Phase 3: Kubernetes Cluster Orchestration & Helm Packaging",
                duration: "Weeks 9 - 14",
                topics: [
                    "Kubernetes Architecture: Control Plane, Kubelet, Kube-proxy, etcd, Pods, Deployments, Services",
                    "ConfigMaps, Secrets, Ingress Controllers, Persistent Volumes (PV/PVC), Namespaces",
                    "Advanced Scheduling, Horizontal Pod Autoscaler (HPA), Rolling Updates, Rollbacks",
                    "Package Management with Helm Charts and GitOps Continuous Delivery with ArgoCD"
                ]
            },
            {
                title: "Phase 4: CI/CD Pipelines, Terraform IaC & Observability",
                duration: "Weeks 15 - 20",
                topics: [
                    "Automating CI/CD Pipelines with Jenkins, Jenkinsfile pipelines, and GitHub Actions",
                    "Infrastructure as Code (IaC) with Terraform: Providers, State files, Modules, AWS resources",
                    "Configuration Management with Ansible Playbooks and Dynamic Inventories",
                    "Monitoring and Logging with Prometheus metrics, Grafana dashboards, and ELK / Loki stack",
                    "DevOps Capstone Project evaluation, System Design interviews, and corporate placement drives"
                ]
            }
        ],
        projects: [
            {
                title: "End-to-End Automated GitOps CI/CD Pipeline on Kubernetes",
                desc: "Configured a zero-touch deployment pipeline with GitHub Actions, SonarQube quality gates, Docker builds, and ArgoCD sync to K8s.",
                tags: ["Kubernetes", "GitHub Actions", "ArgoCD", "Docker"],
                image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Multi-Cloud Infrastructure Automation with Terraform & AWS",
                desc: "Automated complete AWS production cluster setup with VPC, EKS, RDS, and load balancers using modular Terraform code.",
                tags: ["Terraform", "AWS EKS", "IaC", "Jenkins"],
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Production Observability & Alerting Stack with Prometheus & Grafana",
                desc: "Deployed cluster-wide monitoring tracking container CPU/memory usage, node health, and automated PagerDuty alert webhooks.",
                tags: ["Prometheus", "Grafana", "Node Exporter", "Alertmanager"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Automated Server Fleet Configuration with Ansible",
                desc: "Scripted idempotent Ansible playbooks securing 50+ Linux nodes with Nginx, firewall rules, and automated patch management.",
                tags: ["Ansible", "Linux", "Security Hardening", "Nginx"],
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Master Docker containerization, Kubernetes clusters, and Helm charts",
            "Design and execute enterprise CI/CD pipelines with GitHub Actions and Jenkins",
            "Automate cloud infrastructure with Terraform Infrastructure as Code (IaC)",
            "Build full-stack observability pipelines using Prometheus and Grafana",
            "Receive Govt. MSME recognized certificate and high-tier placement support"
        ],
        careerRoles: [
            { title: "DevOps Engineer", salary: "₹7.5 LPA - ₹20.0 LPA" },
            { title: "Site Reliability Engineer (SRE)", salary: "₹8.0 LPA - ₹22.0 LPA" },
            { title: "Cloud & Infrastructure Engineer", salary: "₹6.5 LPA - ₹16.0 LPA" },
            { title: "Build & Release Specialist", salary: "₹6.0 LPA - ₹14.0 LPA" }
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default DevOps;
