import { AppShell } from "../../components/AppShell";
import { MarketWorkspace } from "../../components/MarketWorkspace";
import { NewsDesk } from "../../components/NewsDesk";
export default function DashboardPage() {
  return (
    <AppShell>
      <MarketWorkspace mode="dashboard" />
      <NewsDesk symbol="EUR/USD" />
    </AppShell>
  );
}
