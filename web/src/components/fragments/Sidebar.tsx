import React from 'react';

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white p-4 space-y-4 h-screen fixed">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">MyApp</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <a href="/dashboard" className="hover:bg-gray-700 p-2 rounded">Dashboard</a>
          <a href="/dashboard/count" className="hover:bg-gray-700 p-2 rounded">Realtime Count</a>
          <a href="/settings" className="hover:bg-gray-700 p-2 rounded">Settings</a>
          <a href="/logout" className="hover:bg-gray-700 p-2 rounded">Logout</a>
        </nav>
      </div>

      <div className="flex-1 p-6 bg-gray-100 ml-64 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
