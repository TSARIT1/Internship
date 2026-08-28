import React from 'react';
import CourseTemplate from '../components/CourseTemplate';

const MernStack = () => {
    const courseData = {
        title: "MERN Stack",
        description: "Become a proficient Full Stack Web Developer. Master MongoDB, Express.js, React 19, Node.js, Redux Toolkit, Next.js, and Cloud Deployment.",
        duration: "4-6 Months",
        level: "Beginner to Intermediate",
        heroImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80",
        tools: [
            "React 19", "Node.js", "Express.js", "MongoDB & Mongoose", "Redux Toolkit",
            "Tailwind CSS", "Next.js", "JWT & OAuth", "WebSockets / Socket.io", "Docker & Vercel"
        ],
        curriculum: [
            {
                title: "Phase 1: Modern JavaScript (ES6+), React 19 & Frontend Architecture",
                duration: "Weeks 1 - 4",
                topics: [
                    "Modern JavaScript (ES6+): Closures, Promises, Async/Await, Array Methods, Modules",
                    "React 19 Foundations: Components, Props, State, JSX, Lifecycle Hooks, Custom Hooks",
                    "State Management with Redux Toolkit and React Context API",
                    "Styling with Tailwind CSS, Framer Motion animations, and Responsive Design",
                    "Client-side routing with React Router 7, Protected Routes, and Layouts"
                ]
            },
            {
                title: "Phase 2: Backend Development with Node.js, Express & MongoDB",
                duration: "Weeks 5 - 8",
                topics: [
                    "Node.js Architecture: Event Loop, Streams, File System, Buffers, NPM ecosystem",
                    "RESTful API design with Express.js: Middlewares, Error Handling, Routing",
                    "MongoDB & Mongoose ODM: Schemas, Models, CRUD, Aggregations, Indexing",
                    "Authentication & Security: JWT tokens, Cookies, bcrypt password hashing, CORS, rate limiting"
                ]
            },
            {
                title: "Phase 3: Real-Time Features, Payment Gateways & Full-Stack Integration",
                duration: "Weeks 9 - 14",
                topics: [
                    "Real-Time bidirectional communication with WebSockets and Socket.io",
                    "Integrating Payment Gateways (Razorpay / Stripe) with Webhooks and verification",
                    "Cloud File Storage integration with AWS S3 / Cloudinary for multimedia uploads",
                    "Performance Optimization, Lazy Loading, Code Splitting, and Caching with Redis"
                ]
            },
            {
                title: "Phase 4: Full Stack Enterprise Capstone, Testing & Cloud Deployment",
                duration: "Weeks 15 - 18",
                topics: [
                    "Containerization with Docker, deploying backend to Render/AWS EC2 and frontend to Vercel",
                    "End-to-End Enterprise Capstone Project development with live sprint reviews",
                    "Resume building, GitHub repository curation, and Full Stack technical mock interviews",
                    "Exclusive recruitment drives and corporate interview schedules"
                ]
            }
        ],
        projects: [
            {
                title: "Scalable B2B SaaS Project Management & Collaboration Platform",
                desc: "Built a Jira/Trello clone featuring drag-and-drop boards, live task updates via WebSockets, and role-based permissions.",
                tags: ["React 19", "Node.js", "Socket.io", "MongoDB"],
                image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Enterprise Multi-Vendor E-Commerce Marketplace",
                desc: "Engineered a full-featured e-commerce ecosystem with shopping cart, Razorpay payment capture, admin dashboard, and order tracking.",
                tags: ["MERN", "Redux Toolkit", "Razorpay", "AWS S3"],
                image: "https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Real-Time Video Conferencing & Team Chat Application",
                desc: "Developed a WebRTC and Socket.io powered virtual collaboration suite with screen sharing and instant messaging.",
                tags: ["WebRTC", "Socket.io", "Express", "Tailwind CSS"],
                image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "On-Demand Food Delivery & Real-Time Driver Tracking App",
                desc: "Full-stack food ordering platform with live GPS driver geolocation tracking and automated invoice generation.",
                tags: ["React", "Leaflet Maps", "Node.js", "JWT Auth"],
                image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Build complete, production-ready Full Stack web applications from scratch",
            "Master React 19, modern State Management, Node.js, Express, and MongoDB",
            "Integrate secure authentication, payment gateways, and real-time WebSockets",
            "Deploy applications to cloud environments using Docker, Vercel, and AWS",
            "Receive industry-recognized verified certificate and full placement assistance"
        ],
        careerRoles: [
            { title: "Full Stack Developer (MERN)", salary: "₹6.0 LPA - ₹15.0 LPA" },
            { title: "Frontend Engineer (React.js)", salary: "₹5.0 LPA - ₹12.0 LPA" },
            { title: "Backend Engineer (Node.js/Express)", salary: "₹5.5 LPA - ₹14.0 LPA" },
            { title: "Software Engineer (Web Applications)", salary: "₹6.0 LPA - ₹16.0 LPA" }
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default MernStack;
