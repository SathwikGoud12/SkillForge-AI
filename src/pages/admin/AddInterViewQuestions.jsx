import InterviewQuestionService from "@/src/appwrite/InterviewQuestionsServices";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

const questionService = new InterviewQuestionService();

const AddInterviewQuestion = () => {
  const { domainId, topicId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await questionService.createQuestion({
        question,
        answer,
        difficulty,
        order: Number(order),
        topicId,
      });

      alert("Interview question added successfully");

      navigate(
        `/dashboard/domains/${domainId}/topics/${topicId}`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to add interview question");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        Add Interview Question
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">
            Question
          </label>
          <textarea
            className="w-full border p-2 rounded"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What is useEffect?"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Answer
          </label>
          <textarea
            className="w-full border p-2 rounded min-h-[120px]"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="useEffect is a React hook used to..."
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Difficulty
          </label>
          <select
            className="w-full border p-2 rounded"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">
            Order
          </label>
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
          {loading ? "Saving..." : "Add Question"}
        </button>
      </form>
    </div>
  );
};

export default AddInterviewQuestion;
