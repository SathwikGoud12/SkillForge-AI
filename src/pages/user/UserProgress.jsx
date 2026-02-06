import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Award,
    Clock,
    Flame,
    BookOpen,
    Target,
    Calendar,
    BarChart3
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts";

const UserProgress = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data loading
        setTimeout(() => setLoading(false), 500);
    }, []);

    // Mock data - Replace with real API calls
    const statsData = {
        topicsCompleted: 24,
        assessmentsPassed: 18,
        totalLearningTime: 1247, // minutes
        currentStreak: 7 // days
    };

    // Daily learning activity (last 30 days)
    const dailyActivityData = [
        { date: "Jan 1", minutes: 45, topics: 2 },
        { date: "Jan 2", minutes: 60, topics: 3 },
        { date: "Jan 3", minutes: 30, topics: 1 },
        { date: "Jan 4", minutes: 0, topics: 0 },
        { date: "Jan 5", minutes: 75, topics: 4 },
        { date: "Jan 6", minutes: 90, topics: 5 },
        { date: "Jan 7", minutes: 45, topics: 2 },
        { date: "Jan 8", minutes: 60, topics: 3 },
        { date: "Jan 9", minutes: 80, topics: 4 },
        { date: "Jan 10", minutes: 50, topics: 2 },
        { date: "Jan 11", minutes: 70, topics: 3 },
        { date: "Jan 12", minutes: 40, topics: 2 },
        { date: "Jan 13", minutes: 0, topics: 0 },
        { date: "Jan 14", minutes: 85, topics: 4 },
        { date: "Jan 15", minutes: 95, topics: 5 },
        { date: "Jan 16", minutes: 55, topics: 3 },
        { date: "Jan 17", minutes: 65, topics: 3 },
        { date: "Jan 18", minutes: 75, topics: 4 },
        { date: "Jan 19", minutes: 45, topics: 2 },
        { date: "Jan 20", minutes: 90, topics: 5 },
        { date: "Jan 21", minutes: 60, topics: 3 },
        { date: "Jan 22", minutes: 70, topics: 4 },
        { date: "Jan 23", minutes: 50, topics: 2 },
        { date: "Jan 24", minutes: 80, topics: 4 },
        { date: "Jan 25", minutes: 40, topics: 2 },
        { date: "Jan 26", minutes: 0, topics: 0 },
        { date: "Jan 27", minutes: 100, topics: 6 },
        { date: "Jan 28", minutes: 85, topics: 5 },
        { date: "Jan 29", minutes: 75, topics: 4 },
        { date: "Jan 30", minutes: 90, topics: 5 }
    ];

    // Domain-wise progress
    const domainProgressData = [
        { name: "MERN Stack", completed: 85, total: 100, color: "#8b5cf6" },
        { name: "React.js", completed: 92, total: 100, color: "#3b82f6" },
        { name: "Node.js", completed: 78, total: 100, color: "#10b981" },
        { name: "MongoDB", completed: 65, total: 100, color: "#f59e0b" },
        { name: "Express.js", completed: 70, total: 100, color: "#ef4444" }
    ];

    // Assessment performance
    const assessmentData = [
        { name: "React Basics", score: 95, passed: true },
        { name: "Node.js API", score: 88, passed: true },
        { name: "MongoDB Queries", score: 72, passed: true },
        { name: "Express Routing", score: 90, passed: true },
        { name: "Full Stack Project", score: 85, passed: true },
        { name: "Advanced React", score: 78, passed: true }
    ];

    // Heatmap data (last 90 days)
    const generateHeatmapData = () => {
        const data = [];
        const today = new Date();
        for (let i = 89; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const activity = Math.floor(Math.random() * 6); // 0-5 activity level
            data.push({
                date: date.toISOString().split('T')[0],
                activity: activity,
                day: date.getDay()
            });
        }
        return data;
    };

    const heatmapData = generateHeatmapData();

    const getActivityColor = (level) => {
        const colors = [
            "#ebedf0", // 0 - no activity
            "#c6e48b", // 1 - low
            "#7bc96f", // 2 - medium-low
            "#239a3b", // 3 - medium
            "#196127", // 4 - medium-high
            "#0d4429"  // 5 - high
        ];
        return colors[level] || colors[0];
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <BarChart3 className="w-10 h-10 text-blue-600" />
                        Progress Analytics
                    </h1>
                    <p className="text-slate-600">Track your learning journey and achievements</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Topics Completed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{statsData.topicsCompleted}</h3>
                        <p className="text-slate-600 text-sm">Topics Completed</p>
                    </motion.div>

                    {/* Assessments Passed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{statsData.assessmentsPassed}</h3>
                        <p className="text-slate-600 text-sm">Assessments Passed</p>
                    </motion.div>

                    {/* Total Learning Time */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{formatTime(statsData.totalLearningTime)}</h3>
                        <p className="text-slate-600 text-sm">Total Learning Time</p>
                    </motion.div>

                    {/* Current Streak */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{statsData.currentStreak} days</h3>
                        <p className="text-slate-600 text-sm">Current Streak</p>
                    </motion.div>
                </div>

                {/* Learning Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 mb-8"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        Daily Learning Activity
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dailyActivityData}>
                            <defs>
                                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="date" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "2px solid #e2e8f0",
                                    borderRadius: "12px",
                                    padding: "12px"
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="minutes"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorMinutes)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Learning Heatmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 mb-8"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        Learning Heatmap (Last 90 Days)
                    </h2>
                    <div className="overflow-x-auto">
                        <div className="inline-grid grid-cols-13 gap-1">
                            {heatmapData.map((day, index) => (
                                <div
                                    key={index}
                                    className="w-4 h-4 rounded-sm cursor-pointer hover:ring-2 hover:ring-blue-600 transition-all"
                                    style={{ backgroundColor: getActivityColor(day.activity) }}
                                    title={`${day.date}: ${day.activity} activities`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">
                            <span>Less</span>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4, 5].map((level) => (
                                    <div
                                        key={level}
                                        className="w-4 h-4 rounded-sm"
                                        style={{ backgroundColor: getActivityColor(level) }}
                                    />
                                ))}
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </motion.div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Domain Progress */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Target className="w-6 h-6 text-blue-600" />
                            Domain Progress
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={domainProgressData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "2px solid #e2e8f0",
                                        borderRadius: "12px",
                                        padding: "12px"
                                    }}
                                />
                                <Bar dataKey="completed" radius={[8, 8, 0, 0]}>
                                    {domainProgressData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Assessment Performance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Award className="w-6 h-6 text-blue-600" />
                            Assessment Performance
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={assessmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={100} />
                                <YAxis stroke="#64748b" domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "2px solid #e2e8f0",
                                        borderRadius: "12px",
                                        padding: "12px"
                                    }}
                                />
                                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                    {assessmentData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.passed ? "#10b981" : "#ef4444"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UserProgress;
