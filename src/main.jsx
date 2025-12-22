import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AddDomain from "./pages/admin/AddDomain";
import AdminOverview from "./pages/admin/Overview";
import Overview from "./pages/admin/Overview";
import MyDashboard from "./pages/MyDashboard";
import AllDomains from "./pages/admin/AllDomains";
import EditDomain from "./pages/admin/EditDomain";
import AddTopic from "./pages/admin/AddTopic";
import TopicsList from "./pages/admin/TopicsList";
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
      {
        path: "adddomain",
        element: <AddDomain />,
      },
      {
        path: "alldomains",
        element: <AllDomains />,
      },
      { path: "edit-domain/:id", element: <EditDomain /> },
       {
      path: "domains/:domainId/topics",
      element: <TopicsList /> 
    },
    
      {
        path: "domains/:domainId/add-topic",
        element: <AddTopic />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
