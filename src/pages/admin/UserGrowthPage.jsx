import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users, TrendingUp, UserCheck, UserPlus, RefreshCw, Award, Activity
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import UserTopicProgressService from "@/appwrite/UserTopicProgressService";

const progressService = new UserTopicProgressService();

const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ACCENT = "#6366f1";
const ACCENT2 = "#a855f7";

export default function UserGrowthPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalUsers: 0,
    activeThisMonth: 0,
    avgProgressPerUser: 0,
    completedTopics: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const progressRes = await progressService.getAllProgress();
      const rows = progressRes?.rows || [];

      // Unique users
      const uniqueUsers = new Set(rows.map((r) => r.userId));
      const totalUsers = uniqueUsers.size;

      // Active this month
      const currentMonth = new Date().getMonth();
      const activeThisMonth = new Set(
        rows
          .filter((r) => r.$createdAt && new Date(r.$createdAt).getMonth() === currentMonth)
          .map((r) => r.userId)
      ).size;

      // Avg progress per user
      const userScores = {};
      rows.forEach((r) => {
        if (!userScores[r.userId]) userScores[r.userId] = [];
        userScores[r.userId].push(r.score || 0);
      });
      const allAvgs = Object.values(userScores).map(
        (scores) => scores.reduce((a, b) => a + b, 0) / scores.length
      );
      const avgProgressPerUser = allAvgs.length
        ? Math.round(allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length)
        : 0;

      // Completed topics (score >= 80)
      const completedTopics = rows.filter((r) => (r.score || 0) >= 80).length;

      setSummaryStats({ totalUsers, activeThisMonth, avgProgressPerUser, completedTopics });

      // Monthly registration chart
      const monthlyMap = {};
      rows.forEach((row) => {
        if (!row.$createdAt) return;
        const month = new Date(row.$createdAt).toLocaleString("default", { month: "short" });
        monthlyMap[month] = (monthlyMap[month] || new Set()).add(row.userId);
      });

      const data = MONTH_ORDER.filter((m) => monthlyMap[m]).map((m) => ({
        month: m,
        users: monthlyMap[m].size,
      }));

      setChartData(data);
    } catch (err) {
      console.error("UserGrowthPage error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRefresh = () => { setRefreshing(true); fetchData(); };

  const lineChartOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "#fff",
      borderWidth: 0,
      padding: 16,
      textStyle: { color: "#1e293b", fontWeight: "bold", fontSize: 13 },
      shadowBlur: 24,
      shadowColor: "rgba(99,102,241,0.12)",
      borderRadius: 14,
    },
    grid: { left: "2%", right: "4%", bottom: "3%", top: "5%", containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: chartData.map((d) => d.month),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#94a3b8", fontWeight: "bold", fontSize: 12, margin: 16 },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "#f1f5f9" } },
      axisLine: { show: false },
      axisLabel: { color: "#94a3b8", fontWeight: "bold", fontSize: 12 },
    },
    series: [
      {
        name: "Active Users",
        data: chartData.map((d) => d.users),
        type: "line",
        smooth: 0.4,
        symbol: "circle",
        symbolSize: 10,
        itemStyle: { color: ACCENT, borderColor: "#fff", borderWidth: 2 },
        lineStyle: { width: 4, color: ACCENT, shadowBlur: 16, shadowColor: "rgba(99,102,241,0.3)" },
        areaStyle: {
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(99,102,241,0.22)" },
              { offset: 1, color: "rgba(99,102,241,0.01)" },
            ],
          },
        },
        animationDuration: 1800,
        animationEasing: "cubicInOut",
      },
    ],
  };

  const statCards = [
    { label: "Total Learners", value: summaryStats.totalUsers, icon: Users, gradient: "from-violet-500 to-indigo-600", light: "bg-violet-50", text: "text-violet-700" },
    { label: "Active This Month", value: summaryStats.activeThisMonth, icon: UserCheck, gradient: "from-emerald-400 to-teal-500", light: "bg-emerald-50", text: "text-emerald-700" },
    { label: "Avg Score / User", value: `${summaryStats.avgProgressPerUser}%`, icon: TrendingUp, gradient: "from-amber-400 to-orange-500", light: "bg-amber-50", text: "text-amber-700" },
    { label: "Topics Completed", value: summaryStats.completedTopics, icon: Award, gradient: "from-rose-500 to-pink-600", light: "bg-rose-50", text: "text-rose-700" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Growth Data…</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-md">Live</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Growth</h1>
          <p className="text-slate-500 font-medium mt-1">Learner registration velocity &amp; engagement analytics</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleRefresh} disabled={refreshing}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm hover:shadow-md transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </motion.button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center gap-5 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradient} opacity-[0.07] rounded-bl-full -mr-3 -mt-3 group-hover:scale-110 transition-transform`} />
            <div className={`w-13 h-13 w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h2 className="text-3xl font-black text-slate-900">{card.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Learner Registration Velocity</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Monthly unique active learners</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No registration data yet</p>
            <p className="text-slate-300 text-xs font-medium">Data will appear once users start enrolling</p>
          </div>
        ) : (
          <ReactECharts option={lineChartOption} style={{ height: 360 }} />
        )}
      </motion.div>

      {/* Empty state tip */}
      {chartData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <UserPlus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-black text-indigo-900">Growth Tracking Active</p>
            <p className="text-sm text-indigo-600 font-medium mt-1">
              Once learners start engaging with topics, their registration and activity data will automatically appear here.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
