import type { PublicSportsChannel } from "./types.js";

export const publicSportsChannels: PublicSportsChannel[] = [
  {
    id: "olympics-channel.global",
    name: "Olympics Channel",
    country: "GLOBAL",
    language: "English",
    sports: ["Olympic sports", "Documentary", "Highlights"],
    officialWebsite: "https://olympics.com/",
    evidence: "Official Olympics web property; verify live availability by region before linking streams.",
    epgId: "olympics-channel.global"
  },
  {
    id: "fifa-plus.global",
    name: "FIFA+",
    country: "GLOBAL",
    language: "Multilingual",
    sports: ["Football", "Archive", "Highlights"],
    officialWebsite: "https://www.plus.fifa.com/",
    evidence: "Official FIFA streaming platform; this project stores metadata only.",
    epgId: "fifa-plus.global"
  },
  {
    id: "red-bull-tv.global",
    name: "Red Bull TV",
    country: "GLOBAL",
    language: "English",
    sports: ["Motorsport", "Extreme sports", "Cycling"],
    officialWebsite: "https://www.redbull.com/int-en/discover",
    evidence: "Official Red Bull media property; regional rights can vary.",
    epgId: "red-bull-tv.global"
  },
  {
    id: "tubi-sports.us",
    name: "Tubi Sports",
    country: "US",
    language: "English",
    sports: ["Sports documentaries", "FAST"],
    officialWebsite: "https://tubitv.com/",
    evidence: "Official ad-supported streaming platform; availability changes by region.",
    epgId: "tubi-sports.us"
  }
];
