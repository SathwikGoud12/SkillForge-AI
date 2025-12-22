import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import AppwriteAccount from "../appwrite/Account.services";

const PublicRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const account = new AppwriteAccount();

    async function checkAuth() {
      const user = await account.getAppwriteUser();
      setUser(user);
      setChecking(false);
    }

    checkAuth();
  }, []);

  if (checking) return <h1>Loading...</h1>;

  if (user) return <Navigate to="/dashboard" />;

  return children;
};

export default PublicRoute;
  