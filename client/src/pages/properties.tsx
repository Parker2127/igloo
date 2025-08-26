import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, Bed, Bath, MapPin, DollarSign } from "lucide-react";
import { AddPropertyModal } from "@/components/modals/add-property-modal";
import { EditPropertyModal } from "@/components/modals/edit-property-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Property } from "@shared/schema";

export default function Properties() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Property deleted successfully",
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
        description: "Failed to delete property",
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

  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deletePropertyMutation.mutate(id);
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-properties-title">Properties</h1>
          <p className="text-gray-600 mt-2" data-testid="text-properties-description">
            Manage your rental properties and their details
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="sketch-button"
          data-testid="button-add-property"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Properties Grid */}
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
      ) : properties.length === 0 ? (
        <Card className="sketch-card" data-testid="card-no-properties">
          <CardContent className="text-center py-12">
            <div className="w-12 h-12 sketch-icon flex items-center justify-center mx-auto mb-4">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No properties yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first property</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="sketch-button"
              data-testid="button-add-first-property"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: Property) => (
            <Card key={property.id} className="sketch-card" data-testid={`property-card-${property.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg" data-testid={`property-address-${property.id}`}>
                      {property.address}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm" data-testid={`property-location-${property.id}`}>
                        {property.city}, {property.state} {property.zipCode}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Property Details */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-600">
                        <Bed className="w-4 h-4 mr-1" />
                        <span className="text-sm" data-testid={`property-bedrooms-${property.id}`}>
                          {property.bedrooms} bed
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Bath className="w-4 h-4 mr-1" />
                        <span className="text-sm" data-testid={`property-bathrooms-${property.id}`}>
                          {property.bathrooms} bath
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rent Amount */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span className="font-semibold" data-testid={`property-rent-${property.id}`}>
                        {formatCurrency(property.rentAmount)}/month
                      </span>
                    </div>
                    <Badge variant="outline" data-testid={`property-status-${property.id}`}>
                      Available
                    </Badge>
                  </div>

                  {/* Description */}
                  {property.description && (
                    <p className="text-sm text-gray-600 line-clamp-2" data-testid={`property-description-${property.id}`}>
                      {property.description}
                    </p>
                  )}

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
                      onClick={() => handleEditProperty(property)}
                      data-testid={`button-edit-${property.id}`}
                    >
                      Edit
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
                        cursor: deletePropertyMutation.isPending ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 20,
                        opacity: deletePropertyMutation.isPending ? 0.5 : 1
                      }}
                      onClick={() => !deletePropertyMutation.isPending && handleDeleteProperty(property.id)}
                      data-testid={`button-delete-${property.id}`}
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

      {/* Add Property Modal */}
      <AddPropertyModal open={showAddModal} onOpenChange={setShowAddModal} />
      
      {/* Edit Property Modal */}
      {editingProperty && (
        <EditPropertyModal 
          open={!!editingProperty} 
          property={editingProperty}
          onOpenChange={(open) => !open && setEditingProperty(null)} 
        />
      )}
    </div>
  );
}
