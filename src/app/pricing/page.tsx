import { AppShell } from "../../components/AppShell";
import { MarketWorkspace } from "../../components/MarketWorkspace";

export default function PricingPage() {
  return (
    <AppShell>
      <MarketWorkspace mode="pricing" />
    </AppShell>
  );
}
