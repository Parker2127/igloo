import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertLeaseSchema } from "@shared/schema";
import { z } from "zod";
import type { Property, Tenant } from "@shared/schema";

interface AddLeaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLeaseModal({ open, onOpenChange }: AddLeaseModalProps) {
  const [formData, setFormData] = useState({
    propertyId: "",
    tenantId: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    status: "UPCOMING" as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: tenants = [] } = useQuery<Tenant[]>({
    queryKey: ["/api/tenants"],
  });

  const createLeaseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/leases", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Lease created successfully",
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
        description: "Failed to create lease",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      propertyId: "",
      tenantId: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      status: "UPCOMING",
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = insertLeaseSchema.parse({
        ...formData,
        monthlyRent: formData.monthlyRent,
      });
      createLeaseMutation.mutate(validatedData);
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
      <DialogContent className="max-w-lg" data-testid="modal-add-lease">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">Create New Lease</DialogTitle>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                data-testid="input-start-date"
              />
              {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
            </div>
            
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                data-testid="input-end-date"
              />
              {errors.endDate && <p className="text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="monthlyRent">Monthly Rent *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="monthlyRent"
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                placeholder="2500"
                className="pl-8"
                data-testid="input-monthly-rent"
              />
            </div>
            {errors.monthlyRent && <p className="text-sm text-red-600">{errors.monthlyRent}</p>}
          </div>
          
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger data-testid="select-status">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ENDED">Ended</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
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
              disabled={createLeaseMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="button-create-lease"
            >
              {createLeaseMutation.isPending ? "Creating..." : "Create Lease"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
