import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import TopicService from "@/src/appwrite/topicServices";

const topicService = new TopicService();

const AddTopic = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await topicService.createTopic({
        title,
        description,
        domainId,          
        order: Number(order),
        isActive: true,
      });

      alert("Topic added successfully");
      navigate(`/dashboard/domains/${domainId}/topics`);
    } catch (err) {
      console.error(err);
      alert("Failed to add topic");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Topic</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block font-medium mb-1">Topic Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="React Basics"
            required
          />
        </div>

        
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this topic covers"
          />
        </div>

        
        <div>
          <label className="block font-medium mb-1">Order</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            min="0"
          />
        </div>

        <button
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Adding..." : "Add Topic"}
        </button>
      </form>
    </div>
  );
};

export default AddTopic;
