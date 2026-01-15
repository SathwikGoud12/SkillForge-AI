import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import MyDashboard from "./pages/MyDashboard";

import AddDomain from "./pages/admin/AddDomainForm";
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
import UserDashBoard from "./pages/user/UserDashBoard";
import UserDomains from "./pages/user/UserDomains";
import UserLayout from "./pages/user/UserLayout";
import UserTopics from "./pages/user/UserTopics";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/user",

    element: <UserLayout />,
    children: [
      { index: true, element: <UserDashBoard /> },
      { path: "domains", element: <UserDomains /> },
      {
        path: "domains/:domainId/topics",
        element: <UserTopics/>,
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
      { path: "adddomain", element: <AddDomain /> },
      { path: "alldomains", element: <AllDomains /> },
      { path: "edit-domain/:id", element: <EditDomain /> },
      { path: "domains/:domainId/topics", element: <TopicsList /> },
      { path: "domains/:domainId/add-topic", element: <AddTopic /> },
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
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
