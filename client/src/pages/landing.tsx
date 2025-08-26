import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, FileText, Settings, BarChart3, Shield } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b-2 border-dashed border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Logo size="md" />
            <Button
              onClick={() => window.location.href = '/signin'}
              data-testid="button-login"
              className="sketch-button px-6 py-2 text-primary hover:text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-700 sm:text-5xl md:text-6xl leading-tight">
            Enterprise Rental<br />
            <span className="text-primary">Management Platform</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
            Clean, architectural approach to property management.
            Designed with precision and simplicity in mind.
          </p>
          {/* Demo Access Card */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="sketch-card p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 sketch-icon flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl text-primary font-bold">📐</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Demo Access</h3>
                <p className="text-sm text-muted-foreground mb-4">Experience the clean architectural approach</p>
              </div>
              <Button
                size="lg"
                onClick={() => window.location.href = '/signin'}
                data-testid="button-get-started"
                className="w-full sketch-button text-lg py-3 font-medium"
              >
                Launch Demo
              </Button>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                No registration required • Instant access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-700">
              Architectural Precision in <span className="text-primary">Property Management</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Clean, systematic approach to rental management
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="sketch-card" data-testid="card-property-management">
              <CardHeader>
                <div className="w-12 h-12 sketch-icon flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-gray-700">Property Management</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Systematic organization and oversight of all property assets with precision.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sketch-card" data-testid="card-tenant-management">
              <CardHeader>
                <div className="w-12 h-12 sketch-icon flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-gray-700">Tenant Management</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Streamlined tenant relationships with clear communication protocols.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sketch-card" data-testid="card-lease-tracking">
              <CardHeader>
                <div className="w-12 h-12 sketch-icon flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-gray-700">Lease Tracking</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Methodical lease documentation and renewal management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sketch-card" data-testid="card-maintenance-requests">
              <CardHeader>
                <div className="w-12 h-12 sketch-icon flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-gray-700">Maintenance Requests</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Organized maintenance workflow with priority-based scheduling.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sketch-card" data-testid="card-financial-reporting">
              <CardHeader>
                <div className="w-12 h-12 sketch-icon flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-gray-700">Financial Reporting</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Clear financial tracking with comprehensive reporting capabilities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sketch-card" data-testid="card-secure-platform">
              <CardHeader>
                <div className="w-12 h-12 sketch-icon flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-gray-700">Secure Platform</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enterprise-grade security with structured access control.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t-2 border-dashed border-gray-300 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto mb-4">
              Modern React + TypeScript Application showcasing enterprise-grade property management
            </p>
            <p className="text-muted-foreground text-sm">
              © 2025 Shrikar Kaduluri. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
