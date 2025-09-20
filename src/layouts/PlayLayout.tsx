import { Outlet } from "react-router-dom";
import PlaySideBar from "../components/PlaySideBar/PlaySideBar";
import { useState, useEffect } from "react";
import HeroBg from "../assets/Hero-Bg.webp";

export default function PlayLayout() {
  const [sidebarWidth, setSidebarWidth] = useState("16rem"); // 64px when collapsed, 256px when expanded

  // Listen for sidebar width changes (you could use context or props)
  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth + 'px');
      }
    };

    // Check initial width
    handleResize();
    
    // Listen for changes
    const observer = new ResizeObserver(handleResize);
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      observer.observe(sidebar);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${HeroBg})` }}>
      {/* Fixed Sidebar */}
      <PlaySideBar />
      
      {/* Main Content Area - dynamically adjust margin */}
      <main 
        className="min-h-screen md:ml-64 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Outlet />
      </main>
    </div>
  );
}