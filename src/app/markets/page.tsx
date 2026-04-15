import { AppShell } from "../../components/AppShell";
import { MarketWorkspace } from "../../components/MarketWorkspace";

export default function MarketsPage() {
  return (
    <AppShell>
      <MarketWorkspace mode="markets" />
    </AppShell>
  );
}