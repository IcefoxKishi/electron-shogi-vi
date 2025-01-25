import { USIEngine } from "@/common/settings/usi";

export const testUSIEngine: USIEngine = {
  uri: "es://usi-engine/test-engine",
  name: "my usi engine",
  defaultName: "engine",
  author: "author",
  path: "/engines/engines",
  options: {},
  labels: {
    game: true,
    research: true,
    mate: false,
  },
  enableEarlyPonder: false,
};

export const testUSIEngineWithPonder: USIEngine = {
  uri: "es://usi-engine/test-engine",
  name: "my usi engine",
  defaultName: "engine",
  author: "author",
  path: "/engines/engines",
  options: {
    USI_Ponder: {
      name: "USI_Ponder",
      type: "check",
      order: 2,
      value: "true",
    },
  },
  labels: {
    game: true,
    research: true,
    mate: false,
  },
  enableEarlyPonder: false,
};
