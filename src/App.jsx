import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import AdminDashboard from './AdminDashboard';
import FeedBackForm from './FeedBackForm';
import CopyRights from './CopyRights';
import CollaboratorDashboard from './CollaboratorDashboard'; // create this if needed

export default function App() {
  return (
    <>
      <Routes>
        {/* Home page with Header */}
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

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Collaborator dashboard */}
        <Route path="/collaborator" element={<CollaboratorDashboard />} />
      </Routes>
    </>
  );
}
