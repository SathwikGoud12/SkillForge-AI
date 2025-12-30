import NotesServices from "@/src/appwrite/NotesServices";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

const AddNote = () => {
  const noteService = new NotesServices();
  const navigate = useNavigate();
  const {domainId,topicId}=useParams();

  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [codeExample, setCodeExample] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await noteService.createNote({
        title,
        explanation,
        codeExample,
        youtubeUrl,
        topicId,
        order: Number(order),
      });
      alert("Note Added Successfully")
      navigate(`/dashboard/domains/${domainId}/topics/${topicId}`)
    } catch (error) {
      console.error(error);
    }finally{
        setLoading(false);
    }
  }
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add Note</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="useEffect Basics"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Explanation</label>
          <textarea
            className="w-full border p-2 rounded min-h-[120px]"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain the concept clearly..."
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Code Example</label>
          <textarea
            className="w-full border p-2 rounded font-mono min-h-[100px]"
            value={codeExample}
            onChange={(e) => setCodeExample(e.target.value)}
            placeholder={`useEffect(() => {\n  console.log("run");\n}, []);`}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">YouTube Link</label>
          <input
            className="w-full border p-2 rounded"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/..."
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
          {loading ? "Saving..." : "Add Note"}
        </button>
      </form>
    </div>
  );
};

export default AddNote;
