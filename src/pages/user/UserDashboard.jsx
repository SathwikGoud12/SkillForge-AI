import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import AppwriteAccount from "@/src/appwrite/Account.services";
import UserProfileService from "@/src/appwrite/UserProfileServices";

const appWriteAccount = new AppwriteAccount();
const profileService = new UserProfileService();

const UserDashBoard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  async function loadProfile() {
    try {
      const currentUser = await appWriteAccount.getAppwriteUser();
      console.log(currentUser);

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      const profileRes = await profileService.getProfileByUserId(
        currentUser.$id
      );

      if (profileRes.rows.length > 0) {
        setProfile(profileRes.rows[0]);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await appWriteAccount.logout();
    navigate("/login");
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Good Evening, {profile?.name || user?.name} 👋
          </h1>
          <p className="text-gray-600">
            Preparing for: {profile?.targetRole || "Not set"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-500">
          Progress, streaks, and tasks will appear here next.
        </p>
      </div>
    </div>
  );
};

export default UserDashBoard;
