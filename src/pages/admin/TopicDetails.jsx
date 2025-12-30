import AssessmentService from "@/src/appwrite/AssessmentSevice";
import InterviewQuestionService from "@/src/appwrite/InterviewQuestionsServices";
import NotesServices from "@/src/appwrite/NotesServices";
import ProjectService from "@/src/appwrite/ProjectService";
import TopicServices from "@/src/appwrite/TopicServices";
import UserTopicProgressService from "@/src/appwrite/UserTopicProgressService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const topicService = new TopicServices();
const noteService = new NotesServices();
const questionsService = new InterviewQuestionService();
const assessmentService = new AssessmentService();
const projectService=new ProjectService();
const userTopicProgessService=new UserTopicProgressService();


const TopicDetail = () => {
  const { domainId, topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [notes, setNotes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const[projects,setProjects]=useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("notes");

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);


function handleAnswerChange(questionId, option) {
  setSelectedAnswers((prev) => ({
    ...prev,
    [questionId]: option,
  }));
}

async function submitAssessment() {
  let correct = 0;

  assessments.forEach((q) => {
    if (selectedAnswers[q.$id] === q.correctOption) {
      correct++;
    }
  });

  setScore(correct);
  setSubmitted(true);

  await userTopicProgessService.upsertProgress({
    userId: user.$id,      
    topicId,
    notesCompleted: true,
    assessmentScore: correct,
    assessmentTotal: assessments.length,
    completed: correct / assessments.length >= 0.6,
    lastUpdated: new Date().toISOString(),
  });
}



  async function fetchTopicDetails() {
    try {
      const topicRes = await topicService.getTopicById(topicId);
      setTopic(topicRes);

      const notesRes = await noteService.noteListRows(topicId);
      setNotes(notesRes.rows || []);

      const questionRes = await questionsService.getQuestionsByTopic(topicId);
      setQuestions(questionRes.rows || []);

      const assessmentRes = await assessmentService.getAssessmentsByTopic(topicId);
      setAssessments(assessmentRes.rows || []);

      const projectRes = await projectService.getProjectsByTopic(topicId);
setProjects(projectRes.rows || []);

    } catch (err) {
      console.error("Error fetching topic details", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTopicDetails();
  }, [topicId]);

  if (loading) return <p className="p-6">Loading topic...</p>;
  if (!topic) return <p className="p-6">Topic not found</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{topic.title}</h1>
        <p className="text-gray-600 mt-1">{topic.description}</p>
      </div>
      <div className="flex gap-6 border-b mb-6">
        {["notes", "questions", "assessments", "projects"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-black font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {activeTab === "notes" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Notes</h2>

            <button
              onClick={() =>
                navigate(
                  `/dashboard/domains/${domainId}/topics/${topicId}/add-note`
                )
              }
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              + Add Note
            </button>
          </div>

          {notes.length === 0 ? (
            <p className="text-gray-500">No notes added yet.</p>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.$id}
                  className="border rounded-lg p-4 bg-white shadow"
                >
                  <h3 className="text-lg font-semibold mb-2">{note.title}</h3>

                  <p className="text-gray-700 mb-3">{note.explanation}</p>

                  {note.codeExample && (
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto mb-3">
                      <code>{note.codeExample}</code>
                    </pre>
                  )}

                  {note.youtubeUrl && (
                    <a
                      href={note.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      ▶ Watch related video
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "questions" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Interview Questions</h2>

            <button
              onClick={() =>
                navigate(
                  `/dashboard/domains/${domainId}/topics/${topicId}/add-question`
                )
              }
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              + Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <p className="text-gray-500">No interview questions added yet.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.$id} className="border rounded p-4 bg-white shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{q.question}</h3>

                    <span className="text-xs px-2 py-1 rounded bg-gray-200">
                      {q.difficulty}
                    </span>
                  </div>

                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600">
                      View Answer
                    </summary>
                    <p className="mt-2 text-gray-700">{q.answer}</p>
                  </details>
                </div>
              ))}
            </div>
          )}
        </>
      )}
{activeTab === "assessments" && (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Assessments</h2>

      <button
        onClick={() =>
          navigate(
            `/dashboard/domains/${domainId}/topics/${topicId}/add-assessment`
          )
        }
        className="px-4 py-2 bg-black text-white rounded"
      >
        + Add MCQ
      </button>
    </div>

    {assessments.length === 0 ? (
      <p className="text-gray-500">No assessments added yet.</p>
    ) : (
      <div className="space-y-6">
        {assessments.map((q, index) => (
          <div key={q.$id} className="border p-4 rounded bg-white shadow">
            <p className="font-semibold mb-3">
              {index + 1}. {q.question}
            </p>

            {["A", "B", "C", "D"].map((opt) => {
              const isSelected = selectedAnswers[q.$id] === opt;
              const isCorrect = q.correctOption === opt;
              const isWrong =
                submitted && isSelected && !isCorrect;

              return (
                <label
                  key={opt}
                  className={`block mb-2 cursor-pointer p-2 rounded
                    ${submitted && isCorrect ? "bg-green-100 border border-green-500" : ""}
                    ${isWrong ? "bg-red-100 border border-red-500" : ""}
                  `}
                >
                  <input
                    type="radio"
                    name={q.$id}
                    disabled={submitted}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(q.$id, opt)}
                    className="mr-2"
                  />
                  {q[`option${opt}`]}
                </label>
              );
            })}
          </div>
        ))}

        {!submitted && (
          <button
            onClick={submitAssessment}
            className="px-6 py-2 bg-green-600 text-white rounded"
          >
            Submit Test
          </button>
        )}

        {submitted && (
          <div className="mt-4 text-lg font-semibold">
            ✅ Score: {score} / {assessments.length}
          </div>
        )}
      </div>
    )}
  </>
)}


{activeTab === "projects" && (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Projects</h2>

      <button
        onClick={() =>
          navigate(`/dashboard/domains/${domainId}/add-project`)
        }
        className="px-4 py-2 bg-black text-white rounded"
      >
        + Add Project
      </button>
    </div>

    {projects.length === 0 ? (
      <p className="text-gray-500">No projects yet.</p>
    ) : (
      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.$id}
            onClick={() =>
              navigate(
                `/dashboard/domains/${domainId}/topics/${project.topicId}`
              )
            }
            className="border p-4 rounded cursor-pointer hover:bg-gray-50"
          >
            <h3 className="font-semibold">{project.title}</h3>
            <p className="text-sm text-gray-600">
              {project.description}
            </p>

            <div className="flex gap-4 mt-2 text-sm">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600"
                >
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="text-green-600"
                >
                  Live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)}


    </div>
  );
};

export default TopicDetail;
