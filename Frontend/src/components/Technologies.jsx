import React from 'react';
import { TECHNOLOGY_LOGOS } from './technologyLogos';
import { Cpu, Sparkles, Layers, CheckCircle2 } from 'lucide-react';

const techs = [
    'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React.js', 'Node.js',
    'Java', 'Spring Boot', 'Express JS', 'Django', 'Django REST Framework',
    'Python', 'AWS', 'Docker', 'TensorFlow', 'MongoDB', 'Git/GitHub',
    'PostgreSQL', 'MySQL', 'Kubernetes', 'Azure', 'Google Cloud', 'Redis', 'Sass', 'Bootstrap', 'Redux', 'Jenkins', 'Figma', 'Linux', 'C++', 'C#', 'PHP', 'GraphQL', 'Firebase', 'Netlify', 'Heroku', 'Vercel', 'Bitbucket', 'Jira', 'Slack', 'Notion', 'Trello', 'VS Code', 'IntelliJ', 'PyCharm', 'Eclipse', 'Xcode', 'Android Studio'
];

const techDescriptions = {
    'HTML5': 'Modern semantic markup for scalable web applications.',
    'CSS3': 'Advanced layouts, animations & responsive styling.',
    'JavaScript': 'ES6+ high-performance asynchronous programming.',
    'TypeScript': 'Type-safe enterprise JavaScript architecture.',
    'React.js': 'Component-driven frontend UI development.',
    'Node.js': 'High-concurrency backend runtime environment.',
    'Java': 'Enterprise object-oriented software engineering.',
    'Spring Boot': 'Production-ready cloud microservices.',
    'Express JS': 'Fast, unopinionated REST API framework.',
    'Django': 'Robust Python web framework for secure backends.',
    'Django REST Framework': 'Scalable RESTful Web API development.',
    'Python': 'Modern programming for AI, Data & Automation.',
    'AWS': 'Scalable cloud computing & DevOps infrastructure.',
    'Docker': 'Containerization for consistent deployment.',
    'TensorFlow': 'Deep learning & neural network training.',
    'MongoDB': 'High-performance NoSQL document database.',
    'Git/GitHub': 'Industry-standard version control & CI.',
    'PostgreSQL': 'Enterprise-grade relational SQL database.',
    'MySQL': 'Standard ACID-compliant relational database.',
    'Kubernetes': 'Automated container orchestration at scale.',
    'Azure': 'Microsoft enterprise cloud ecosystem.',
    'Google Cloud': 'Google scalable cloud infrastructure & BigQuery.',
    'Redis': 'Sub-millisecond in-memory caching & queues.',
    'Sass': 'Modular preprocessed CSS styling architecture.',
    'Bootstrap': 'Responsive UI grid & utility components.',
    'Redux': 'Predictable global state management for React.',
    'Jenkins': 'Continuous Integration & Continuous Delivery.',
    'Figma': 'Modern collaborative UI/UX product design.',
    'Linux': 'Unix server administration & shell scripting.',
    'C++': 'High-performance systems & algorithmic computing.',
    'C#': 'Modern .NET enterprise application engineering.',
    'PHP': 'Server-side web scripting and legacy backends.',
    'GraphQL': 'Declarative data fetching & flexible APIs.',
    'Firebase': 'Real-time database, auth & serverless backends.',
    'Netlify': 'Next-gen automated web deployment platform.',
    'Heroku': 'PaaS cloud application hosting and scaling.',
    'Vercel': 'Frontend cloud platform with edge deployments.',
    'Bitbucket': 'Enterprise Git repository & code review tool.',
    'Jira': 'Agile scrum sprint planning & issue tracking.',
    'Slack': 'Team collaboration and DevOps alert webhooks.',
    'Notion': 'Engineering docs, architecture specs & sprints.',
    'Trello': 'Kanban board for task and deliverable tracking.',
    'VS Code': 'Modern extensible developer IDE environment.',
    'IntelliJ': 'Flagship IDE for enterprise Java & Spring Boot.',
    'PyCharm': 'Dedicated IDE for professional Python engineering.',
    'Eclipse': 'Classic IDE for Java enterprise systems.',
    'Xcode': 'Native iOS & macOS Apple development suite.',
    'Android Studio': 'Official IDE for native Android app engineering.'
};

const Technologies = () => {
    return (
        <section className="py-20 bg-white border-t border-slate-200/80 font-sans">
            <div className="container mx-auto px-6 text-center">
                {/* Header Badge & Title */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs uppercase tracking-wider mb-4">
                    <Cpu size={14} className="text-blue-600" />
                    <span>Industry-Standard Tech Stack & Tools</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 mb-4 tracking-tight">
                    Technologies & Frameworks You'll Master
                </h2>

                <p className="text-slate-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed mb-14">
                    "Real software engineering isn't just about theory—it's about mastering the tools that power Fortune 500 enterprises. At TSAR IT, you build production-ready projects with 45+ in-demand industry technologies."
                </p>

                {/* Tech Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 max-w-6xl mx-auto">
                    {techs.map((tech, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center bg-slate-50/80 hover:bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 group cursor-default"
                            title={techDescriptions[tech] || tech}
                        >
                            <div className="w-14 h-14 mb-3 flex items-center justify-center bg-white rounded-xl shadow-xs border border-slate-100 p-2 group-hover:scale-110 transition-transform duration-300">
                                {TECHNOLOGY_LOGOS[tech] ? (
                                    <img
                                        src={TECHNOLOGY_LOGOS[tech]}
                                        alt={`${tech} logo`}
                                        className="w-10 h-10 object-contain"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <span
                                    className="w-10 h-10 hidden items-center justify-center bg-blue-50 rounded-lg text-blue-700 font-bold text-base"
                                >
                                    {tech[0]}
                                </span>
                            </div>

                            <span className="font-bold text-slate-900 text-xs sm:text-sm text-center line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                                {tech}
                            </span>
                            <span className="text-[11px] text-slate-500 text-center line-clamp-2 leading-tight">
                                {techDescriptions[tech] || ''}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bottom Highlight Strip */}
                <div className="mt-14 max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 rounded-3xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
                            <Layers size={22} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-sm sm:text-base">Hands-on Multi-Stack Exposure</h4>
                            <p className="text-xs text-slate-600">Every internship module includes GitHub version control, live cloud CI/CD deployment, and architecture design.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 shrink-0">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>Updated for 2026 Batch</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Technologies;
