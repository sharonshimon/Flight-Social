import { Outlet } from "react-router-dom";
import Navbar from "../components/upperNavBar/Navbar";
import LeftBar from "../components/leftBar/LeftBar";
import RightBar from "../components/rightBar/RightBar";

export default function Layout() {
  return (
    <div className="feed-bg" style={{ minHeight: "100vh", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
        <LeftBar />
        <main style={{ flex: 6, overflowY: "auto", maxHeight: "calc(100vh - 60px)", padding: 20 }}>
          <Outlet />
        </main>
        <RightBar />
      </div>
    </div>
  );
}