import router from "@/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Toast from "./components/ui/toast";

const queryClient = new QueryClient();
const isDevEnvironment = import.meta.env.DEV;
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      {isDevEnvironment && <ReactQueryDevtools />}
      <Toast />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
} else {
  console.error("Failed to find the root element.");
}
