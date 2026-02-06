import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import {
    Award, CheckCircle2, Copy, Share2, ExternalLink,
    Github, Linkedin, Globe, Target, TrendingUp,
    Calendar, Code, BookOpen, Zap, Shield
} from "lucide-react";
import { toast } from "sonner";
import PublicProfileService from "@/appwrite/PublicProfileService";
import DomainService from "@/appwrite/domainServices";

const profileService = new PublicProfileService();
const domainService = new DomainService();

const PublicProfile = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [domains, setDomains] = useState({});

    useEffect(() => {
        loadProfile();
    }, [username]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await profileService.getCompletePublicProfile(username);

            if (!data) {
                setProfileData(null);
                setLoading(false);
                return;
            }

            setProfileData(data);

            // Load domain details
            const domainDetails = {};
            for (const progress of data.verifiedDomains) {
                try {
                    const domain = await domainService.getDomainById(progress.domainId);
                    if (domain) {
                        domainDetails[progress.domainId] = domain;
                    }
                } catch (error) {
                    console.error("Error loading domain:", error);
                }
            }
            setDomains(domainDetails);
        } catch (error) {
            console.error("Error loading profile:", error);
            setProfileData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Profile URL copied to clipboard!");
    };

    const handleLinkedInShare = () => {
        const url = profileService.getLinkedInShareUrl(username, profileData.profile.fullName);
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-6">
                        <Award className="w-12 h-12 text-slate-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Profile Not Found</h1>
                    <p className="text-slate-600 mb-6">
                        The profile you're looking for doesn't exist or is set to private.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    const { profile, verifiedDomains, certificates, projects, stats } = profileData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Avatar */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-shrink-0"
                        >
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                                {profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.fullName}
                                        className="w-full h-full rounded-2xl object-cover"
                                    />
                                ) : (
                                    profile.fullName.charAt(0).toUpperCase()
                                )}
                            </div>
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-bold text-slate-900">{profile.fullName}</h1>
                                    {profile.isVerified && (
                                        <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            <Shield className="w-4 h-4" />
                                            Verified
                                        </div>
                                    )}
                                </div>

                                {profile.targetRole && (
                                    <p className="text-xl text-slate-600 mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        {profile.targetRole}
                                    </p>
                                )}

                                {profile.bio && (
                                    <p className="text-slate-700 mb-6 leading-relaxed max-w-2xl">
                                        {profile.bio}
                                    </p>
                                )}

                                {/* Social Links */}
                                <div className="flex items-center gap-3 mb-6">
                                    {profile.githubUrl && (
                                        <a
                                            href={profile.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                        >
                                            <Github className="w-4 h-4" />
                                            GitHub
                                        </a>
                                    )}
                                    {profile.linkedinUrl && (
                                        <a
                                            href={profile.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                            LinkedIn
                                        </a>
                                    )}
                                    {profile.portfolioUrl && (
                                        <a
                                            href={profile.portfolioUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Portfolio
                                        </a>
                                    )}
                                </div>

                                {/* Share Actions */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleCopyUrl}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copy Profile URL
                                    </button>
                                    <button
                                        onClick={handleLinkedInShare}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] hover:bg-[#006399] text-white rounded-lg transition-colors font-semibold"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share on LinkedIn
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
                {/* Skills Snapshot */}
                {profile.skills && profile.skills.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Code className="w-6 h-6 text-blue-600" />
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Learning Activity Stats */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        Learning Activity
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <Award className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{stats.verifiedDomains}</p>
                            <p className="text-sm text-slate-600">Verified Domains</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{stats.assessmentsPassed}</p>
                            <p className="text-sm text-slate-600">Assessments Passed</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <BookOpen className="w-8 h-8 text-purple-600" />
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{stats.totalTopicsCompleted}</p>
                            <p className="text-sm text-slate-600">Topics Completed</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <Zap className="w-8 h-8 text-yellow-600" />
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{certificates.length}</p>
                            <p className="text-sm text-slate-600">Certificates Earned</p>
                        </div>
                    </div>
                </motion.section>

                {/* Verified Domains */}
                {verifiedDomains.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Award className="w-6 h-6 text-blue-600" />
                            Verified Domains
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {verifiedDomains.map((progress) => {
                                const domain = domains[progress.domainId];
                                return (
                                    <div
                                        key={progress.$id}
                                        className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-blue-600 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-1">
                                                    {domain?.title || "Domain"}
                                                </h3>
                                                <p className="text-sm text-slate-600">{domain?.description || ""}</p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Verified
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-slate-600">
                                                <Calendar className="w-4 h-4 inline mr-1" />
                                                Verified {new Date(progress.verifiedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.section>
                )}

                {/* Certificates */}
                {certificates.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Award className="w-6 h-6 text-blue-600" />
                            Certificates
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certificates.map((cert) => (
                                <div
                                    key={cert.$id}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{cert.domainName}</h3>
                                            <p className="text-sm text-slate-600">Certificate of Completion</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Issued {new Date(cert.issuedAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs">{cert.certificateId}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Code className="w-6 h-6 text-blue-600" />
                            Verified Projects
                        </h2>
                        <div className="space-y-6">
                            {projects.map((project) => (
                                <div
                                    key={project.$id}
                                    className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-blue-600 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">Final Domain Project</h3>
                                            <p className="text-slate-600 mb-3">{project.description}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Verified
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <Github className="w-4 h-4" />
                                                View Code
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                                            >
                                                <Globe className="w-4 h-4" />
                                                Live Demo
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-slate-200 py-8">
                <div className="max-w-5xl mx-auto px-6 text-center text-slate-600">
                    <p>Powered by <span className="font-bold text-blue-600">SkillForge AI</span></p>
                    <p className="text-sm mt-2">Learn, Build, Verify</p>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
