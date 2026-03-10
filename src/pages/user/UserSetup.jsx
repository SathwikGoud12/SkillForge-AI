import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Zap,
} from "lucide-react";

import AppwriteAccount from "@/appwrite/Account.services";
import PublicProfileService from "@/appwrite/PublicProfileService";
import DomainService from "@/appwrite/domainServices";

const account = new AppwriteAccount();
const profileService = new PublicProfileService();
const domainService = new DomainService();

const ROLES = [
  { id: 1, name: "Frontend Developer", emoji: "🎨", color: "from-blue-400 to-cyan-500" },
  { id: 2, name: "Backend Developer", emoji: "⚙️", color: "from-purple-400 to-indigo-600" },
  { id: 3, name: "Full Stack Developer", emoji: "🚀", color: "from-orange-400 to-red-500" },
  { id: 4, name: "Data Scientist", emoji: "📊", color: "from-green-400 to-emerald-500" },
  { id: 5, name: "DevOps Engineer", emoji: "🔧", color: "from-yellow-400 to-orange-500" },
  { id: 6, name: "Mobile Developer", emoji: "📱", color: "from-pink-400 to-red-500" },
];

const LEVELS = [
  { id: 1, name: "Beginner", desc: "Just starting out", emoji: "🌱" },
  { id: 2, name: "Intermediate", desc: "Some experience", emoji: "🌿" },
  { id: 3, name: "Advanced", desc: "Experienced", emoji: "🌳" },
  { id: 4, name: "Expert", desc: "Master level", emoji: "👑" },
];

const UserSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [domains, setDomains] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDomains, setLoadingDomains] = useState(false);

  // Load domains when step changes to 3
  useEffect(() => {
    if (step === 3 && domains.length === 0) {
      loadDomains();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function loadDomains() {
    try {
      setLoadingDomains(true);
      const res = await domainService.getAllDomains();
      setDomains(res.rows || []);
    } catch (error) {
      console.error("Failed to load domains", error);
      toast.error("Failed to load domains");
    } finally {
      setLoadingDomains(false);
    }
  }

  async function handleComplete() {
    if (!selectedRole || !selectedLevel || selectedDomains.length === 0) {
      toast.error("Please complete all steps");
      return;
    }

    try {
      setLoading(true);
      const user = await account.getAppwriteUser();
      const roleObj = ROLES.find((r) => r.id === selectedRole);
      const levelObj = LEVELS.find((l) => l.id === selectedLevel);

      // Save setup data to the userProfiles table
      // Make sure these columns exist in Appwrite: skillLevel (String), enrolledDomains (String)
      await profileService.updateProfile(user.$id, {
        fullName: user.name || "",
        targetRole: roleObj.name,
        skillLevel: levelObj.name,
        enrolledDomains: selectedDomains.join(","),
      });

      toast.success("Setup complete! Welcome to SkillForge 🎉");
      setTimeout(() => {
        // Navigate to the first domain the user selected
        navigate(`/user/domains/${selectedDomains[0]}/topics`);
      }, 1500);
    } catch (error) {
      console.error("Setup error:", error);
      toast.error("Failed to complete setup");
    } finally {
      setLoading(false);
    }
  }


  const toggleDomain = (domainId) => {
    setSelectedDomains((prev) =>
      prev.includes(domainId)
        ? prev.filter((id) => id !== domainId)
        : [...prev, domainId]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 flex items-center justify-center">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Welcome to SkillForge</h1>
            </div>
            <p className="text-purple-100">
              Let's personalize your learning journey in 3 simple steps
            </p>

            {/* Progress Bar */}
            <div className="mt-6 flex gap-2">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  initial={{ width: 0 }}
                  animate={{
                    width: "100%",
                    backgroundColor: s <= step ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.3)",
                  }}
                  transition={{ duration: 0.5, delay: s * 0.1 }}
                  className="h-2 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 min-h-96">
            <AnimatePresence mode="wait">
              {/* Step 1: Choose Role */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  variants={containerVariants}
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    What's your target role?
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {ROLES.map((role, idx) => (
                      <motion.button
                        key={role.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-4 rounded-xl font-semibold transition-all text-left ${selectedRole === role.id
                          ? `bg-gradient-to-br ${role.color} text-white shadow-lg`
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                          }`}
                      >
                        <div className="text-3xl mb-2">{role.emoji}</div>
                        <div className="text-sm">{role.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Choose Level */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  variants={containerVariants}
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    What's your experience level?
                  </h2>

                  <div className="space-y-3">
                    {LEVELS.map((level, idx) => (
                      <motion.button
                        key={level.id}
                        variants={itemVariants}
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`w-full p-4 rounded-xl font-semibold transition-all text-left flex items-center justify-between ${selectedLevel === level.id
                          ? "bg-purple-100 text-purple-900 border-2 border-purple-600"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200 border-2 border-transparent"
                          }`}
                      >
                        <div>
                          <div className="text-2xl">{level.emoji}</div>
                          <div className="font-bold">{level.name}</div>
                          <div className="text-xs opacity-75">{level.desc}</div>
                        </div>
                        {selectedLevel === level.id && (
                          <CheckCircle2 className="w-6 h-6 text-purple-600" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Choose Domains */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  variants={containerVariants}
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Choose domains to enroll in
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Select at least one domain to get started
                  </p>

                  {loadingDomains ? (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4"
                      ></motion.div>
                      <p className="text-slate-600">Loading domains...</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {domains.map((domain, idx) => (
                        <motion.button
                          key={domain.$id}
                          variants={itemVariants}
                          whileHover={{ x: 8 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleDomain(domain.$id)}
                          className={`w-full p-4 rounded-xl font-semibold transition-all text-left flex items-center justify-between ${selectedDomains.includes(domain.$id)
                            ? "bg-indigo-100 text-indigo-900 border-2 border-indigo-600"
                            : "bg-slate-100 text-slate-900 hover:bg-slate-200 border-2 border-transparent"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5" />
                            <div>
                              <div className="font-bold">{domain.title}</div>
                              <div className="text-xs opacity-75">
                                {domain.level}
                              </div>
                            </div>
                          </div>
                          {selectedDomains.includes(domain.$id) && (
                            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Buttons */}
          <div className="border-t border-slate-200 p-8 flex justify-between gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </motion.button>

            {step < 3 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (step === 1 && !selectedRole) {
                    toast.error("Please select a role");
                    return;
                  }
                  if (step === 2 && !selectedLevel) {
                    toast.error("Please select a level");
                    return;
                  }
                  setStep(step + 1);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Complete Setup
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSetup;
