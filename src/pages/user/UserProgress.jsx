import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp, Award, Clock, Flame, BookOpen,
    Target, Calendar, BarChart3, CheckCircle2, Zap
} from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from "recharts";

const UserProgress = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => { setTimeout(() => setLoading(false), 400); }, []);

    const statsData = {
        topicsCompleted: 24,
        assessmentsPassed: 18,
        totalLearningTime: 1247,
        currentStreak: 7
    };

    const dailyActivityData = [
        { date: "Jan 1", minutes: 45 }, { date: "Jan 5", minutes: 60 },
        { date: "Jan 7", minutes: 30 }, { date: "Jan 9", minutes: 75 },
        { date: "Jan 11", minutes: 90 }, { date: "Jan 13", minutes: 45 },
        { date: "Jan 15", minutes: 60 }, { date: "Jan 17", minutes: 80 },
        { date: "Jan 19", minutes: 50 }, { date: "Jan 21", minutes: 70 },
        { date: "Jan 23", minutes: 40 }, { date: "Jan 25", minutes: 85 },
        { date: "Jan 27", minutes: 95 }, { date: "Jan 28", minutes: 55 },
        { date: "Jan 29", minutes: 65 }, { date: "Jan 30", minutes: 90 },
    ];

    const domainProgressData = [
        { name: "MERN Stack", completed: 85, color: "#8b5cf6" },
        { name: "React.js", completed: 92, color: "#6366f1" },
        { name: "Node.js", completed: 78, color: "#10b981" },
        { name: "MongoDB", completed: 65, color: "#f59e0b" },
        { name: "Express.js", completed: 70, color: "#ef4444" }
    ];

    const assessmentData = [
        { name: "React Basics", score: 95, passed: true },
        { name: "Node.js API", score: 88, passed: true },
        { name: "MongoDB", score: 72, passed: true },
        { name: "Express Routing", score: 90, passed: true },
        { name: "Full Stack", score: 85, passed: true },
        { name: "Advanced React", score: 78, passed: true }
    ];

    const generateHeatmapData = () => {
        const data = [];
        const today = new Date();
        for (let i = 89; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split("T")[0],
                activity: Math.floor(Math.random() * 6),
            });
        }
        return data;
    };
    const heatmapData = generateHeatmapData();

    const getActivityColor = (level) => {
        const colors = ["#f1f5f9", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"];
        return colors[level] || colors[0];
    };

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-semibold">Loading your progress…</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            value: statsData.topicsCompleted,
            label: "Topics Completed",
            icon: BookOpen,
            gradient: "from-violet-500 to-indigo-600",
            bg: "bg-violet-50",
            text: "text-violet-600",
            change: "+3 this week",
        },
        {
            value: statsData.assessmentsPassed,
            label: "Assessments Passed",
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-teal-500",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            change: "+2 this week",
        },
        {
            value: formatTime(statsData.totalLearningTime),
            label: "Total Learning Time",
            icon: Clock,
            gradient: "from-amber-400 to-orange-500",
            bg: "bg-amber-50",
            text: "text-amber-600",
            change: "+4h this week",
        },
        {
            value: `${statsData.currentStreak} days`,
            label: "Current Streak 🔥",
            icon: Flame,
            gradient: "from-rose-500 to-pink-500",
            bg: "bg-rose-50",
            text: "text-rose-600",
            change: "Best: 12 days",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── Header ─────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-3xl overflow-hidden p-8 text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #4f46e5 100%)" }}
                >
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)" }} />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Progress Analytics</h1>
                            <p className="text-violet-200 mt-1">Track your learning journey and achievements</p>
                        </div>
                    </div>
                    {/* decorative orbs */}
                    <div className="absolute right-12 top-6 w-24 h-24 rounded-full bg-white/5" />
                    <div className="absolute right-20 bottom-4 w-12 h-12 rounded-full bg-white/5" />
                </motion.div>

                {/* ── Stat Cards ─────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                            className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col gap-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${card.bg} ${card.text}`}>
                                    {card.change}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
                                <p className="text-slate-500 text-sm mt-0.5 font-medium">{card.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Learning Activity Chart ─────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl p-6 shadow-md border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Daily Learning Activity</h2>
                            <p className="text-slate-400 text-sm">Minutes spent learning per day</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={dailyActivityData}>
                            <defs>
                                <linearGradient id="gradMinutes" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", fontSize: 13 }}
                                formatter={(v) => [`${v} min`, "Learning"]}
                            />
                            <Area type="monotone" dataKey="minutes" stroke="#8b5cf6" strokeWidth={3} fill="url(#gradMinutes)" dot={{ fill: "#8b5cf6", r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* ── Heatmap ────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-3xl p-6 shadow-md border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Activity Heatmap</h2>
                            <p className="text-slate-400 text-sm">Last 90 days of learning activity</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto pb-2">
                        <div className="inline-grid grid-cols-[repeat(13,1fr)] gap-1.5 min-w-max">
                            {heatmapData.map((day, i) => (
                                <div
                                    key={i}
                                    className="w-4 h-4 rounded-md cursor-pointer transition-transform hover:scale-125"
                                    style={{ backgroundColor: getActivityColor(day.activity) }}
                                    title={`${day.date}: ${day.activity} sessions`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-xs text-slate-400 font-medium">Less</span>
                        {[0, 1, 2, 3, 4, 5].map((l) => (
                            <div key={l} className="w-4 h-4 rounded-md" style={{ backgroundColor: getActivityColor(l) }} />
                        ))}
                        <span className="text-xs text-slate-400 font-medium">More</span>
                    </div>
                </motion.div>

                {/* ── Charts Grid ────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Domain Progress */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-3xl p-6 shadow-md border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Domain Progress</h2>
                                <p className="text-slate-400 text-sm">Topics completed per domain</p>
                            </div>
                        </div>

                        {/* Custom progress bars instead of chart */}
                        <div className="space-y-4">
                            {domainProgressData.map((d, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-bold text-slate-700">{d.name}</span>
                                        <span className="text-sm font-black" style={{ color: d.color }}>{d.completed}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${d.completed}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                            className="h-full rounded-full"
                                            style={{ background: `linear-gradient(90deg, ${d.color}cc, ${d.color})` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Assessment Performance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-3xl p-6 shadow-md border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Assessment Scores</h2>
                                <p className="text-slate-400 text-sm">Your latest assessment results</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {assessmentData.map((a, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.score >= 85 ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                        <Zap className={`w-4 h-4 ${a.score >= 85 ? 'text-emerald-600' : 'text-amber-600'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{a.name}</p>
                                        <div className="h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${a.score}%` }}
                                                transition={{ duration: 0.6, delay: i * 0.08 }}
                                                className="h-full rounded-full"
                                                style={{ background: a.score >= 85 ? "linear-gradient(90deg, #10b981, #059669)" : "linear-gradient(90deg, #f59e0b, #d97706)" }}
                                            />
                                        </div>
                                    </div>
                                    <span className={`text-sm font-black flex-shrink-0 ${a.score >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {a.score}%
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default UserProgress;
