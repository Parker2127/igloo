import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertPropertySchema,
  insertTenantSchema,
  insertLeaseSchema,
  insertPaymentSchema,
  insertMaintenanceRequestSchema,
  insertDocumentSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Demo login route
  app.post('/api/demo-login', async (req: any, res) => {
    try {
      // Create a demo session
      req.session.user = {
        claims: {
          sub: 'demo-user',
          email: 'shrikar.kaduluri@igloo.com',
          first_name: 'Shrikar',
          last_name: 'Kaduluri',
          profile_image_url: null
        },
        access_token: 'demo-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
      };
      
      res.json({ success: true, message: 'Demo login successful' });
    } catch (error) {
      console.error("Error with demo login:", error);
      res.status(500).json({ message: "Demo login failed" });
    }
  });

  // Check auth status for demo mode
  const checkAuth = (req: any, res: any, next: any) => {
    if (req.session?.user) {
      req.user = req.session.user;
      return next();
    }
    return isAuthenticated(req, res, next);
  };

  // Auth routes
  app.get('/api/auth/user', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard metrics
  app.get('/api/dashboard/metrics', checkAuth, async (req: any, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Properties CRUD
  app.get('/api/properties', checkAuth, async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/:id', checkAuth, async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post('/api/properties', checkAuth, async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.put('/api/properties/:id', checkAuth, async (req, res) => {
    try {
      const validatedData = insertPropertySchema.partial().parse(req.body);
      const property = await storage.updateProperty(req.params.id, validatedData);
      res.json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete('/api/properties/:id', checkAuth, async (req, res) => {
    try {
      await storage.deleteProperty(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Tenants CRUD
  app.get('/api/tenants', checkAuth, async (req, res) => {
    try {
      const tenants = await storage.getTenants();
      res.json(tenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  });

  app.get('/api/tenants/:id', checkAuth, async (req, res) => {
    try {
      const tenant = await storage.getTenant(req.params.id);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error) {
      console.error("Error fetching tenant:", error);
      res.status(500).json({ message: "Failed to fetch tenant" });
    }
  });

  app.post('/api/tenants', checkAuth, async (req, res) => {
    try {
      const validatedData = insertTenantSchema.parse(req.body);
      const tenant = await storage.createTenant(validatedData);
      res.status(201).json(tenant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating tenant:", error);
      res.status(500).json({ message: "Failed to create tenant" });
    }
  });

  app.put('/api/tenants/:id', checkAuth, async (req, res) => {
    try {
      const validatedData = insertTenantSchema.partial().parse(req.body);
      const tenant = await storage.updateTenant(req.params.id, validatedData);
      res.json(tenant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating tenant:", error);
      res.status(500).json({ message: "Failed to update tenant" });
    }
  });

  app.delete('/api/tenants/:id', checkAuth, async (req, res) => {
    try {
      await storage.deleteTenant(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tenant:", error);
      res.status(500).json({ message: "Failed to delete tenant" });
    }
  });

  // Leases CRUD
  app.get('/api/leases', checkAuth, async (req, res) => {
    try {
      const leases = await storage.getLeases();
      res.json(leases);
    } catch (error) {
      console.error("Error fetching leases:", error);
      res.status(500).json({ message: "Failed to fetch leases" });
    }
  });

  app.get('/api/leases/:id', checkAuth, async (req, res) => {
    try {
      const lease = await storage.getLease(req.params.id);
      if (!lease) {
        return res.status(404).json({ message: "Lease not found" });
      }
      res.json(lease);
    } catch (error) {
      console.error("Error fetching lease:", error);
      res.status(500).json({ message: "Failed to fetch lease" });
    }
  });

  app.post('/api/leases', checkAuth, async (req, res) => {
    try {
      const validatedData = insertLeaseSchema.parse(req.body);
      const lease = await storage.createLease(validatedData);
      res.status(201).json(lease);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating lease:", error);
      res.status(500).json({ message: "Failed to create lease" });
    }
  });

  app.put('/api/leases/:id', checkAuth, async (req, res) => {
    try {
      const validatedData = insertLeaseSchema.partial().parse(req.body);
      const lease = await storage.updateLease(req.params.id, validatedData);
      res.json(lease);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating lease:", error);
      res.status(500).json({ message: "Failed to update lease" });
    }
  });

  app.delete('/api/leases/:id', checkAuth, async (req, res) => {
    try {
      await storage.deleteLease(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lease:", error);
      res.status(500).json({ message: "Failed to delete lease" });
    }
  });

  // Payments CRUD
  app.get('/api/payments', checkAuth, async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.get('/api/payments/overdue', checkAuth, async (req, res) => {
    try {
      const overduePayments = await storage.getOverduePayments();
      res.json(overduePayments);
    } catch (error) {
      console.error("Error fetching overdue payments:", error);
      res.status(500).json({ message: "Failed to fetch overdue payments" });
    }
  });

  app.post('/api/payments', checkAuth, async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.put('/api/payments/:id', checkAuth, async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(req.params.id, validatedData);
      res.json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating payment:", error);
      res.status(500).json({ message: "Failed to update payment" });
    }
  });

  // Maintenance Requests CRUD
  app.get('/api/maintenance-requests', checkAuth, async (req, res) => {
    try {
      const requests = await storage.getMaintenanceRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      res.status(500).json({ message: "Failed to fetch maintenance requests" });
    }
  });

  app.get('/api/maintenance-requests/high-priority', checkAuth, async (req, res) => {
    try {
      const requests = await storage.getHighPriorityMaintenanceRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching high priority maintenance requests:", error);
      res.status(500).json({ message: "Failed to fetch high priority maintenance requests" });
    }
  });

  app.post('/api/maintenance-requests', checkAuth, async (req, res) => {
    try {
      const validatedData = insertMaintenanceRequestSchema.parse(req.body);
      const request = await storage.createMaintenanceRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating maintenance request:", error);
      res.status(500).json({ message: "Failed to create maintenance request" });
    }
  });

  app.put('/api/maintenance-requests/:id', checkAuth, async (req, res) => {
    try {
      const validatedData = insertMaintenanceRequestSchema.partial().parse(req.body);
      const request = await storage.updateMaintenanceRequest(req.params.id, validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating maintenance request:", error);
      res.status(500).json({ message: "Failed to update maintenance request" });
    }
  });

  app.delete('/api/maintenance-requests/:id', checkAuth, async (req, res) => {
    try {
      await storage.deleteMaintenanceRequest(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting maintenance request:", error);
      res.status(500).json({ message: "Failed to delete maintenance request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
