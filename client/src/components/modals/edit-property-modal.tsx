import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertPropertySchema } from "@shared/schema";
import type { Property } from "@shared/schema";
import { z } from "zod";

interface EditPropertyModalProps {
  open: boolean;
  property: Property;
  onOpenChange: (open: boolean) => void;
}

export function EditPropertyModal({ open, property, onOpenChange }: EditPropertyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bedrooms: 0,
    bathrooms: 0,
    rentAmount: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize form with property data
  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        rentAmount: property.rentAmount.toString(),
        description: property.description || "",
      });
    }
  }, [property]);

  const updatePropertyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/properties/${property.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Property updated successfully",
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
        description: "Failed to update property",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = insertPropertySchema.parse({
        ...formData,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        rentAmount: parseFloat(formData.rentAmount),
      });
      updatePropertyMutation.mutate(validatedData);
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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-edit-property">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-property-name">Property Name*</Label>
            <Input
              id="edit-property-name"
              type="text"
              placeholder="Enter property name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
              data-testid="input-edit-property-name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="edit-property-address">Address*</Label>
            <Input
              id="edit-property-address"
              type="text"
              placeholder="Enter property address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
              data-testid="input-edit-property-address"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          {/* City, State, Zip */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-property-city">City*</Label>
              <Input
                id="edit-property-city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
                data-testid="input-edit-property-city"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-property-state">State*</Label>
              <Input
                id="edit-property-state"
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={errors.state ? "border-red-500" : ""}
                data-testid="input-edit-property-state"
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-property-zipCode">Zip Code*</Label>
              <Input
                id="edit-property-zipCode"
                type="text"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className={errors.zipCode ? "border-red-500" : ""}
                data-testid="input-edit-property-zip"
              />
              {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
            </div>
          </div>

          {/* Bedrooms and Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-property-bedrooms">Bedrooms*</Label>
              <Input
                id="edit-property-bedrooms"
                type="number"
                min="0"
                placeholder="Number of bedrooms"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value) || 0)}
                className={errors.bedrooms ? "border-red-500" : ""}
                data-testid="input-edit-property-bedrooms"
              />
              {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-property-bathrooms">Bathrooms*</Label>
              <Input
                id="edit-property-bathrooms"
                type="number"
                min="0"
                step="0.5"
                placeholder="Number of bathrooms"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", parseFloat(e.target.value) || 0)}
                className={errors.bathrooms ? "border-red-500" : ""}
                data-testid="input-edit-property-bathrooms"
              />
              {errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms}</p>}
            </div>
          </div>

          {/* Rent Amount */}
          <div className="space-y-2">
            <Label htmlFor="edit-property-rent">Monthly Rent*</Label>
            <Input
              id="edit-property-rent"
              type="number"
              min="0"
              step="0.01"
              placeholder="Monthly rent amount"
              value={formData.rentAmount}
              onChange={(e) => handleInputChange("rentAmount", e.target.value)}
              className={errors.rentAmount ? "border-red-500" : ""}
              data-testid="input-edit-property-rent"
            />
            {errors.rentAmount && <p className="text-red-500 text-sm">{errors.rentAmount}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-property-description">Description</Label>
            <Textarea
              id="edit-property-description"
              placeholder="Property description (optional)"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
              data-testid="textarea-edit-property-description"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-edit-property"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updatePropertyMutation.isPending}
              className="flex-1 sketch-button"
              data-testid="button-update-property"
            >
              {updatePropertyMutation.isPending ? "Updating..." : "Update Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}