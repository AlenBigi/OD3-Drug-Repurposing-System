import { Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Researcher";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col text-white
      bg-gradient-to-br from-[#0e5f5a] via-[#0a5752] to-[#094a46]">

      {/* ===== Top Header ===== */}
      <header className="h-16 px-8 flex items-center justify-between
        border-b border-white/10 bg-[#0e5f5a]">
        
        <h1 className="text-2xl font-bold tracking-wider">OD3</h1>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-white/70">Logged in as</p>
            <p className="font-semibold">{username}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full
              bg-white/15 hover:bg-white/25 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ===== Main Area ===== */}
      <div className="flex flex-1">

        {/* ===== Sidebar ===== */}
        <aside className="w-64 bg-[#0b4f4b] border-r border-white/10">
          <nav className="p-6">
            <ul className="space-y-2 text-sm">

              <li>
                <button
                  onClick={() => navigate("/home")}
                  className="w-full text-left px-4 py-3 rounded-md
                    bg-white/15 font-medium"
                >
                  Dashboard
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/predict")}
                  className="w-full text-left px-4 py-3 rounded-md
                    hover:bg-white/10 transition"
                >
                  Drug Analysis
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/diseases")}
                  className="w-full text-left px-4 py-3 rounded-md
                    hover:bg-white/10 transition"
                >
                  Disease Explorer
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/reports")}
                  className="w-full text-left px-4 py-3 rounded-md
                    hover:bg-white/10 transition"
                >
                  Reports
                </button>
              </li>

            </ul>
          </nav>
        </aside>

        {/* ===== Page Content ===== */}
        <main className="flex-1 overflow-y-auto p-14">
          <Outlet />
        </main>

      </div>
    </div>
  );
}