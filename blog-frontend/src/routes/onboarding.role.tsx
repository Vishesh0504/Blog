import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/role")({
  component: () => <div>Hello /onboarding/role!</div>,
});
