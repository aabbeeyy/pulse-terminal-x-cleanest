
import { AppShell } from "../../components/AppShell";
import { MarketWorkspace } from "../../components/MarketWorkspace";
export default function SignalsPage() {
  return (
    <AppShell>
      <MarketWorkspace mode="signals" />
    </AppShell>
  );
}
