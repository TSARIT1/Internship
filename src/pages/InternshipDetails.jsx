import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    BookOpen, CheckCircle, ChevronDown, ChevronUp, Clock,
    Code, Database, Layout, Server, Award, Users,
    Zap, ArrowLeft, ArrowRight, Brain, Cloud, Shield
} from 'lucide-react';

const InternshipDetails = () => {
    // In a real app, you would fetch this based on the ID
    const dummyData = {
        title: "Data Science Internship",
        description: "Master the art of data with our comprehensive Data Science internship program.",
        duration: "4 Months",
        level: "Intermediate",
        heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        curriculum: [
            {
                title: "Python for Data Science",
                duration: "4 weeks",
                topics: [
                    "Python Basics for Data Analysis",
                    "NumPy for Numerical Computing",
                    "Pandas for Data Manipulation",
                    "Data Visualization Basics",
                    "Working with Jupyter Notebooks"
                ]
            },
            {
                title: "Data Analysis & Visualization",
                duration: "4 weeks",
                topics: [
                    "Exploratory Data Analysis (EDA)",
                    "Matplotlib & Seaborn",
                    "Plotly for Interactive Visuals",
                    "Data Cleaning Techniques",
                    "Feature Engineering"
                ]
            },
            {
                title: "Machine Learning Fundamentals",
                duration: "5 weeks",
                topics: [
                    "Supervised vs Unsupervised Learning",
                    "Regression Algorithms",
                    "Classification Algorithms",
                    "Model Evaluation Metrics",
                    "Scikit-Learn Library"
                ]
            },
            {
                title: "Advanced Topics",
                duration: "5 weeks",
                topics: [
                    "Natural Language Processing (NLP)",
                    "Neural Networks Basics",
                    "Time Series Analysis",
                    "Model Deployment",
                    "Capstone Project"
                ]
            }
        ],
        features: [
            { icon: Database, title: "Real Datasets", desc: "Work with datasets from various industries" },
            { icon: Brain, title: "ML Projects", desc: "Hands on machine learning projects" },
            { icon: Layout, title: "Visualization Tools", desc: "Master visualization libraries" },
            { icon: Users, title: "Expert Mentors", desc: "Learn from data science professionals" },
            { icon: Cloud, title: "Cloud Labs", desc: "Access to cloud computing resources" },
            { icon: BookOpen, title: "Portfolio Building", desc: "Develop a strong project portfolio" }
        ],
        projects: [
            {
                title: "Customer Segmentation",
                desc: "Cluster analysis for marketing optimization",
                tags: ["K-Means", "PCA", "RFM Analysis"],
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "House Price Prediction",
                desc: "Regression model for real estate pricing",
                tags: ["Linear Regression", "Feature Engineering", "Grid Search"],
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Sentiment Analysis",
                desc: "NLP model for product reviews",
                tags: ["NLTK", "TF-IDF", "Naive Bayes"],
                image: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Master Python for data analysis and visualization",
            "Build predictive models using machine learning",
            "Work with real-world datasets",
            "Develop end-to-end data science projects",
            "Gain industry-recognized certification"
        ]
    };

    const [openSection, setOpenSection] = useState(0);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.05),transparent_50%)]"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="relative bg-slate-900 text-white pt-32 pb-24 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={dummyData.heroImage}
                            alt="Hero Background"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent h-24 bottom-0 z-10"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <Link to="/" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:bg-white/20">
                            <ArrowLeft size={16} className="mr-2" /> Back to Home
                        </Link>

                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/30 mb-6 backdrop-blur-sm">
                                <Award size={14} /> Certified Program
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight glass-text-shadow">
                                {dummyData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
                                {dummyData.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 text-white font-medium">
                                    <Clock size={18} className="text-blue-400" /> {dummyData.duration}
                                </span>
                                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 text-white font-medium">
                                    <CheckCircle size={18} className="text-amber-400" /> {dummyData.level}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 -mt-16 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Curriculum & Projects */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* What We Provide Grid */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Zap className="text-amber-500" /> Program Highlights
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {dummyData.features.map((feature, idx) => (
                                        <div key={idx} className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                            <feature.icon className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                            <h3 className="font-bold text-slate-800 text-sm mb-1">{feature.title}</h3>
                                            <p className="text-xs text-slate-500 leading-snug">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Curriculum Accordion */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <BookOpen className="text-blue-500" /> Course Curriculum
                                </h2>
                                <div className="space-y-4">
                                    {dummyData.curriculum.map((section, idx) => (
                                        <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                            <button
                                                onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                                                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${openSection === idx ? 'bg-slate-50/50' : 'hover:bg-slate-50/50'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${openSection === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-bold text-lg ${openSection === idx ? 'text-blue-600' : 'text-slate-900'}`}>{section.title}</h3>
                                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">{section.duration}</p>
                                                    </div>
                                                </div>
                                                {openSection === idx ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                                            </button>

                                            <div className={`transition-all duration-300 ease-in-out ${openSection === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                                <div className="p-6 pt-2 border-t border-slate-100/50 pl-[4.5rem]">
                                                    <ul className="space-y-3">
                                                        {section.topics.map((topic, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0"></div>
                                                                {topic}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Project Examples */}
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Code className="text-purple-500" /> Real-World Projects
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {dummyData.projects.map((project, idx) => (
                                        <div key={idx} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                                            <div className="h-40 overflow-hidden relative">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{project.desc}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tags.map((tag, i) => (
                                                        <span key={i} className="text-xs font-semibold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Sticky Sidebar for Enrollment */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* CTA Card */}
                                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Award size={120} />
                                    </div>

                                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Program Fees</p>
                                    <div className="flex items-center justify-center gap-1 mb-6">
                                        <span className="text-4xl font-bold text-slate-900">₹4,999</span>
                                        <span className="text-slate-400 line-through text-sm">₹8,999</span>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                                        Enroll Now <ArrowRight size={18} />
                                    </button>
                                    <p className="text-xs text-slate-400 mt-4">Top 5% performers get paid internships</p>
                                </div>

                                {/* Outcomes Card */}
                                <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100 p-6">
                                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">What you will achieve</h3>
                                    <ul className="space-y-3">
                                        {dummyData.outcomes.map((outcome, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                                <div className="mt-0.5 text-green-500 shrink-0">
                                                    <CheckCircle size={16} />
                                                </div>
                                                {outcome}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Mentor Snippet - Visual refinement */}
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-bold mb-2">Need Career Guidance?</h3>
                                        <p className="text-slate-300 text-sm mb-4">Book a free 15-min counseling session with our mentors.</p>
                                        <button className="text-xs font-bold bg-white text-slate-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                            Talk to Mentor
                                        </button>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipDetails;
