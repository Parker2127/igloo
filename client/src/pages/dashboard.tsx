import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Building, DollarSign, AlertTriangle, Wrench, Plus, TrendingUp, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { AddPropertyModal } from "@/components/modals/add-property-modal";
import { AddTenantModal } from "@/components/modals/add-tenant-modal";
import { AddLeaseModal } from "@/components/modals/add-lease-modal";
import { AddMaintenanceModal } from "@/components/modals/add-maintenance-modal";

export default function Dashboard() {
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAddLease, setShowAddLease] = useState(false);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: highPriorityRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/maintenance-requests/high-priority"],
  });

  const { data: overduePayments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/payments/overdue"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="sketch-card p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-700 mb-2" data-testid="text-dashboard-title">Property Dashboard</h1>
        <p className="text-muted-foreground text-lg" data-testid="text-welcome-message">
          Clean, systematic overview of your property portfolio.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Total Properties */}
        <Card className="sketch-card p-6" data-testid="card-total-properties">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Properties</CardTitle>
            <div className="w-12 h-12 sketch-icon flex items-center justify-center">
              <Building className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {metricsLoading ? (
              <Skeleton className="h-10 w-20 rounded-lg" />
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-700 mb-3" data-testid="text-total-properties">
                  {metrics?.totalProperties || 0}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center text-primary font-semibold" data-testid="text-occupied-properties">
                    <div className="w-2 h-2 bg-primary rounded-full mr-1"></div>
                    {metrics?.occupiedProperties || 0} occupied
                  </span>
                  <span className="flex items-center text-muted-foreground font-semibold" data-testid="text-vacant-properties">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                    {metrics?.vacantProperties || 0} vacant
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="sketch-card p-6" data-testid="card-monthly-revenue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Revenue</CardTitle>
            <div className="w-12 h-12 sketch-icon flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {metricsLoading ? (
              <Skeleton className="h-10 w-32 rounded-lg" />
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-700 mb-3" data-testid="text-monthly-revenue">
                  {formatCurrency(metrics?.monthlyRevenue || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Monthly income</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Overdue Payments */}
        <Card className="sketch-card p-6" data-testid="card-overdue-payments">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Overdue</CardTitle>
            <div className="w-12 h-12 sketch-icon flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {metricsLoading ? (
              <Skeleton className="h-10 w-28 rounded-lg" />
            ) : (
              <>
                <div className="text-3xl font-bold text-red-600 mb-3" data-testid="text-overdue-amount">
                  {formatCurrency(metrics?.overduePayments || 0)}
                </div>
                <p className="text-sm text-muted-foreground">Requires attention</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Open Maintenance Requests */}
        <Card className="sketch-card p-6" data-testid="card-open-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Maintenance</CardTitle>
            <div className="w-12 h-12 sketch-icon flex items-center justify-center">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {metricsLoading ? (
              <Skeleton className="h-10 w-20 rounded-lg" />
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-700 mb-3" data-testid="text-open-requests">
                  {metrics?.openRequests || 0}
                </div>
                <p className="text-sm text-muted-foreground">Open requests</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="sketch-card p-6" data-testid="card-quick-actions">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-gray-700 flex items-center">
              <div className="w-10 h-10 sketch-icon flex items-center justify-center mr-3">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            <Button
              onClick={() => setShowAddProperty(true)}
              className="sketch-button w-full py-3 text-sm font-medium"
              data-testid="button-add-property"
            >
              <Building className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button
              onClick={() => setShowAddTenant(true)}
              className="sketch-button w-full py-3 text-sm font-medium"
              data-testid="button-add-tenant"
            >
              <Users className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
            <Button
              onClick={() => setShowAddLease(true)}
              className="sketch-button w-full py-3 text-sm font-medium"
              data-testid="button-create-lease"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Create Lease
            </Button>
            <Button
              onClick={() => setShowAddMaintenance(true)}
              className="sketch-button w-full py-3 text-sm font-medium"
              data-testid="button-add-maintenance"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </CardContent>
        </Card>

        {/* High Priority Maintenance */}
        <Card className="sketch-card p-6" data-testid="card-high-priority-maintenance">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <CardTitle className="text-xl font-bold text-gray-700 flex items-center">
              <div className="w-8 h-8 sketch-icon flex items-center justify-center mr-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              High Priority
            </CardTitle>
            {!requestsLoading && highPriorityRequests?.length > 0 && (
              <Badge className="bg-red-50 text-red-700 border border-red-200 rounded-sm px-3 py-1" data-testid="badge-urgent-count">
                {highPriorityRequests.length} urgent
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {requestsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : highPriorityRequests?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 sketch-icon flex items-center justify-center mx-auto mb-3">
                  <Wrench className="w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground" data-testid="text-no-urgent-requests">
                  No urgent maintenance requests
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {highPriorityRequests?.slice(0, 3).map((request: any) => (
                  <div key={request.id} className="bg-red-50 rounded-sm p-4 border-2 border-dashed border-red-200" data-testid={`maintenance-request-${request.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-red-600 text-white text-xs px-2 py-1 rounded-sm">HIGH</Badge>
                          <span className="text-sm font-semibold text-gray-900">{request.description}</span>
                        </div>
                        <p className="text-xs text-red-600 font-medium">
                          Reported {formatDate(request.reportedDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Payments */}
        <Card className="sketch-card p-6" data-testid="card-overdue-payments-list">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <CardTitle className="text-xl font-bold text-gray-700 flex items-center">
              <div className="w-8 h-8 sketch-icon flex items-center justify-center mr-3">
                <DollarSign className="w-4 h-4 text-orange-600" />
              </div>
              Overdue Payments
            </CardTitle>
            {!paymentsLoading && overduePayments?.length > 0 && (
              <Badge className="bg-orange-50 text-orange-700 border border-orange-200 rounded-sm px-3 py-1" data-testid="badge-overdue-count">
                {overduePayments.length} overdue
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {paymentsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : overduePayments?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 sketch-icon flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <p className="text-primary font-medium" data-testid="text-no-overdue">
                  All payments are up to date!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {overduePayments?.slice(0, 3).map((payment: any) => (
                  <div key={payment.id} className="bg-orange-50 rounded-sm p-4 border-2 border-dashed border-orange-200" data-testid={`overdue-payment-${payment.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900 mb-1">
                          {formatCurrency(Number(payment.amount))}
                        </p>
                        <p className="text-sm text-orange-600 font-medium">
                          Due {formatDate(payment.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddPropertyModal open={showAddProperty} onOpenChange={setShowAddProperty} />
      <AddTenantModal open={showAddTenant} onOpenChange={setShowAddTenant} />
      <AddLeaseModal open={showAddLease} onOpenChange={setShowAddLease} />
      <AddMaintenanceModal open={showAddMaintenance} onOpenChange={setShowAddMaintenance} />
    </div>
  );
}
