import { FootProfile, FootSelfInput, MockAnalysisOutput } from "@/types";

const KEYS = {
  selfInput: "footmatch_self_input",
  analysis: "footmatch_analysis",
  profile: "footmatch_profile"
};

function isClient() {
  return typeof window !== "undefined";
}

function notifyProfileChanged() {
  if (!isClient()) return;
  window.dispatchEvent(new Event("footmatch-profile-changed"));
}

export function saveSelfInput(input: FootSelfInput) {
  if (!isClient()) return;
  window.localStorage.setItem(KEYS.selfInput, JSON.stringify(input));
}

export function getSelfInput(): FootSelfInput | null {
  if (!isClient()) return null;
  const raw = window.localStorage.getItem(KEYS.selfInput);
  if (!raw) return null;

  const parsed = JSON.parse(raw) as FootSelfInput & { commonIssue?: FootSelfInput["commonIssues"][number] | "none" };

  return {
    ...parsed,
    commonIssues:
      parsed.commonIssues ??
      (parsed.commonIssue && parsed.commonIssue !== "none" ? [parsed.commonIssue] : [])
  };
}

export function saveAnalysisResult(output: MockAnalysisOutput) {
  if (!isClient()) return;
  window.localStorage.setItem(KEYS.analysis, JSON.stringify(output));
}

export function getAnalysisResult(): MockAnalysisOutput | null {
  if (!isClient()) return null;
  const raw = window.localStorage.getItem(KEYS.analysis);
  return raw ? (JSON.parse(raw) as MockAnalysisOutput) : null;
}

export function saveFootProfile(profile: FootProfile) {
  if (!isClient()) return;
  window.localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  notifyProfileChanged();
}

export function getFootProfile(): FootProfile | null {
  if (!isClient()) return null;
  const raw = window.localStorage.getItem(KEYS.profile);
  return raw ? (JSON.parse(raw) as FootProfile) : null;
}

export function clearFootmatchProfile() {
  if (!isClient()) return;
  Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
  notifyProfileChanged();
}
