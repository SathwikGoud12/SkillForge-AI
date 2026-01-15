import { useEffect, useState, useCallback } from "react";

import DomainService from "@/src/appwrite/domainServices";
import TopicServices from "@/src/appwrite/TopicServices";
import NotesServices from "@/src/appwrite/NotesServices";
import AssessmentService from "@/src/appwrite/AssessmentSevice";
import ProjectService from "@/src/appwrite/ProjectService";
import UserTopicProgressService from "@/src/appwrite/UserTopicProgressService";

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

        const month = new Date(row.$createdAt).toLocaleString("default", {
          month: "short",
        });

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
    }
  }, []);

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  if (loading) {
    return <p className="p-6">Loading admin overview...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Overview</h1>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Domains" value={stats.domains} />
        <StatCard title="Total Topics" value={stats.topics} />
        <StatCard title="Total Notes" value={stats.notes} />
        <StatCard title="Total MCQs" value={stats.assessments} />
        <StatCard title="Total Projects" value={stats.projects} />
        <StatCard title="Active Learners" value={stats.activeUsers} />
      </div>

      <UserGrowthChart data={userGrowth} />

      <AdminContentHealth/>

    </div>
  );
};

export default AdminOverview;
