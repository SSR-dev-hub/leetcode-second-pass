import { queryClient } from "./sdk-shim";
import { QueryClientProvider } from "@tanstack/react-query";
import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./theme.css";

const rootEl = document.querySelector<HTMLElement>("[data-generated-space-root]");
if (!rootEl) {
  throw new Error("missing generated space root element");
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("LeetCode Second Pass could not render", error, info);
  }

  override render() {
    if (this.state.failed) {
      return (
        <main className="startup-error" role="alert">
          <div>
            <h1>LeetCode Second Pass couldn’t open</h1>
            <p>Reload the page to try again. Your saved problems and review history are unchanged.</p>
            <button type="button" onClick={() => window.location.reload()}>Reload app</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

// Keep `<QueryClientProvider client={queryClient}>` wrapping the app, and keep
// BOTH the `hatch-space-root` class AND the `data-hatch-space-root`
// attribute on the outer div: theme.css selects on
// `.hatch-space-root[data-hatch-space-root]` for mobile safe-area insets,
// correct viewport sizing, and notch/gesture-bar padding.
createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="hatch-space-root" data-hatch-space-root>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </div>
    </QueryClientProvider>
  </StrictMode>,
);
