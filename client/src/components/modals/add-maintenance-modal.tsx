import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertMaintenanceRequestSchema } from "@shared/schema";
import { z } from "zod";
import type { Property, Tenant } from "@shared/schema";

interface AddMaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMaintenanceModal({ open, onOpenChange }: AddMaintenanceModalProps) {
  const [formData, setFormData] = useState({
    propertyId: "",
    tenantId: "",
    description: "",
    priority: "MEDIUM" as const,
    status: "PENDING" as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const { data: tenants } = useQuery({
    queryKey: ["/api/tenants"],
  });

  const createMaintenanceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/maintenance-requests", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests/high-priority"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Maintenance request created successfully",
      });
      onOpenChange(false);
      resetForm();
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
        description: "Failed to create maintenance request",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      propertyId: "",
      tenantId: "",
      description: "",
      priority: "MEDIUM",
      status: "PENDING",
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = insertMaintenanceRequestSchema.parse(formData);
      createMaintenanceMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getPropertyDisplay = (property: Property) => {
    return `${property.address}, ${property.city}`;
  };

  const getTenantDisplay = (tenant: Tenant) => {
    return `${tenant.name} (${tenant.email})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="modal-add-maintenance">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">Add Maintenance Request</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="propertyId">Property *</Label>
            <Select value={formData.propertyId} onValueChange={(value) => handleInputChange("propertyId", value)}>
              <SelectTrigger data-testid="select-property">
                <SelectValue placeholder="Select Property" />
              </SelectTrigger>
              <SelectContent>
                {properties?.map((property: Property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {getPropertyDisplay(property)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && <p className="text-sm text-red-600">{errors.propertyId}</p>}
          </div>
          
          <div>
            <Label htmlFor="tenantId">Tenant *</Label>
            <Select value={formData.tenantId} onValueChange={(value) => handleInputChange("tenantId", value)}>
              <SelectTrigger data-testid="select-tenant">
                <SelectValue placeholder="Select Tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants?.map((tenant: Tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {getTenantDisplay(tenant)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tenantId && <p className="text-sm text-red-600">{errors.tenantId}</p>}
          </div>
          
          <div>
            <Label htmlFor="priority">Priority *</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
              <SelectTrigger data-testid="select-priority">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && <p className="text-sm text-red-600">{errors.priority}</p>}
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the maintenance issue in detail..."
              rows={4}
              data-testid="textarea-description"
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMaintenanceMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="button-create-maintenance"
            >
              {createMaintenanceMutation.isPending ? "Creating..." : "Add Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
