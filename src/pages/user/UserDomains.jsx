import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import AppwriteAccount from "@/src/appwrite/Account.services";
import DomainService from "@/src/appwrite/domainServices";

const account = new AppwriteAccount();
const domainService = new DomainService();

const UserDomains = () => {
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDomains() {
    try {
      const user = await account.getAppwriteUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const res = await domainService.getAllDomains();
      setDomains(res.rows || []);
    } catch (error) {
      console.error("Failed to load domains", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDomains();
  }, []);

  if (loading) {
    return <p className="p-6">Loading domains...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Choose a Domain</h1>

      {domains.length === 0 ? (
        <p>No domains available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <div
              key={domain.$id}
              onClick={() => navigate(`/user/domains/${domain.$id}/topics`)}
              className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition"
            >
             {domain.imageId && (
              <img
                src={domainService.getImagePreview(domain.imageId)}
                alt={domain.title}
                className="w-full h-44 object-cover"
              />
            )}

              <div className="p-4">
                <h2 className="text-lg font-semibold">{domain.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {domain.description}
                </p>

                <p className="text-sm mt-2">
                  <span className="font-medium">Level:</span> {domain.level}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDomains;
