import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import RenderModal from "./modals/RenderModal/RenderModal";
import ScrollToTop from "./scrollToTop";
import { useLocation } from "react-router";
// import { initAutoLogout } from "./utils/autoLogout";
// import { isLoggedIn } from "../src/utils/auth";

function App() {
  const isModalOpen = useSelector((state) => state.modal.isOpen);

  
  const location = useLocation()
  useEffect(()=> {
    console.log(location)
  })

  return (
    <div className="App">
      <ScrollToTop />
      <AppRoutes />
      {isModalOpen && <RenderModal />}
    </div>
  );
}

export default App;
