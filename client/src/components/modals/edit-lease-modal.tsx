import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertLeaseSchema } from "@shared/schema";
import type { Lease, Property, Tenant } from "@shared/schema";
import { z } from "zod";

interface EditLeaseModalProps {
  open: boolean;
  lease: Lease;
  onOpenChange: (open: boolean) => void;
}

export function EditLeaseModal({ open, lease, onOpenChange }: EditLeaseModalProps) {
  const [formData, setFormData] = useState({
    propertyId: "",
    tenantId: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    status: "UPCOMING" as "ACTIVE" | "ENDED" | "UPCOMING",
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

  // Initialize form with lease data
  useEffect(() => {
    if (lease) {
      setFormData({
        propertyId: lease.propertyId,
        tenantId: lease.tenantId,
        startDate: lease.startDate,
        endDate: lease.endDate,
        monthlyRent: lease.monthlyRent,
        status: lease.status,
      });
    }
  }, [lease]);

  const updateLeaseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/leases/${lease.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Lease updated successfully",
      });
      onOpenChange(false);
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
        description: "Failed to update lease",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = insertLeaseSchema.parse({
        ...formData,
        monthlyRent: formData.monthlyRent,
      });
      updateLeaseMutation.mutate(validatedData);
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? `${property.address}, ${property.city}` : propertyId;
  };

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : tenantId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sketch-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-700">Edit Lease Agreement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Selection */}
          <div className="space-y-2">
            <Label htmlFor="propertyId" className="text-sm font-medium text-gray-700">
              Property *
            </Label>
            <Select value={formData.propertyId} onValueChange={(value) => handleInputChange('propertyId', value)}>
              <SelectTrigger className="modern-input">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.address}, {property.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && <p className="text-sm text-red-600">{errors.propertyId}</p>}
          </div>

          {/* Tenant Selection */}
          <div className="space-y-2">
            <Label htmlFor="tenantId" className="text-sm font-medium text-gray-700">
              Tenant *
            </Label>
            <Select value={formData.tenantId} onValueChange={(value) => handleInputChange('tenantId', value)}>
              <SelectTrigger className="modern-input">
                <SelectValue placeholder="Select a tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name} ({tenant.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tenantId && <p className="text-sm text-red-600">{errors.tenantId}</p>}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
              Start Date *
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="modern-input"
              data-testid="input-start-date"
            />
            {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
              End Date *
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="modern-input"
              data-testid="input-end-date"
            />
            {errors.endDate && <p className="text-sm text-red-600">{errors.endDate}</p>}
          </div>

          {/* Monthly Rent */}
          <div className="space-y-2">
            <Label htmlFor="monthlyRent" className="text-sm font-medium text-gray-700">
              Monthly Rent *
            </Label>
            <Input
              id="monthlyRent"
              type="number"
              step="0.01"
              value={formData.monthlyRent}
              onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
              placeholder="Enter monthly rent amount"
              className="modern-input"
              data-testid="input-monthly-rent"
            />
            {errors.monthlyRent && <p className="text-sm text-red-600">{errors.monthlyRent}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status *
            </Label>
            <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
              <SelectTrigger className="modern-input">
                <SelectValue placeholder="Select lease status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ENDED">Ended</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-edit-lease"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="sketch-button flex-1"
              disabled={updateLeaseMutation.isPending}
              data-testid="button-save-lease"
            >
              {updateLeaseMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}