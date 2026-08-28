import React from 'react';
import CourseTemplate from '../components/CourseTemplate';

const MachineLearning = () => {
    const courseData = {
        title: "Machine Learning",
        description: "Build intelligent predictive systems, deep learning architectures, computer vision pipelines, and deploy models to scalable cloud servers.",
        duration: "4-6 Months",
        level: "Intermediate to Advanced",
        heroImage: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1600&q=80",
        tools: [
            "Python", "PyTorch", "TensorFlow", "Scikit-Learn", "OpenCV",
            "NLTK & SpaCy", "FastAPI", "Docker", "MLflow", "HuggingFace"
        ],
        curriculum: [
            {
                title: "Phase 1: Advanced Mathematical Foundations & Supervised Learning",
                duration: "Weeks 1 - 4",
                topics: [
                    "Linear Algebra, Multivariate Calculus, Matrix operations & Optimization",
                    "Probability distributions, Bayes theorem, Maximum Likelihood Estimation (MLE)",
                    "Linear & Logistic Regression, Regularization (L1 Lasso, L2 Ridge, ElasticNet)",
                    "Decision Trees, Gini Impurity, Entropy, Random Forests & Extra Trees",
                    "Support Vector Machines (SVM) & Kernel Tricks"
                ]
            },
            {
                title: "Phase 2: Ensemble Learning & Unsupervised Architectures",
                duration: "Weeks 5 - 8",
                topics: [
                    "Boosting Algorithms: AdaBoost, Gradient Boosting, XGBoost, CatBoost",
                    "Clustering Algorithms: K-Means++, DBSCAN, Gaussian Mixture Models",
                    "Dimensionality Reduction: PCA, t-SNE, UMAP visualization",
                    "Model Evaluation, Validation Curves, Learning Curves, and Cross-Validation"
                ]
            },
            {
                title: "Phase 3: Deep Learning, Neural Networks & Computer Vision",
                duration: "Weeks 9 - 14",
                topics: [
                    "Perceptrons, Multi-Layer Perceptrons (MLP), Activation functions, Backpropagation",
                    "Deep Neural Networks with PyTorch: Tensors, Autograd, Custom Datasets & Training loops",
                    "Convolutional Neural Networks (CNNs) for Image Classification & Transfer Learning (ResNet, VGG)",
                    "Object Detection basics with OpenCV & YOLO",
                    "Recurrent Neural Networks (RNNs), LSTMs, and Sequence-to-Sequence Modeling"
                ]
            },
            {
                title: "Phase 4: MLOps, Model Deployment & Capstone Delivery",
                duration: "Weeks 15 - 18",
                topics: [
                    "Packaging ML models into REST APIs using FastAPI & Docker",
                    "Model tracking with MLflow, Experimentation, and Artifact Registry",
                    "Live Capstone project presentation and technical mentor code review",
                    "Interview coaching, algorithmic challenges, and placement drives"
                ]
            }
        ],
        projects: [
            {
                title: "Autonomous Vehicle Obstacle & Lane Detection System",
                desc: "Trained a real-time computer vision deep learning pipeline detecting road lanes and obstacles with 95% frame accuracy.",
                tags: ["PyTorch", "OpenCV", "YOLOv8", "Deep Learning"],
                image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Algorithmic Stock Price Forecasting & Sentiment Engine",
                desc: "Built a hybrid LSTM deep learning network with financial news sentiment analysis for short-term asset forecasting.",
                tags: ["LSTM", "Transformers", "NLP", "FastAPI"],
                image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Medical Imaging X-Ray Pneumonia Classifier",
                desc: "Engineered a transfer learning ResNet model accurately detecting pulmonary abnormalities from chest radiography scans.",
                tags: ["Transfer Learning", "ResNet50", "PyTorch", "Healthcare AI"],
                image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "E-Commerce Recommendation & Collaborative Filtering Engine",
                desc: "Developed a personalized matrix-factorization recommendation engine handling 100k+ user-item interactions.",
                tags: ["Matrix Factorization", "KNN", "Scikit-Learn", "Docker"],
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Master modern Supervised, Unsupervised, and Deep Learning algorithms",
            "Build production-ready PyTorch neural network pipelines",
            "Implement Computer Vision and Natural Language Processing models",
            "Deploy trained models as microservices with Docker and FastAPI",
            "Receive industry-recognized verified certificate and interview assistance"
        ],
        careerRoles: [
            { title: "Machine Learning Engineer", salary: "₹7.0 LPA - ₹18.0 LPA" },
            { title: "Deep Learning Specialist", salary: "₹8.0 LPA - ₹20.0 LPA" },
            { title: "Computer Vision Engineer", salary: "₹7.5 LPA - ₹18.0 LPA" },
            { title: "AI/ML Solutions Developer", salary: "₹6.0 LPA - ₹15.0 LPA" }
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default MachineLearning;
