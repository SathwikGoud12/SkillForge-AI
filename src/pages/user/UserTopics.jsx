import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Play,
  Lock,
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  Zap,
  Target,
  Rocket,
} from "lucide-react";
import TopicServices from "@/appwrite/TopicServices";
import DomainService from "@/appwrite/domainServices";
import DomainFinalProject from "@/components/DomainFinalProject";
import AppwriteAccount from "@/appwrite/Account.services";

const topicService = new TopicServices();
const domainService = new DomainService();
const appwriteAccount = new AppwriteAccount();



const UserTopics = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  async function loadTopicsAndDomain() {
    try {
      // Load user
      const currentUser = await appwriteAccount.getAppwriteUser();
      setUser(currentUser);

      // Load domain info
      const domainRes = await domainService.getDomainById(domainId);
      setDomain(domainRes);

      // Load topics
      const res = await topicService.getTopicsByDomain(domainId);

      // Use real backend data only
      setTopics(res.rows || []);
    } catch (err) {
      console.error("Failed to load topics", err);
      toast.error("Failed to load topics. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTopicsAndDomain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </motion.div>
          <p className="text-slate-700 text-lg font-medium">
            Loading topics...
          </p>
        </motion.div>
      </div>
    );
  }

  const completedCount = topics.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / topics.length) * 100);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "expert":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Toaster position="top-right" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white sticky top-0 z-40 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/user/domains")}
              className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Domains</span>
            </motion.button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {domain?.title || "Learning Path"}
              </h1>
              <p className="text-purple-200">
                {domain?.description || "Master the fundamentals and beyond"}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{topics.length}</p>
                <p className="text-purple-200 text-sm">Topics</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{completedCount}</p>
                <p className="text-purple-200 text-sm">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Your Progress
                  </h3>
                  <p className="text-sm text-slate-600">
                    {completedCount} of {topics.length} topics completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">
                  {progressPercent}%
                </p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
              ></motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">
                  Completed
                </p>
                <p className="text-4xl font-bold">{completedCount}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  In Progress
                </p>
                <p className="text-4xl font-bold">
                  {topics.length - completedCount}
                </p>
              </div>
              <BookOpen className="w-12 h-12 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">
                  Total Time
                </p>
                <p className="text-4xl font-bold">
                  {Math.floor(
                    topics.reduce((acc, t) => {
                      const mins = parseInt(t.duration) || 0;
                      return acc + mins;
                    }, 0) / 60
                  )}
                  h
                </p>
              </div>
              <Clock className="w-12 h-12 opacity-80" />
            </div>
          </motion.div>
        </div>

        {/* Topics List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Learning Topics
          </h2>

          {topics.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No topics available yet</p>
              <p className="text-slate-400 text-sm mt-2">
                Check back soon for new content!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic, idx) => (
                <motion.div
                  key={topic.$id || topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  onClick={() => {
                    if (!topic.locked) {
                      navigate(
                        `/user/domains/${domainId}/topics/${topic.$id || topic.id}`
                      );
                    } else {
                      toast.error("Complete previous topics to unlock this one");
                    }
                  }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${topic.locked
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-xl"
                    }`}
                >
                  <div className="flex items-center p-6">
                    {/* Order Number */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white mr-4 ${topic.completed
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : topic.locked
                          ? "bg-gradient-to-br from-gray-400 to-gray-500"
                          : "bg-gradient-to-br from-purple-500 to-indigo-600"
                        }`}
                    >
                      {topic.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : topic.locked ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <span>{topic.order || idx + 1}</span>
                      )}
                    </div>

                    {/* Topic Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-4">
                          {topic.difficulty && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                                topic.difficulty
                              )}`}
                            >
                              {topic.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-600 mb-3">
                        {topic.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{topic.duration || "30 min"}</span>
                        </div>
                        {topic.completed && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-medium">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 ml-4">
                      {topic.locked ? (
                        <div className="p-3 rounded-xl bg-gray-100">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                      ) : topic.completed ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-xl hover:bg-green-200 transition-colors"
                        >
                          Review
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all"
                        >
                          Start
                          <Play className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for current topic */}
                  {!topic.completed && !topic.locked && idx === completedCount && (
                    <div className="px-6 pb-4">
                      <div className="bg-purple-100 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-purple-700 text-sm font-medium">
                          <Zap className="w-4 h-4" />
                          <span>Continue where you left off</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Final Project Section */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-purple-600" />
              Final Domain Project
            </h2>
            <DomainFinalProject domainId={domainId} userId={user.$id} />
          </motion.div>
        )}

        {/* Achievement Section */}
        {completedCount === topics.length && topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-8 text-white text-center shadow-2xl"
          >
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">
              🎉 Congratulations! 🎉
            </h3>
            <p className="text-lg mb-4">
              You've completed all topics in this domain!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Claim Your Certificate
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserTopics;
