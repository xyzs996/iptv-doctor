import { ExternalLink, ShieldCheck } from "lucide-react";
import { publicSportsChannels } from "@iptv-star/sports-data";

export function App() {
  return (
    <main className="shell">
      <section className="heading">
        <ShieldCheck size={28} />
        <div>
          <p className="eyebrow">Metadata only</p>
          <h1>Public Sports TV Index</h1>
        </div>
      </section>

      <section className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Region</th>
              <th>Sports</th>
              <th>Evidence</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {publicSportsChannels.map((channel) => (
              <tr key={channel.id}>
                <td><strong>{channel.name}</strong><span>{channel.language}</span></td>
                <td>{channel.country}</td>
                <td>{channel.sports.join(", ")}</td>
                <td>{channel.evidence}</td>
                <td>
                  <a href={channel.officialWebsite} target="_blank" rel="noreferrer">
                    <ExternalLink size={15} /> Official
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
