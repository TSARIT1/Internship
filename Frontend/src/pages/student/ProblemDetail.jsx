
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getProblem, runCode, submitCode } from '../../services/problemApi';
import { Play, CheckCircle, AlertTriangle, ArrowLeft, RefreshCw, Terminal, Clock, Database, ChevronDown, ChevronUp } from 'lucide-react';

const ProblemDetail = () => {
    const { id } = useParams(); // Problem ID
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);

    const [code, setCode] = useState("// Write your code here...");
    const [language, setLanguage] = useState("python");

    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState('description'); // description, output
    const [submissionResult, setSubmissionResult] = useState(null);

    // Default code templates
    const templates = {
        python: `# Write your Python code here\nimport sys\n\n# Read input\n# input_str = sys.stdin.read()\n# print(input_str)`,
        java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Your code here\n    }\n}`,
        cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
        c: `#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}`,
        javascript: `// Read from stdin\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8');\n// Your code here\nconsole.log(input);`
    };

    useEffect(() => {
        loadProblem();
    }, [id]);

    useEffect(() => {
        if (!problem) return;
        // Set default code based on language if code is still default
        if (code === "// Write your code here...") {
            setCode(templates[language] || "");
        }
    }, [language, problem]);

    const loadProblem = async () => {
        setLoading(true);
        const res = await getProblem(id);
        if (res.success) {
            setProblem(res.data);
            // Default code based on problem template if available? OR just standard language templates
            // If problem has starterCode, use it?
        } else {
            alert("Failed to load problem");
        }
        setLoading(false);
    };

    const handleRun = async () => {
        setIsRunning(true);
        setActiveTab('output');
        setSubmissionResult(null);
        setOutput({ status: 'Running...', logs: [] });

        const res = await runCode({ problemId: id, language, code });

        if (res.success) {
            setOutput({
                status: res.data.allPassed ? 'Passed' : 'Failed',
                results: res.data.results,
                error: null
            });
        } else {
            setOutput({
                status: 'Error',
                error: res.error?.message || res.error || "Execution failed",
                results: []
            });
        }
        setIsRunning(false);
    };

    const handleSubmit = async () => {
        const student = JSON.parse(sessionStorage.getItem('student'));
        if (!student) {
            alert("Please login to submit.");
            navigate('/login');
            return;
        }

        if (!confirm("Are you sure you want to submit your solution?")) return;

        setIsRunning(true);
        setActiveTab('output');
        setSubmissionResult(null);
        setOutput({ status: 'Submitting...', logs: [] });

        const res = await submitCode({
            problemId: id,
            userId: student.id,
            language,
            code,
            hackathonId: problem.hackathonId
        });

        if (res.success) {
            setSubmissionResult(res.data);
            setOutput({
                status: res.data.status, // ACCEPTED, WRONG_ANSWER
                results: [], // We don't get individual case details on submit usually
                summary: `Passed ${res.data.passed} of ${res.data.total} test cases.`
            });
        } else {
            setOutput({
                status: 'Error',
                error: res.error?.message || res.error || "Submission failed"
            });
        }
        setIsRunning(false);
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading IDE...</div>;
    if (!problem) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Problem not found.</div>;

    return (
        <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-slate-800 border-b border-white/10 px-4 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition">
                        <ArrowLeft size={20} className="text-slate-400" />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">{problem.title}</h1>
                        <div className="flex gap-3 text-xs text-slate-400">
                            <span className={`font-bold ${problem.difficulty === 'Easy' ? 'text-green-400' :
                                problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'
                                }`}>{problem.difficulty}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {problem.timeLimit}s</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Database size={12} /> {problem.memoryLimit}MB</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="python">Python 3</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="javascript">JavaScript</option>
                    </select>

                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                    >
                        <Play size={16} className={isRunning ? "opacity-50" : "text-green-400"} />
                        Run
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isRunning}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-green-900/20 transition"
                    >
                        {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                        Submit
                    </button>
                </div>
            </header>

            {/* Main Content - Split Screen */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Description */}
                <div className="w-1/3 bg-slate-900 border-r border-white/10 flex flex-col min-w-[300px]">
                    <div className="flex border-b border-white/5">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'description' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'output' ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            Output {output && <span className="ml-1 w-2 h-2 rounded-full bg-blue-500 inline-block"></span>}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {activeTab === 'description' ? (
                            <div className="prose prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: problem.description?.replace(/\n/g, '<br/>') || "No description provided." }} />

                                <div className="mt-6 space-y-4">
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <h3 className="text-sm font-bold text-slate-300 mb-2">Input Format</h3>
                                        <p className="text-sm text-slate-400 whitespace-pre-wrap">{problem.inputFormat || "Standard input"}</p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <h3 className="text-sm font-bold text-slate-300 mb-2">Output Format</h3>
                                        <p className="text-sm text-slate-400 whitespace-pre-wrap">{problem.outputFormat || "Standard output"}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {output ? (
                                    <>
                                        <div className={`p-4 rounded-lg border ${output.status === 'Passed' || output.status === 'ACCEPTED' ? 'bg-green-500/10 border-green-500/20' :
                                            output.status === 'Running...' ? 'bg-blue-500/10 border-blue-500/20' :
                                                'bg-red-500/10 border-red-500/20'
                                            }`}>
                                            <h3 className={`font-bold text-lg mb-1 ${output.status === 'Passed' || output.status === 'ACCEPTED' ? 'text-green-400' :
                                                output.status === 'Running...' ? 'text-blue-400' :
                                                    'text-red-400'
                                                }`}>
                                                {output.status === 'ACCEPTED' ? 'Accepted!' : output.status}
                                            </h3>
                                            {output.summary && <p className="text-slate-300 text-sm">{output.summary}</p>}
                                            {output.error && <p className="text-red-300 text-sm font-mono mt-2">{output.error}</p>}
                                        </div>

                                        {/* Individual Test Cases (Only for Run, not Submit) */}
                                        {output.results && output.results.map((res, i) => (
                                            <div key={i} className="bg-slate-800 rounded-lg overflow-hidden border border-white/5">
                                                <div className="flex items-center justify-between px-4 py-2 bg-slate-700/50">
                                                    <span className="text-sm font-medium text-slate-300">Test Case {i + 1}</span>
                                                    {res.passed ?
                                                        <span className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-0.5 rounded">PASSED</span> :
                                                        <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded">FAILED</span>
                                                    }
                                                </div>
                                                <div className="p-3 space-y-2 font-mono text-xs">
                                                    <div>
                                                        <span className="text-slate-500 block">Input:</span>
                                                        <div className="bg-black/30 p-2 rounded text-slate-300">{res.input}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 block">Expected Output:</span>
                                                        <div className="bg-black/30 p-2 rounded text-slate-300">{res.expectedOutput}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 block">Your Output:</span>
                                                        <div className={`bg-black/30 p-2 rounded ${res.passed ? 'text-slate-300' : 'text-red-300'}`}>{res.actualOutput}</div>
                                                    </div>
                                                    {res.stderr && (
                                                        <div>
                                                            <span className="text-slate-500 block">Error Output:</span>
                                                            <div className="bg-red-900/10 p-2 rounded text-red-300">{res.stderr}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="text-slate-500 text-center py-10">
                                        <Terminal size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>Run your code to see output here.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Editor */}
                <div className="w-2/3 flex flex-col bg-[#1e1e1e]">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProblemDetail;
