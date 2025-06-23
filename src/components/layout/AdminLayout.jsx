import React from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen pt-[64px]">
      <Sidebar />
      <div className="ml-[200px] flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4">
          {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
