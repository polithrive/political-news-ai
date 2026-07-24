export const colors = {
  brand: {
    primary: "#E45757",
    primaryHover: "#D94B4B",
    primarySoft: "#FCEAEA",

    secondary: "#5F6FDB",
    secondaryHover: "#5363CC",
    secondarySoft: "#ECEEFC",

    navy: "#25364A",
    navySoft: "#34485F",
  },

  background: {
    app: "#E9EEF2",
    page: "#F1F4F6",
    surface: "#F8FAFB",
    elevated: "#FFFFFF",
    muted: "#E3E9EE",
    inverse: "#25364A",
  },

  text: {
    primary: "#1F2933",
    secondary: "#52606D",
    muted: "#7B8794",
    subtle: "#9AA5B1",
    inverse: "#FFFFFF",
    brand: "#E45757",
  },

  border: {
    default: "#D7DEE5",
    subtle: "#E4E9EE",
    strong: "#BCC7D1",
    brand: "#E9A6A6",
  },

  status: {
    success: "#2F855A",
    successSoft: "#E6F4EC",

    warning: "#C47A18",
    warningSoft: "#FFF3D6",

    danger: "#C74444",
    dangerSoft: "#FCE8E8",

    info: "#4C63C7",
    infoSoft: "#E9EDFC",
  },

  political: {
    progressive: "#4F6DB8",
    progressiveSoft: "#E8EEF9",

    centrist: "#7B8794",
    centristSoft: "#EEF1F4",

    conservative: "#C85B5B",
    conservativeSoft: "#F9EAEA",

    consensus: "#3F8C72",
    consensusSoft: "#E6F3EE",
  },

  data: {
    excellent: "#2F855A",
    good: "#5B8C64",
    moderate: "#C58A2B",
    low: "#C74444",
  },

  overlay: {
    soft: "rgba(37, 54, 74, 0.08)",
    medium: "rgba(37, 54, 74, 0.16)",
    strong: "rgba(37, 54, 74, 0.28)",
  },
} as const;

export type ColorTokens = typeof colors;