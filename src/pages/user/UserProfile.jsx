import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User, Mail, Calendar, Shield, Edit, Save, X,
    Github, Linkedin, Globe, MapPin, Briefcase, Award
} from "lucide-react";
import { toast } from "sonner";
import AppwriteAccount from "@/appwrite/Account.services";
import PublicProfileService from "@/appwrite/PublicProfileService";

const account = new AppwriteAccount();
const profileService = new PublicProfileService();

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        targetRole: "",
        bio: "",
        githubUrl: "",
        linkedinUrl: "",
        portfolioUrl: ""
    });

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        setLoading(true);
        try {
            const currentUser = await account.getAppwriteUser();
            setUser(currentUser);

            const userProfile = await profileService.getOrCreateProfile(currentUser.$id, {
                fullName: currentUser.name,
                username: currentUser.email.split("@")[0]
            });

            setProfile(userProfile);
            setFormData({
                fullName: userProfile.fullName || currentUser.name,
                username: userProfile.username || "",
                targetRole: userProfile.targetRole || "",
                bio: userProfile.bio || "",
                githubUrl: userProfile.githubUrl || "",
                linkedinUrl: userProfile.linkedinUrl || "",
                portfolioUrl: userProfile.portfolioUrl || ""
            });
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await profileService.updateProfile(user.$id, formData);
            toast.success("Profile updated successfully!");
            setEditing(false);
            loadUserProfile();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData({
            fullName: profile.fullName || user.name,
            username: profile.username || "",
            targetRole: profile.targetRole || "",
            bio: profile.bio || "",
            githubUrl: profile.githubUrl || "",
            linkedinUrl: profile.linkedinUrl || "",
            portfolioUrl: profile.portfolioUrl || ""
        });
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
                    <p className="text-slate-600">Manage your personal information and public profile</p>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden"
                >
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 relative">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-6">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center text-blue-600 text-3xl font-bold">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="text-white">
                                    <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                                    <p className="text-blue-100 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {user?.email}
                                    </p>
                                    {profile?.isVerified && (
                                        <div className="flex items-center gap-2 mt-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                            <Shield className="w-4 h-4" />
                                            Verified Account
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Edit Button */}
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-8 space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Full Name
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium">
                                            {profile?.fullName || "Not set"}
                                        </p>
                                    )}
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Username
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                                            placeholder="username"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium font-mono">
                                            {profile?.username || "Not set"}
                                        </p>
                                    )}
                                </div>

                                {/* Target Role */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        <Briefcase className="w-4 h-4 inline mr-1" />
                                        Target Role
                                    </label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={formData.targetRole}
                                            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                                            placeholder="e.g., Full-Stack Developer"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium">
                                            {profile?.targetRole || "Not set"}
                                        </p>
                                    )}
                                </div>

                                {/* Bio */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Bio
                                    </label>
                                    {editing ? (
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-700">
                                            {profile?.bio || "No bio added yet"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                                Social Links
                            </h3>
                            <div className="space-y-4">
                                {/* GitHub */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <Github className="w-4 h-4" />
                                        GitHub
                                    </label>
                                    {editing ? (
                                        <input
                                            type="url"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                                            placeholder="https://github.com/username"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium">
                                            {profile?.githubUrl || "Not set"}
                                        </p>
                                    )}
                                </div>

                                {/* LinkedIn */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn
                                    </label>
                                    {editing ? (
                                        <input
                                            type="url"
                                            value={formData.linkedinUrl}
                                            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium">
                                            {profile?.linkedinUrl || "Not set"}
                                        </p>
                                    )}
                                </div>

                                {/* Portfolio */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Portfolio Website
                                    </label>
                                    {editing ? (
                                        <input
                                            type="url"
                                            value={formData.portfolioUrl}
                                            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                                            placeholder="https://yourportfolio.com"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium">
                                            {profile?.portfolioUrl || "Not set"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Account Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="px-4 py-3 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-600 mb-1">Member Since</p>
                                    <p className="font-semibold text-slate-900">
                                        {new Date(user?.$createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="px-4 py-3 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-600 mb-1">Account Status</p>
                                    <p className="font-semibold text-green-600 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                        Active
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Public Profile Link */}
                        {profile?.username && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-blue-600" />
                                            Public Profile
                                        </h4>
                                        <p className="text-sm text-slate-600">
                                            Your public profile is available at:
                                        </p>
                                        <p className="font-mono text-blue-600 mt-2">
                                            /u/{profile.username}
                                        </p>
                                    </div>
                                    <a
                                        href={`/u/${profile.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        View Profile
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;
