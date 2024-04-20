import { StrictMode } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
const queryClient = new QueryClient();
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
    isAuthenticated: false,
    user: undefined,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // <StrictMode>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </CookiesProvider>
  );
}
