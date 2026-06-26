import type { SportsDataset } from "./types.js";

const dataset: SportsDataset = {
  tournament: {
    name: "FIFA World Cup 2026",
    edition: 23,
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    hostCountries: ["Canada", "Mexico", "United States"],
    teamCount: 48,
    matchCount: 104
  },
  broadcasters: {
    AE: {
      country: "AE",
      label: "United Arab Emirates",
      channels: [
        {
          id: "ad_sports.ae",
          name: "Abu Dhabi Sports",
          country: "AE",
          language: "Arabic",
          kind: "broadcast",
          isFree: true,
          website: "https://adsports.ae/",
          notes: "Free-to-air sports network."
        },
        {
          id: "dubaisports.ae",
          name: "Dubai Sports",
          country: "AE",
          language: "Arabic",
          kind: "broadcast",
          isFree: true,
          website: "https://www.dubaisports.ae/",
          notes: "Free-to-air sports network."
        }
      ]
    },
    AR: {
      country: "AR",
      label: "Argentina",
      channels: [
        {
          id: "tycsports.ar",
          name: "TyC Sports",
          country: "AR",
          language: "Spanish",
          kind: "broadcast",
          isFree: false,
          website: "https://www.tycsports.com/",
          notes: "Pay-TV sports network."
        },
        {
          id: "tntsports.ar",
          name: "TNT Sports Argentina",
          country: "AR",
          language: "Spanish",
          kind: "broadcast",
          isFree: false,
          website: "https://tntsports.com.ar/",
          notes: "Pay-TV sports network."
        },
        {
          id: "tvp.ar",
          name: "TV Pública",
          country: "AR",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.tvpublica.com.ar/",
          notes: "Free-to-air public broadcaster for select matches."
        }
      ]
    },
    AT: {
      country: "AT",
      label: "Austria",
      channels: [
        {
          id: "orf.at",
          name: "ORF",
          country: "AT",
          language: "German",
          kind: "broadcast",
          isFree: true,
          website: "https://tvthek.orf.at/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    AU: {
      country: "AU",
      label: "Australia",
      channels: [
        {
          id: "sbs.au",
          name: "SBS",
          country: "AU",
          language: "English",
          kind: "broadcast",
          isFree: true,
          website: "https://www.sbs.com.au/ondemand",
          notes: "Free-to-air World Cup 2026 rights holder."
        },
        {
          id: "optus.au",
          name: "Optus Sport",
          country: "AU",
          language: "English",
          kind: "streaming",
          isFree: false,
          website: "https://sport.optus.com.au/",
          notes: "Streaming rights holder."
        }
      ]
    },
    BE: {
      country: "BE",
      label: "Belgium",
      channels: [
        {
          id: "rtbf.be",
          name: "RTBF",
          country: "BE",
          language: "French",
          kind: "broadcast",
          isFree: true,
          website: "https://www.rtbf.be/auvio",
          notes: "Free-to-air French-language public broadcaster."
        },
        {
          id: "sporza.be",
          name: "Sporza",
          country: "BE",
          language: "Dutch",
          kind: "streaming",
          isFree: true,
          website: "https://sporza.be/",
          notes: "Free Dutch-language sports streaming by VRT."
        }
      ]
    },
    BG: {
      country: "BG",
      label: "Bulgaria",
      channels: [
        {
          id: "bnt.bg",
          name: "BNT",
          country: "BG",
          language: "Bulgarian",
          kind: "broadcast",
          isFree: true,
          website: "https://bnt.bg/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    BR: {
      country: "BR",
      label: "Brazil",
      channels: [
        {
          id: "globo.br",
          name: "TV Globo",
          country: "BR",
          language: "Portuguese",
          kind: "broadcast",
          isFree: true,
          website: "https://globoplay.globo.com/",
          notes: "Free-to-air broadcast rights holder."
        },
        {
          id: "casatv.br",
          name: "Cazé TV",
          country: "BR",
          language: "Portuguese",
          kind: "streaming",
          isFree: true,
          website: "https://www.cazetv.com.br/",
          notes: "Free streaming on YouTube/Twitch."
        },
        {
          id: "sportv.br",
          name: "SporTV",
          country: "BR",
          language: "Portuguese",
          kind: "broadcast",
          isFree: false,
          website: "https://canaisglobo.globo.com/",
          notes: "Pay-TV sports network."
        }
      ]
    },
    CA: {
      country: "CA",
      label: "Canada",
      channels: [
        {
          id: "ctv.ca",
          name: "CTV",
          country: "CA",
          language: "English",
          kind: "broadcast",
          isFree: false,
          website: "https://www.ctv.ca/",
          notes: "English-language World Cup 2026 rights in Canada."
        },
        {
          id: "tsn.ca",
          name: "TSN",
          country: "CA",
          language: "English",
          kind: "broadcast",
          isFree: false,
          website: "https://www.tsn.ca/",
          notes: "English-language sports network."
        },
        {
          id: "sportsnet.ca",
          name: "Sportsnet",
          country: "CA",
          language: "English",
          kind: "broadcast",
          isFree: false,
          website: "https://www.sportsnet.ca/",
          notes: "English-language sports network."
        },
        {
          id: "tvasports.ca",
          name: "TVA Sports",
          country: "CA",
          language: "French",
          kind: "broadcast",
          isFree: false,
          website: "https://www.tvasports.ca/",
          notes: "French-language coverage in Canada."
        }
      ]
    },
    CH: {
      country: "CH",
      label: "Switzerland",
      channels: [
        {
          id: "srf.ch",
          name: "SRF",
          country: "CH",
          language: "German",
          kind: "broadcast",
          isFree: true,
          website: "https://www.srf.ch/",
          notes: "Free-to-air German-language public broadcaster."
        },
        {
          id: "rts.ch",
          name: "RTS",
          country: "CH",
          language: "French",
          kind: "broadcast",
          isFree: true,
          website: "https://www.rts.ch/",
          notes: "Free-to-air French-language public broadcaster."
        }
      ]
    },
    CL: {
      country: "CL",
      label: "Chile",
      channels: [
        {
          id: "chv.cl",
          name: "Chilevisión",
          country: "CL",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.chilevision.cl/",
          notes: "Free-to-air broadcaster."
        },
        {
          id: "tntsports.cl",
          name: "TNT Sports Chile",
          country: "CL",
          language: "Spanish",
          kind: "broadcast",
          isFree: false,
          website: "https://tntsports.cl/",
          notes: "Pay-TV sports network."
        }
      ]
    },
    CN: {
      country: "CN",
      label: "China",
      channels: [
        {
          id: "cctv.cn",
          name: "CCTV",
          country: "CN",
          language: "Chinese",
          kind: "broadcast",
          isFree: true,
          website: "https://sports.cctv.com/",
          notes: "Free-to-air state broadcaster."
        },
        {
          id: "migu.cn",
          name: "Migu",
          country: "CN",
          language: "Chinese",
          kind: "streaming",
          isFree: false,
          website: "https://www.migu.cn/",
          notes: "Streaming platform."
        }
      ]
    },
    CO: {
      country: "CO",
      label: "Colombia",
      channels: [
        {
          id: "caracol.co",
          name: "Caracol TV",
          country: "CO",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.caracoltv.com/",
          notes: "Free-to-air broadcaster."
        },
        {
          id: "rcn.co",
          name: "RCN",
          country: "CO",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.canalrcn.com/",
          notes: "Free-to-air broadcaster."
        }
      ]
    },
    CR: {
      country: "CR",
      label: "Costa Rica",
      channels: [
        {
          id: "teletica.cr",
          name: "Teletica",
          country: "CR",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.teletica.com/",
          notes: "Free-to-air broadcaster."
        }
      ]
    },
    CZ: {
      country: "CZ",
      label: "Czech Republic",
      channels: [
        {
          id: "ct.cz",
          name: "ČT",
          country: "CZ",
          language: "Czech",
          kind: "broadcast",
          isFree: true,
          website: "https://www.ceskatelevize.cz/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    DE: {
      country: "DE",
      label: "Germany",
      channels: [
        {
          id: "ard.de",
          name: "ARD / Das Erste",
          country: "DE",
          language: "German",
          kind: "broadcast",
          isFree: true,
          website: "https://www.daserste.de/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "zdf.de",
          name: "ZDF",
          country: "DE",
          language: "German",
          kind: "broadcast",
          isFree: true,
          website: "https://www.zdf.de/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "sportschau.de",
          name: "Sportschau",
          country: "DE",
          language: "German",
          kind: "streaming",
          isFree: true,
          website: "https://www.sportschau.de/",
          notes: "ARD sports streaming platform."
        }
      ]
    },
    DK: {
      country: "DK",
      label: "Denmark",
      channels: [
        {
          id: "dr.dk",
          name: "DR",
          country: "DK",
          language: "Danish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.dr.dk/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    DZ: {
      country: "DZ",
      label: "Algeria",
      channels: [
        {
          id: "entv.dz",
          name: "ENTV",
          country: "DZ",
          language: "Arabic",
          kind: "broadcast",
          isFree: true,
          website: "https://www.entv.dz/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    EC: {
      country: "EC",
      label: "Ecuador",
      channels: [
        {
          id: "ecuavisa.ec",
          name: "Ecuavisa",
          country: "EC",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.ecuavisa.com/",
          notes: "Free-to-air broadcaster."
        }
      ]
    },
    EG: {
      country: "EG",
      label: "Egypt",
      channels: [
        {
          id: "ontime.eg",
          name: "ON Time Sports",
          country: "EG",
          language: "Arabic",
          kind: "broadcast",
          isFree: true,
          website: "https://www.ontimesports.com/",
          notes: "Free-to-air sports channel."
        }
      ]
    },
    ES: {
      country: "ES",
      label: "Spain",
      channels: [
        {
          id: "rtve.es",
          name: "RTVE",
          country: "ES",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.rtve.es/play/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "movistar.es",
          name: "Movistar Plus+",
          country: "ES",
          language: "Spanish",
          kind: "streaming",
          isFree: false,
          website: "https://www.movistarplus.es/",
          notes: "Pay-TV streaming rights."
        }
      ]
    },
    FI: {
      country: "FI",
      label: "Finland",
      channels: [
        {
          id: "yle.fi",
          name: "Yle",
          country: "FI",
          language: "Finnish",
          kind: "broadcast",
          isFree: true,
          website: "https://yle.fi/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    FR: {
      country: "FR",
      label: "France",
      channels: [
        {
          id: "tf1.fr",
          name: "TF1",
          country: "FR",
          language: "French",
          kind: "broadcast",
          isFree: true,
          website: "https://www.tf1.fr/",
          notes: "Free-to-air World Cup 2026 rights holder."
        },
        {
          id: "beinfrance.fr",
          name: "beIN SPORTS France",
          country: "FR",
          language: "French",
          kind: "broadcast",
          isFree: false,
          website: "https://www.beinsports.com/fr-fr",
          notes: "Pay-TV rights holder."
        },
        {
          id: "mycanal.fr",
          name: "MyCanal",
          country: "FR",
          language: "French",
          kind: "streaming",
          isFree: false,
          website: "https://www.canalplus.com/",
          notes: "Streaming via Canal+."
        }
      ]
    },
    GB: {
      country: "GB",
      label: "England / United Kingdom",
      channels: [
        {
          id: "bbc.gb",
          name: "BBC",
          country: "GB",
          language: "English",
          kind: "broadcast",
          isFree: true,
          website: "https://www.bbc.co.uk/sport/football",
          notes: "Free-to-air World Cup 2026 rights holder."
        },
        {
          id: "itv.gb",
          name: "ITV",
          country: "GB",
          language: "English",
          kind: "broadcast",
          isFree: true,
          website: "https://www.itv.com/sport",
          notes: "Free-to-air World Cup 2026 rights holder."
        },
        {
          id: "bbciplayer.gb",
          name: "BBC iPlayer",
          country: "GB",
          language: "English",
          kind: "streaming",
          isFree: true,
          website: "https://www.bbc.co.uk/iplayer",
          notes: "Free streaming for UK viewers."
        },
        {
          id: "itvx.gb",
          name: "ITVX",
          country: "GB",
          language: "English",
          kind: "streaming",
          isFree: true,
          website: "https://www.itv.com/watch",
          notes: "Free streaming for UK viewers."
        }
      ]
    },
    GR: {
      country: "GR",
      label: "Greece",
      channels: [
        {
          id: "ert.gr",
          name: "ERT",
          country: "GR",
          language: "Greek",
          kind: "broadcast",
          isFree: true,
          website: "https://www.ert.gr/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    HR: {
      country: "HR",
      label: "Croatia",
      channels: [
        {
          id: "hrt.hr",
          name: "HRT",
          country: "HR",
          language: "Croatian",
          kind: "broadcast",
          isFree: true,
          website: "https://www.hrt.hr/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    HU: {
      country: "HU",
      label: "Hungary",
      channels: [
        {
          id: "mtva.hu",
          name: "MTVA",
          country: "HU",
          language: "Hungarian",
          kind: "broadcast",
          isFree: true,
          website: "https://www.mediaklikk.hu/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    ID: {
      country: "ID",
      label: "Indonesia",
      channels: [
        {
          id: "emtek.id",
          name: "Emtek / SCTV",
          country: "ID",
          language: "Indonesian",
          kind: "broadcast",
          isFree: true,
          website: "https://www.sctv.co.id/",
          notes: "Free-to-air rights holder."
        }
      ]
    },
    IE: {
      country: "IE",
      label: "Ireland",
      channels: [
        {
          id: "rte.ie",
          name: "RTÉ",
          country: "IE",
          language: "English",
          kind: "broadcast",
          isFree: true,
          website: "https://www.rte.ie/player/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    IL: {
      country: "IL",
      label: "Israel",
      channels: [
        {
          id: "knesset.il",
          name: "KAN",
          country: "IL",
          language: "Hebrew",
          kind: "broadcast",
          isFree: true,
          website: "https://www.kan.org.il/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    IN: {
      country: "IN",
      label: "India",
      channels: [
        {
          id: "sports18.in",
          name: "Sports18",
          country: "IN",
          language: "English / Hindi",
          kind: "broadcast",
          isFree: false,
          website: "https://www.sports18.com/",
          notes: "TV rights holder."
        },
        {
          id: "jiocinema.in",
          name: "JioCinema",
          country: "IN",
          language: "English / Hindi / Regional",
          kind: "streaming",
          isFree: true,
          website: "https://www.jiocinema.com/sports",
          notes: "Free streaming rights holder."
        }
      ]
    },
    IR: {
      country: "IR",
      label: "Iran",
      channels: [
        {
          id: "irinn.ir",
          name: "IRIB",
          country: "IR",
          language: "Persian",
          kind: "broadcast",
          isFree: true,
          website: "https://www.irinn.ir/",
          notes: "State broadcaster."
        }
      ]
    },
    IT: {
      country: "IT",
      label: "Italy",
      channels: [
        {
          id: "rai.it",
          name: "RAI",
          country: "IT",
          language: "Italian",
          kind: "broadcast",
          isFree: true,
          website: "https://www.raiplay.it/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "skyitalia.it",
          name: "Sky Sport Italia",
          country: "IT",
          language: "Italian",
          kind: "broadcast",
          isFree: false,
          website: "https://sport.sky.it/",
          notes: "Pay-TV rights holder."
        },
        {
          id: "dazn.it",
          name: "DAZN Italy",
          country: "IT",
          language: "Italian",
          kind: "streaming",
          isFree: false,
          website: "https://www.dazn.com/it-IT/home",
          notes: "Streaming rights."
        }
      ]
    },
    JP: {
      country: "JP",
      label: "Japan",
      channels: [
        {
          id: "nhk.jp",
          name: "NHK",
          country: "JP",
          language: "Japanese",
          kind: "broadcast",
          isFree: true,
          website: "https://www.nhk.or.jp/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "abema.jp",
          name: "ABEMA",
          country: "JP",
          language: "Japanese",
          kind: "streaming",
          isFree: true,
          website: "https://abema.tv/",
          notes: "Free streaming rights holder."
        },
        {
          id: "dazn.jp",
          name: "DAZN Japan",
          country: "JP",
          language: "Japanese",
          kind: "streaming",
          isFree: false,
          website: "https://www.dazn.com/ja-JP/home",
          notes: "Streaming rights holder."
        }
      ]
    },
    KR: {
      country: "KR",
      label: "South Korea",
      channels: [
        {
          id: "kbsworld.kr",
          name: "KBS World",
          country: "KR",
          language: "English",
          kind: "broadcast",
          isFree: true,
          website: "https://kbsworld.kbs.co.kr/",
          notes: "International broadcast of select matches."
        }
      ]
    },
    MA: {
      country: "MA",
      label: "Morocco",
      channels: [
        {
          id: "snrt.ma",
          name: "SNRT",
          country: "MA",
          language: "Arabic / French",
          kind: "broadcast",
          isFree: true,
          website: "https://www.snrt.ma/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    MX: {
      country: "MX",
      label: "Mexico",
      channels: [
        {
          id: "tudn.mx",
          name: "TUDN",
          country: "MX",
          language: "Spanish",
          kind: "broadcast",
          isFree: false,
          website: "https://www.tudn.com/",
          notes: "Spanish-language World Cup 2026 rights in Mexico."
        },
        {
          id: "televisa.mx",
          name: "Televisa",
          country: "MX",
          language: "Spanish",
          kind: "broadcast",
          isFree: false,
          website: "https://www.televisa.com/",
          notes: "Free-to-air Spanish broadcast."
        },
        {
          id: "azteca.mx",
          name: "TV Azteca",
          country: "MX",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.tvazteca.com/aztecadeportes/",
          notes: "Free-to-air Spanish broadcast."
        },
        {
          id: "vix.mx",
          name: "Vix",
          country: "MX",
          language: "Spanish",
          kind: "streaming",
          isFree: true,
          website: "https://vix.com/",
          notes: "Streaming rights holder."
        }
      ]
    },
    MY: {
      country: "MY",
      label: "Malaysia",
      channels: [
        {
          id: "rtm.my",
          name: "RTM",
          country: "MY",
          language: "Malay",
          kind: "broadcast",
          isFree: true,
          website: "https://rtmklik.rtm.gov.my/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    NG: {
      country: "NG",
      label: "Nigeria",
      channels: [
        {
          id: "africamagic.ng",
          name: "Africa Magic",
          country: "NG",
          language: "English",
          kind: "broadcast",
          isFree: false,
          website: "https://www.dstv.com/africamagic/",
          notes: "MultiChoice/DStv rights holder for Sub-Saharan Africa."
        },
        {
          id: "supersport.ng",
          name: "SuperSport",
          country: "NG",
          language: "English",
          kind: "broadcast",
          isFree: false,
          website: "https://supersport.com/",
          notes: "MultiChoice/DStv sports network."
        }
      ]
    },
    NL: {
      country: "NL",
      label: "Netherlands",
      channels: [
        {
          id: "npo.nl",
          name: "NPO",
          country: "NL",
          language: "Dutch",
          kind: "broadcast",
          isFree: true,
          website: "https://www.npostart.nl/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "ziggo.nl",
          name: "Ziggo Sport",
          country: "NL",
          language: "Dutch",
          kind: "broadcast",
          isFree: false,
          website: "https://www.ziggosport.nl/",
          notes: "Pay-TV sports network."
        }
      ]
    },
    NO: {
      country: "NO",
      label: "Norway",
      channels: [
        {
          id: "nrk.no",
          name: "NRK",
          country: "NO",
          language: "Norwegian",
          kind: "broadcast",
          isFree: true,
          website: "https://www.nrk.no/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "tv2no.no",
          name: "TV 2 Norway",
          country: "NO",
          language: "Norwegian",
          kind: "broadcast",
          isFree: false,
          website: "https://www.tv2.no/",
          notes: "Pay-TV rights holder."
        }
      ]
    },
    NZ: {
      country: "NZ",
      label: "New Zealand",
      channels: [
        {
          id: "sky.nz",
          name: "Sky Sport NZ",
          country: "NZ",
          language: "English",
          kind: "broadcast",
          isFree: false,
          website: "https://www.skysportnow.co.nz/",
          notes: "Pay-TV rights holder."
        }
      ]
    },
    PE: {
      country: "PE",
      label: "Peru",
      channels: [
        {
          id: "americatv.pe",
          name: "América Televisión",
          country: "PE",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.americatv.com.pe/",
          notes: "Free-to-air broadcaster."
        }
      ]
    },
    PH: {
      country: "PH",
      label: "Philippines",
      channels: [
        {
          id: "tap.ph",
          name: "TapGO / Tap Sports",
          country: "PH",
          language: "English",
          kind: "streaming",
          isFree: false,
          website: "https://www.tapgo.tv/",
          notes: "Streaming rights holder."
        }
      ]
    },
    PL: {
      country: "PL",
      label: "Poland",
      channels: [
        {
          id: "tvp.pl",
          name: "TVP",
          country: "PL",
          language: "Polish",
          kind: "broadcast",
          isFree: true,
          website: "https://sport.tvp.pl/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    PT: {
      country: "PT",
      label: "Portugal",
      channels: [
        {
          id: "rtp.pt",
          name: "RTP",
          country: "PT",
          language: "Portuguese",
          kind: "broadcast",
          isFree: true,
          website: "https://www.rtp.pt/play/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "sporttv.pt",
          name: "Sport TV",
          country: "PT",
          language: "Portuguese",
          kind: "broadcast",
          isFree: false,
          website: "https://www.sporttv.pt/",
          notes: "Pay-TV rights holder."
        }
      ]
    },
    QA: {
      country: "QA",
      label: "Qatar / MENA",
      channels: [
        {
          id: "beinmena.qa",
          name: "beIN SPORTS MENA",
          country: "QA",
          language: "Arabic / English",
          kind: "broadcast",
          isFree: false,
          website: "https://www.beinsports.com/",
          notes: "Middle East and North Africa rights holder."
        },
        {
          id: "alkass.qa",
          name: "Al Kass",
          country: "QA",
          language: "Arabic",
          kind: "broadcast",
          isFree: true,
          website: "https://www.alkass.net/",
          notes: "Free-to-air sports channel."
        }
      ]
    },
    RO: {
      country: "RO",
      label: "Romania",
      channels: [
        {
          id: "tvr.ro",
          name: "TVR",
          country: "RO",
          language: "Romanian",
          kind: "broadcast",
          isFree: true,
          website: "https://www.tvr.ro/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    RS: {
      country: "RS",
      label: "Serbia",
      channels: [
        {
          id: "rts.rs",
          name: "RTS",
          country: "RS",
          language: "Serbian",
          kind: "broadcast",
          isFree: true,
          website: "https://www.rts.rs/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    RU: {
      country: "RU",
      label: "Russia",
      channels: [
        {
          id: "matchtv.ru",
          name: "Match TV",
          country: "RU",
          language: "Russian",
          kind: "broadcast",
          isFree: true,
          website: "https://matchtv.ru/",
          notes: "Free-to-air sports channel."
        }
      ]
    },
    SA: {
      country: "SA",
      label: "Saudi Arabia",
      channels: [
        {
          id: "ssc.sa",
          name: "Saudi Sports Company (SSC)",
          country: "SA",
          language: "Arabic",
          kind: "streaming",
          isFree: false,
          website: "https://ssc.tv/",
          notes: "Streaming rights holder."
        },
        {
          id: "sba.sa",
          name: "SBA",
          country: "SA",
          language: "Arabic",
          kind: "broadcast",
          isFree: true,
          website: "https://www.sba.sa/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    SE: {
      country: "SE",
      label: "Sweden",
      channels: [
        {
          id: "svt.se",
          name: "SVT",
          country: "SE",
          language: "Swedish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.svt.se/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "viaplay.se",
          name: "Viaplay",
          country: "SE",
          language: "Swedish",
          kind: "streaming",
          isFree: false,
          website: "https://www.viaplay.se/",
          notes: "Streaming rights holder."
        }
      ]
    },
    SG: {
      country: "SG",
      label: "Singapore",
      channels: [
        {
          id: "mewatch.sg",
          name: "meWATCH",
          country: "SG",
          language: "English",
          kind: "streaming",
          isFree: true,
          website: "https://www.mewatch.sg/",
          notes: "Free streaming via Mediacorp."
        }
      ]
    },
    SK: {
      country: "SK",
      label: "Slovakia",
      channels: [
        {
          id: "rtvs.sk",
          name: "RTVS",
          country: "SK",
          language: "Slovak",
          kind: "broadcast",
          isFree: true,
          website: "https://www.rtvs.sk/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    TH: {
      country: "TH",
      label: "Thailand",
      channels: [
        {
          id: "true4u.th",
          name: "True4U",
          country: "TH",
          language: "Thai",
          kind: "broadcast",
          isFree: true,
          website: "https://true4u.com/",
          notes: "Free-to-air rights holder."
        }
      ]
    },
    TN: {
      country: "TN",
      label: "Tunisia",
      channels: [
        {
          id: "watanya.tn",
          name: "El Wataniya",
          country: "TN",
          language: "Arabic",
          kind: "broadcast",
          isFree: true,
          website: "https://www.wataniya.tn/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    TR: {
      country: "TR",
      label: "Turkey",
      channels: [
        {
          id: "trt.tr",
          name: "TRT",
          country: "TR",
          language: "Turkish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.trt.com.tr/",
          notes: "Free-to-air public broadcaster."
        }
      ]
    },
    UA: {
      country: "UA",
      label: "Ukraine",
      channels: [
        {
          id: "xsport.ua",
          name: "Xsport+",
          country: "UA",
          language: "Ukrainian",
          kind: "broadcast",
          isFree: false,
          website: "https://xsport.ua/",
          notes: "Pay-TV sports network."
        }
      ]
    },
    US: {
      country: "US",
      label: "United States",
      channels: [
        {
          id: "fox.us",
          name: "FOX",
          country: "US",
          language: "English",
          kind: "broadcast",
          isFree: false,
          website: "https://www.foxsports.com/",
          notes: "English-language World Cup 2026 broadcast rights holder in the US."
        },
        {
          id: "fs1.us",
          name: "FS1",
          country: "US",
          language: "English",
          kind: "broadcast",
          isFree: false,
          website: "https://www.foxsports.com/",
          notes: "English-language companion channel for overflow matches."
        },
        {
          id: "telemundo.us",
          name: "Telemundo",
          country: "US",
          language: "Spanish",
          kind: "broadcast",
          isFree: false,
          website: "https://www.telemundo.com/",
          notes: "Spanish-language World Cup 2026 broadcast rights holder."
        },
        {
          id: "universo.us",
          name: "Universo",
          country: "US",
          language: "Spanish",
          kind: "broadcast",
          isFree: false,
          website: "https://www.telemundo.com/universo",
          notes: "Spanish-language overflow channel."
        },
        {
          id: "peacock.us",
          name: "Peacock",
          country: "US",
          language: "Spanish",
          kind: "streaming",
          isFree: false,
          website: "https://www.peacocktv.com/",
          notes: "Spanish-language streaming package for all FIFA World Cup 2026 matches."
        }
      ]
    },
    UY: {
      country: "UY",
      label: "Uruguay",
      channels: [
        {
          id: "canal4.uy",
          name: "Canal 4",
          country: "UY",
          language: "Spanish",
          kind: "broadcast",
          isFree: true,
          website: "https://www.canal4.com.uy/",
          notes: "Free-to-air broadcaster."
        }
      ]
    },
    VN: {
      country: "VN",
      label: "Vietnam",
      channels: [
        {
          id: "vtv.vn",
          name: "VTV",
          country: "VN",
          language: "Vietnamese",
          kind: "broadcast",
          isFree: true,
          website: "https://vtv.vn/",
          notes: "Free-to-air state broadcaster."
        }
      ]
    },
    ZA: {
      country: "ZA",
      label: "South Africa",
      channels: [
        {
          id: "sabc.za",
          name: "SABC",
          country: "ZA",
          language: "English",
          kind: "broadcast",
          isFree: true,
          website: "https://www.sabcsport.com/",
          notes: "Free-to-air public broadcaster."
        },
        {
          id: "supersport.za",
          name: "SuperSport",
          country: "ZA",
          language: "English",
          kind: "broadcast",
          isFree: false,
          website: "https://supersport.com/",
          notes: "Pay-TV rights holder."
        }
      ]
    }
  },
  fixtures: [
    {
      id: "wc26-001",
      stage: "Group Stage",
      status: "scheduled",
      kickoffUtc: "2026-06-11T19:00:00Z",
      homeTeam: "Mexico",
      awayTeam: "South Africa",
      venue: "Estadio Azteca",
      city: "Mexico City",
      country: "Mexico",
      broadcasterIdsByCountry: {
        AR: ["tycsports.ar", "tntsports.ar", "tvp.ar"],
        AU: ["sbs.au", "optus.au"],
        BR: ["globo.br", "casatv.br", "sportv.br"],
        CA: ["ctv.ca", "tsn.ca", "sportsnet.ca", "tvasports.ca"],
        DE: ["ard.de", "zdf.de", "sportschau.de"],
        ES: ["rtve.es", "movistar.es"],
        FR: ["tf1.fr", "beinfrance.fr", "mycanal.fr"],
        GB: ["bbc.gb", "itv.gb", "bbciplayer.gb", "itvx.gb"],
        IT: ["rai.it", "skyitalia.it", "dazn.it"],
        JP: ["nhk.jp", "abema.jp", "dazn.jp"],
        MX: ["tudn.mx", "televisa.mx", "azteca.mx", "vix.mx"],
        US: ["fox.us", "fs1.us", "telemundo.us", "universo.us", "peacock.us"],
        ZA: ["sabc.za", "supersport.za"]
      }
    },
    {
      id: "wc26-002",
      stage: "Group Stage",
      status: "scheduled",
      kickoffUtc: "2026-06-12T02:00:00Z",
      homeTeam: "United States",
      awayTeam: "Wales",
      venue: "SoFi Stadium",
      city: "Los Angeles",
      country: "United States",
      broadcasterIdsByCountry: {
        AR: ["tycsports.ar", "tntsports.ar", "tvp.ar"],
        AU: ["sbs.au", "optus.au"],
        BR: ["globo.br", "casatv.br", "sportv.br"],
        CA: ["ctv.ca", "tsn.ca", "sportsnet.ca", "tvasports.ca"],
        DE: ["ard.de", "zdf.de", "sportschau.de"],
        ES: ["rtve.es", "movistar.es"],
        FR: ["tf1.fr", "beinfrance.fr", "mycanal.fr"],
        GB: ["bbc.gb", "itv.gb", "bbciplayer.gb", "itvx.gb"],
        IT: ["rai.it", "skyitalia.it", "dazn.it"],
        JP: ["nhk.jp", "abema.jp", "dazn.jp"],
        MX: ["tudn.mx", "televisa.mx", "azteca.mx", "vix.mx"],
        US: ["fox.us", "fs1.us", "telemundo.us", "universo.us", "peacock.us"],
        ZA: ["sabc.za", "supersport.za"]
      }
    },
    {
      id: "wc26-003",
      stage: "Group Stage",
      status: "scheduled",
      kickoffUtc: "2026-06-12T19:00:00Z",
      homeTeam: "Canada",
      awayTeam: "Japan",
      venue: "BMO Field",
      city: "Toronto",
      country: "Canada",
      broadcasterIdsByCountry: {
        AR: ["tycsports.ar", "tntsports.ar", "tvp.ar"],
        AU: ["sbs.au", "optus.au"],
        BR: ["globo.br", "casatv.br", "sportv.br"],
        CA: ["ctv.ca", "tsn.ca", "sportsnet.ca", "tvasports.ca"],
        DE: ["ard.de", "zdf.de", "sportschau.de"],
        ES: ["rtve.es", "movistar.es"],
        FR: ["tf1.fr", "beinfrance.fr", "mycanal.fr"],
        GB: ["bbc.gb", "itv.gb", "bbciplayer.gb", "itvx.gb"],
        IT: ["rai.it", "skyitalia.it", "dazn.it"],
        JP: ["nhk.jp", "abema.jp", "dazn.jp"],
        MX: ["tudn.mx", "televisa.mx", "azteca.mx", "vix.mx"],
        US: ["fox.us", "fs1.us", "telemundo.us", "universo.us", "peacock.us"],
        ZA: ["sabc.za", "supersport.za"]
      }
    },
    {
      id: "wc26-004",
      stage: "Group Stage",
      status: "scheduled",
      kickoffUtc: "2026-06-13T22:00:00Z",
      homeTeam: "Brazil",
      awayTeam: "Morocco",
      venue: "MetLife Stadium",
      city: "New York/New Jersey",
      country: "United States",
      broadcasterIdsByCountry: {
        AR: ["tycsports.ar", "tntsports.ar", "tvp.ar"],
        AU: ["sbs.au", "optus.au"],
        BR: ["globo.br", "casatv.br", "sportv.br"],
        CA: ["ctv.ca", "tsn.ca", "sportsnet.ca", "tvasports.ca"],
        DE: ["ard.de", "zdf.de", "sportschau.de"],
        ES: ["rtve.es", "movistar.es"],
        FR: ["tf1.fr", "beinfrance.fr", "mycanal.fr"],
        GB: ["bbc.gb", "itv.gb", "bbciplayer.gb", "itvx.gb"],
        IT: ["rai.it", "skyitalia.it", "dazn.it"],
        JP: ["nhk.jp", "abema.jp", "dazn.jp"],
        MX: ["tudn.mx", "televisa.mx", "azteca.mx", "vix.mx"],
        US: ["fox.us", "fs1.us", "telemundo.us", "universo.us", "peacock.us"],
        ZA: ["sabc.za", "supersport.za"]
      }
    },
    {
      id: "wc26-005",
      stage: "Round of 32",
      status: "unknown",
      kickoffUtc: "2026-06-28T20:00:00Z",
      homeTeam: "Winner Group A",
      awayTeam: "Third Place Group C/D/E",
      venue: "AT&T Stadium",
      city: "Dallas",
      country: "United States",
      broadcasterIdsByCountry: {
        AR: ["tycsports.ar", "tntsports.ar", "tvp.ar"],
        AU: ["sbs.au", "optus.au"],
        BR: ["globo.br", "casatv.br", "sportv.br"],
        CA: ["ctv.ca", "tsn.ca", "sportsnet.ca", "tvasports.ca"],
        DE: ["ard.de", "zdf.de", "sportschau.de"],
        ES: ["rtve.es", "movistar.es"],
        FR: ["tf1.fr", "beinfrance.fr", "mycanal.fr"],
        GB: ["bbc.gb", "itv.gb", "bbciplayer.gb", "itvx.gb"],
        IT: ["rai.it", "skyitalia.it", "dazn.it"],
        JP: ["nhk.jp", "abema.jp", "dazn.jp"],
        MX: ["tudn.mx", "televisa.mx", "azteca.mx", "vix.mx"],
        US: ["fox.us", "fs1.us", "telemundo.us", "universo.us", "peacock.us"],
        ZA: ["sabc.za", "supersport.za"]
      }
    },
    {
      id: "wc26-006",
      stage: "Final",
      status: "unknown",
      kickoffUtc: "2026-07-19T19:00:00Z",
      homeTeam: "TBD",
      awayTeam: "TBD",
      venue: "MetLife Stadium",
      city: "New York/New Jersey",
      country: "United States",
      broadcasterIdsByCountry: {
        AR: ["tycsports.ar", "tntsports.ar", "tvp.ar"],
        AU: ["sbs.au", "optus.au"],
        BR: ["globo.br", "casatv.br", "sportv.br"],
        CA: ["ctv.ca", "tsn.ca", "sportsnet.ca", "tvasports.ca"],
        DE: ["ard.de", "zdf.de", "sportschau.de"],
        ES: ["rtve.es", "movistar.es"],
        FR: ["tf1.fr", "beinfrance.fr", "mycanal.fr"],
        GB: ["bbc.gb", "itv.gb", "bbciplayer.gb", "itvx.gb"],
        IT: ["rai.it", "skyitalia.it", "dazn.it"],
        JP: ["nhk.jp", "abema.jp", "dazn.jp"],
        MX: ["tudn.mx", "televisa.mx", "azteca.mx", "vix.mx"],
        US: ["fox.us", "fs1.us", "telemundo.us", "universo.us", "peacock.us"],
        ZA: ["sabc.za", "supersport.za"]
      }
    }
  ]
};

export function getWorldCup2026Dataset(): SportsDataset {
  return dataset;
}
