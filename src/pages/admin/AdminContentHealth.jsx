import { useEffect, useState } from "react";
import TopicServices from "@/src/appwrite/TopicServices";
import NotesServices from "@/src/appwrite/NotesServices";
import AssessmentService from "@/src/appwrite/AssessmentSevice";
import UserTopicProgressService from "@/src/appwrite/UserTopicProgressService";

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

      // -------- Topics without Assessments --------
      const topicIdsWithAssessments = new Set(
        assessments.map(a => a.topicId)
      );
      const noAssessments = topics.filter(
        t => !topicIdsWithAssessments.has(t.$id)
      );

      // -------- Avg score per topic --------
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

      setHealth({
        noNotes,
        noAssessments,
        weakTopics,
        strongTopics,
      });
    } catch (err) {
      console.error("Content health error", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="p-6">Loading content health...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

      {/* Topics Without Notes */}
      <HealthCard
        title="Topics without Notes"
        items={health.noNotes}
        color="red"
      />

      {/* Topics Without Assessments */}
      <HealthCard
        title="Topics without Assessments"
        items={health.noAssessments}
        color="orange"
      />

      {/* Weak Topics */}
      <HealthCard
        title="Weak Topics (Avg < 60%)"
        items={health.weakTopics}
        color="red"
        showScore
      />

      {/* Strong Topics */}
      <HealthCard
        title="Strong Topics (Avg ≥ 80%)"
        items={health.strongTopics}
        color="green"
        showScore
      />

    </div>
  );
};

const HealthCard = ({ title, items, color, showScore }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h2 className={`text-lg font-semibold mb-3 text-${color}-600`}>
      {title}
    </h2>

    {items.length === 0 ? (
      <p className="text-gray-500">All good 🎉</p>
    ) : (
      <ul className="space-y-2">
        {items.slice(0, 6).map((item, i) => (
          <li key={i} className="flex justify-between">
            <span>{item.title}</span>
            {showScore && (
              <span className="font-semibold">
                {Math.round(item.avg)}%
              </span>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default AdminContentHealth;
