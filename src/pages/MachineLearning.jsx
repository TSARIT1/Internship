import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, CheckCircle, ChevronDown, ChevronUp, Clock,
    Code, Database, Layout, Server, Award, Users,
    Zap, ArrowLeft, ArrowRight, Brain, Cloud, Shield
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MachineLearning = () => {
    const data = {
        title: "Machine Learning Internship",
        description: "Learn to build and deploy machine learning models with Python and TensorFlow.",
        duration: "5 Months",
        level: "Advanced",
        heroImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        curriculum: [
            {
                title: "Python & Math for ML",
                duration: "4 weeks",
                topics: [
                    "Advanced Python Programming",
                    "Linear Algebra & Calculus",
                    "Probability & Statistics",
                    "NumPy & Pandas Mastery",
                    "Data Preprocessing Pipelines"
                ]
            },
            {
                title: "Supervised Learning",
                duration: "5 weeks",
                topics: [
                    "Linear & Logistic Regression",
                    "Decision Trees & Random Forests",
                    "Support Vector Machines (SVM)",
                    "Gradient Boosting (XGBoost, LightGBM)",
                    "Model Evaluation & Tuning"
                ]
            },
            {
                title: "Unsupervised & Deep Learning",
                duration: "6 weeks",
                topics: [
                    "Clustering Algorithms (K-Means, DBSCAN)",
                    "Dimensionality Reduction (PCA)",
                    "Neural Networks Fundamentals",
                    "TensorFlow & Keras API",
                    "Convolutional Neural Networks (CNN)"
                ]
            },
            {
                title: "Deployment & MLOps",
                duration: "5 weeks",
                topics: [
                    "Model Serialization",
                    "Flask/FastAPI for Model Serving",
                    "Dockerizing ML Applications",
                    "CI/CD for Machine Learning",
                    "Cloud Deployment (AWS/GCP)"
                ]
            }
        ],
        features: [
            { icon: Brain, title: "Deep Learning", desc: "Master Neural Networks" },
            { icon: Code, title: "Python First", desc: "Advanced Python coding" },
            { icon: Database, title: "Big Data", desc: "Handle large datasets" },
            { icon: Server, title: "Model Deployment", desc: "Productionize your models" },
            { icon: Users, title: "Code Reviews", desc: "Feedback from Senior Devs" },
            { icon: BookOpen, title: "Research Papers", desc: "Implement latest research" }
        ],
        projects: [
            {
                title: "Image Classification",
                desc: "CNN model for medical imaging diagnosis",
                tags: ["Deep Learning", "CNN", "TensorFlow"],
                image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Stock Price Prediction",
                desc: "LSTM model for time-series forecasting",
                tags: ["RNN", "LSTM", "Time Series"],
                image: "https://images.unsplash.com/photo-1611974765215-fadbf4c3f297?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Recommendation Engine",
                desc: "Collaborative filtering for e-commerce",
                tags: ["Recommender Systems", "Matrix Factorization"],
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Expertise in building ML algorithms from scratch",
            "Proficiency with TensorFlow and Keras Deep Learning",
            "Experience deploying models to production",
            "Understanding of MLOps best practices",
            "Strong portfolio of AI/ML projects",
            "Implement Natural Language Processing (NLP) solutions",
            "Work with Time Series Analysis",
            "Optimize neural networks for performance"
        ]
    };

    const tools = [
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
        { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
        { name: "Scikit-Learn", icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" },
        { name: "Pandas", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
        { name: "OpenCV", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
        { name: "Keras", icon: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg" },
        { name: "Jupyter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original-wordmark.svg" }
    ];

    const [openSection, setOpenSection] = useState(0);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-100">
            <Header />

            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={data.heroImage}
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-300 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border border-purple-500/20 mb-8 backdrop-blur-sm">
                        <Award size={16} /> Certified Program
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                        {data.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                        {data.description}
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-600/30 flex items-center gap-2">
                            Enroll Now <ArrowRight size={20} />
                        </button>

                    </div>
                </div>
            </div>

            {/* Program Outcomes */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Program Outcomes</h2>
                        <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.outcomes.map((outcome, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                    <CheckCircle size={24} />
                                </div>
                                <p className="text-slate-700 font-medium leading-relaxed">{outcome}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What You'll Learn */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">What You'll Learn</h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Dive deep into the world of algorithms and neural networks. Our curriculum covers everything from statistical foundations to deep learning deployment.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Master Supervised and Unsupervised Learning",
                                    "Build Neural Networks with TensorFlow & Keras",
                                    "Implement Computer Vision pipelines",
                                    "Deploy ML models using Flask & Docker",
                                    "Analyze large datasets with Pandas"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                            <CheckCircle size={14} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-purple-600 rounded-3xl rotate-3 opacity-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                alt="Machine Learning"
                                className="relative rounded-3xl shadow-2xl z-10"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Provide */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Provide</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Comprehensive support to launch your AI career.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.features.map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all text-center group">
                                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools & Technologies */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Tools & Technologies Covered</h2>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {tools.map((tool, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3 group">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-2">
                                    <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain" />
                                </div>
                                <span className="font-semibold text-slate-700">{tool.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Curriculum & Projects */}
            <div className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Curriculum */}
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <BookOpen className="text-purple-600" /> Comprehensive Curriculum
                            </h2>
                            <div className="space-y-4">
                                {data.curriculum.map((section, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                        <button
                                            onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                                            className={`w-full flex items-center justify-between p-6 text-left transition-colors ${openSection === idx ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${openSection === idx ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-500 border-slate-300'}`}>
                                                    {idx + 1}
                                                </div>
                                                <span className={`font-bold text-lg ${openSection === idx ? 'text-purple-700' : 'text-slate-800'}`}>{section.title}</span>
                                            </div>
                                            {openSection === idx ? <ChevronUp size={20} className="text-purple-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                                        </button>
                                        {openSection === idx && (
                                            <div className="p-6 pt-0 pl-[4.5rem] border-t border-slate-100">
                                                <ul className="space-y-3 mt-4">
                                                    {section.topics.map((topic, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></div>
                                                            {topic}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects */}
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <Code className="text-purple-600" /> Capstone Projects
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {data.projects.map((project, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                                        <div className="h-48 overflow-hidden">
                                            <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-xl text-slate-900 mb-2">{project.title}</h3>
                                            <p className="text-slate-500 mb-4 text-sm">{project.desc}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag, t) => (
                                                    <span key={t} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-100">
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

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center relative overflow-hidden mb-8">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Award size={120} />
                                </div>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Fees</p>
                                <div className="flex items-center justify-center gap-2 mb-8">
                                    <span className="text-5xl font-bold text-slate-900">₹5,999</span>
                                    <span className="text-slate-400 line-through text-lg">₹9,999</span>
                                </div>
                                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:-translate-y-1 mb-4 flex items-center justify-center gap-2">
                                    Enroll Now <ArrowRight size={18} />
                                </button>
                                <p className="text-xs text-slate-400">Limited seats available for next batch</p>
                            </div>

                            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-4">Questions?</h3>
                                    <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                                        Speak to our career counselors to get a personalized roadmap.
                                    </p>
                                    <a href="mailto:nnikhiln2002@gmail.com?subject=Inquiry%20about%20Machine%20Learning%20Internship&body=Hello%20Team%2C%0A%0AI%20am%20interested%20in%20the%20Machine%20Learning%20Internship%20Program.%20Please%20provide%20more%20details%20regarding%20the%20enrollment%20process.%0A%0AThanks" className="block w-full text-center bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm">
                                        Book Free Session
                                    </a>
                                </div>
                                <div className="absolute bottom-[-20%] right-[-20%] w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MachineLearning;
