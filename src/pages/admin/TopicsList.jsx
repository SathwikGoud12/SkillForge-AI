import TopicServices from "@/appwrite/TopicServices";
import DomainProjectService from "@/appwrite/DomainProjectService";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { Rocket, Edit, Trash2, Target, Clock } from "lucide-react";

const topicService = new TopicServices();
const projectService = new DomainProjectService();

const TopicsList = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();

  async function fetchTopics() {
    try {
      const responseData = await topicService.getTopicsByDomain(domainId);
      return responseData.rows || [];
    } catch (error) {
      console.error("Failed to fetch topics", error);
      throw new Error(error.message);
    }
  }

  async function fetchDomainProject() {
    try {
      const project = await projectService.getProjectByDomain(domainId);
      return project;
    } catch (error) {
      console.error("Failed to fetch domain project", error);
      return null;
    }
  }

  async function deleteTopic(id) {
    if (!confirm("Delete this topic?")) return;

    await topicService.deleteTopic(id);
    fetchTopics();
  }

  async function deleteDomainProject(id) {
    if (!confirm("Delete the final domain project?")) return;

    await projectService.deleteProject(id);
    window.location.reload();
  }

  const {
    data: topics,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["topics", domainId],
    queryFn: fetchTopics,
  });

  const {
    data: domainProject,
    isPending: projectPending,
  } = useQuery({
    queryKey: ["domainProject", domainId],
    queryFn: fetchDomainProject,
  });

  if (isPending || projectPending) return <p>Loading topics...</p>;
  if (isError) return <p>{error.message}</p>;

  const requirements = domainProject
    ? projectService.parseRequirements(domainProject.requirements)
    : [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Topics</h2>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/dashboard/domains/${domainId}/add-final-project`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            🚀 Add Final Project
          </button>

          <button
            onClick={() => navigate(`/dashboard/domains/${domainId}/add-topic`)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Topic
          </button>
        </div>
      </div>

      {/* Final Domain Project Section */}
      {domainProject && (
        <div className="mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{domainProject.title}</h3>
                <p className="text-sm text-purple-600 font-semibold">Final Domain Project</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/dashboard/domains/${domainId}/edit-final-project/${domainProject.$id}`)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                title="Edit Project"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteDomainProject(domainProject.$id)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-slate-700 mb-4">{domainProject.description}</p>

          <div className="flex items-center gap-6 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-slate-700">{domainProject.difficulty}</span>
            </div>
            {domainProject.estimatedHours && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-slate-700">~{domainProject.estimatedHours} hours</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Requirements:</span>
              <span className="font-semibold text-slate-700">{requirements.length}</span>
            </div>
          </div>

          {requirements.length > 0 && (
            <details className="bg-white rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-900 hover:text-purple-600">
                View Requirements ({requirements.length})
              </summary>
              <ul className="mt-3 space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-purple-600 font-bold">{index + 1}.</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {/* Topics List */}
      <h3 className="text-lg font-bold mb-4">Domain Topics</h3>

      {topics.length === 0 && <p>No topics yet.</p>}

      {topics.map((topic) => (
        <div
          key={topic.$id}
          onClick={() =>
            navigate(`/dashboard/domains/${domainId}/topics/${topic.$id}`)
          }
          className="border p-4 rounded mb-3 flex justify-between cursor-pointer hover:bg-gray-50"
        >
          <div>
            <h3 className="font-semibold">{topic.title}</h3>
            <p className="text-sm text-gray-600">{topic.description}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/dashboard/domains/${domainId}/edit-topic/${topic.$id}`
                );
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTopic(topic.$id);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicsList;
