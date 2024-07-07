import { t } from "@/common/i18n";
import { USIEngine } from "./usi";

export type SecondaryResearchSettings = {
  usi?: USIEngine;
};

export type ResearchSettings = {
  usi?: USIEngine;
  secondaries?: SecondaryResearchSettings[];
  enableMaxSeconds: boolean;
  maxSeconds: number;
};

export function defaultResearchSettings(): ResearchSettings {
  return {
    enableMaxSeconds: false,
    maxSeconds: 10,
  };
}

export function normalizeResearchSettings(settings: ResearchSettings): ResearchSettings {
  return {
    ...defaultResearchSettings(),
    ...settings,
    secondaries: settings.secondaries?.filter((secondary) => !!secondary.usi),
  };
}

export function validateResearchSettings(settings: ResearchSettings): Error | undefined {
  if (!settings.usi) {
    return new Error(t.engineNotSelected);
  }
  if (settings.secondaries?.some((secondary) => !secondary.usi)) {
    return new Error(t.engineNotSelected);
  }
}
