import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payment } from "@shared/schema";

export default function Payments() {
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: overduePayments, isLoading: overdueLoading } = useQuery({
    queryKey: ["/api/payments/overdue"],
  });

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  const handleMarkPaid = async (paymentId: string) => {
    try {
      await apiRequest("PUT", `/api/payments/${paymentId}`, { status: "PAID", paymentDate: new Date() });
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Payment marked as paid",
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      });
    }
  };

  const handleViewPayment = (paymentId: string) => {
    // You could implement a payment details modal here
    toast({
      title: "Payment Details",
      description: `Viewing payment ${paymentId}`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'DUE':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'LATE':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'default';
      case 'DUE':
        return 'secondary';
      case 'LATE':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 bg-green-100';
      case 'DUE':
        return 'text-yellow-600 bg-yellow-100';
      case 'LATE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Calculate summary statistics
  const totalPaid = payments?.filter((p: Payment) => p.status === 'PAID')
    .reduce((sum: number, p: Payment) => sum + Number(p.amount), 0) || 0;
  
  const totalDue = payments?.filter((p: Payment) => p.status === 'DUE')
    .reduce((sum: number, p: Payment) => sum + Number(p.amount), 0) || 0;
  
  const totalOverdue = overduePayments?.reduce((sum: number, p: Payment) => sum + Number(p.amount), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900" data-testid="text-payments-title">Payments</h1>
        <p className="text-gray-600 mt-2" data-testid="text-payments-description">
          Track rent payments and manage payment status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="sketch-card" data-testid="card-total-paid">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Paid</CardTitle>
            <div className="sketch-icon w-8 h-8 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-600" data-testid="text-total-paid-amount">
                {formatCurrency(totalPaid)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="sketch-card" data-testid="card-total-due">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Due</CardTitle>
            <div className="sketch-icon w-8 h-8 flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600" data-testid="text-total-due-amount">
                {formatCurrency(totalDue)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="sketch-card" data-testid="card-total-overdue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Overdue</CardTitle>
            <div className="sketch-icon w-8 h-8 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            {overdueLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600" data-testid="text-total-overdue-amount">
                {formatCurrency(totalOverdue)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="sketch-card" data-testid="card-payments-table">
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 sketch-icon flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No payments yet</h3>
              <p className="text-muted-foreground">Payments will appear here once leases are created</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lease</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: Payment) => (
                    <TableRow key={payment.id} data-testid={`payment-row-${payment.id}`}>
                      <TableCell className="font-medium" data-testid={`payment-lease-${payment.id}`}>
                        {payment.leaseId}
                      </TableCell>
                      <TableCell data-testid={`payment-amount-${payment.id}`}>
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell data-testid={`payment-due-date-${payment.id}`}>
                        {formatDate(payment.dueDate)}
                      </TableCell>
                      <TableCell data-testid={`payment-payment-date-${payment.id}`}>
                        {payment.paymentDate ? formatDate(payment.paymentDate) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <Badge 
                            className={getStatusColor(payment.status)}
                            data-testid={`payment-status-${payment.id}`}
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {payment.status !== 'PAID' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkPaid(payment.id)}
                              data-testid={`button-mark-paid-${payment.id}`}
                            >
                              Mark Paid
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewPayment(payment.id)}
                            data-testid={`button-view-payment-${payment.id}`}
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
