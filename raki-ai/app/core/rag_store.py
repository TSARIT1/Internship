import os
from typing import List, Dict, Any, Optional
from .config import settings

class SimpleRAGStore:
    def __init__(self):
        self.documents: List[Dict[str, str]] = []
        self._init_knowledge_base()

    def _init_knowledge_base(self):
        """Preload TSAR IT INTERNSHIP technical curriculum & knowledge base."""
        self.documents = [
            {
                "id": "ds_curriculum",
                "title": "Data Science & AI Track",
                "content": "Covers Python, Pandas, NumPy, Scikit-Learn, Supervised/Unsupervised Machine Learning, Tableau, SQL, and 4 Capstone projects including predictive models and customer churn analytics."
            },
            {
                "id": "genai_curriculum",
                "title": "AI & Generative AI Track",
                "content": "Covers Large Language Models (LLMs), LangChain, LlamaIndex, Vector Databases (Chroma, Pinecone), Prompt Engineering, RAG architectures, Fine-tuning with LoRA/QLoRA, and PyTorch."
            },
            {
                "id": "java_curriculum",
                "title": "Java Enterprise Full Stack Track",
                "content": "Covers Core Java 17/21, Spring Boot 3.x, Spring Security, JWT, RESTful Microservices, Hibernate JPA, MySQL, React 19 Frontend, Docker, and AWS deployment."
            },
            {
                "id": "mern_curriculum",
                "title": "MERN Full Stack Track",
                "content": "Covers MongoDB, Express.js, React 19, Node.js, Next.js 14, Tailwind CSS, WebSockets, Redux Toolkit, and production cloud deployment on Vercel and AWS."
            },
            {
                "id": "devops_curriculum",
                "title": "DevOps & Cloud Computing Track",
                "content": "Covers Linux administration, Git workflows, Docker containerization, Kubernetes orchestration, Helm, Jenkins & GitHub Actions CI/CD, Terraform IaC, Prometheus, and Grafana."
            },
            {
                "id": "cyber_curriculum",
                "title": "Cyber Security & Ethical Hacking Track",
                "content": "Covers Kali Linux, Network scanning (Nmap, Wireshark), OWASP Top 10 web vulnerabilities, Burp Suite, SOC monitoring with Splunk, SIEM analysis, and defensive engineering."
            },
            {
                "id": "certification_info",
                "title": "Certification & Credentials",
                "content": "Graduates receive verified technical internship certificates with unique QR verification codes secured via TSAR IT Central Authentication Service."
            }
        ]

    def add_document(self, doc_id: str, title: str, content: str):
        self.documents.append({
            "id": doc_id,
            "title": title,
            "content": content
        })

    def search(self, query: str, limit: int = 3) -> List[Dict[str, str]]:
        query_terms = query.lower().split()
        scored = []
        for doc in self.documents:
            score = 0
            text = f"{doc['title']} {doc['content']}".lower()
            for term in query_terms:
                if term in text:
                    score += text.count(term)
            if score > 0:
                scored.append((score, doc))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        results = [doc for _, doc in scored[:limit]]
        
        # Fallback if no specific term matched
        if not results:
            results = self.documents[:limit]
        return results

rag_store = SimpleRAGStore()
