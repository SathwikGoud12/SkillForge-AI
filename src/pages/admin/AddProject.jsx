import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProjectService from "@/src/appwrite/ProjectService";
import TopicServices from "@/src/appwrite/TopicServices";


const projectService = new ProjectService();
const topicService = new TopicServices();

const AddProject = () => {
  const navigate = useNavigate();
  const { domainId } = useParams();
  const queryClient = useQueryClient();

  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  async function fetchTopics() {
    const res = await topicService.getTopicsByDomain(domainId);
    setTopics(res.rows || []);
  }

  useEffect(() => {
    fetchTopics();
  }, [domainId]);

  const mutation = useMutation({
    mutationFn: (data) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", domainId] });
      alert("Project added successfully");
      navigate(
        `/dashboard/domains/${domainId}/topics/${topicId}`,
        { replace: true }
      );
    },
    onError: (error) => {
      alert("Cannot add project");
      console.error(error);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    mutation.mutate({
      title,
      description,
      techStack,
      githubUrl,
      liveUrl,
      topicId,
      domainId,
    });
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
          placeholder="Tech Stack"
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
          disabled={mutation.isPending}
          className="w-full bg-black text-white py-2 rounded"
        >
          {mutation.isPending ? "Saving..." : "Add Project"}
        </button>
      </form>
    </div>
  );
};

export default AddProject;
