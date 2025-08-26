import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Mail, Phone, User, FileText } from "lucide-react";
import { AddTenantModal } from "@/components/modals/add-tenant-modal";
import { EditTenantModal } from "@/components/modals/edit-tenant-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Tenant } from "@shared/schema";

export default function Tenants() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery<Tenant[]>({
    queryKey: ["/api/tenants"],
  });

  const deleteTenantMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tenants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Tenant deleted successfully",
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
        description: "Failed to delete tenant",
        variant: "destructive",
      });
    },
  });

  const handleDeleteTenant = (id: string) => {
    console.log('Delete tenant clicked:', id);
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      deleteTenantMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditTenant = (tenant: Tenant) => {
    console.log('Edit tenant clicked:', tenant.id);
    setEditingTenant(tenant);
  };

  const handleViewLease = async (tenantId: string) => {
    console.log('View lease clicked:', tenantId);
    try {
      // Find leases for this tenant
      const response = await fetch(`/api/leases?tenantId=${tenantId}`);
      if (response.ok) {
        const leases = await response.json();
        if (leases.length > 0) {
          // Navigate to leases page with filter
          window.location.href = `/leases?tenant=${tenantId}`;
        } else {
          toast({
            title: "No Lease Found",
            description: "This tenant doesn't have any active leases.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find lease information.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-tenants-title">Tenants</h1>
          <p className="text-gray-600 mt-2" data-testid="text-tenants-description">
            Manage your tenant information and contacts
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="sketch-button"
          data-testid="button-add-tenant"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Tenants Grid */}
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
      ) : tenants.length === 0 ? (
        <Card className="sketch-card" data-testid="card-no-tenants">
          <CardContent className="text-center py-12">
            <div className="w-12 h-12 sketch-icon flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No tenants yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first tenant</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="sketch-button"
              data-testid="button-add-first-tenant"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant: Tenant) => (
            <Card key={tenant.id} className="sketch-card" data-testid={`tenant-card-${tenant.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg" data-testid={`tenant-name-${tenant.id}`}>
                        {tenant.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Contact Information */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm" data-testid={`tenant-email-${tenant.id}`}>
                        {tenant.email}
                      </span>
                    </div>
                    {tenant.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm" data-testid={`tenant-phone-${tenant.id}`}>
                          {tenant.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tenant Since */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Tenant since {formatDate(tenant.createdAt || '')}
                    </p>
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
                      onClick={() => {
                        setEditingTenant(tenant);
                      }}
                      data-testid={`button-edit-tenant-${tenant.id}`}
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
                      onClick={() => {
                        handleViewLease(tenant.id);
                      }}
                      data-testid={`button-view-lease-${tenant.id}`}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Lease
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
                        cursor: 'pointer',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 20
                      }}
                      onClick={() => {
                        handleDeleteTenant(tenant.id);
                      }}
                      data-testid={`button-delete-tenant-${tenant.id}`}
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

      {/* Add Tenant Modal */}
      <AddTenantModal open={showAddModal} onOpenChange={setShowAddModal} />
      
      {/* Edit Tenant Modal */}
      {editingTenant && (
        <EditTenantModal 
          open={!!editingTenant} 
          tenant={editingTenant}
          onOpenChange={(open) => !open && setEditingTenant(null)} 
        />
      )}
    </div>
  );
}
