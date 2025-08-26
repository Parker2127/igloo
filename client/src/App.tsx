import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AnimatedLoading } from "@/components/ui/animated-loading";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import SignIn from "@/pages/signin";
import Dashboard from "@/pages/dashboard";
import Properties from "@/pages/properties";
import Tenants from "@/pages/tenants";
import Leases from "@/pages/leases";
import Payments from "@/pages/payments";
import Maintenance from "@/pages/maintenance";
import Reports from "@/pages/reports";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Header title="igloo" subtitle="Streamlined property management platform" />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AnimatedLoading />;
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/signin" component={SignIn} />
        </>
      ) : (
        <>
          <Route path="/">
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          </Route>
          <Route path="/properties">
            <AuthenticatedLayout>
              <Properties />
            </AuthenticatedLayout>
          </Route>
          <Route path="/tenants">
            <AuthenticatedLayout>
              <Tenants />
            </AuthenticatedLayout>
          </Route>
          <Route path="/leases">
            <AuthenticatedLayout>
              <Leases />
            </AuthenticatedLayout>
          </Route>
          <Route path="/payments">
            <AuthenticatedLayout>
              <Payments />
            </AuthenticatedLayout>
          </Route>
          <Route path="/maintenance">
            <AuthenticatedLayout>
              <Maintenance />
            </AuthenticatedLayout>
          </Route>
          <Route path="/reports">
            <AuthenticatedLayout>
              <Reports />
            </AuthenticatedLayout>
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
