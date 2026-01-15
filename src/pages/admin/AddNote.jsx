import NotesServices from "@/src/appwrite/NotesServices";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useState } from "react";
import {useNavigate, useParams } from "react-router";

const AddNote = () => {
  const noteService = new NotesServices();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { domainId, topicId } = useParams();
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [codeExample, setCodeExample] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [order, setOrder] = useState(0);
  
  const createNotes=async(noteData)=>{
return noteService.createNote(noteData)
  }
  const mutation = useMutation({
    mutationFn: createNotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", topicId] });
      alert("Note Added Successfully");
      navigate(`/dashboard/domains/${domainId}/topics/${topicId}`);
    },
    onError:(error)=>{
      console.log(error)
      alert("Failed to add Notes")
    }
  });
   function handleSubmit(e) {
    e.preventDefault();
      mutation.mutate({
     title,
      explanation,
      codeExample,
      youtubeUrl,
      order: Number(order),
      topicId,
  })
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
          disabled={mutation.isPending}
          className={`w-full py-2 rounded text-white font-semibold ${
            mutation.isPending ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          }`}
        >
          {mutation.isPending ? "Saving..." : "Add Note"}
        </button>
      </form>
    </div>
  );
};

export default AddNote;
