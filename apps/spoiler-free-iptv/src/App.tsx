import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { getWorldCup2026Dataset } from "iptv-sports-data";

const dataset = getWorldCup2026Dataset();

export function App() {
  const [showTeams, setShowTeams] = useState(false);

  return (
    <main className="shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">No-score mode</p>
          <h1>Spoiler-Free IPTV</h1>
        </div>
        <button onClick={() => setShowTeams((value) => !value)}>
          {showTeams ? <EyeOff size={16} /> : <Eye size={16} />}
          {showTeams ? "Hide Teams" : "Reveal Teams"}
        </button>
      </section>

      <section className="timeline">
        {dataset.fixtures.map((fixture) => (
          <article className="slot" key={fixture.id}>
            <time>{new Date(fixture.kickoffUtc).toLocaleString()}</time>
            <strong>{showTeams ? `${fixture.homeTeam} vs ${fixture.awayTeam}` : "Match hidden"}</strong>
            <span>{fixture.stage} · {fixture.city}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
