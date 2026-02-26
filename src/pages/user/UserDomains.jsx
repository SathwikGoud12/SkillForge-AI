import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  BookOpen,
  Zap,
  ChevronRight,
  Filter,
  Search,
  Star,
  Users,
  Clock,
  ArrowUpRight,
} from "lucide-react";

import AppwriteAccount from "@/appwrite/Account.services";
import DomainService from "@/appwrite/domainServices";

const account = new AppwriteAccount();
const domainService = new DomainService();

const UserDomains = () => {
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  async function loadDomains() {
    try {
      const user = await account.getAppwriteUser();
      if (!user) {
        window.location.href = "/"; // No session, go to landing page
        return;
      }

      const res = await domainService.getAllDomains();
      setDomains(res.rows || []);
      toast.success("Domains loaded successfully!");
    } catch (error) {
      console.error("Failed to load domains", error);
      toast.error("Failed to load domains");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDomainClick = (domainId) => {
    toast.success("Opening domain...", {
      description: "Get ready to learn!",
    });
    navigate(`/user/domains/${domainId}/topics`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"
          ></motion.div>
          <p className="text-slate-600 text-lg font-medium">
            Loading learning domains...
          </p>
        </div>
      </div>
    );
  }

  // Filter domains
  const filteredDomains = domains.filter((domain) => {
    const matchesSearch = domain.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "All" || domain.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  const getLevelColor = (level) => {
    const colors = {
      Beginner: {
        bg: "from-green-400 to-emerald-500",
        badge: "bg-green-100 text-green-800",
      },
      Intermediate: {
        bg: "from-yellow-400 to-orange-500",
        badge: "bg-yellow-100 text-yellow-800",
      },
      Advanced: {
        bg: "from-red-400 to-pink-500",
        badge: "bg-red-100 text-red-800",
      },
      Expert: {
        bg: "from-purple-400 to-indigo-600",
        badge: "bg-purple-100 text-purple-800",
      },
    };
    return (
      colors[level] || { bg: "from-blue-400 to-cyan-500", badge: "bg-blue-100 text-blue-800" }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen className="w-10 h-10 text-blue-600" />
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Learning Domains
            </h1>
          </div>
          <p className="text-slate-600 text-lg mt-3 max-w-2xl">
            Choose a domain to start mastering new skills. Each domain contains curated topics designed for your growth.
          </p>
        </motion.div>

        {/* Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedLevel("All")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${selectedLevel === "All"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-200"
                }`}
            >
              All Levels
            </motion.button>
            {["Beginner", "Intermediate", "Advanced", "Expert"].map((level) => (
              <motion.button
                key={level}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${selectedLevel === level
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-200"
                  }`}
              >
                {level}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 mb-6 font-medium"
        >
          {filteredDomains.length === 0
            ? "No domains found. Try adjusting your search."
            : `Showing ${filteredDomains.length} domain${filteredDomains.length !== 1 ? "s" : ""
            }`}
        </motion.p>

        {/* Content */}
        {filteredDomains.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="inline-block p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-6">
              <BookOpen className="w-16 h-16 text-slate-400" />
            </div>
            <p className="text-2xl text-slate-900 font-bold mb-2">
              No domains found
            </p>
            <p className="text-slate-600">
              Try a different search term or adjust your level filter
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredDomains.map((domain, idx) => {
              const colors = getLevelColor(domain.level);
              return (
                <motion.div
                  key={domain.$id}
                  variants={itemVariants}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onClick={() => handleDomainClick(domain.$id)}
                  className="group cursor-pointer"
                >
                  <div className="relative h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-200">
                    {/* Image Container */}
                    <div className={`relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br ${colors.bg}`}>
                      {domain.imageId && (
                        <motion.img
                          src={domainService.getImagePreview(domain.imageId)}
                          alt={domain.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      {!domain.imageId && (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-indigo-200">
                          <BookOpen className="w-16 h-16 text-blue-300" />
                        </div>
                      )}

                      {/* Overlay on Hover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4"
                      >
                        <p className="text-white text-sm font-semibold">
                          Click to explore topics
                        </p>
                      </motion.div>

                      {/* Level Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 + 0.3 }}
                        className={`absolute top-4 right-4 px-4 py-2 rounded-full ${colors.badge} text-sm font-bold shadow-lg flex items-center gap-1`}
                      >
                        <Zap className="w-4 h-4" />
                        {domain.level}
                      </motion.div>
                    </div>

                    {/* Content Container */}
                    <div className="p-5 sm:p-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {domain.title}
                      </h2>

                      <p className="text-slate-600 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed">
                        {domain.description || "Explore this domain to master new skills"}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-t border-b border-slate-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {domain.topicsCount || 0}
                          </div>
                          <div className="text-xs text-slate-500">Topics</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {domain.difficulty || "N/A"}
                          </div>
                          <div className="text-xs text-slate-500">Difficulty</div>
                        </div>
                      </div>

                      {/* Footer with Arrow */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                          Explore Topics
                          <motion.div
                            whileHover={{ x: 4 }}
                            whileTap={{ x: -2 }}
                          >
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </motion.div>
                        </span>
                        <motion.div
                          animate={{ rotate: [0, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-yellow-500"
                        >
                          <Star className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Gradient Overlay on Hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty State with CTA */}
        {domains.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-20"
          >
            <p className="text-xl text-slate-600 mb-4">
              Looks like there are no domains yet.
            </p>
            <p className="text-slate-500">Check back soon for new learning content!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDomains;
