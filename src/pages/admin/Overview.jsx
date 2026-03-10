import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Rocket,
  Users,
  Zap,
  TrendingUp,
  RefreshCw
} from "lucide-react";

import DomainService from "@/appwrite/domainServices";
import TopicServices from "@/appwrite/TopicServices";
import NotesServices from "@/appwrite/NotesServices";
import AssessmentService from "@/appwrite/AssessmentSevice";
import ProjectService from "@/appwrite/ProjectService";
import UserTopicProgressService from "@/appwrite/UserTopicProgressService";

import StatCard from "./StatCard";
import UserGrowthChart from "./UserGrowthChart";
import AdminContentHealth from "./AdminContentHealth";

const domainService = new DomainService();
const topicService = new TopicServices();
const noteService = new NotesServices();
const assessmentService = new AssessmentService();
const projectService = new ProjectService();
const progressService = new UserTopicProgressService();

const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AdminOverview = () => {
  const [stats, setStats] = useState({
    domains: 0,
    topics: 0,
    notes: 0,
    assessments: 0,
    projects: 0,
    activeUsers: 0,
  });

  const [userGrowth, setUserGrowth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminStats = useCallback(async () => {
    try {
      const [
        domainsRes,
        topicsRes,
        notesRes,
        assessmentsRes,
        projectsRes,
        progressRes,
      ] = await Promise.all([
        domainService.getAllDomains(),
        topicService.getAllTopics(),
        noteService.getAllNotes(),
        assessmentService.getAllAssessments(),
        projectService.getAllProjects(),
        progressService.getAllProgress(),
      ]);

      const rows = progressRes?.rows || [];
      const uniqueUsers = new Set(rows.map(r => r.userId));

      setStats({
        domains: domainsRes?.total || 0,
        topics: topicsRes?.total || 0,
        notes: notesRes?.total || 0,
        assessments: assessmentsRes?.total || 0,
        projects: projectsRes?.total || 0,
        activeUsers: uniqueUsers.size,
      });

      const monthlyMap = {};
      rows.forEach(row => {
        if (!row.$createdAt) return;
        const month = new Date(row.$createdAt).toLocaleString("default", { month: "short" });
        monthlyMap[month] = (monthlyMap[month] || 0) + 1;
      });

      const chartData = MONTH_ORDER
        .filter(month => monthlyMap[month])
        .map(month => ({
          month,
          users: monthlyMap[month],
        }));

      setUserGrowth(chartData);
    } catch (error) {
      console.error("Admin Overview error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAdminStats();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Initializing Admin Suite...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-md">Live Platform</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Command</h1>
          <p className="text-slate-500 font-medium">Real-time ecosystem analytics & content management</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm hover:shadow-md transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard title="Domains" value={stats.domains} icon={BookOpen} color="violet" />
        <StatCard title="Topics" value={stats.topics} icon={Layers} color="blue" />
        <StatCard title="Study Notes" value={stats.notes} icon={FileText} color="emerald" />
        <StatCard title="Assessments" value={stats.assessments} icon={HelpCircle} color="amber" />
        <StatCard title="Projects" value={stats.projects} icon={Rocket} color="rose" />
        <StatCard title="Total Learners" value={stats.activeUsers} icon={Users} color="indigo" />
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UserGrowthChart data={userGrowth} />
        </div>
        <div>
          <AdminContentHealth stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
