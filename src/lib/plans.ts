export const FREE_PLAN = "Free";
export const BASIC_PLAN = "Basic";
export const PRO_PLAN = "Pro";

export function isPaidPlan(plan?: string | null) {
  return plan === BASIC_PLAN || plan === PRO_PLAN;
}

export function isProPlan(plan?: string | null) {
  return plan === PRO_PLAN;
}

export const premiumFeatureGrid = {
  Basic: [
    "Live multi-asset dashboard",
    "Stocks, forex, crypto, and metals",
    "TradingView chart mode",
    "Core AI signals and watchlist",
    "Faster refresh cadence",
  ],
  Pro: [
    "Everything in Basic",
    "Full desk layout with premium modules",
    "Premium widgets: regime board, strategy notes, sentiment matrix",
    "Advanced AI signal breakdowns",
    "Priority product unlocks and richer strategy notes",
  ],
};
