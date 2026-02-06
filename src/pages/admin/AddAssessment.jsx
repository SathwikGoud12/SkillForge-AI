import AssessmentService from "@/appwrite/AssessmentSevice";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Plus, Trash2, Save } from "lucide-react";

const assessmentService = new AssessmentService();

const AddAssessment = () => {
  const { domainId, topicId } = useParams();
  const navigate = useNavigate();

  // Assessment metadata
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [duration, setDuration] = useState(20);
  const [passingScore, setPassingScore] = useState(70);

  // Questions array
  const [questions, setQuestions] = useState([
    {
      id: "q1",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "A",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Add new question
  const addQuestion = () => {
    const newId = `q${questions.length + 1}`;
    setQuestions([
      ...questions,
      {
        id: newId,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "A",
      },
    ]);
  };

  // Remove question
  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  // Update question text
  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // Update option
  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // Update correct answer
  const updateCorrectAnswer = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      alert("Please enter assessment title");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1} is empty`);
        return false;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`Question ${i + 1}, Option ${String.fromCharCode(65 + j)} is empty`);
          return false;
        }
      }
    }

    return true;
  };

  // Submit assessment
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create assessment with correct field names and types
      const assessmentData = {
        title,
        difficulty,
        duration: parseInt(duration), // Must be integer, not string
        question: JSON.stringify(questions), // Use 'question' field to store questions array
        topicId,
        isActive: true,
      };

      // Add passingScore only if the field exists in your schema
      if (passingScore) {
        assessmentData.passingScore = parseInt(passingScore); // Must be integer
      }

      await assessmentService.createAssessment(assessmentData);

      alert("Assessment created successfully!");
      navigate(`/dashboard/domains/${domainId}/topics/${topicId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create assessment: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-slate-900">
        Create New Assessment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Assessment Metadata */}
        <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
          <h3 className="text-xl font-bold mb-4 text-purple-900">
            Assessment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Title *
              </label>
              <input
                type="text"
                className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-purple-500 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., React Fundamentals Quiz"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Difficulty *
              </label>
              <select
                className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-purple-500 focus:outline-none"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Duration (minutes) *
              </label>
              <input
                type="number"
                className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-purple-500 focus:outline-none"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min="5"
                max="180"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-slate-700">
                Passing Score (%) *
              </label>
              <input
                type="number"
                className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-purple-500 focus:outline-none"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                min="0"
                max="100"
                required
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Questions ({questions.length})
            </h3>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-slate-900">
                    Question {qIndex + 1}
                  </h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-slate-700">
                    Question Text *
                  </label>
                  <textarea
                    className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-purple-500 focus:outline-none"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, e.target.value)}
                    rows="3"
                    placeholder="Enter your question here..."
                    required
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex}>
                      <label className="block font-semibold mb-2 text-slate-700">
                        Option {String.fromCharCode(65 + optIndex)} *
                      </label>
                      <input
                        type="text"
                        className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-purple-500 focus:outline-none"
                        value={option}
                        onChange={(e) =>
                          updateOption(qIndex, optIndex, e.target.value)
                        }
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block font-semibold mb-2 text-slate-700">
                    Correct Answer *
                  </label>
                  <select
                    className="w-full border-2 border-slate-300 p-3 rounded-lg focus:border-purple-500 focus:outline-none bg-green-50"
                    value={q.correctAnswer}
                    onChange={(e) =>
                      updateCorrectAnswer(qIndex, e.target.value)
                    }
                  >
                    <option value="A">A - {q.options[0] || "Option A"}</option>
                    <option value="B">B - {q.options[1] || "Option B"}</option>
                    <option value="C">C - {q.options[2] || "Option C"}</option>
                    <option value="D">D - {q.options[3] || "Option D"}</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-4 rounded-lg text-white font-bold text-lg flex items-center justify-center gap-2 ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition-all"
              }`}
          >
            <Save className="w-5 h-5" />
            {loading ? "Creating Assessment..." : "Create Assessment"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-4 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Preview */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h3 className="text-lg font-bold mb-2 text-blue-900">Preview</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <strong>Title:</strong> {title || "Not set"}
          </p>
          <p>
            <strong>Difficulty:</strong> {difficulty}
          </p>
          <p>
            <strong>Duration:</strong> {duration} minutes
          </p>
          <p>
            <strong>Passing Score:</strong> {passingScore}%
          </p>
          <p>
            <strong>Total Questions:</strong> {questions.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddAssessment;
