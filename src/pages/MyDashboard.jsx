import { Button } from "@/components/ui/button"
import { Link, Outlet, useNavigate } from "react-router";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import useAuthStore from "@/src/store/authStore.js";
import AppwriteAccount from "../appwrite/Account.services";

const MyDashboard = () => {

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const appwriteAccount = new AppwriteAccount();
  const navigate = useNavigate();

  async function handleLogOut() {
    setIsLoggingOut(true)
    const result = await appwriteAccount.logout();
    console.log("result");
    if (!result?.message) {
      setIsLoggingOut(false)
      setCurrentUser(null)
      navigate("/login")
    }
  }

  console.log("Renders and Re-renders");

  return (
    <main className="h-screen w-screen flex gap-3 p-3">
      <section className="bg-amber-500 rounded-lg p-3 w-[20%] flex flex-col items-start justify-between">
        <nav className="flex flex-col gap-3">
          <Link className="text-blue hover:underline" to="/dashboard">Overview</Link>
          <Link className="text-blue hover:underline" to="/dashboard/adddomain">AddDomain</Link>
           <Link className="text-blue hover:underline" to="/dashboard/alldomains">AllDomains</Link>
          <Link className="text-blue hover:underline" to="/dashboard/settings">Settings</Link>
        </nav>
        <Button
          disabled={isLoggingOut ? true : false}
          variant="destructive" onClick={handleLogOut}>
          {
            isLoggingOut ? (
              <p className="flex items-center gap-2">
                <Spinner />
                <span>Logging Out</span>
              </p>
            ) : "Log Out"
          }
        </Button>
      </section>

      <section className="w-[80%]">
        <Outlet />
      </section>
    </main>
  )
}

export default MyDashboard