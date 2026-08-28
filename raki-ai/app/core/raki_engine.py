import json
import httpx
from typing import AsyncGenerator, List, Dict, Any, Optional
from .config import settings
from ..models.schemas import ChatMessage

SYSTEM_PROMPTS_BY_SITE = {
    "internship": """You are RAKI AI, the elite AI Technical Architect, Software Engineer, and Autonomous Coding Mentor for the TSAR IT INTERNSHIP PORTAL.
Your mission is to provide world-class, production-grade technical guidance across:
- Data Science & AI (Python, Pandas, NumPy, Scikit-Learn, ML Models)
- Generative AI & LLMs (LangChain, Vector DBs, Prompt Engineering, RAG, PyTorch)
- Java Enterprise Full Stack (Spring Boot 3, REST APIs, Microservices, Hibernate, React 19)
- MERN Full Stack (MongoDB, Express, React, Node.js, Tailwind CSS)
- Cloud & DevOps (Docker, Kubernetes, AWS, CI/CD pipelines, Linux)
- Cybersecurity & Ethical Hacking (OWASP, Network Security, Vulnerability Analysis)
Provide accurate code, concise explanations, exam preparation, and career mentoring.""",

    "rynatyai": """You are RAKI AI powering the RYNATY AI Multi-Agent Ecosystem.
You execute enterprise autonomous operations across:
- Banking & Fintech (Biometric KYC, AML compliance, Fraud risk scoring, Ledger reconciliation)
- Healthcare & Medical (EHR sync, HL7/FHIR compliance, Clinical triage, Telehealth)
- Beauty & Skincare (Dermatological profile analysis, Personalized AM/PM routines, Ingredient safety)
- Telecom & Networks (Packet drop mitigation, BGP routing, Predictive churn reduction)
- Agriculture & AgTech (Multispectral drone crop analysis, Yield projection, Supply chain tracking)
- Government & Citizen Services (Case management, Municipal permit routing, Audit transparency)
- Space & Satellites (LEO orbital telemetry, Battery maintenance, Constellation drift correction)
- Voice & Autonomous E-Commerce (Natural telephony dialogue, Multi-marketplace price comparison)
Deliver professional, highly structured, deterministic, and domain-tailored intelligence.""",

    "tsaritservices": """You are RAKI AI, the Chief AI Solutions Architect for TSAR IT SERVICES.
You assist enterprise clients with:
- Bespoke Software Engineering & Modern Architecture
- Cloud Migration (AWS, Azure, GCP, Microservices, Kubernetes)
- Data Engineering, AI/ML Product Development & Analytics
- Enterprise IT Modernization & Security Auditing.""",

    "billing": """You are RAKI AI, the Intelligent Billing & Invoicing Assistant.
You assist with invoice calculations, GST/Tax reconciliation, billing queries, and automated financial reporting.""",

    "hms": """You are RAKI AI, the Healthcare & Hospital Management System (HMS) Intelligent Copilot.
You assist medical staff with patient flow optimization, appointment scheduling, inventory tracking, and clinical documentation support."""
}

SYSTEM_PROMPT_DEFAULT = SYSTEM_PROMPTS_BY_SITE["internship"]

class RakiAIEngine:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.default_model = settings.DEFAULT_MODEL

    async def list_models(self) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    return data.get("models", [])
                return []
            except Exception as e:
                print(f"[RakiAI] Error listing models: {e}")
                return []

    async def pull_model(self, model_name: str) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient(timeout=300.0) as client:
            try:
                async with client.stream("POST", f"{self.base_url}/api/pull", json={"name": model_name}) as response:
                    async for line in response.aiter_lines():
                        if line:
                            yield line
            except Exception as e:
                yield json.dumps({"error": str(e)})

    def get_system_prompt_for_context(self, site_context: Optional[str], custom_prompt: Optional[str]) -> str:
        if custom_prompt and custom_prompt.strip():
            return custom_prompt
        if site_context and site_context.lower() in SYSTEM_PROMPTS_BY_SITE:
            return SYSTEM_PROMPTS_BY_SITE[site_context.lower()]
        return SYSTEM_PROMPT_DEFAULT

    async def chat(
        self,
        messages: List[ChatMessage],
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        site_context: Optional[str] = None,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        selected_model = model or self.default_model
        sys_prompt = self.get_system_prompt_for_context(site_context, system_prompt)

        formatted_messages = [{"role": "system", "content": sys_prompt}]
        for m in messages:
            formatted_messages.append({"role": m.role, "content": m.content})

        payload = {
            "model": selected_model,
            "messages": formatted_messages,
            "stream": False,
            "options": {"temperature": temperature}
        }

        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                res = await client.post(f"{self.base_url}/api/chat", json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "model": selected_model,
                        "response": data.get("message", {}).get("content", ""),
                        "done": True,
                        "total_duration": data.get("total_duration"),
                        "site_context": site_context or "internship"
                    }
                else:
                    return {
                        "model": selected_model,
                        "response": f"Ollama Error (HTTP {res.status_code}): {res.text}",
                        "done": True
                    }
            except Exception as e:
                return {
                    "model": selected_model,
                    "response": f"RAKI AI Inference Exception: {str(e)}. Make sure Ollama has pulled '{selected_model}'.",
                    "done": True
                }

    async def chat_stream(
        self,
        messages: List[ChatMessage],
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        site_context: Optional[str] = None,
        temperature: float = 0.7
    ) -> AsyncGenerator[str, None]:
        selected_model = model or self.default_model
        sys_prompt = self.get_system_prompt_for_context(site_context, system_prompt)

        formatted_messages = [{"role": "system", "content": sys_prompt}]
        for m in messages:
            formatted_messages.append({"role": m.role, "content": m.content})

        payload = {
            "model": selected_model,
            "messages": formatted_messages,
            "stream": True,
            "options": {"temperature": temperature}
        }

        async with httpx.AsyncClient(timeout=180.0) as client:
            try:
                async with client.stream("POST", f"{self.base_url}/api/chat", json=payload) as response:
                    async for chunk in response.aiter_lines():
                        if chunk:
                            yield chunk
            except Exception as e:
                yield json.dumps({"error": str(e)})

    async def generate_code(
        self,
        prompt: str,
        language: str = "python",
        model: Optional[str] = None,
        framework: Optional[str] = None,
        include_tests: bool = False
    ) -> str:
        framework_text = f" using {framework}" if framework else ""
        test_text = " Include unit test cases with assertions." if include_tests else ""
        
        system_prompt = f"You are RAKI AI's master code generator. Output only clean, optimized, fully functional {language}{framework_text} code with inline comments.{test_text}"
        
        messages = [
            ChatMessage(role="user", content=f"Generate {language} code for the following specification:\n\n{prompt}")
        ]
        
        result = await self.chat(messages, model=model, system_prompt=system_prompt, temperature=0.2)
        return result.get("response", "")

    async def review_code(
        self,
        code: str,
        language: str,
        model: Optional[str] = None
    ) -> str:
        system_prompt = f"""You are RAKI AI's Automated Senior Code Reviewer. 
Analyze the provided {language} code and provide:
1. 🛡️ Security & Vulnerability Analysis
2. ⚡ Performance & Complexity (Time & Space Complexity)
3. 🧹 Clean Code & Architectural Refactoring suggestions
4. 🚀 Refactored / Fixed Code snippet"""

        messages = [
            ChatMessage(role="user", content=f"Please review this {language} code:\n\n```{language}\n{code}\n```")
        ]

        result = await self.chat(messages, model=model, system_prompt=system_prompt, temperature=0.3)
        return result.get("response", "")

raki_engine = RakiAIEngine()
