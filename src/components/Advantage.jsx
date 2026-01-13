import { useRef, useEffect } from 'react';
import { Award, CheckCircle, Users, Zap, Briefcase, TrendingUp } from 'lucide-react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

const StatCard = ({ stat, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const springValue = useSpring(0, { stiffness: 60, damping: 15 });
    const displayValue = useTransform(springValue, (latest) => {
        if (stat.value % 1 !== 0) {
            return latest.toFixed(1);
        }
        return Math.floor(latest);
    });

    useEffect(() => {
        if (isInView) {
            springValue.set(stat.value);
        }
    }, [isInView, stat.value, springValue]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center justify-center p-6"
        >
            <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2 flex items-center tracking-tight">
                <motion.span>{displayValue}</motion.span>
                <span className="text-blue-600">{stat.suffix}</span>
            </div>
            {stat.stars && <div className="text-amber-400 text-sm mb-2 flex gap-1">★★★★★</div>}
            <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
        </motion.div>
    );
};

const Advantage = () => {
    return (
        <section id="benefits" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6">

                {/* Statistics Row */}
                <div className="mb-24 bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                        {[
                            { label: 'Average Rating', value: 4.9, suffix: '', stars: true },
                            { label: 'Students Trained', value: 5000, suffix: '+' },
                            { label: 'Placement Rate', value: 85, suffix: '%' },
                            { label: 'Industry Mentors', value: 50, suffix: '+' }
                        ].map((stat, idx) => (
                            <StatCard key={idx} stat={stat} index={idx} />
                        ))}
                    </div>
                </div>

                {/* Features */}
                {/* Features Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider mb-6">
                        <TrendingUp size={16} />
                        <span>Why Choose Tsar IT</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold font-display text-slate-900 mb-6 leading-tight">
                        The Competitive Edge <span className="text-slate-400">You Need.</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Our IT internship program bridges the gap between academic theory and industry reality.
                        You won't just learn; you'll build, deploy, and collaborate just like you would in a top tech company.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Side Small Features */}
                    {/* Left Side Small Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                <CheckCircle size={24} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg mb-2">Verified Certificate</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Recognized by top companies across India and abroad.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                                <Users size={24} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg mb-2">Network</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Join a community of 5000+ ambitious developers.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                                <Zap size={24} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg mb-2">Live Projects</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Work on production-grade applications.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Briefcase size={24} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg mb-2">Placement Support</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Resume building, mock interviews, and referrals.</p>
                        </div>
                    </div>

                    {/* Right Side Cards */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-full blur-[100px] opacity-40"></div>
                        <div className="relative grid grid-cols-1 gap-6">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
                            >
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/30">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Hands-on Training</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Forget borning lectures. We focus on 80% practical application and 20% theory.
                                    You will write code from day one.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 ml-0 lg:ml-12"
                            >
                                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/30">
                                    <Award size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Industry Mentorship</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Get 1-on-1 guidance from experienced seniors who are currently working at
                                    companies like Amazon, Google, and Microsoft.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Advantage;
