import AssessmentService from "@/src/appwrite/AssessmentSevice";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";


const assessmentService = new AssessmentService();

const AddAssessment = () => {
  const { domainId, topicId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("A");
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await assessmentService.createAssessment({
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
        difficulty,
        topicId,
        isActive: true,
      });

      alert("Assessment question added successfully");

      navigate(
        `/dashboard/domains/${domainId}/topics/${topicId}`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to add assessment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        Add Assessment (MCQ)
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Question</label>
          <textarea
            className="w-full border p-2 rounded"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Option A</label>
          <input
            className="w-full border p-2 rounded"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Option B</label>
          <input
            className="w-full border p-2 rounded"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Option C</label>
          <input
            className="w-full border p-2 rounded"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Option D</label>
          <input
            className="w-full border p-2 rounded"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Correct Option
          </label>
          <select
            className="w-full border p-2 rounded"
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
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
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Saving..." : "Add MCQ"}
        </button>
      </form>
    </div>
  );
};

export default AddAssessment;
