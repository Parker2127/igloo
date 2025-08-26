import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Download, TrendingUp, Calendar, DollarSign, Users } from "lucide-react";

export default function Reports() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: payments } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const { data: tenants } = useQuery({
    queryKey: ["/api/tenants"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate some basic analytics
  const totalRevenue = payments?.filter((p: any) => p.status === 'PAID')
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
  
  const averageRent = properties?.length > 0 
    ? properties.reduce((sum: number, p: any) => sum + Number(p.rentAmount), 0) / properties.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-700" data-testid="text-reports-title">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2" data-testid="text-reports-description">
            Financial reports and property management analytics
          </p>
        </div>
        <Button className="sketch-button" data-testid="button-export-report">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="sketch-card" data-testid="card-total-revenue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <div className="sketch-icon w-8 h-8 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-600" data-testid="text-total-revenue">
                {formatCurrency(totalRevenue)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-monthly-potential">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Potential</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-blue-600" data-testid="text-monthly-potential">
                {formatCurrency(metrics?.monthlyRevenue || 0)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-average-rent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rent</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-purple-600" data-testid="text-average-rent">
                {formatCurrency(averageRent)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-occupancy-rate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-orange-600" data-testid="text-occupancy-rate">
                {metrics?.totalProperties > 0 
                  ? Math.round((metrics.occupiedProperties / metrics.totalProperties) * 100)
                  : 0}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <Card data-testid="card-financial-summary">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Total Properties</span>
                <span className="font-semibold" data-testid="text-summary-properties">
                  {metrics?.totalProperties || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Occupied Units</span>
                <span className="font-semibold text-green-600" data-testid="text-summary-occupied">
                  {metrics?.occupiedProperties || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Vacant Units</span>
                <span className="font-semibold text-orange-600" data-testid="text-summary-vacant">
                  {metrics?.vacantProperties || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Total Tenants</span>
                <span className="font-semibold" data-testid="text-summary-tenants">
                  {tenants?.length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card data-testid="card-revenue-breakdown">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Collected Payments</span>
                <span className="font-semibold text-green-600" data-testid="text-collected-payments">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Monthly Potential</span>
                <span className="font-semibold text-yellow-600" data-testid="text-monthly-potential-breakdown">
                  {formatCurrency(metrics?.monthlyRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Outstanding Amounts</span>
                <span className="font-semibold text-red-600" data-testid="text-outstanding-amounts">
                  {formatCurrency(metrics?.overduePayments || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Collection Rate</span>
                <span className="font-semibold text-blue-600" data-testid="text-collection-rate">
                  {metrics?.monthlyRevenue > 0 
                    ? Math.round((totalRevenue / Number(metrics.monthlyRevenue)) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Performance */}
      <Card data-testid="card-property-performance">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Property Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {properties?.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Available</h3>
              <p className="text-gray-600">Add properties to see performance analytics</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Property</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Monthly Rent</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {properties?.map((property: any) => (
                    <tr key={property.id} className="border-b">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{property.address}</p>
                          <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-green-600">
                        {formatCurrency(Number(property.rentAmount))}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">85%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}