import React, { useState, useEffect } from 'react';
import { getPricing, updatePricing } from '../services/studentApi';
import { Edit2, Check, X, CircleDollarSign } from 'lucide-react';

const AdminPricing = () => {
    const [pricing, setPricing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editForm, setEditForm] = useState({ totalFee: 0, discount: 0 });

    useEffect(() => {
        loadPricing();
    }, []);

    const loadPricing = async () => {
        try {
            const response = await getPricing();
            setPricing(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (item) => {
        setEditingCourse(item.course);
        setEditForm({ totalFee: item.totalFee, discount: item.discount });
    };

    const handleCancelEdit = () => {
        setEditingCourse(null);
        setEditForm({ totalFee: 0, discount: 0 });
    };

    const handleSaveEdit = async (courseName) => {
        try {
            const response = await updatePricing(courseName, editForm.totalFee, editForm.discount);
            if (response.success) {
                setPricing(prev => prev.map(item =>
                    item.course === courseName ? { ...item, totalFee: Number(editForm.totalFee), discount: Number(editForm.discount) } : item
                ));
                setEditingCourse(null);
            }
        } catch (error) {
            console.error("Failed to update pricing", error);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">Manage Pricing</h1>
                <p className="text-slate-500">Update course fees and standard offers</p>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 pl-6 font-bold text-slate-700 text-sm">Course Domain</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Base Fee</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Standard Discount</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Final Price</th>
                                <th className="p-4 pr-6 text-right font-bold text-slate-700 text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pricing.map((item) => (
                                <tr key={item.course} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4 pl-6 font-medium text-slate-900">{item.course}</td>

                                    {/* Fee Column */}
                                    <td className="p-4 text-slate-700 font-medium">
                                        {editingCourse === item.course ? (
                                            <input
                                                type="number"
                                                className="w-28 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                value={editForm.totalFee}
                                                onChange={(e) => setEditForm({ ...editForm, totalFee: e.target.value })}
                                            />
                                        ) : (
                                            `₹${item.totalFee.toLocaleString()}`
                                        )}
                                    </td>

                                    {/* Discount Column */}
                                    <td className="p-4 text-slate-700 font-medium">
                                        {editingCourse === item.course ? (
                                            <input
                                                type="number"
                                                className="w-28 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                value={editForm.discount}
                                                onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                                            />
                                        ) : (
                                            item.discount > 0 ? (
                                                <span className="text-green-600 font-bold">-₹{item.discount.toLocaleString()}</span>
                                            ) : '-'
                                        )}
                                    </td>

                                    {/* Calculated Final Price */}
                                    <td className="p-4 text-slate-900 font-bold">
                                        ₹{(item.totalFee - item.discount).toLocaleString()}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {editingCourse === item.course ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveEdit(item.course)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Save"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditClick(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Pricing"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPricing;
