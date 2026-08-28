
import React, { useState, useEffect } from 'react';
import { getProblems, createProblem, updateProblem, deleteProblem } from '../services/problemApi';
import { getHackathons } from '../services/hackathonApi';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Save, X } from 'lucide-react';

const AdminProblemManagement = () => {
    const [problems, setProblems] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProblem, setEditingProblem] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'Easy',
        timeLimit: 1.0,
        memoryLimit: 256,
        inputFormat: '',
        outputFormat: '',
        hackathonId: '',
        testCases: []
    });

    const loadData = async () => {
        setLoading(true);
        const [probs, hacks] = await Promise.all([getProblems(), getHackathons()]);
        if (probs.success) setProblems(probs.data);
        if (hacks.success) setHackathons(hacks.data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (problem) => {
        setEditingProblem(problem.id);
        setFormData({
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            timeLimit: problem.timeLimit,
            memoryLimit: problem.memoryLimit,
            inputFormat: problem.inputFormat,
            outputFormat: problem.outputFormat,
            hackathonId: problem.hackathonId || '',
            testCases: problem.testCases || []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingProblem(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            difficulty: 'Easy',
            timeLimit: 1.0,
            memoryLimit: 256,
            inputFormat: '',
            outputFormat: '',
            hackathonId: '',
            testCases: []
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Ensure hackathonId is number or null
        const payload = {
            ...formData,
            hackathonId: formData.hackathonId ? Number(formData.hackathonId) : null
        };

        let res;
        if (editingProblem) {
            res = await updateProblem(editingProblem, payload);
        } else {
            res = await createProblem(payload);
        }

        if (res.success) {
            alert("Problem saved successfully!");
            setEditingProblem(null);
            resetForm();
            loadData();
        } else {
            alert("Failed to save problem: " + res.error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this problem?")) return;
        const res = await deleteProblem(id);
        if (res.success) loadData();
        else alert("Failed to delete");
    };

    // Test Case Management
    const addTestCase = () => {
        setFormData(prev => ({
            ...prev,
            testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: false }]
        }));
    };

    const updateTestCase = (index, field, value) => {
        const newCases = [...formData.testCases];
        newCases[index][field] = value;
        setFormData(prev => ({ ...prev, testCases: newCases }));
    };

    const removeTestCase = (index) => {
        const newCases = formData.testCases.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, testCases: newCases }));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Manage Coding Problems</h1>

            {/* Editor Form */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    {editingProblem ? <Edit2 size={20} className="text-blue-600" /> : <Plus size={20} className="text-green-600" />}
                    {editingProblem ? 'Edit Problem' : 'Create New Problem'}
                </h2>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                            <input type="text" required className="w-full border rounded-lg px-4 py-2"
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Difficulty</label>
                            <select className="w-full border rounded-lg px-4 py-2"
                                value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Description (Markdown supported)</label>
                        <textarea required rows={4} className="w-full border rounded-lg px-4 py-2 font-mono text-sm"
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="# Problem Description..." />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Input Format</label>
                            <textarea rows={2} className="w-full border rounded-lg px-4 py-2 text-sm"
                                value={formData.inputFormat} onChange={e => setFormData({ ...formData, inputFormat: e.target.value })}
                                placeholder="e.g. The first line contains an integer N..." />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Output Format</label>
                            <textarea rows={2} className="w-full border rounded-lg px-4 py-2 text-sm"
                                value={formData.outputFormat} onChange={e => setFormData({ ...formData, outputFormat: e.target.value })}
                                placeholder="e.g. Print the sum of..." />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Time Limit (s)</label>
                            <input type="number" step="0.1" className="w-full border rounded-lg px-4 py-2"
                                value={formData.timeLimit} onChange={e => setFormData({ ...formData, timeLimit: parseFloat(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Memory Limit (MB)</label>
                            <input type="number" className="w-full border rounded-lg px-4 py-2"
                                value={formData.memoryLimit} onChange={e => setFormData({ ...formData, memoryLimit: parseInt(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Assign to Hackathon</label>
                            <select className="w-full border rounded-lg px-4 py-2"
                                value={formData.hackathonId} onChange={e => setFormData({ ...formData, hackathonId: e.target.value })}>
                                <option value="">-- None (Practice) --</option>
                                {hackathons.map(h => (
                                    <option key={h.id} value={h.id}>{h.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Test Cases */}
                    <div className="bg-slate-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700">Test Cases</h3>
                            <button type="button" onClick={addTestCase} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold hover:bg-blue-200">
                                + Add Case
                            </button>
                        </div>

                        {formData.testCases.map((tc, idx) => (
                            <div key={idx} className="flex gap-4 mb-3 items-start">
                                <span className="pt-2 font-bold text-slate-400 text-sm">#{idx + 1}</span>
                                <div className="flex-1">
                                    <textarea placeholder="Input" rows={1} className="w-full border rounded px-2 py-1 text-sm font-mono mb-1"
                                        value={tc.input} onChange={e => updateTestCase(idx, 'input', e.target.value)} />
                                </div>
                                <div className="flex-1">
                                    <textarea placeholder="Expected Output" rows={1} className="w-full border rounded px-2 py-1 text-sm font-mono mb-1"
                                        value={tc.expectedOutput} onChange={e => updateTestCase(idx, 'expectedOutput', e.target.value)} />
                                </div>
                                <div className="pt-1">
                                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                        <input type="checkbox" checked={tc.isHidden} onChange={e => updateTestCase(idx, 'isHidden', e.target.checked)} />
                                        Hidden
                                    </label>
                                </div>
                                <button type="button" onClick={() => removeTestCase(idx)} className="text-red-400 hover:text-red-600 pt-1">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {formData.testCases.length === 0 && <p className="text-sm text-slate-400 italic">No test cases added.</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        {editingProblem && (
                            <button type="button" onClick={handleCancel} className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100">
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2">
                            <Save size={18} /> {editingProblem ? 'Update Problem' : 'Create Problem'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Problem List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-slate-600">ID</th>
                            <th className="p-4 font-bold text-slate-600">Title</th>
                            <th className="p-4 font-bold text-slate-600">Difficulty</th>
                            <th className="p-4 font-bold text-slate-600">Hackathon</th>
                            <th className="p-4 font-bold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {problems.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="p-4 text-slate-500">#{p.id}</td>
                                <td className="p-4 font-bold text-slate-800">{p.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                            p.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>{p.difficulty}</span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    {hackathons.find(h => h.id === p.hackathonId)?.title || '-'}
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleEdit(p)} className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {problems.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-400">No problems found. Create one above.</div>
                )}
            </div>
        </div>
    );
};

export default AdminProblemManagement;
