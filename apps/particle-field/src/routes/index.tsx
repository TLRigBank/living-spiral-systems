import { createFileRoute } from "@tanstack/react-router";
import { LivingField } from "@/components/spiral/LivingField";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="h-dvh overflow-hidden bg-void">
      <LivingField />
    </main>
  );
}
