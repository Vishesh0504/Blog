import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/")({
  component: () => onboarding,
});

function onboarding() {
  return <div> Hello</div>;
}
