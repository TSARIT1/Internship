import React from 'react';
import CourseTemplate from '../components/CourseTemplate';

const AI = () => {
    const courseData = {
        title: "AI",
        description: "Explore the frontiers of Artificial Intelligence, Generative AI, Large Language Models (LLMs), LangChain, Vector Databases, and Agentic Workflows.",
        duration: "5-6 Months",
        level: "Advanced",
        heroImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1600&q=80",
        tools: [
            "OpenAI API", "Google Gemini API", "LangChain", "LlamaIndex", "Pinecone & ChromaDB",
            "HuggingFace", "Transformers (BERT/GPT)", "PyTorch", "Ollama", "FastAPI"
        ],
        curriculum: [
            {
                title: "Phase 1: Foundations of Artificial Intelligence & Neural Architectures",
                duration: "Weeks 1 - 4",
                topics: [
                    "Overview of Classical AI vs Modern Generative AI",
                    "Deep Neural Networks, Attention Mechanisms, and Feedforward Networks",
                    "The Transformer Architecture: Self-Attention, Multi-Head Attention, Positional Encoding",
                    "Pre-trained Foundation Models: GPT, LLaMA, Mistral, Gemini, Claude overview",
                    "Tokenization, Embeddings, Context Windows, and Temperature tuning"
                ]
            },
            {
                title: "Phase 2: Prompt Engineering, LangChain & Autonomous Agents",
                duration: "Weeks 5 - 8",
                topics: [
                    "Advanced Prompt Engineering: Few-Shot, Chain-of-Thought (CoT), ReAct prompting",
                    "LangChain Framework: Chains, Prompt Templates, Memory, Tools, Output Parsers",
                    "Building Autonomous AI Agents with Tool Calling (Function Calling) capabilities",
                    "Multi-Agent Architectures (CrewAI / AutoGen) for automated problem solving"
                ]
            },
            {
                title: "Phase 3: Retrieval Augmented Generation (RAG) & Vector Databases",
                duration: "Weeks 9 - 14",
                topics: [
                    "RAG Architecture: Document Loaders, Chunking Strategies, Vector Embeddings",
                    "Working with Vector Databases: Pinecone, ChromaDB, FAISS, Weaviate",
                    "Advanced RAG: Semantic Hybrid Search, Reranking (Cohere), Parent Document Retrieval",
                    "Fine-Tuning Open Source LLMs (PEFT / LoRA) with HuggingFace & Unsloth",
                    "Evaluating LLM Applications: Hallucination detection, Ragas framework, TruLens"
                ]
            },
            {
                title: "Phase 4: Enterprise Generative AI Capstone & Deployment",
                duration: "Weeks 15 - 18",
                topics: [
                    "Full-Stack GenAI Application Development with FastAPI backend and React frontend",
                    "Local LLM deployment using Ollama and vLLM inference server",
                    "Comprehensive Enterprise AI Capstone Project submission & code evaluation",
                    "Technical portfolio review, AI engineer interview preparation, and placement rounds"
                ]
            }
        ],
        projects: [
            {
                title: "Enterprise Multi-Document Financial RAG Knowledge Assistant",
                desc: "Engineered an AI copilot indexing 1,000+ financial PDFs with hybrid vector search and zero-hallucination citations.",
                tags: ["LangChain", "Pinecone", "OpenAI", "FastAPI"],
                image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Autonomous Code Refactoring & Security Audit AI Agent",
                desc: "Built a multi-agent system that analyzes GitHub repositories, detects security vulnerabilities, and generates automated pull requests.",
                tags: ["CrewAI", "Function Calling", "Gemini Pro", "Docker"],
                image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Multimodal Medical Diagnostics AI Copilot",
                desc: "Developed a vision-language assistant interpreting clinical patient history alongside lab reports and imaging data.",
                tags: ["Vision LLM", "HuggingFace", "Streamlit", "LlamaIndex"],
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Customer Support Voice & Text Real-Time AI Conversationalist",
                desc: "Created a low-latency conversational voice agent with whisper transcription and real-time dynamic tool execution.",
                tags: ["WebSockets", "Whisper", "LangChain", "Vector DB"],
                image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Build production-grade Generative AI and LLM applications",
            "Master LangChain, LlamaIndex, and Vector Databases (Pinecone, Chroma)",
            "Architect and deploy enterprise RAG (Retrieval Augmented Generation) systems",
            "Fine-tune open-source LLMs using LoRA/QLoRA and HuggingFace",
            "Receive Govt. MSME recognized certificate and high-tier placement support"
        ],
        careerRoles: [
            { title: "Generative AI Engineer", salary: "₹8.5 LPA - ₹24.0 LPA" },
            { title: "LLM Solutions Architect", salary: "₹10.0 LPA - ₹28.0 LPA" },
            { title: "AI Prompt & Systems Engineer", salary: "₹7.0 LPA - ₹18.0 LPA" },
            { title: "NLP & AI Applications Developer", salary: "₹8.0 LPA - ₹20.0 LPA" }
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default AI;
