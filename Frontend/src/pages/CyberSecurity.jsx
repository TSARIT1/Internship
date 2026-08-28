import React from 'react';
import CourseTemplate from '../components/CourseTemplate';

const CyberSecurity = () => {
    const courseData = {
        title: "Cyber Security",
        description: "Defend networks, applications, and cloud infrastructures. Master Ethical Hacking, Kali Linux, Penetration Testing, OWASP Top 10, Wireshark, and SOC analysis.",
        duration: "5-6 Months",
        level: "Intermediate to Advanced",
        heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80",
        tools: [
            "Kali Linux", "Wireshark", "Nmap & Zenmap", "Burp Suite Pro", "Metasploit",
            "OWASP ZAP", "Splunk & SIEM", "Snort IDS/IPS", "John the Ripper", "Hydra"
        ],
        curriculum: [
            {
                title: "Phase 1: Cyber Security Fundamentals & Networking Defense",
                duration: "Weeks 1 - 4",
                topics: [
                    "Introduction to Information Security: CIA Triad, Threat Actors, Attack Vectors, Defense in Depth",
                    "Networking Foundations for Security: OSI & TCP/IP models, Packet Anatomy, DNS, Subnetting",
                    "Network Traffic Analysis with Wireshark: Packet Captures, Protocol Inspection, Anomaly Detection",
                    "Port Scanning & Network Reconnaissance using Nmap, Masscan, and OSINT gathering techniques"
                ]
            },
            {
                title: "Phase 2: Linux Security Hardening, Cryptography & Privilege Escalation",
                duration: "Weeks 5 - 8",
                topics: [
                    "Kali Linux environment setup, command-line tool mastery, and bash automation",
                    "Applied Cryptography: Symmetric vs Asymmetric encryption, Hashing (SHA/MD5), SSL/TLS, PKI",
                    "System Vulnerability Assessment, Password Cracking (Hashcat, John the Ripper), Exploitation basics",
                    "Linux and Windows Privilege Escalation techniques and access maintenance"
                ]
            },
            {
                title: "Phase 3: Web Application Penetration Testing (OWASP Top 10)",
                duration: "Weeks 9 - 14",
                topics: [
                    "Web Architecture & HTTP/HTTPS inspection using Burp Suite Proxy and Repeater",
                    "OWASP Top 10 Vulnerabilities: SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF, IDOR, SSRF",
                    "Authentication Bypass, Broken Access Control, Security Misconfigurations",
                    "API Penetration Testing, Automated Vulnerability Scanning with OWASP ZAP & Nikto",
                    "Writing comprehensive Penetration Testing Reports with remediation guidelines"
                ]
            },
            {
                title: "Phase 4: SOC Operations, Incident Response & Live Cyber Range Capstone",
                duration: "Weeks 15 - 20",
                topics: [
                    "Security Operations Center (SOC) workflows, SIEM log analysis using Splunk and ELK",
                    "Intrusion Detection & Prevention Systems (IDS/IPS) configuration with Snort / Suricata",
                    "Incident Response, Digital Forensics fundamentals, and Malware triage",
                    "Live Cyber Range Capstone (Capture The Flag - CTF) challenges and placement drives"
                ]
            }
        ],
        projects: [
            {
                title: "Enterprise Web Application Penetration Test & Audit",
                desc: "Conducted an end-to-end black-box penetration audit finding critical SQLi, IDOR, and privilege escalation vulnerabilities with full CVE reporting.",
                tags: ["Burp Suite", "OWASP Top 10", "Pen Testing", "Kali Linux"],
                image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "SOC SIEM Threat Hunting & Log Analytics Pipeline",
                desc: "Configured Splunk SIEM dashboards ingesting 50k+ daily logs, generating automated alerts for brute-force and credential stuffing attacks.",
                tags: ["Splunk", "SIEM", "SOC Operations", "Threat Hunting"],
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Network Intrusion Detection & Snort Rule Engine",
                desc: "Deployed a network security appliance with Snort IDS detecting port scans, SYN floods, and malicious payload signatures in real time.",
                tags: ["Snort IDS", "Wireshark", "Network Defense", "Linux"],
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Corporate Phishing Simulation & Security Awareness Portal",
                desc: "Engineered an automated educational phishing simulation platform tracking employee vulnerability rates and security compliance.",
                tags: ["Social Engineering", "OSINT", "Python", "Risk Assessment"],
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Perform comprehensive vulnerability assessments and ethical penetration testing",
            "Master Kali Linux security tools: Nmap, Wireshark, Burp Suite, and Metasploit",
            "Identify and remediate OWASP Top 10 Web Application security flaws",
            "Operate SOC monitoring and analyze security logs with Splunk SIEM",
            "Receive industry-recognized verified certificate and high-demand corporate placement support"
        ],
        careerRoles: [
            { title: "Cyber Security Analyst", salary: "₹6.0 LPA - ₹16.0 LPA" },
            { title: "Ethical Hacker / Pen Tester", salary: "₹7.0 LPA - ₹18.0 LPA" },
            { title: "SOC Analyst (L1/L2)", salary: "₹5.5 LPA - ₹14.0 LPA" },
            { title: "Information Security Consultant", salary: "₹7.5 LPA - ₹20.0 LPA" }
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default CyberSecurity;
