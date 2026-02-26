import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Flame,
  BookOpen,
  Zap,
  Target,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ChevronRight,
  LogOut,
  Star,
  Users,
  FileText,
  ArrowRight,
  Rocket,
  Heart,
} from "lucide-react";

import AppwriteAccount from "@/appwrite/Account.services";
import UserProfileService from "@/appwrite/UserProfileServices";
import DomainService from "@/appwrite/domainServices";
import TopicServices from "@/appwrite/TopicServices";
import UserTopicProgressService from "@/appwrite/UserTopicProgressService";
import SolarSystem from "@/components/SolarSystem";
import { AILearningRoadmap } from "@/components/ai";

const appWriteAccount = new AppwriteAccount();
const profileService = new UserProfileService();
const domainService = new DomainService();
const topicService = new TopicServices();
const progressService = new UserTopicProgressService();

const UserDashBoard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [domains, setDomains] = useState([]);
  const [enrolledDomains, setEnrolledDomains] = useState([]);
  const [progress, setProgress] = useState([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  async function loadDashboardData() {
    try {
      const currentUser = await appWriteAccount.getAppwriteUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      const profileRes = await profileService.getProfileByUserId(
        currentUser.$id
      );

      if (profileRes.rows.length > 0) {
        const profileData = profileRes.rows[0];
        setProfile(profileData);

        // Check if this is first time (no targetRole set)
        if (!profileData.targetRole) {
          setShowWelcomeModal(true);
        }
      } else {
        // First time user, create profile
        setShowWelcomeModal(true);
      }

      const [domainsRes, progressRes] = await Promise.all([
        domainService.getAllDomains(),
        progressService.getAllProgress(),
      ]);

      setDomains(domainsRes.rows || []);
      setProgress(progressRes.rows || []);

      // Filter enrolled domains (domains with progress)
      const enrolledDomainIds = new Set(
        progressRes.rows?.map((p) => p.domainId) || []
      );

      const enrolled = domainsRes.rows?.filter((d) =>
        enrolledDomainIds.has(d.$id)
      );

      setEnrolledDomains(enrolled || []);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await appWriteAccount.logout();
      toast.success("Logged out successfully!");
      window.location.href = "/"; // Full reload to landing page, clears all state
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getDayStreak = () => {
    return Math.floor(Math.random() * 10) + 1;
  };

  const getTotalPoints = () => {
    return Math.floor(Math.random() * 500) + 50;
  };

  const getTopicsCompleted = () => {
    return progress.filter((p) => p.completed)?.length || 0;
  };

  const getTotalTopics = () => {
    return domains.reduce((acc, d) => acc + (d.topicsCount || 0), 0) || 0;
  };

  const getHoursTaught = () => {
    return Math.floor(Math.random() * 100) + 10;
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="inline-flex animate-pulse rounded-full h-16 w-16 border-4 border-purple-400 border-t-purple-600 mb-4"></div>
          <p className="text-white text-lg font-medium">
            Loading your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  const streak = getDayStreak();
  const totalPoints = getTotalPoints();
  const topicsCompleted = getTopicsCompleted();
  const totalTopics = getTotalTopics();
  const hoursTaught = getHoursTaught();
  const progressPercent =
    totalTopics > 0 ? Math.round((topicsCompleted / totalTopics) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const leaderboard = [
    { rank: 1, name: "Rahul", points: 420 },
    { rank: 2, name: "Anjali", points: 390 },
    { rank: 3, name: profile?.name || "You", points: totalPoints },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      <Toaster position="top-right" />

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowWelcomeModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-20 h-20 text-purple-500" />
              </motion.div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3">
                Welcome to SkillForge 🚀
              </h2>
              <p className="text-slate-600 text-lg mb-10">
                Let's personalize your learning journey in 30 seconds
              </p>
              <div className="flex flex-col items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowWelcomeModal(false);
                    navigate("/user/setup");
                  }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg transition-all"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowWelcomeModal(false)}
                  className="text-slate-600 font-semibold py-2 px-6 hover:text-slate-900 transition-colors"
                >
                  Skip for now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white sticky top-0 z-40 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {getGreeting()}, {profile?.name || user?.name} 👋
              </h1>
              <p className="text-purple-200 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Preparing for: {profile?.targetRole || "Not set"}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        {/* Streak & Gamification */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">
                  Current Streak
                </p>
                <h2 className="text-5xl font-bold">{streak}</h2>
                <p className="text-orange-100 mt-2">
                  🔥 Days of learning
                </p>
                <p className="text-xs text-orange-200 mt-2">
                  Come back tomorrow to keep your streak alive!
                </p>
              </div>
              <Flame className="w-20 h-20 opacity-80" />
            </div>
          </div>

          {/* Points Card */}
          <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">
                  Total Points
                </p>
                <h2 className="text-5xl font-bold">{totalPoints}</h2>
                <p className="text-purple-100 mt-2">
                  ⭐ Keep going, you're awesome!
                </p>
                <p className="text-xs text-purple-200 mt-2">
                  Complete topics to earn more points
                </p>
              </div>
              <Star className="w-20 h-20 opacity-80" />
            </div>
          </div>
        </motion.div>

        {/* Primary Action */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {enrolledDomains.length > 0
                  ? "▶ Continue Learning"
                  : "🎯 Start Your Learning Journey"}
              </h2>
              <p className="text-blue-100 mb-4">
                {enrolledDomains.length > 0
                  ? `Pick up where you left off - ${enrolledDomains[0]?.title || ""}`
                  : "Choose a domain to begin your skill development"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(
                  enrolledDomains.length > 0
                    ? `/user/domains/${enrolledDomains[0]?.$id}/topics`
                    : "/user/domains"
                )
              }
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {enrolledDomains.length > 0 ? "Resume" : "Explore Domains"}
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Solar System Navigation */}
        <motion.div variants={itemVariants}>
          <SolarSystem />
        </motion.div>

        {/* Progress Overview */}
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Your Progress
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Topics Completed */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-2xl hover:border-blue-600 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-600 font-semibold">Topics</h4>
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </motion.div>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {topicsCompleted}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                of {totalTopics} completed
              </p>
              <div className="mt-4 bg-slate-200 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-full"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">{progressPercent}%</p>
            </motion.div>

            {/* Assessments */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl hover:border-green-600 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-600 font-semibold">Assessments</h4>
                <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring" }}>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </motion.div>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {Math.floor(Math.random() * 10) + 1}
              </p>
              <p className="text-sm text-slate-500 mt-1">taken</p>
            </motion.div>

            {/* Certificates */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-2xl hover:border-yellow-600 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-600 font-semibold">Certificates</h4>
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Award className="w-5 h-5 text-yellow-500" />
                </motion.div>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {Math.floor(Math.random() * 5) + 1}
              </p>
              <p className="text-sm text-slate-500 mt-1">earned</p>
            </motion.div>

            {/* Time Spent */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-2xl hover:border-purple-600 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-600 font-semibold">Time Spent</h4>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-5 h-5 text-purple-500" />
                </motion.div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{hoursTaught}</p>
              <p className="text-sm text-slate-500 mt-1">hours learning</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Learning Domains */}
        {enrolledDomains.length > 0 && (
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Your Learning Domains
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledDomains.map((domain, idx) => (
                <motion.div
                  key={domain.$id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    navigate(`/user/domains/${domain.$id}/topics`)
                  }
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      {domain.title}
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                      {domain.description || "Start learning this domain"}
                    </p>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-semibold text-slate-900">
                          {Math.floor(Math.random() * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                          style={{
                            width: `${Math.floor(Math.random() * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-indigo-600 font-semibold">
                        {domain.level || "All Levels"}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all text-center group"
            >
              <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.3 }}>
                <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:text-blue-600" />
              </motion.div>
              <p className="font-semibold text-slate-900">Notes</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all text-center group"
            >
              <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring" }}>
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:text-green-600" />
              </motion.div>
              <p className="font-semibold text-slate-900">MCQs</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all text-center group"
            >
              <motion.div whileHover={{ rotate: [0, -15, 15, -15, 0] }} transition={{ duration: 0.5 }}>
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2 group-hover:text-yellow-600" />
              </motion.div>
              <p className="font-semibold text-slate-900">Assessments</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const el = document.getElementById('ai-roadmap-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all text-center group"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                whileHover={{ scale: 1.2 }}
              >
                <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:text-purple-600" />
              </motion.div>
              <p className="font-semibold text-slate-900">AI Path</p>
            </motion.button>
          </div>
        </motion.div>

        {/* AI LEARNING ROADMAP SECTION */}
        <motion.div
          id="ai-roadmap-section"
          variants={itemVariants}
          className="pt-8"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-600" />
            AI Career Roadmap
          </h3>
          <AILearningRoadmap
            domain={{ name: profile?.targetRole || enrolledDomains[0]?.title || "Full Stack Development" }}
            userProfile={{ level: profile?.level || "beginner", goals: [profile?.targetRole] }}
          />
        </motion.div>

        {/* Leaderboard */}
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-500" />
            This Week's Leaderboard
          </h3>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="divide-y">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 flex items-center justify-between ${index === 2 ? "bg-purple-50" : ""
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : index === 2
                            ? "bg-orange-600"
                            : "bg-slate-400"
                        }`}
                    >
                      {entry.rank}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{entry.name}</p>
                      {index === 2 && (
                        <p className="text-xs text-purple-600">
                          That's you! 🎯
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {entry.points}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Certificates Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            Your Certificates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((cert, idx) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-yellow-200 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-10 h-10 text-yellow-600" />
                  <span className="text-xs text-yellow-700 font-semibold bg-yellow-100 px-2 py-1 rounded-full">
                    Verified
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">
                  Certificate #{cert}
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Completed with excellence
                </p>
                <button className="text-yellow-700 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  View Certificate <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-400 py-8 mt-16 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-purple-500 to-blue-500"></div>
        <div className="relative z-10">
          <p className="font-semibold">Keep learning, keep growing! 🚀</p>
          <p className="text-xs mt-2">Made with ❤️ for learners worldwide</p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashBoard;
