import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { AddMaintenanceModal } from "@/components/modals/add-maintenance-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { MaintenanceRequest } from "@shared/schema";

export default function Maintenance() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: maintenanceRequests = [], isLoading } = useQuery<MaintenanceRequest[]>({
    queryKey: ["/api/maintenance-requests"],
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PUT", `/api/maintenance-requests/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests/high-priority"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Maintenance request updated successfully",
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
        description: "Failed to update maintenance request",
        variant: "destructive",
      });
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/maintenance-requests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance-requests/high-priority"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Maintenance request deleted successfully",
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
        description: "Failed to delete maintenance request",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100';
      case 'LOW':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'IN_PROGRESS':
        return <Settings className="w-4 h-4 text-blue-600" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStatusUpdate = (id: string, status: string) => {
    updateRequestMutation.mutate({ id, status });
  };

  const handleDeleteRequest = (id: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance request?')) {
      deleteRequestMutation.mutate(id);
    }
  };

  // Group requests by status
  const pendingRequests = maintenanceRequests?.filter((req: MaintenanceRequest) => req.status === 'PENDING') || [];
  const inProgressRequests = maintenanceRequests?.filter((req: MaintenanceRequest) => req.status === 'IN_PROGRESS') || [];
  const completedRequests = maintenanceRequests?.filter((req: MaintenanceRequest) => req.status === 'COMPLETED') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-maintenance-title">Maintenance</h1>
          <p className="text-gray-600 mt-2" data-testid="text-maintenance-description">
            Manage maintenance requests and track their progress
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="sketch-button"
          data-testid="button-add-maintenance"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Request
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="sketch-card" data-testid="card-pending-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <div className="sketch-icon w-8 h-8 flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600" data-testid="text-pending-count">
              {pendingRequests.length}
            </div>
          </CardContent>
        </Card>

        <Card className="sketch-card" data-testid="card-in-progress-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            <div className="sketch-icon w-8 h-8 flex items-center justify-center">
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-in-progress-count">
              {inProgressRequests.length}
            </div>
          </CardContent>
        </Card>

        <Card className="sketch-card" data-testid="card-completed-requests">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            <div className="sketch-icon w-8 h-8 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-completed-count">
              {completedRequests.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Requests */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : maintenanceRequests.length === 0 ? (
        <Card data-testid="card-no-maintenance">
          <CardContent className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests yet</h3>
            <p className="text-gray-600 mb-4">Maintenance requests will appear here when reported</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="button-add-first-maintenance"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {maintenanceRequests.map((request: MaintenanceRequest) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow" data-testid={`maintenance-card-${request.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getPriorityColor(request.priority)} data-testid={`maintenance-priority-${request.id}`}>
                        {request.priority}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(request.status)}
                        <Badge className={getStatusColor(request.status)} data-testid={`maintenance-status-${request.id}`}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid={`maintenance-description-${request.id}`}>
                      {request.description}
                    </h3>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Property:</span> {request.propertyId}</p>
                      <p><span className="font-medium">Tenant:</span> {request.tenantId}</p>
                      <p><span className="font-medium">Reported:</span> {formatDate(request.reportedDate || '')}</p>
                      {request.completedDate && (
                        <p><span className="font-medium">Completed:</span> {formatDate(request.completedDate)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {request.status === 'PENDING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(request.id, 'IN_PROGRESS')}
                        disabled={updateRequestMutation.isPending}
                        data-testid={`button-start-work-${request.id}`}
                      >
                        Start Work
                      </Button>
                    )}
                    {request.status === 'IN_PROGRESS' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(request.id, 'COMPLETED')}
                        disabled={updateRequestMutation.isPending}
                        data-testid={`button-mark-complete-${request.id}`}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteRequest(request.id)}
                      disabled={deleteRequestMutation.isPending}
                      data-testid={`button-delete-maintenance-${request.id}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Maintenance Modal */}
      <AddMaintenanceModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
