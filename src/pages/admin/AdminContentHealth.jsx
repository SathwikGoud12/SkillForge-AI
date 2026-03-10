import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, TrendingDown, TrendingUp, Info } from "lucide-react";
import TopicServices from "@/appwrite/TopicServices";
import NotesServices from "@/appwrite/NotesServices";
import AssessmentService from "@/appwrite/AssessmentSevice";
import UserTopicProgressService from "@/appwrite/UserTopicProgressService";

const topicService = new TopicServices();
const noteService = new NotesServices();
const assessmentService = new AssessmentService();
const progressService = new UserTopicProgressService();

const AdminContentHealth = () => {
  const [health, setHealth] = useState({
    noNotes: [],
    noAssessments: [],
    weakTopics: [],
    strongTopics: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  async function fetchHealth() {
    try {
      const [
        topicsRes,
        notesRes,
        assessmentsRes,
        progressRes,
      ] = await Promise.all([
        topicService.getAllTopics(),
        noteService.getAllNotes(),
        assessmentService.getAllAssessments(),
        progressService.getAllProgress(),
      ]);

      const topics = topicsRes.rows || [];
      const notes = notesRes.rows || [];
      const assessments = assessmentsRes.rows || [];
      const progress = progressRes.rows || [];

      const topicIdsWithNotes = new Set(notes.map(n => n.topicId));
      const noNotes = topics.filter(t => !topicIdsWithNotes.has(t.$id));

      const topicIdsWithAssessments = new Set(assessments.map(a => a.topicId));
      const noAssessments = topics.filter(t => !topicIdsWithAssessments.has(t.$id));

      const scoreMap = {};
      progress.forEach(p => {
        if (!scoreMap[p.topicId]) {
          scoreMap[p.topicId] = { total: 0, count: 0 };
        }
        scoreMap[p.topicId].total += p.score || 0;
        scoreMap[p.topicId].count += 1;
      });

      const weakTopics = [];
      const strongTopics = [];

      topics.forEach(t => {
        const stat = scoreMap[t.$id];
        if (!stat) return;
        const avg = stat.total / stat.count;
        if (avg < 60) {
          weakTopics.push({ title: t.title, avg });
        } else if (avg >= 80) {
          strongTopics.push({ title: t.title, avg });
        }
      });

      setHealth({ noNotes, noAssessments, weakTopics, strongTopics });
    } catch (err) {
      console.error("Content health error", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-8 h-full">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Info className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">Platform Health</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Automated Content Audit</p>
        </div>
      </div>

      <div className="space-y-6">
        <HealthSection
          title="Content Gaps"
          items={[
            { label: "Missing Notes", count: health.noNotes.length, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Missing Quizzes", count: health.noAssessments.length, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" }
          ]}
        />

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student Performance</h3>
          <div className="grid grid-cols-1 gap-3">
            <PerformanceBadge
              label="Struggling Topics"
              count={health.weakTopics.length}
              icon={TrendingDown}
              color="rose"
            />
            <PerformanceBadge
              label="Mastered Topics"
              count={health.strongTopics.length}
              icon={TrendingUp}
              color="emerald"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-tighter italic">
          All metrics synchronized with real-time user progress
        </p>
      </div>
    </div>
  );
};

const HealthSection = ({ title, items }) => (
  <div className="space-y-3">
    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h3>
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div key={i} className={`${item.bg} p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all`}>
          <div className="flex flex-col gap-2">
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <div>
              <p className="text-2xl font-black text-slate-900">{item.count}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PerformanceBadge = ({ label, count, icon: Icon, color }) => {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100"
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border ${styles[color]} shadow-sm`}>
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
      </div>
      <span className="text-lg font-black">{count}</span>
    </div>
  );
};

export default AdminContentHealth;
