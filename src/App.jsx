import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Dashboard from "./AdminRoutes/Dashboard";
import Feedback from "./AdminRoutes/Feedback";
import Developers from "./AdminRoutes/Developers";
import Login from "./Login";
import FeedBackForm from "./FeedBackForm";
import Header from "./Header";
import CopyRights from "./CopyRights";
import CollaboratorDashboard from './CollaboratorDashboard'

export default function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route
        path="/"
        element={
          <div>
            <Header />
            <FeedBackForm />
            <CopyRights />
          </div>
        }
      />

      {/* Login page */}
      <Route path="/login" element={<Login />} />


<Route path="/collaborator" element={<CollaboratorDashboard />} />


     {/* Admin dashboard with nested routes */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="feedbacks" element={<Feedback />} />
        <Route path="developers" element={<Developers />} />
        {/* Optional: default redirect to dashboard */}
        <Route index element={<Dashboard />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
        
    </Routes>
  );
}
