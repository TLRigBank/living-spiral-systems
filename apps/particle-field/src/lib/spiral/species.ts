export type SpeciesId = "spine" | "hermes" | "grok" | "honey" | "shell";
export type HoneyStamp = "exploring" | "returned";

export type InspectState =
  | { species: "spine" }
  | { species: "hermes" }
  | { species: "grok" }
  | { species: "honey"; stamp: HoneyStamp }
  | { species: "shell" };

export const SPECIES_ORDER: SpeciesId[] = [
  "spine",
  "hermes",
  "grok",
  "honey",
  "shell",
];

export const HEX = {
  void: "#0b0e12",
  spine: "#f4e6c3",
  hermes: "#c4a574",
  grok: "#7ec8e3",
  honey: "#e0b25a",
  shell: "#8aa4b0",
} as const;

export const RGB = {
  spine: [244, 230, 195] as const,
  hermes: [196, 165, 116] as const,
  grok: [126, 200, 227] as const,
  honey: [224, 178, 90] as const,
  shell: [138, 164, 176] as const,
};

export const COPY = {
  title: "Living Spiral Ecosystem",
  subtitle: "Dual runtime — local well, cloud well, still core.",
  anchor: "The spine does not spin. The field shows the life that does.",
  hook: "Five species. Not five colors.",
  contract: "Spine stays · Wells pull · Honey crosses · Shell bounds.",
  footer: "Drag to stir · Space pause · Tap a well",
  honeyCaption: "Returned crosses as truth · Exploring stays candidate",
  strip: {
    spine: "Spine Still",
    hermes: "Hermes Local",
    grok: "Grok Cloud",
    honey: "Honey Exchange",
    shell: "Shell Orbit",
  },
  role: {
    spine: "Still core",
    hermes: "Local well",
    grok: "Cloud well",
    honey: "Exchange",
    shell: "Outer orbit",
  },
  inspect: {
    spine: "Holds still. Identity of the system — not a swirl.",
    hermes: "Mac mini. Dense, short travel. Work that stays close.",
    grok: "Faster, farther. Cloud well — more particles, longer paths.",
    honey:
      "Work moving between wells. Exploring is candidate. Returned may land as current truth.",
    shell: "Membrane. May orbit. The spine inside it does not spin.",
  },
  honeyStamp: {
    exploring: "Exploring — candidate traffic",
    returned: "Returned — may land as current truth",
  },
  murmur: {
    align: "Align = Spine",
    cohere: "Cohere = Honey crossings",
    separate: "Separate = Hermes short-path, Grok long-path, Shell bound",
  },
  murmurTag: {
    spine: "Align",
    hermes: "Separate · short-path",
    grok: "Separate · long-path",
    honey: "Cohere · crossings",
    shell: "Separate · bound",
  },
} as const;

export const TRAIL = {
  spine: 0,
  hermes: 7,
  grok: 16,
  honeyExploring: 9,
  honeyReturned: 26,
  shell: 5,
} as const;
