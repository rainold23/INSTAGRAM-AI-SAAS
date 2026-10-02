export const PLAN_LIMITS = {
  free: { aiGenerations: 10 },
  pro: { aiGenerations: 200 },
  business: { aiGenerations: 1000 },
} as const;

export function getPlanLimit(plan: string | null | undefined, key: keyof typeof PLAN_LIMITS.free) {
  const normalized = (plan || "free").toLowerCase() as keyof typeof PLAN_LIMITS;
  return PLAN_LIMITS[normalized]?.[key] ?? PLAN_LIMITS.free[key];
}
