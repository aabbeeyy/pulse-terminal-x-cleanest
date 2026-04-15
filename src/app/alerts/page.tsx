import { AppShell } from "../../components/AppShell";
import { MarketWorkspace } from "../../components/MarketWorkspace";

export default function AlertsPage() {
  return (
    <AppShell>
      <MarketWorkspace mode="alerts" />
    </AppShell>
  );
}
