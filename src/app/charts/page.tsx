import { AppShell } from "../../components/AppShell";
import { MarketWorkspace } from "../../components/MarketWorkspace";

export default function ChartsPage() {
  return (
    <AppShell>
      <MarketWorkspace mode="charts" />
    </AppShell>
  );
}
