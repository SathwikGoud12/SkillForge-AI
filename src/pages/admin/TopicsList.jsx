  import TopicServices from "@/src/appwrite/TopicServices";
  import { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router";

  const topicService = new TopicServices();

  const TopicsList = () => {
    const { domainId } = useParams();
    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchTopics() {
      try {
        const res = await topicService.getTopicsByDomain(domainId);
        setTopics(res.rows || []);
      } catch (err) {
        console.error("Failed to fetch topics", err);
      } finally {
        setLoading(false);
      }
    }

    async function deleteTopic(id) {
      if (!confirm("Delete this topic?")) return;

      await topicService.deleteTopic(id);
      fetchTopics();
    }

    useEffect(() => {
      fetchTopics();
    }, [domainId]);

    if (loading) return <p>Loading topics...</p>;

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Topics</h2>

          <button
            onClick={() =>
              navigate(`/dashboard/domains/${domainId}/add-topic`)
            }
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Topic
          </button>
        </div>

      {topics.length === 0 && <p>No topics yet.</p>}

       {topics.map((topic) => (
  <div
    key={topic.$id}
    onClick={() =>
      navigate(
        `/dashboard/domains/${domainId}/topics/${topic.$id}`
      )
    }
    className="border p-4 rounded mb-3 flex justify-between cursor-pointer hover:bg-gray-50"
  >
    <div>
      <h3 className="font-semibold">{topic.title}</h3>
      <p className="text-sm text-gray-600">
        {topic.description}
      </p>
    </div>

    {/* RIGHT SIDE (Buttons) */}
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation(); // ⭐ VERY IMPORTANT
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
          e.stopPropagation(); // ⭐ VERY IMPORTANT
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
