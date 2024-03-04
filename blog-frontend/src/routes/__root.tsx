import {
  createRootRouteWithContext,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

const LoadingSpinner = () => {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  return <Loading show={isLoading} />;
};

const RootComponent = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`${theme === "light" ? "bg-bg-light" : "bg-bg-dark"} min-h-screen  `}
    >
      <Toaster />
      <Navbar />
      <div className="absolute top-18 size-20 left-1/2">
        <LoadingSpinner />
      </div>
      <hr
        className={`border-1 ${theme === "light" ? "border-gray-300" : "border-gray-700"}`}
      ></hr>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
};
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <ThemeProvider>
      <RootComponent />
    </ThemeProvider>
  ),
});
