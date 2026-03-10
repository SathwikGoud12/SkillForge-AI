import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  BookOpen,
  Zap,
  Target,
  Award,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Star,
  FileText,
  ArrowRight,
  ChevronRight,
  Rocket,
  LogOut,
  Flame,
  Clock,
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

      {/* ─── HERO HEADER ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #16213e 70%, #0d1b2a 100%)" }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#a855f7" : "#06b6d4",
                opacity: 0.4,
              }}
              animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
          {/* Large glow blobs */}
          <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(99,102,241,0.15)" }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(168,85,247,0.12)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between flex-wrap gap-6">
            {/* Left: greeting + info */}
            <div className="flex items-center gap-5">
              {/* Avatar with ring */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative flex-shrink-0"
              >
                <div
                  className="w-18 h-18 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-2xl"
                  style={{
                    width: 72, height: 72,
                    background: "linear-gradient(135deg, #6366f1, #a855f7)"
                  }}
                >
                  {(profile?.name || user?.name || "U").substring(0, 2).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: "#1a1040" }}>
                  <div className="w-2 h-2 bg-emerald-300 rounded-full animate-ping" />
                </div>
              </motion.div>

              {/* Text */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.25)", color: "#a78bfa" }}>
                    ✦ {getGreeting()}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  {profile?.name || user?.name || "Learner"} 👋
                </h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-sm text-indigo-200 font-medium">
                      {profile?.targetRole || "Set your target role"}
                    </span>
                  </div>
                  <span className="text-white/20">·</span>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-sm text-orange-200 font-medium">{streak} day streak</span>
                  </div>
                  <span className="text-white/20">·</span>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-sm text-amber-200 font-medium">{totalPoints} XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: XP bar + logout */}
            <div className="flex items-center gap-4">
              {/* XP Level mini card */}
              <div className="hidden sm:block rounded-2xl p-4 text-right" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Total XP</p>
                <p className="text-2xl font-black text-white">{totalPoints}</p>
                <div className="mt-2 w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalPoints % 500) / 500 * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
                  />
                </div>
                <p className="text-[10px] text-white/40 mt-1">{500 - (totalPoints % 500)} XP to next level</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Bottom quick stat pills */}
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            {[
              { label: `${topicsCompleted} Topics Done`, color: "rgba(99,102,241,0.2)", border: "rgba(99,102,241,0.4)", text: "#a78bfa" },
              { label: `${progress.length} Assessments`, color: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.35)", text: "#6ee7b7" },
              { label: `${hoursTaught}h Learning`, color: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)", text: "#fcd34d" },
              { label: `${enrolledDomains.length} Domains`, color: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.35)", text: "#c4b5fd" },
            ].map((pill, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: pill.color, border: `1px solid ${pill.border}`, color: pill.text }}
              >
                {pill.label}
              </motion.span>
            ))}
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
        {/* ─── GAMIFICATION CARDS ──────────────────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Streak Card */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative rounded-3xl p-6 text-white overflow-hidden shadow-xl"
            style={{ background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)" }}
          >
            <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 20%, white, transparent 60%)" }} />
            <div className="relative z-10">
              <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-3">🔥 Current Streak</p>
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-6xl font-black leading-none">{streak}</h2>
                  <p className="text-orange-100 text-sm mt-1 font-semibold">days learning</p>
                </div>
                <Flame className="w-16 h-16 opacity-30" />
              </div>
              <div className="mt-4 flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full ${i < streak % 7 ? 'bg-white' : 'bg-white/20'}`} />
                ))}
              </div>
              <p className="text-orange-200 text-xs mt-2">Weekly progress</p>
            </div>
          </motion.div>

          {/* Points Card */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative rounded-3xl p-6 text-white overflow-hidden shadow-xl"
            style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" }}
          >
            <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 20%, white, transparent 60%)" }} />
            <div className="relative z-10">
              <p className="text-purple-100 text-xs font-bold uppercase tracking-widest mb-3">⭐ Total Points</p>
              <div className="flex items-end justify-between">
                <div>
                  <motion.h2
                    key={totalPoints}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-6xl font-black leading-none"
                  >
                    {totalPoints}
                  </motion.h2>
                  <p className="text-purple-100 text-sm mt-1 font-semibold">XP earned</p>
                </div>
                <Star className="w-16 h-16 opacity-30" />
              </div>
              <div className="mt-4">
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalPoints % 500) / 500 * 100, 100)}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className="text-purple-200 text-xs mt-1.5">{500 - (totalPoints % 500)} XP to next level</p>
              </div>
            </div>
          </motion.div>

          {/* Continue Learning Card */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative rounded-3xl p-6 text-white overflow-hidden shadow-xl cursor-pointer"
            style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)" }}
            onClick={() => navigate(enrolledDomains.length > 0 ? `/user/domains/${enrolledDomains[0]?.$id}/topics` : "/user/domains")}
          >
            <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 80% 20%, white, transparent 60%)" }} />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-cyan-100 text-xs font-bold uppercase tracking-widest mb-3">
                  {enrolledDomains.length > 0 ? "▶ Continue Learning" : "🎯 Get Started"}
                </p>
                <h2 className="text-2xl font-black leading-tight">
                  {enrolledDomains.length > 0 ? enrolledDomains[0]?.title || "Your Course" : "Explore Domains"}
                </h2>
                <p className="text-cyan-100 text-sm mt-1">
                  {enrolledDomains.length > 0 ? "Pick up where you left off" : "Start your learning journey"}
                </p>
              </div>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 mt-4 bg-white/20 rounded-xl px-4 py-2 w-fit font-bold text-sm"
              >
                {enrolledDomains.length > 0 ? "Resume" : "Explore"}
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.div>
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

        {/* Daily Learning Milestones - REPLACING Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              Daily Learning Milestones
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Restarting in 12h</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Review Notes", desc: "Spend 10m on your notes", progress: 60, icon: FileText, color: "blue" },
              { title: "Take a Quiz", desc: "Test your knowledge", progress: 0, icon: CheckCircle2, color: "emerald" },
              { title: "Complete Topic", desc: "Master a full concept", progress: 100, icon: Target, color: "violet" },
              { title: "AI Mentorship", desc: "Chat with AI Mentor", progress: 40, icon: Sparkles, color: "fuchsia" },
            ].map((milestone, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${milestone.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <milestone.icon className={`w-7 h-7 text-${milestone.color}-600`} />
                </div>
                <h4 className="text-lg font-black text-slate-900 leading-tight mb-1">{milestone.title}</h4>
                <p className="text-xs text-slate-500 font-medium mb-4">{milestone.desc}</p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-auto">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${milestone.progress}%` }}
                    className={`h-full bg-gradient-to-r ${milestone.color === 'blue' ? 'from-blue-500 to-indigo-500' :
                      milestone.color === 'emerald' ? 'from-emerald-500 to-teal-500' :
                        milestone.color === 'violet' ? 'from-violet-500 to-purple-500' :
                          'from-fuchsia-500 to-pink-500'
                      }`}
                  />
                </div>
                <div className="flex justify-between w-full mt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">{milestone.progress === 100 ? "Done" : "Ongoing"}</span>
                  <span className="text-[10px] font-black text-slate-900">{milestone.progress}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI LEARNING ROADMAP SECTION */}
        <motion.div
          id="ai-roadmap-section"
          variants={itemVariants}
          className="pt-8"
        >
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950" />

            {/* Glowing orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mt-24" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl mb-[-6rem]" />
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 p-8 lg:p-12">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/50">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      AI-Powered
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-300">
                    Career Roadmap
                  </h3>
                  <p className="text-sm text-indigo-300 mt-0.5">
                    Personalized for: <span className="font-bold text-white">{profile?.targetRole || enrolledDomains[0]?.title || "Your Journey"}</span>
                  </p>
                </div>
              </div>

              {/* Roadmap Component — wrapped for dark bg contrast */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <AILearningRoadmap
                  domain={{ name: profile?.targetRole || enrolledDomains[0]?.title || "Full Stack Development" }}
                  userProfile={{ level: (profile?.skillLevel || "beginner").toLowerCase(), goals: [profile?.targetRole].filter(Boolean) }}
                />
              </div>
            </div>
          </div>
        </motion.div>



        {/* ─── CONTINUE LEARNING ───────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                Continue Learning
              </h3>
              <p className="text-slate-500 text-sm mt-1">Pick up right where you left off</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/user/domains")}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              All Domains
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {enrolledDomains.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {enrolledDomains.slice(0, 3).map((domain, idx) => {
                const progressPct = domain.progressPct || 0;
                const gradients = [
                  'from-indigo-500 to-purple-600',
                  'from-emerald-500 to-teal-600',
                  'from-orange-500 to-red-500',
                ];
                const gradient = gradients[idx % gradients.length];
                return (
                  <motion.div
                    key={domain.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden flex flex-col"
                  >
                    {/* Top color bar */}
                    <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        {domain.imageUrl ? (
                          <img src={domain.imageUrl} alt={domain.title} className="w-14 h-14 rounded-2xl object-cover shadow-md flex-shrink-0" />
                        ) : (
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                            <BookOpen className="w-7 h-7 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-slate-900 text-lg leading-tight truncate">{domain.title}</h4>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-2">{domain.description}</p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                          <span>Progress</span>
                          <span className="text-slate-800">{progressPct}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.15 }}
                            className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5">
                          {progressPct === 0 ? "Not started yet" : progressPct === 100 ? "🎉 Completed!" : `${100 - progressPct}% remaining`}
                        </p>
                      </div>

                      {/* Resume button */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/user/domains/${domain.$id}/topics`)}
                        className={`w-full py-3 bg-gradient-to-r ${gradient} text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md mt-auto`}
                      >
                        {progressPct === 0 ? "Start Learning" : progressPct === 100 ? "Review Domain" : "Continue Learning"}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 text-center border-2 border-dashed border-indigo-200"
            >
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-indigo-400" />
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-2">No Domains Enrolled Yet</h4>
              <p className="text-slate-500 text-sm mb-6">Start your learning journey by exploring available domains</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/user/domains")}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200"
              >
                Explore Domains
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* ─── QUICK ACCESS HUB ────────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" />
              Quick Access
            </h3>
            <p className="text-slate-500 text-sm mt-1">Jump to any feature instantly</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "AI Assistant",
                desc: "Chat with your AI tutor",
                icon: Sparkles,
                gradient: "from-violet-500 to-purple-600",
                shadow: "shadow-violet-200",
                route: "/user/ai-assistant",
              },
              {
                label: "Take Assessment",
                desc: "Test your knowledge",
                icon: CheckCircle2,
                gradient: "from-blue-500 to-cyan-500",
                shadow: "shadow-blue-200",
                route: "/user/domains",
              },
              {
                label: "Study Materials",
                desc: "PDFs, notes & resources",
                icon: FileText,
                gradient: "from-emerald-500 to-teal-500",
                shadow: "shadow-emerald-200",
                route: "/user/study-materials",
              },
              {
                label: "Interview Prep",
                desc: "Practice Q&A sessions",
                icon: Target,
                gradient: "from-orange-500 to-red-500",
                shadow: "shadow-orange-200",
                route: "/user/interview-questions",
              },
              {
                label: "My Progress",
                desc: "Track your learning",
                icon: TrendingUp,
                gradient: "from-pink-500 to-rose-500",
                shadow: "shadow-pink-200",
                route: "/user/progress",
              },
              {
                label: "Certificates",
                desc: "View your achievements",
                icon: Award,
                gradient: "from-amber-400 to-orange-500",
                shadow: "shadow-amber-200",
                route: "/user/certificates",
              },
              {
                label: "All Domains",
                desc: "Explore learning paths",
                icon: BookOpen,
                gradient: "from-indigo-500 to-blue-600",
                shadow: "shadow-indigo-200",
                route: "/user/domains",
              },
              {
                label: "My Profile",
                desc: "Edit your information",
                icon: Star,
                gradient: "from-slate-600 to-slate-800",
                shadow: "shadow-slate-200",
                route: "/user/profile",
              },
            ].map((item, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.route)}
                className={`bg-white rounded-3xl p-5 text-left border border-slate-100 shadow-lg ${item.shadow} hover:shadow-xl transition-all group flex flex-col gap-3`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ─── FOOTER ──────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-3xl overflow-hidden mt-4"
          style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #24243e 100%)" }}
        >
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(99,102,241,0.12)" }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(168,85,247,0.10)" }} />

          <div className="relative z-10 px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg leading-none">
                      Skill<span style={{ color: "#a78bfa" }}>Forge</span>
                    </h3>
                    <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">AI Platform</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your personalized AI-powered learning platform to master any skill and accelerate your career.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-indigo-300 font-bold text-xs uppercase tracking-widest mb-4">Quick Links</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Dashboard", path: "/user" },
                    { label: "Domains", path: "/user/domains" },
                    { label: "Progress", path: "/user/progress" },
                    { label: "AI Roadmap", path: "/user#ai-roadmap-section" },
                    { label: "Certificates", path: "/user/certificates" },
                    { label: "Profile", path: "/user/profile" },
                  ].map((link) => (
                    <motion.button
                      key={link.path}
                      whileHover={{ x: 3 }}
                      onClick={() => navigate(link.path)}
                      className="text-slate-400 hover:text-indigo-300 text-sm text-left transition-colors font-medium"
                    >
                      → {link.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Stats/Motivational */}
              <div>
                <h4 className="text-indigo-300 font-bold text-xs uppercase tracking-widest mb-4">Your Journey</h4>
                <div className="space-y-3">
                  {[
                    { emoji: "🚀", text: "Keep pushing your limits every day" },
                    { emoji: "🧠", text: "AI-powered personalized learning" },
                    { emoji: "🏆", text: "Earn verified certificates" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{item.emoji}</span>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-slate-500 text-xs">
                © 2026 SkillForge AI · Made with <span className="text-red-400">❤️</span> for learners worldwide
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-500 text-xs font-semibold">All systems operational</span>
              </div>
            </div>
          </div>
        </motion.div>


      </motion.div>
    </div>
  );
};

export default UserDashBoard;
