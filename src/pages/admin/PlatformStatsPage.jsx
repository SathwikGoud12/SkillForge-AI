import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Layers, FileText, HelpCircle, Rocket,
  TrendingUp, TrendingDown, CheckCircle, AlertCircle,
  RefreshCw, BarChart2, Activity
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import DomainService from "@/appwrite/domainServices";
import TopicServices from "@/appwrite/TopicServices";
import NotesServices from "@/appwrite/NotesServices";
import AssessmentService from "@/appwrite/AssessmentSevice";
import ProjectService from "@/appwrite/ProjectService";
import UserTopicProgressService from "@/appwrite/UserTopicProgressService";

const domainService = new DomainService();
const topicService = new TopicServices();
const noteService = new NotesServices();
const assessmentService = new AssessmentService();
const projectService = new ProjectService();
const progressService = new UserTopicProgressService();

export default function PlatformStatsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    domains: 0, topics: 0, notes: 0, assessments: 0, projects: 0,
    missingNotes: 0, missingAssessments: 0, weakTopics: 0, strongTopics: 0,
  });
  const [domainBreakdown, setDomainBreakdown] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState({ ranges: [], counts: [] });

  const fetchData = useCallback(async () => {
    try {
      const [domainsRes, topicsRes, notesRes, assessmentsRes, projectsRes, progressRes] =
        await Promise.all([
          domainService.getAllDomains(),
          topicService.getAllTopics(),
          noteService.getAllNotes(),
          assessmentService.getAllAssessments(),
          projectService.getAllProjects(),
          progressService.getAllProgress(),
        ]);

      const topics = topicsRes?.rows || [];
      const notes = notesRes?.rows || [];
      const assessments = assessmentsRes?.rows || [];
      const progress = progressRes?.rows || [];

      // Missing content
      const topicIdsWithNotes = new Set(notes.map((n) => n.topicId));
      const topicIdsWithAssessments = new Set(assessments.map((a) => a.topicId));
      const missingNotes = topics.filter((t) => !topicIdsWithNotes.has(t.$id)).length;
      const missingAssessments = topics.filter((t) => !topicIdsWithAssessments.has(t.$id)).length;

      // Weak / Strong topics
      const scoreMap = {};
      progress.forEach((p) => {
        if (!scoreMap[p.topicId]) scoreMap[p.topicId] = { total: 0, count: 0 };
        scoreMap[p.topicId].total += p.score || 0;
        scoreMap[p.topicId].count += 1;
      });
      let weakTopics = 0, strongTopics = 0;
      topics.forEach((t) => {
        const s = scoreMap[t.$id];
        if (!s) return;
        const avg = s.total / s.count;
        if (avg < 60) weakTopics++;
        else if (avg >= 80) strongTopics++;
      });

      // Score distribution
      const ranges = ["0–20", "21–40", "41–60", "61–80", "81–100"];
      const counts = [0, 0, 0, 0, 0];
      progress.forEach((p) => {
        const s = p.score || 0;
        if (s <= 20) counts[0]++;
        else if (s <= 40) counts[1]++;
        else if (s <= 60) counts[2]++;
        else if (s <= 80) counts[3]++;
        else counts[4]++;
      });
      setScoreDistribution({ ranges, counts });

      // Domain breakdown (topics per domain)
      const domains = domainsRes?.rows || [];
      const topicsPerDomain = {};
      topics.forEach((t) => {
        topicsPerDomain[t.domainId] = (topicsPerDomain[t.domainId] || 0) + 1;
      });
      const breakdown = domains
        .map((d) => ({ name: d.title || d.name || "Domain", topics: topicsPerDomain[d.$id] || 0 }))
        .filter((d) => d.topics > 0)
        .sort((a, b) => b.topics - a.topics)
        .slice(0, 8);
      setDomainBreakdown(breakdown);

      setStats({
        domains: domainsRes?.total || domains.length,
        topics: topicsRes?.total || topics.length,
        notes: notesRes?.total || notes.length,
        assessments: assessmentsRes?.total || assessments.length,
        projects: projectsRes?.total || 0,
        missingNotes, missingAssessments, weakTopics, strongTopics,
      });
    } catch (err) {
      console.error("PlatformStatsPage error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  const handleRefresh = () => { setRefreshing(true); fetchData(); };

  // Bar chart — domain breakdown
  const barChartOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#fff",
      borderWidth: 0,
      padding: 16,
      textStyle: { color: "#1e293b", fontWeight: "bold" },
      shadowBlur: 20,
      shadowColor: "rgba(0,0,0,0.08)",
      borderRadius: 14,
    },
    grid: { left: "2%", right: "4%", bottom: "3%", top: "5%", containLabel: true },
    xAxis: {
      type: "category",
      data: domainBreakdown.map((d) => d.name),
      axisLabel: { color: "#94a3b8", fontWeight: "bold", fontSize: 11, rotate: domainBreakdown.length > 4 ? 20 : 0 },
      axisLine: { show: false }, axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#94a3b8", fontWeight: "bold", fontSize: 12 },
      splitLine: { lineStyle: { type: "dashed", color: "#f1f5f9" } },
      axisLine: { show: false },
    },
    series: [{
      name: "Topics",
      type: "bar",
      data: domainBreakdown.map((d) => d.topics),
      barWidth: "50%",
      itemStyle: {
        borderRadius: [10, 10, 0, 0],
        color: {
          type: "linear", x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: "#a855f7" },
            { offset: 1, color: "#6366f1" },
          ],
        },
        shadowBlur: 10,
        shadowColor: "rgba(99,102,241,0.3)",
      },
      animationDuration: 1600,
      animationEasing: "elasticOut",
    }],
  };

  // Score distribution doughnut
  const donutChartOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { orient: "vertical", right: "5%", top: "center", textStyle: { color: "#64748b", fontWeight: "bold", fontSize: 12 } },
    series: [{
      name: "Score Range",
      type: "pie",
      radius: ["50%", "80%"],
      center: ["38%", "50%"],
      avoidLabelOverlap: true,
      label: { show: false },
      labelLine: { show: false },
      data: scoreDistribution.ranges.map((r, i) => ({
        name: r,
        value: scoreDistribution.counts[i],
        itemStyle: { color: ["#f43f5e", "#f97316", "#facc15", "#34d399", "#6366f1"][i] },
      })),
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDuration: 1600,
    }],
  };

  const contentCards = [
    { label: "Total Domains", value: stats.domains, icon: BookOpen, gradient: "from-violet-500 to-indigo-600" },
    { label: "Total Topics", value: stats.topics, icon: Layers, gradient: "from-blue-500 to-cyan-500" },
    { label: "Study Notes", value: stats.notes, icon: FileText, gradient: "from-emerald-500 to-teal-500" },
    { label: "Assessments", value: stats.assessments, icon: HelpCircle, gradient: "from-amber-400 to-orange-500" },
    { label: "Projects", value: stats.projects, icon: Rocket, gradient: "from-rose-500 to-pink-600" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Compiling Platform Stats…</p>
      </div>
    );
  }

  const totalProgress = scoreDistribution.counts.reduce((a, b) => a + b, 0);
  const hasScoreData = totalProgress > 0;
  const hasDomainData = domainBreakdown.length > 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-fuchsia-100 text-fuchsia-700 text-[10px] font-black uppercase tracking-wider rounded-md">Live</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Stats</h1>
          <p className="text-slate-500 font-medium mt-1">Content health, score distributions &amp; domain coverage</p>
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

      {/* Content Volume Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {contentCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col items-start gap-3 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${card.gradient} opacity-[0.07] rounded-bl-full -mr-2 -mt-2 group-hover:scale-125 transition-transform`} />
            <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center text-white shadow-md`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">{card.value}</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Health Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Missing Notes", value: stats.missingNotes, icon: AlertCircle, color: "amber", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
          { label: "Missing Quizzes", value: stats.missingAssessments, icon: AlertCircle, color: "rose", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
          { label: "Struggling Topics", value: stats.weakTopics, icon: TrendingDown, color: "orange", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100" },
          { label: "Mastered Topics", value: stats.strongTopics, icon: TrendingUp, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            className={`${item.bg} border ${item.border} rounded-2xl p-5 flex items-center gap-4`}
          >
            <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm`}>
              <item.icon className={`w-5 h-5 ${item.text}`} />
            </div>
            <div>
              <h3 className={`text-2xl font-black ${item.text}`}>{item.value}</h3>
              <p className={`text-[11px] font-bold uppercase tracking-widest ${item.text} opacity-70`}>{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Domain Breakdown Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Topics per Domain</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Content distribution across domains</p>
            </div>
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          {hasDomainData ? (
            <ReactECharts option={barChartOption} style={{ height: 300 }} />
          ) : (
            <EmptyChart icon={BarChart2} message="No domain data yet" />
          )}
        </motion.div>

        {/* Score Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Score Distribution</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Assessment performance ranges</p>
            </div>
            <div className="w-10 h-10 bg-fuchsia-50 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-fuchsia-600" />
            </div>
          </div>
          {hasScoreData ? (
            <ReactECharts option={donutChartOption} style={{ height: 300 }} />
          ) : (
            <EmptyChart icon={Activity} message="No assessment scores yet" />
          )}
        </motion.div>
      </div>

      {/* Platform Health Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 border border-indigo-100 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wide">Platform Health Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Content Score</p>
            <p className="text-xl font-black text-slate-900 mt-1">
              {stats.topics > 0 ? `${Math.round(((stats.notes + stats.assessments) / (stats.topics * 2)) * 100)}%` : "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Coverage</p>
            <p className="text-xl font-black text-slate-900 mt-1">
              {stats.topics > 0 ? `${Math.round(((stats.topics - stats.missingNotes) / stats.topics) * 100)}%` : "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Avg per Domain</p>
            <p className="text-xl font-black text-slate-900 mt-1">
              {stats.domains > 0 ? Math.round(stats.topics / stats.domains) : 0} topics
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Action Items</p>
            <p className="text-xl font-black text-rose-600 mt-1">
              {stats.missingNotes + stats.missingAssessments}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function EmptyChart({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-3">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
        <Icon className="w-7 h-7 text-slate-300" />
      </div>
      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{message}</p>
    </div>
  );
}
