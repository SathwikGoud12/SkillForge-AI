import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ProjectService from "@/src/appwrite/ProjectService";
import TopicServices from "@/src/appwrite/TopicServices";

const projectService = new ProjectService();
const topicService = new TopicServices();

const AddProject = () => {
  const navigate = useNavigate();
  const { domainId } = useParams();

  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTopics() {
      const res = await topicService.getTopicsByDomain(domainId);
      setTopics(res.rows || []);
    }
    fetchTopics();
  }, [domainId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await projectService.createProject({
        title,
        description,
        techStack,
        githubUrl,
        liveUrl,
        topicId,
      });

      alert("Project added successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to add project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Tech Stack (React, HTML, CSS)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="GitHub URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Live URL"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          required
        >
          <option value="">Select Topic</option>
          {topics.map((t) => (
            <option key={t.$id} value={t.$id}>
              {t.title}
            </option>
          ))}
        </select>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Add Project"}
        </button>
      </form>
    </div>
  );
};

export default AddProject;
