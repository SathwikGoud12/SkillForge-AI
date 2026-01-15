import TopicServices from "@/src/appwrite/TopicServices";
import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";

const topicService = new TopicServices();

const AddTopic = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);

  const createTopic = async (data) => {
    return topicService.createTopic(data);
  };

  const mutation= useMutation({
    mutationFn: createTopic,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topics", domainId],
      });

      alert("Topic added successfully");
      navigate(`/dashboard/domains/${domainId}/topics`);
    },

    onError: (error) => {
      console.error(error);
      alert("Failed to add topic");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    mutation.mutate({
      title,
      description,
      domainId,
      order: Number(order),
      isActive: true,
    });
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Topic</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="React Basics"
          required
        />

        <textarea
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What this topic covers"
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />

        <button
          disabled={mutation.isPending}
          className={`w-full py-2 rounded text-white ${
           mutation.isPending ? "bg-gray-400" : "bg-black"
          }`}
        >
          {mutation.isPending ? "Adding..." : "Add Topic"}
        </button>
      </form>
    </div>
  );
};

export default AddTopic;
