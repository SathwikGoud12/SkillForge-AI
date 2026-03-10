import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import MyDashboard from "./pages/MyDashboard";
import { AuthInitializer } from "./components/AuthInitializer";
import { RootLayout } from "./components/RootLayout";

import AddDomainForm from "./pages/admin/AddDomainForm";
import Overview from "./pages/admin/Overview";
import AllDomains from "./pages/admin/AllDomains";
import EditDomain from "./pages/admin/EditDomain";
import AddTopic from "./pages/admin/AddTopic";
import TopicsList from "./pages/admin/TopicsList";
import AddNote from "./pages/admin/AddNote";
import TopicDetail from "./pages/admin/TopicDetails";
import AddInterviewQuestion from "./pages/admin/AddInterViewQuestions";
import AddAssessment from "./pages/admin/AddAssessment";
import AddProject from "./pages/admin/AddProject";
import AddDomainProject from "./pages/admin/AddDomainProject";
import SeedData from "./pages/admin/SeedData";

import UserDomains from "./pages/user/UserDomains";
import UserLayout from "./pages/user/UserLayout";
import UserTopics from "./pages/user/UserTopics";
import UserTopicDetails from "./pages/user/UserTopicDetails";
import UserSetup from "./pages/user/UserSetup";
import AssessmentAttempt from "./pages/user/AssessmentAttempt";
import MyCertificates from "./pages/user/MyCertificates";
import PublicProfile from "./pages/PublicProfile";
import UserProfile from "./pages/user/UserProfile";
import UserProgress from "./pages/user/UserProgress";
import AIAssistant from "./pages/user/AIAssistant";
import StudyMaterials from "./pages/user/StudyMaterials";
import SubjectDetail from "./pages/user/SubjectDetail";
import DoubtClearingSession from "./pages/user/DoubtClearingSession";
import OAuthCallback from "./pages/OAuthCallback";
import UserGrowthPage from "./pages/admin/UserGrowthPage";
import PlatformStatsPage from "./pages/admin/PlatformStatsPage";
import UserDashboard from "./pages/user/UserDashboard";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/home",
        element: <App />,
      },
      {
        path: "/u/:username",
        element: <PublicProfile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/oauth/callback",
        element: <OAuthCallback />,
      },
      {
        path: "/user",
        element: (
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <UserDashboard/> },
          { path: "setup", element: <UserSetup /> },
          { path: "domains", element: <UserDomains /> },
          { path: "seed-data", element: <SeedData /> },
          { path: "certificates", element: <MyCertificates /> },
          { path: "profile", element: <UserProfile /> },
          { path: "progress", element: <UserProgress /> },
          { path: "ai-assistant", element: <AIAssistant /> },
          { path: "study-materials", element: <StudyMaterials /> },
          { path: "study-materials/subject/:subjectId", element: <SubjectDetail /> },
          { path: "study-materials/doubt-session/:subjectId", element: <DoubtClearingSession /> },
          {
            path: "domains/:domainId/topics",
            element: <UserTopics />,
          },
          {
            path: "domains/:domainId/topics/:topicId",
            element: <UserTopicDetails />,
          },
          {
            path: "domains/:domainId/topics/:topicId/assessment/:assessmentId",
            element: <AssessmentAttempt />,
          },
        ],
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <MyDashboard />
            </AdminRoute>
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Overview /> },
          { path: "adddomain", element: <AddDomainForm /> },
          { path: "alldomains", element: <AllDomains /> },
          { path: "analytics", element: <UserGrowthPage /> },
          { path: "stats", element: <PlatformStatsPage /> },
          { path: "edit-domain/:id", element: <EditDomain /> },
          { path: "domains/:domainId/topics", element: <TopicsList /> },
          { path: "domains/:domainId/add-topic", element: <AddTopic /> },
          { path: "domains/:domainId/add-final-project", element: <AddDomainProject /> },
          {
            path: "domains/:domainId/topics/:topicId/add-note",
            element: <AddNote />,
          },
          {
            path: "domains/:domainId/topics/:topicId",
            element: <TopicDetail />,
          },
          {
            path: "domains/:domainId/topics/:topicId/add-question",
            element: <AddInterviewQuestion />,
          },
          {
            path: "domains/:domainId/topics/:topicId/add-assessment",
            element: <AddAssessment />,
          },
          {
            path: "domains/:domainId/topics/:topicId/add-project",
            element: <AddProject />,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
