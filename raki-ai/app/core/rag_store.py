import os
from typing import List, Dict, Any, Optional
from .config import settings

class MultiSectorRAGStore:
    def __init__(self):
        self.documents: List[Dict[str, str]] = []
        self._init_knowledge_base()

    def _init_knowledge_base(self):
        """Preload multi-sector enterprise knowledge base across Banking, Healthcare, Beauty, Telecom, Agriculture, Government, and Data Science."""
        self.documents = [
            # ==============================================================
            # 1. BANKING & FINTECH INTELLIGENCE
            # ==============================================================
            {
                "id": "banking_core_kyc_aml",
                "sector": "banking",
                "title": "Banking • Real-Time KYC, Biometric Identity & AML Compliance",
                "content": """Autonomous banking protocols enforce Anti-Money Laundering (AML) and Know Your Customer (KYC) standards.
1. KYC Verification: Real-time OCR document analysis, liveness biometric face-matching (99.8% precision), and sanction list screening (OFAC, PEP, Interpol).
2. Transaction Monitoring & AML: Real-time velocity checks and graph-based anomaly detection flag suspicious transactions exceeding $10,000 or exhibiting structuring (smurfing) patterns in under 12ms.
3. Regulatory Compliance: Adheres to Basel III/IV capital adequacy ratios, Dodd-Frank, and automated Suspicious Activity Report (SAR) filing with cryptographic audit hashing."""
            },
            {
                "id": "banking_iso20022_payments",
                "sector": "banking",
                "title": "Banking • ISO 20022 Messaging, Payment Rails & Fraud Scoring",
                "content": """Modern payment orchestration supports real-time gross settlement (RTGS), SWIFT gpi, FedNow, UPI, and SEPA Instant.
1. Messaging Standard: Standardized XML schema using ISO 20022 (pacs.008 for customer credit transfers, pacs.002 for payment status reports, camt.053 for bank statements).
2. Fraud Detection Engine: XGBoost and Deep Autoencoders calculate instant Fraud Risk Scores (0-1000). Transactions with score > 850 trigger immediate tokenized multi-factor step-up challenges.
3. Ledger Reconciliation: Double-entry immutable ledger synchronization across multi-currency settlement rails with zero floating discrepancy."""
            },
            {
                "id": "banking_credit_risk",
                "sector": "banking",
                "title": "Banking • Credit Risk Scoring & Algorithmic Trading Architecture",
                "content": """Quantitative risk management utilizes statistical modeling:
1. Credit Risk Parameters: Probability of Default (PD), Loss Given Default (LGD), and Exposure at Default (EAD). Expected Loss calculated as EL = PD * LGD * EAD.
2. Underwriting: Automated underwriting analyzes alternative cash flow metrics, debt-to-income (DTI < 43%), and credit bureau APIs in real time.
3. Quantitative Trading: Ultra-low latency FIX Protocol (v5.0) integration with Order Management Systems (OMS) for limit order books and VWAP/TWAP execution."""
            },

            # ==============================================================
            # 2. HEALTHCARE & CLINICAL INTELLIGENCE
            # ==============================================================
            {
                "id": "healthcare_fhir_hl7",
                "sector": "healthcare",
                "title": "Healthcare • HL7 FHIR R4 Interoperability & HIPAA Security",
                "content": """Clinical data exchange adheres to HL7 FHIR Release 4 and HIPAA Title II standards.
1. FHIR Resources: Standardized JSON/XML structures for Patient, Practitioner, Observation (vitals/labs), Condition (ICD-10-CM/SNOMED CT), Encounter, and MedicationRequest.
2. Security & HIPAA Compliance: 256-bit AES encryption at rest, TLS 1.3 in transit, strict Role-Based Access Control (RBAC), and automatic de-identification of 18 Safe Harbor Protected Health Information (PHI) identifiers.
3. SMART on FHIR: OAuth 2.0 authorization framework for EHR plug-in integration across Epic, Cerner, and OpenEMR."""
            },
            {
                "id": "healthcare_clinical_triage",
                "sector": "healthcare",
                "title": "Healthcare • Clinical Triage, ESI Protocol & Diagnostic AI",
                "content": """Emergency Severity Index (ESI) triage algorithm categorizes patient acuity from Level 1 (Resuscitation) to Level 5 (Non-urgent).
1. Level 1: Immediate life-saving intervention (cardiac arrest, respiratory failure).
2. Level 2: High risk, confused/lethargic, severe pain/distress, or vitals exceeding Danger Zone thresholds (Heart Rate > 100, Respiratory Rate > 20, SpO2 < 92%).
3. Diagnostic AI Assistance: Differential diagnosis synthesis cross-references ICD-10 diagnostic trees, lab blood panels (CBC, CMP, Troponin), and imaging modalities (DICOM viewer integration)."""
            },
            {
                "id": "healthcare_telehealth_pharma",
                "sector": "healthcare",
                "title": "Healthcare • Telehealth, e-Prescriptions & Drug Interaction Safety",
                "content": """Autonomous digital health pipelines manage remote patient encounters and pharmacological safety.
1. Telehealth Orchestration: WebRTC encrypted video streams paired with real-time audio transcription and automated SOAP note generation (Subjective, Objective, Assessment, Plan).
2. Drug Interaction Checking: Real-time cross-referencing against National Drug Code (NDC) and RxNorm databases flags adverse contraindications (e.g., Warfarin + NSAIDs, SSRIs + MAOIs).
3. Pharmacy Routing: SCRIPT Standard compliance for instant digital e-prescription transmission to certified retail/hospital dispensaries."""
            },

            # ==============================================================
            # 3. BEAUTY & COSMETICS INTELLIGENCE
            # ==============================================================
            {
                "id": "beauty_skin_diagnostics",
                "sector": "beauty",
                "title": "Beauty • Dermatological Skin Analysis & Fitzpatrick Diagnostics",
                "content": """Clinical skincare consultation begins with comprehensive dermatological assessment.
1. Skin Classification: Fitzpatrick phototypes (I to VI), Baumann Skin Typing System (16 permutations based on Oily/Dry, Sensitive/Resistant, Pigmented/Non-Pigmented, Wrinkled/Tight).
2. Barrier Health Diagnostics: Transepidermal Water Loss (TEWL) analysis, stratum corneum lipid balance (ceramides, cholesterol, free fatty acids in 3:1:1 optimal molar ratio).
3. Condition Profiling: Automated grading for Acne Vulgaris (Comedonal, Inflammatory, Nodulocystic), Melasma, Rosacea, and photo-aging."""
            },
            {
                "id": "beauty_routine_formulation",
                "sector": "beauty",
                "title": "Beauty • Personalized AM/PM Routines & Ingredient Synergy",
                "content": """Scientific formulation principles for morning and evening routines:
1. AM Routine (Protect & Hydrate): Gentle Low-pH Cleanser -> L-Ascorbic Acid (Vitamin C 15% + Ferulic Acid pH < 3.5) -> Hyaluronic Acid Hydrator -> Ceramide Barrier Moisturizer -> Broad-Spectrum Mineral SPF 50 (Zinc Oxide / Titanium Dioxide).
2. PM Routine (Repair & Renew): Double Cleanse (Lipophilic Balm -> Foam) -> Encapsulated Retinol / Retinaldehyde (Cellular turnover) -> Niacinamide 4% (Soothing & Sebum control) -> Peptide Repair Complex -> Occlusive Squalane.
3. Ingredient Compatibility Matrix: Avoid mixing high-strength Direct Acids (AHA/BHA) with Pure Retinoids in same application; buffer Vitamin C and Niacinamide to prevent flushing."""
            },
            {
                "id": "beauty_regulatory_inci",
                "sector": "beauty",
                "title": "Beauty • Cosmetic Chemistry, Clean Beauty & INCI Regulations",
                "content": """Cosmetic product safety adheres to International Nomenclature of Cosmetic Ingredients (INCI), FDA MoCRA, and EU Regulation 1223/2009.
1. Preservative Systems: Phenoxyethanol, Ethylhexylglycerin, Potassium Sorbate preventing microbial and fungal proliferation.
2. Emulsion Technology: Water-in-oil (W/O) vs Oil-in-water (O/W) micro-emulsions using non-comedogenic emulsifiers (Cetearyl Olivate, Sorbitan Olivate).
3. Clean Beauty Compliance: Free from parabens, phthalates, synthetic sulfates (SLS/SLES), formaldehyde releasers, and microplastics with 100% cruelty-free verification."""
            },

            # ==============================================================
            # 4. TELECOM & 5G NETWORKS INTELLIGENCE
            # ==============================================================
            {
                "id": "telecom_5g_slicing",
                "sector": "telecom",
                "title": "Telecom • 5G Standalone (SA) Architecture & Network Slicing",
                "content": """5G New Radio (NR) networks utilize 3GPP Release 16/17 Standalone architecture with Service-Based Architecture (SBA).
1. Network Slicing: Virtualized end-to-end network instances over common physical infrastructure:
   - eMBB (Enhanced Mobile Broadband): High throughput (>1 Gbps) for 4K/8K streaming and cloud XR.
   - URLLC (Ultra-Reliable Low-Latency Communication): Sub-1ms latency and 99.999% reliability for autonomous vehicles and industrial robotics.
   - mMTC (Massive Machine Type Communication): High connection density (1M devices/km²) for smart cities and IoT.
2. Core Network Functions: AMF (Access and Mobility Management), SMF (Session Management), UPF (User Plane Function), and PCF (Policy Control)."""
            },
            {
                "id": "telecom_bgp_qos",
                "sector": "telecom",
                "title": "Telecom • BGP Routing, SDN/NFV & Self-Healing Traffic Engineering",
                "content": """Autonomous IP routing and packet transport engineering:
1. Routing Protocols: BGP-4 with Segment Routing (SR-MPLS / SRv6) for programmatic path calculation and sub-50ms Fast Reroute (FRR).
2. Autonomous Anomaly Mitigation: Real-time telemetry monitoring detects link degradation, packet drops, or optical fiber attenuation, triggering automated zero-touch BGP route withdrawal and dynamic re-routing in 8ms.
3. Quality of Service (QoS): 5G QoS Indicators (5QI) and DiffServ traffic prioritization guaranteeing bandwidth and jitter constraints for mission-critical voice (VoNR) and emergency communications."""
            },
            {
                "id": "telecom_churn_analytics",
                "sector": "telecom",
                "title": "Telecom • Predictive Churn Reduction & Optical Infrastructure",
                "content": """Customer retention and infrastructure lifecycle management:
1. Churn Prediction Engine: Random Forest and LSTM neural networks analyze customer CDRs (Call Detail Records), data throttling frequency, customer service sentiment, and billing interactions to predict subscriber churn with 94.2% accuracy.
2. Proactive Retention Action: Automated dispatch of personalized loyalty bandwidth upgrades, 5G device subsidies, or tariff optimization before contract expiration.
3. Optical DWDM: Dense Wavelength Division Multiplexing delivering 400Gbps/800Gbps per wavelength across long-haul optical fiber backbones."""
            },

            # ==============================================================
            # 5. AGRICULTURE & AGTECH INTELLIGENCE
            # ==============================================================
            {
                "id": "agri_multispectral_ndvi",
                "sector": "agriculture",
                "title": "Agriculture • Multispectral Drone Imagery & NDVI Vegetation Health",
                "content": """Precision agriculture utilizes remote sensing and optical satellite telemetry.
1. Spectral Indices:
   - Normalized Difference Vegetation Index: NDVI = (NIR - Red) / (NIR + Red). Values > 0.6 indicate vigorous dense canopy biomass; < 0.2 indicates soil, water, or severe crop stress.
   - NDRE (Normalized Difference Red Edge): Sensitive to chlorophyll content in thick mid-to-late stage canopies.
2. Multispectral Drone Ingestion: Multispectral bands (Red, Green, Blue, RedEdge, NIR) mapped to high-resolution GIS orthomosaics with sub-centimeter ground sampling distance (GSD).
3. Early Stress Detection: Automated anomaly heatmaps flag moisture deficits and nutrient deficiencies 10-14 days before visible symptoms appear."""
            },
            {
                "id": "agri_crop_pathology",
                "sector": "agriculture",
                "title": "Agriculture • Crop Disease Pathology & Precision NPK Soil Chemistry",
                "content": """Agronomic disease diagnosis and soil fertility management:
1. Crop Pathology: Computer vision models identify foliar diseases (e.g., Early/Late Blight in Solanaceae, Yellow Rust in Wheat, Powdery Mildew, Anthracnose) with treatment recommendations and biological control options.
2. Soil Fertility & NPK Balance: Automated soil test interpretation optimizing Nitrogen (N for vegetative growth), Phosphorus (P for root/flower development), and Potassium (K for stress tolerance and fruit quality).
3. Variable Rate Application (VRA): Prescription shapefiles generated for GPS-guided smart tractor sprayers, reducing chemical runoff by 35%."""
            },
            {
                "id": "agri_irrigation_supply_chain",
                "sector": "agriculture",
                "title": "Agriculture • Precision Smart Irrigation & Cold Chain Traceability",
                "content": """Resource optimization and post-harvest supply chain intelligence:
1. Smart Irrigation Scheduling: Calculates Reference Evapotranspiration (ET0) via FAO-56 Penman-Monteith equation combined with IoT capacitance soil moisture probes, triggering automated drip solenoid valves.
2. Weather Forecast Integration: Real-time precipitation and frost forecasting prevents over-watering and mitigates crop damage.
3. Cold Chain Traceability: IoT BLE and LoRaWAN temperature/humidity loggers track harvest produce from farm gate to distribution hub, guaranteeing zero HACCP food safety violations."""
            },

            # ==============================================================
            # 6. GOVERNMENT & PUBLIC SECTOR INTELLIGENCE
            # ==============================================================
            {
                "id": "gov_citizen_services",
                "sector": "government",
                "title": "Government • Omnichannel Citizen Services & Municipal Case Management",
                "content": """Digital public infrastructure for transparent and efficient municipal governance:
1. Citizen Case Management: Automated routing, SLA tracking, and resolution dispatch for citizen service requests (civil registrations, tax payments, utility maintenance, grievance redressal).
2. Omnichannel Accessibility: Multilingual self-service portals, voice IVR, and WhatsApp bot integration enabling 24/7 access to public services without physical administrative queuing.
3. Public Safety & Emergency Dispatch: Computer-Aided Dispatch (CAD) systems integrated with GIS emergency mapping for optimal police, fire, and ambulance unit allocation."""
            },
            {
                "id": "gov_identity_permits",
                "sector": "government",
                "title": "Government • Digital Identity (eID), Building Permits & Regulatory Audit",
                "content": """Public sector digital identity and administrative verification:
1. Secure Digital Identity: Interoperable digital identity frameworks (eIDAS, Aadhaar, OAuth PKCE) ensuring zero-knowledge authentication and privacy-preserving credential sharing.
2. Automated Building Permitting: BIM (Building Information Modeling) and CAD automated code compliance checking verifies zoning, fire safety, and setback requirements in seconds.
3. Public Procurement & Transparency: Immutable ledger audit trails log every procurement tender, bidder evaluation, and budgetary disbursement with complete public auditability."""
            },

            # ==============================================================
            # 7. DATA SCIENCE, AI & SOFTWARE ENGINEERING (INTERNSHIP CORE)
            # ==============================================================
            {
                "id": "ds_ai_core_curriculum",
                "sector": "data_science",
                "title": "Data Science & AI • Full Curriculum & Industry Projects",
                "content": """Comprehensive Data Science curriculum at TSAR IT INTERNSHIP:
1. Foundations: Python 3.12, NumPy vectorization, Pandas exploratory data analysis (EDA), Seaborn, and Matplotlib data storytelling.
2. Classical Machine Learning: Regression (Linear, Ridge, Lasso), Classification (Logistic, Decision Trees, Random Forests, XGBoost, LightGBM, CatBoost), Clustering (K-Means, DBSCAN), Dimensionality Reduction (PCA, t-SNE).
3. Industry Capstones: Real-time Customer Churn Prediction, Loan Default Risk Scoring, Algorithmic Stock Price Forecasting, and E-commerce Recommendation Systems."""
            },
            {
                "id": "genai_llm_curriculum",
                "sector": "data_science",
                "title": "Generative AI & LLMs • Deep Learning, RAG & Agentic Swarms",
                "content": """Generative AI and Large Language Model engineering track:
1. Deep Learning & Neural Architectures: PyTorch, Convolutional Neural Networks (CNNs), Recurrent Neural Networks (LSTMs), and Transformer Self-Attention mechanism.
2. LLM Operations (LLMOps): Prompt engineering, LangChain & LlamaIndex pipelines, Vector Databases (ChromaDB, Pinecone, Qdrant, Milvus), Reciprocal Rank Fusion RAG.
3. Model Fine-Tuning: PEFT, LoRA, QLoRA (4-bit/8-bit quantization), Supervised Fine-Tuning (SFT), Direct Preference Optimization (DPO), and Ollama model deployment."""
            },
            {
                "id": "fullstack_devops_curriculum",
                "sector": "data_science",
                "title": "Enterprise Full Stack & DevOps • Cloud Architecture",
                "content": """Enterprise software engineering and cloud deployment:
1. Java Full Stack: Spring Boot 3.3, Microservices, Spring Security JWT, Hibernate JPA, PostgreSQL, and React 19 Frontend.
2. MERN Full Stack: MongoDB Atlas, Express.js, React 19 with Vite, Node.js, WebSockets, and Tailwind CSS.
3. Cloud & DevOps: Docker multi-stage containers, Kubernetes clusters, Helm charts, GitHub Actions CI/CD pipelines, Terraform Infrastructure as Code (IaC), and Nginx reverse proxies with SSL."""
            }
        ]

    def add_document(self, doc_id: str, sector: str, title: str, content: str):
        self.documents.append({
            "id": doc_id,
            "sector": sector,
            "title": title,
            "content": content
        })

    def search(self, query: str, sector: Optional[str] = None, limit: int = 4) -> List[Dict[str, str]]:
        query_terms = [t for t in query.lower().split() if len(t) > 2]
        scored = []
        
        target_docs = self.documents
        if sector and sector.lower() != "all":
            filtered = [d for d in self.documents if d.get("sector") == sector.lower()]
            if filtered:
                target_docs = filtered

        for doc in target_docs:
            score = 0
            text = f"{doc['title']} {doc['content']}".lower()
            
            # Exact phrase boost
            if query.lower() in text:
                score += 15
            
            for term in query_terms:
                if term in text:
                    score += text.count(term) * 2
            
            if score > 0:
                scored.append((score, doc))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        results = [doc for _, doc in scored[:limit]]
        
        # Fallback if no term matched
        if not results:
            results = target_docs[:limit]
        return results

    def get_all_sectors(self) -> List[str]:
        return list(set(d.get("sector", "general") for d in self.documents))

rag_store = MultiSectorRAGStore()
