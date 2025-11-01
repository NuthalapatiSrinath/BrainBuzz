// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router";

import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import HomePage from "../pages/HomePage/HomePage";
import CurrentAffairsPage from "../pages/CurrentAffairsPage/CurrentAffairsPage";
import UPSCPage from "../sections/CurrentAffairsSubCategorySection/UPSCPage/UPSCPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* index route renders HomePage inside DashboardLayout */}
        <Route index element={<HomePage />} />
        
        <Route path="/currentaffairs" element={<CurrentAffairsPage />} />
        <Route path="/currentaffairs/upsc" element={<UPSCPage />} />
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default AppRoutes;
