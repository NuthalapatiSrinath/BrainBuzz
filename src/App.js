import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import RenderModal from "./modals/RenderModal/RenderModal";
// import { initAutoLogout } from "./utils/autoLogout";
// import { isLoggedIn } from "../src/utils/auth";

function App() {
  const isModalOpen = useSelector((state) => state.modal.isOpen);

  // useEffect(() => {
    
  //   if (isLoggedIn()) {
  //     initAutoLogout();
  //   }
  // }, []);

  return (
    <div className="App">
      <AppRoutes />
      {isModalOpen && <RenderModal />}
    </div>
  );
}

export default App;
