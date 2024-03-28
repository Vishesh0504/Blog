import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/interests")({
  component: () => <div>Hello /onboarding/interests!</div>,
});
