import { Hero } from "@/components/hero/Hero";
import { InsightFlow } from "@/components/flow/InsightFlow";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Signature } from "@/components/signature/Signature";

export default function Home() {
  return (
    <>
      <Hero />
      <InsightFlow />
      <Dashboard />
      <Signature />
    </>
  );
}
