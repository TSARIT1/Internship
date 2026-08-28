import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Database, Cloud, Code, Server, Coffee, Shield, Video, Globe, Lock, Tablet, Layout, Sparkles, CheckCircle2, Download, Filter, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotlightCard from './ui/SpotlightCard';
import EnrollButton from './EnrollButton';
import LeadModal from './LeadModal';
import { getAllCourses } from '../services/studentApi';

const iconMap = {
    'Brain': Brain,
    'Database': Database,
    'Cloud': Cloud,
    'Code': Code,
    'Server': Server,
    'Coffee': Coffee,
    'Shield': Shield,
    'Video': Video,
    'Globe': Globe,
    'Lock': Lock,
    'Tablet': Tablet,
    'Layout': Layout
};

const courseImages = {
    'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'Machine Learning': 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80',
    'AI': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    'MERN Stack': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    'DevOps': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    'Java Full Stack': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    'Python Programming': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    'AWS Cloud Computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'Cyber Security': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
};

const defaultCourseData = [
    {
        id: 1,
        name: "Data Science",
        slug: "/data-science",
        domain: "Data & AI",
        duration: "4-6 Months",
        level: "Beginner to Advanced",
        description: "Master EDA, Python, NumPy, Pandas, predictive modeling, Tableau dashboards, and end-to-end data pipelines.",
        iconName: "Database",
        gradient: "from-blue-600 to-cyan-500",
        tags: ["Python", "Pandas", "EDA", "Tableau", "SQL"]
    },
    {
        id: 2,
        name: "Machine Learning",
        slug: "/machine-learning",
        domain: "Data & AI",
        duration: "4-6 Months",
        level: "Intermediate",
        description: "Build predictive algorithms, neural networks, computer vision models, and deploy Scikit-learn & PyTorch models.",
        iconName: "Brain",
        gradient: "from-purple-600 to-pink-500",
        tags: ["Supervised ML", "Deep Learning", "PyTorch", "NLP", "Flask"]
    },
    {
        id: 3,
        name: "AI",
        slug: "/ai",
        domain: "Data & AI",
        duration: "5-6 Months",
        level: "Advanced",
        description: "Master Generative AI, Large Language Models (LLMs), Prompt Engineering, Transformers, LangChain, and RAG architectures.",
        iconName: "Code",
        gradient: "from-amber-500 to-orange-500",
        tags: ["GenAI", "LLMs", "LangChain", "Transformers", "RAG"]
    },
    {
        id: 4,
        name: "MERN Stack",
        slug: "/mern-stack",
        domain: "Web Development",
        duration: "4-6 Months",
        level: "Beginner to Intermediate",
        description: "Build full stack scalable web apps with React 19, Node.js, Express, MongoDB, Redux Toolkit, and Tailwind CSS.",
        iconName: "Layout",
        gradient: "from-emerald-500 to-teal-600",
        tags: ["React 19", "Node.js", "Express", "MongoDB", "Tailwind"]
    },
    {
        id: 5,
        name: "Java Full Stack",
        slug: "/java-full-stack",
        domain: "Web Development",
        duration: "6 Months",
        level: "Beginner to Enterprise",
        description: "Enterprise-grade software development with Core Java, Spring Boot, Spring Cloud, Hibernate, Microservices, and React.",
        iconName: "Coffee",
        gradient: "from-blue-700 to-indigo-600",
        tags: ["Spring Boot", "Microservices", "Hibernate", "React", "Kafka"]
    },
    {
        id: 6,
        name: "Python Programming",
        slug: "/python-programming",
        domain: "Web Development",
        duration: "4 Months",
        level: "Beginner",
        description: "Master Python fundamentals, OOP, Django, FastAPI, Web Scraping, automation bots, and RESTful API engineering.",
        iconName: "Code",
        gradient: "from-yellow-500 to-amber-600",
        tags: ["Python 3.12", "Django", "FastAPI", "Automation", "REST APIs"]
    },
    {
        id: 7,
        name: "AWS Cloud Computing",
        slug: "/aws-cloud-computing",
        domain: "Cloud & DevOps",
        duration: "5 Months",
        level: "Intermediate",
        description: "AWS Certified Solutions Architect track covering EC2, S3, VPC, IAM, Serverless Lambda, RDS, and CloudFormation.",
        iconName: "Cloud",
        gradient: "from-orange-500 to-red-500",
        tags: ["AWS Architecture", "EC2 & S3", "VPC Networking", "Lambda", "IAM"]
    },
    {
        id: 8,
        name: "DevOps",
        slug: "/devops",
        domain: "Cloud & DevOps",
        duration: "5-6 Months",
        level: "Advanced",
        description: "Automate delivery pipelines with Docker containerization, Kubernetes clusters, Jenkins CI/CD, Terraform, and Ansible.",
        iconName: "Server",
        gradient: "from-red-500 to-rose-600",
        tags: ["Docker", "Kubernetes", "CI/CD", "Terraform", "GitHub Actions"]
    },
    {
        id: 9,
        name: "Cyber Security",
        slug: "/cyber-security",
        domain: "Security",
        duration: "5-6 Months",
        level: "Advanced",
        description: "Defend systems against cyber threats with Ethical Hacking, Kali Linux, Penetration Testing, Wireshark, and SOC analysis.",
        iconName: "Shield",
        gradient: "from-teal-500 to-emerald-600",
        tags: ["Ethical Hacking", "Penetration Testing", "SOC", "OWASP", "Wireshark"]
    }
];

const InternshipCards = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCourseForModal, setSelectedCourseForModal] = useState('Data Science');
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Data & AI', 'Web Development', 'Cloud & DevOps', 'Security'];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getAllCourses();
                if (response.success && response.data && response.data.length > 0) {
                    // Merge with our rich local metadata
                    const merged = defaultCourseData.map(def => {
                        const apiMatch = response.data.find(a => a.name?.toLowerCase() === def.name?.toLowerCase());
                        return {
                            ...def,
                            ...(apiMatch || {})
                        };
                    });
                    setCourses(merged);
                } else {
                    setCourses(defaultCourseData);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
                setCourses(defaultCourseData);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = selectedCategory === 'All'
        ? courses
        : courses.filter(c => {
            if (selectedCategory === 'Data & AI') return c.name.includes('Data') || c.name.includes('Machine') || c.name.includes('AI');
            if (selectedCategory === 'Web Development') return c.name.includes('MERN') || c.name.includes('Java') || c.name.includes('Python');
            if (selectedCategory === 'Cloud & DevOps') return c.name.includes('AWS') || c.name.includes('DevOps');
            if (selectedCategory === 'Security') return c.name.includes('Cyber') || c.name.includes('Security');
            return true;
        });

    return (
        <section id="internships" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100 relative overflow-hidden border-t border-slate-200 font-sans">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4">
                            <Sparkles size={14} className="text-amber-500" />
                            <span>TSAR IT INTERNSHIP TRACKS • 2026</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 mb-6 tracking-tight">
                            Industry-Driven <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">Tech Internships</span>
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                            Each internship includes <strong>live technical lectures, real-time enterprise capstone projects, 1-on-1 code reviews, verified technical certifications, and guaranteed placement support</strong>.
                        </p>
                    </motion.div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((item, index) => {
                        const IconComponent = iconMap[item.iconName] || Code;
                        const cardImage = courseImages[item.name] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';

                        return (
                            <motion.div
                                key={item.id || index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <SpotlightCard className="h-full group hover:-translate-y-2 transition-all duration-300 border-slate-200 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-600/15 flex flex-col">
                                    {/* Card Top Image */}
                                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                                        <img
                                            src={cardImage}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                                        {/* Icon Badge */}
                                        <div className={`absolute top-4 left-4 w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.gradient || 'from-blue-600 to-indigo-600'} text-white shadow-lg`}>
                                            <IconComponent size={24} />
                                        </div>

                                        {/* Level Badge */}
                                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] font-bold">
                                            {item.level}
                                        </div>

                                        {/* Duration Tag */}
                                        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white font-semibold">
                                            <Clock size={13} className="text-teal-400" />
                                            <span>{item.duration}</span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 sm:p-7 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                                                <Star size={13} className="fill-amber-400 text-amber-400" />
                                                <span>4.9</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                                            {item.description}
                                        </p>

                                        {/* Tech Stack Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {item.tags?.map((tag, tagIdx) => (
                                                <span
                                                    key={tagIdx}
                                                    className="bg-slate-100 border border-slate-200/80 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Dual CTAs */}
                                        <div className="mt-auto space-y-2.5 pt-4 border-t border-slate-100">
                                            <div className="flex gap-2">
                                                <EnrollButton
                                                    course={item.name}
                                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-600/20 text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
                                                >
                                                    Enroll Now
                                                </EnrollButton>
                                                <Link
                                                    to={item.slug || `/internship/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="flex-1 inline-flex items-center justify-center gap-1 font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200/80 py-2.5 rounded-xl transition-colors"
                                                >
                                                    <span>Details</span>
                                                    <ArrowRight size={14} />
                                                </Link>
                                            </div>

                                            {/* Download Syllabus Lead Trigger */}
                                            <button
                                                onClick={() => {
                                                    setSelectedCourseForModal(item.name);
                                                    setIsLeadModalOpen(true);
                                                }}
                                                className="w-full py-2 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200/60 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                            >
                                                <Download size={13} />
                                                <span>Download Syllabus & Free Demo</span>
                                            </button>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Lead Modal */}
            <LeadModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                defaultCourse={selectedCourseForModal}
                title={`Download ${selectedCourseForModal} Syllabus & Demo`}
            />
        </section>
    );
};

export default InternshipCards;
