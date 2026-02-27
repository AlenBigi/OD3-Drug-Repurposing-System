import { useNavigate } from "react-router-dom";

export default function DiseaseSearch() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Researcher";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 text-white flex flex-col">
      {/* Top Header Bar - Logo left, Profile/Logout right */}
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-8 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wider">OD3</h1>

        {/* Profile & Logout - Top Right */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-white/80">Logged in as</p>
            <p className="font-semibold">{username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur transition font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10">
          <nav className="p-6">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/home")}
                  className="w-full text-left block py-3 px-4 rounded-lg hover:bg-white/10 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/analysis")}
                  className="w-full text-left block py-3 px-4 rounded-lg hover:bg-white/10 transition"
                >
                  Drug Analysis
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/diseases")}
                  className="w-full text-left block py-3 px-4 rounded-lg bg-white/10 font-medium"
                >
                  Disease Explorer
                </button>
              </li>

              <li>
                <a href="#" className="block py-3 px-4 rounded-lg hover:bg-white/10 transition">
                  Reports
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-12">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-12">
            Disease Search
          </h1>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-10">
            <div className="flex items-center gap-4 px-6 py-4 rounded-full
              bg-white/15 border border-white/20">
              <span className="text-xl opacity-80">🔍</span>
              <input
                type="text"
                placeholder="Search disease..."
                className="bg-transparent w-full outline-none placeholder-white/60"
              />
            </div>
          </div>

          {/* Disease Card */}
          <div className="w-full max-w-3xl mb-10
            bg-white/12 border border-white/20 rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-3">
              Alzheimer&apos;s Disease <span className="text-sm opacity-70">(ORPHA:58)</span>
            </h2>

            <p className="text-white/80 leading-relaxed">
              A neurodegenerative disorder characterized by progressive cognitive
              decline, memory loss, and behavioral changes.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6
            w-full max-w-4xl">

            {/* Prevalence */}
            <div className="bg-white/12 border border-white/20 rounded-2xl p-5">
              <h3 className="font-semibold mb-2">👥 Prevalence</h3>
              <p className="text-white/80 text-sm">
                1–5 per 1,000 people<br />over age 60
              </p>
            </div>

            {/* Genes */}
            <div className="bg-white/12 border border-white/20 rounded-2xl p-5">
              <h3 className="font-semibold mb-3">🧬 Genes Involved</h3>
              <div className="flex gap-2 flex-wrap">
                {["APP", "PSEN1", "PSEN2"].map(gene => (
                  <span
                    key={gene}
                    className="px-3 py-1 rounded-full text-sm
                  bg-emerald-600/40 border border-emerald-400/40">
                    {gene}
                  </span>
                ))}
              </div>
            </div>

            {/* Treatments */}
            <div className="bg-white/12 border border-white/20 rounded-2xl p-5">
              <h3 className="font-semibold mb-2">💊 Known Treatments</h3>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• Donepezil</li>
                <li>• Memantine</li>
                <li>• Rivastigmine</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
