import TopicServices from "@/src/appwrite/TopicServices";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";


const topicService = new TopicServices();

const UserTopics = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTopics() {
    try {
      const res = await topicService.getTopicsByDomain(domainId);
      setTopics(res.rows || []);
    } catch (err) {
      console.error("Failed to load topics", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTopics();
  }, [domainId]);

  if (loading) {
    return <p className="p-6">Loading topics...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Topics</h1>

      {topics.length === 0 ? (
        <p className="text-gray-500">No topics available</p>
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <div
              key={topic.$id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
              onClick={() =>
                navigate(`/user/domains/${domainId}/topics/${topic.$id}`)
              }
            >
              <h2 className="text-lg font-semibold">{topic.title}</h2>
              <p className="text-gray-600 text-sm">{topic.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTopics;
