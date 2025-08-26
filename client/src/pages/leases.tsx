import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, DollarSign, CreditCard } from "lucide-react";
import { AddLeaseModal } from "@/components/modals/add-lease-modal";
import { EditLeaseModal } from "@/components/modals/edit-lease-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Lease } from "@shared/schema";

export default function Leases() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLease, setEditingLease] = useState<Lease | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leases = [], isLoading } = useQuery<Lease[]>({
    queryKey: ["/api/leases"],
  });

  const deleteLeaseMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/leases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Lease deleted successfully",
      });
    },
    onError: (error) => {
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
        description: "Failed to delete lease",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'UPCOMING':
        return 'secondary';
      case 'ENDED':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'UPCOMING':
        return 'text-blue-600 bg-blue-100';
      case 'ENDED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDeleteLease = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lease?')) {
      deleteLeaseMutation.mutate(id);
    }
  };

  const handleEditLease = (lease: Lease) => {
    setEditingLease(lease);
  };

  const handleViewPayments = (leaseId: string) => {
    window.location.href = `/payments?lease=${leaseId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-leases-title">Leases</h1>
          <p className="text-gray-600 mt-2" data-testid="text-leases-description">
            Manage lease agreements and rental terms
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600"
          data-testid="button-add-lease"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Lease
        </Button>
      </div>

      {/* Leases Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : leases.length === 0 ? (
        <Card className="sketch-card" data-testid="card-no-leases">
          <CardContent className="text-center py-12">
            <div className="w-12 h-12 sketch-icon flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No leases yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first lease agreement</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="sketch-button"
              data-testid="button-create-first-lease"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Lease
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leases.map((lease: Lease) => (
            <Card key={lease.id} className="sketch-card" data-testid={`lease-card-${lease.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center" data-testid={`lease-title-${lease.id}`}>
                      <FileText className="w-5 h-5 mr-2" />
                      Lease Agreement
                    </CardTitle>
                    <div className="mt-2">
                      <Badge 
                        className={getStatusColor(lease.status)}
                        data-testid={`lease-status-${lease.id}`}
                      >
                        {lease.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Property & Tenant Info */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Property:</span> {lease.propertyId}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tenant:</span> {lease.tenantId}
                    </p>
                  </div>

                  {/* Lease Terms */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="font-semibold" data-testid={`lease-rent-${lease.id}`}>
                          {formatCurrency(lease.monthlyRent)}/month
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span data-testid={`lease-start-date-${lease.id}`}>
                          Start: {formatDate(lease.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span data-testid={`lease-end-date-${lease.id}`}>
                          End: {formatDate(lease.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2" style={{position: 'relative', zIndex: 10}}>
                    <div 
                      style={{
                        flex: 1, 
                        padding: '8px 12px', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        border: '1px solid #d1d5db', 
                        borderRadius: '0', 
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 20
                      }}
                      onClick={() => handleEditLease(lease)}
                      data-testid={`button-edit-lease-${lease.id}`}
                    >
                      Edit
                    </div>
                    <div 
                      style={{
                        flex: 1, 
                        padding: '8px 12px', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        border: '1px solid #d1d5db', 
                        borderRadius: '0', 
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 20
                      }}
                      onClick={() => handleViewPayments(lease.id)}
                      data-testid={`button-view-payments-${lease.id}`}
                    >
                      <CreditCard className="w-3 h-3 mr-1" />
                      Payments
                    </div>
                    <div
                      style={{
                        padding: '8px 12px', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        border: '1px solid #d1d5db', 
                        borderRadius: '0', 
                        backgroundColor: 'white',
                        color: '#dc2626',
                        cursor: deleteLeaseMutation.isPending ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 20,
                        opacity: deleteLeaseMutation.isPending ? 0.5 : 1
                      }}
                      onClick={() => !deleteLeaseMutation.isPending && handleDeleteLease(lease.id)}
                      data-testid={`button-delete-lease-${lease.id}`}
                    >
                      Delete
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Lease Modal */}
      <AddLeaseModal open={showAddModal} onOpenChange={setShowAddModal} />
      
      {/* Edit Lease Modal */}
      {editingLease && (
        <EditLeaseModal 
          open={!!editingLease} 
          lease={editingLease}
          onOpenChange={(open) => !open && setEditingLease(null)} 
        />
      )}
    </div>
  );
}
