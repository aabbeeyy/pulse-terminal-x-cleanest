import { AppShell } from "../../components/AppShell";
import { MarketWorkspace } from "../../components/MarketWorkspace";

export default function NewsPage() {
  return (
    <AppShell>
      <MarketWorkspace mode="news" />
    </AppShell>
  );
}
