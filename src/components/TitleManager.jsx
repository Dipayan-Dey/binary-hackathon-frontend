import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import routeTitles from "../config/routeTitles";
// import routeTitles from "../config/routeTitles";

function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const title = routeTitles[location.pathname];

    document.title = title || "ReadyNX";
  }, [location.pathname]);

  return null;
}

export default TitleManager;
