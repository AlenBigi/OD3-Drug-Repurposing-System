import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function DiseaseSearch() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Researcher";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  // 🔎 HANDLE INPUT
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      setSelectedDisease(null);
    }
  };

  // 🔎 SEARCH EFFECT (ONLY FETCH — no setState loops)
  useEffect(() => {
    if (query.length < 2) return;

    const delayDebounce = setTimeout(() => {
      fetch(`http://localhost:8000/search?query=${query}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error("Search error:", err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // 📦 FETCH SELECTED DISEASE
  const fetchDisease = (id) => {
    fetch(`http://localhost:8000/disease/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedDisease({ ...data, id });
        setResults([]);
        setQuery(data.name || "");
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white flex flex-col">

      {/* HEADER */}
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-8 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wider">OD3</h1>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-white/80">Logged in as</p>
            <p className="font-semibold">{username}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10">
          <nav className="p-6">
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate("/home")} className="w-full text-left py-3 px-4 hover:bg-white/10 rounded-lg">
                  Home
                </button>
              </li>

              <li>
                <button onClick={() => navigate("/analysis")} className="w-full text-left py-3 px-4 hover:bg-white/10 rounded-lg">
                  Drug Analysis
                </button>
              </li>

              <li>
                <button className="w-full text-left py-3 px-4 bg-white/10 rounded-lg">
                  Disease Explorer
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-12 overflow-y-auto">

          <h1 className="text-4xl font-bold mb-8">
            Disease Explorer
          </h1>

          {/* SEARCH BAR */}
          <div className="relative max-w-2xl mb-10">

            <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-white/15 border border-white/20">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Search disease..."
                value={query}
                onChange={handleChange}
                className="bg-transparent w-full outline-none placeholder-white/60"
              />
            </div>

            {/* SEARCH RESULTS */}
            {results.length > 0 && (
              <div className="absolute w-full mt-2 bg-slate-800 border border-white/10 rounded-xl max-h-60 overflow-y-auto z-10">
                {results.map((d) => (
                  <div
                    key={d.orpha_id}
                    onClick={() => fetchDisease(d.orpha_id)}
                    className="p-3 cursor-pointer hover:bg-white/10"
                  >
                    {d.name} (ORPHA:{d.orpha_id})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DISEASE DETAILS */}
          {selectedDisease && (
            <div className="max-w-4xl space-y-6">

              {/* TITLE */}
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                <h2 className="text-2xl font-semibold">
                  {selectedDisease.name}
                  <span className="text-sm opacity-70 ml-2">
                    (ORPHA:{selectedDisease.id})
                  </span>
                </h2>

                <p className="text-white/80 mt-3">
                  {selectedDisease.prevalence || "No prevalence data available"}
                </p>
              </div>

              {/* GRID */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* GENES */}
                <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
                  <h3 className="font-semibold mb-3">🧬 Genes</h3>

                  <div className="flex flex-wrap gap-2">
                    {selectedDisease.genes?.length > 0 ? (
                      selectedDisease.genes.map((g) => (
                        <span key={g} className="px-3 py-1 bg-emerald-500/30 rounded-full text-sm">
                          {g}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm opacity-70">No gene data</p>
                    )}
                  </div>
                </div>

                {/* SYMPTOMS */}
                <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
                  <h3 className="font-semibold mb-3">🩺 Symptoms</h3>

                  <div className="flex flex-wrap gap-2">
                    {selectedDisease.symptoms?.length > 0 ? (
                      selectedDisease.symptoms.slice(0, 20).map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-500/30 rounded-full text-sm">
                          {s}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm opacity-70">No symptom data</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}