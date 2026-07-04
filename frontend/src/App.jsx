import { Component } from "react";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import AppRoutes from "./routes/AppRoutes";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-bg flex min-h-screen items-center justify-center p-4">
          <div className="glass max-w-md rounded-lg p-6 text-center">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-400">Refresh the page or sign in again to continue.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <AppRoutes />
    <Toaster position="top-right" toastOptions={{ style: { background: "#181826", color: "#fff", border: "1px solid #303044" } }} />
    <Analytics />
  </ErrorBoundary>
);

export default App;
