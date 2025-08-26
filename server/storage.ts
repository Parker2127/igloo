import {
  users,
  properties,
  tenants,
  leases,
  payments,
  maintenanceRequests,
  documents,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Tenant,
  type InsertTenant,
  type Lease,
  type InsertLease,
  type Payment,
  type InsertPayment,
  type MaintenanceRequest,
  type InsertMaintenanceRequest,
  type Document,
  type InsertDocument,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Property operations
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;

  // Tenant operations
  getTenants(): Promise<Tenant[]>;
  getTenant(id: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: string, tenant: Partial<InsertTenant>): Promise<Tenant>;
  deleteTenant(id: string): Promise<void>;

  // Lease operations
  getLeases(): Promise<Lease[]>;
  getLease(id: string): Promise<Lease | undefined>;
  createLease(lease: InsertLease): Promise<Lease>;
  updateLease(id: string, lease: Partial<InsertLease>): Promise<Lease>;
  deleteLease(id: string): Promise<void>;

  // Payment operations
  getPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment>;
  deletePayment(id: string): Promise<void>;
  getOverduePayments(): Promise<Payment[]>;

  // Maintenance Request operations
  getMaintenanceRequests(): Promise<MaintenanceRequest[]>;
  getMaintenanceRequest(id: string): Promise<MaintenanceRequest | undefined>;
  createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  updateMaintenanceRequest(id: string, request: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest>;
  deleteMaintenanceRequest(id: string): Promise<void>;
  getHighPriorityMaintenanceRequests(): Promise<MaintenanceRequest[]>;

  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, document: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: string): Promise<void>;

  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    totalProperties: number;
    occupiedProperties: number;
    vacantProperties: number;
    monthlyRevenue: number;
    overduePayments: number;
    openRequests: number;
  }>;
}

// Demo data for engaging experience
const DEMO_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    address: "2847 Maple Grove Avenue",
    city: "Austin",
    state: "TX",
    zipCode: "78704",
    bedrooms: 3,
    bathrooms: "2.5",
    rentAmount: "2800.00",
    description: "Modern townhouse with updated kitchen, hardwood floors, and private patio. Near downtown district.",
    imageUrl: null,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: "prop-2", 
    address: "1534 Pine Street Unit 4B",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    bedrooms: 2,
    bathrooms: "2.0",
    rentAmount: "2200.00",
    description: "Downtown loft with city views, exposed brick, and in-unit laundry. Walking distance to restaurants.",
    imageUrl: null,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: "prop-3",
    address: "8921 Cedar Hills Drive",
    city: "Austin", 
    state: "TX",
    zipCode: "78759",
    bedrooms: 4,
    bathrooms: "3.0",
    rentAmount: "3200.00",
    description: "Spacious family home with large backyard, two-car garage, and excellent school district.",
    imageUrl: null,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: "prop-4",
    address: "456 Oak Boulevard",
    city: "Austin",
    state: "TX", 
    zipCode: "78702",
    bedrooms: 1,
    bathrooms: "1.0",
    rentAmount: "1650.00",
    description: "Cozy studio apartment with modern amenities, perfect for professionals. Close to tech district.",
    imageUrl: null,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05')
  }
];

const DEMO_TENANTS: Tenant[] = [
  {
    id: "tenant-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(512) 555-0123",
    userId: null,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: "tenant-2",
    name: "Michael Chen", 
    email: "michael.chen@email.com",
    phone: "(512) 555-0456",
    userId: null,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: "tenant-3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com", 
    phone: "(512) 555-0789",
    userId: null,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  }
];

const DEMO_LEASES: Lease[] = [
  {
    id: "lease-1",
    propertyId: "prop-1",
    tenantId: "tenant-1",
    startDate: "2024-02-01",
    endDate: "2025-01-31", 
    monthlyRent: "2800.00",
    status: "ACTIVE",
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: "lease-2",
    propertyId: "prop-2",
    tenantId: "tenant-2",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    monthlyRent: "2200.00", 
    status: "ACTIVE",
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: "lease-3",
    propertyId: "prop-3",
    tenantId: "tenant-3",
    startDate: "2024-04-01", 
    endDate: "2025-03-31",
    monthlyRent: "3200.00",
    status: "ACTIVE",
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20')
  }
];

const DEMO_PAYMENTS: Payment[] = [
  {
    id: "payment-1",
    leaseId: "lease-1", 
    amount: "2800.00",
    paymentDate: "2024-12-01",
    dueDate: "2024-12-01",
    status: "PAID",
    stripePaymentId: "pi_demo_001",
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: "payment-2",
    leaseId: "lease-2",
    amount: "2200.00", 
    paymentDate: null,
    dueDate: "2024-12-01",
    status: "LATE",
    stripePaymentId: null,
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: "payment-3", 
    leaseId: "lease-3",
    amount: "3200.00",
    paymentDate: "2024-12-03",
    dueDate: "2024-12-01", 
    status: "PAID",
    stripePaymentId: "pi_demo_002",
    createdAt: new Date('2024-12-03'),
    updatedAt: new Date('2024-12-03')
  },
  {
    id: "payment-4",
    leaseId: "lease-1",
    amount: "2800.00",
    paymentDate: null,
    dueDate: "2025-01-01",
    status: "DUE", 
    stripePaymentId: null,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20')
  }
];

const DEMO_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: "maint-1",
    propertyId: "prop-1",
    tenantId: "tenant-1",
    description: "Kitchen faucet is dripping constantly. Needs repair or replacement.", 
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    reportedDate: new Date('2024-12-10'),
    completedDate: null,
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-12')
  },
  {
    id: "maint-2", 
    propertyId: "prop-2",
    tenantId: "tenant-2",
    description: "Heating system not working properly. Temperature inconsistent throughout apartment.",
    status: "PENDING",
    priority: "HIGH", 
    reportedDate: new Date('2024-12-15'),
    completedDate: null,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: "maint-3",
    propertyId: "prop-3", 
    tenantId: "tenant-3",
    description: "Washing machine making loud noise during spin cycle.",
    status: "COMPLETED",
    priority: "LOW",
    reportedDate: new Date('2024-11-20'),
    completedDate: new Date('2024-11-25'),
    createdAt: new Date('2024-11-20'), 
    updatedAt: new Date('2024-11-25')
  },
  {
    id: "maint-4",
    propertyId: "prop-1",
    tenantId: "tenant-1", 
    description: "Front door lock sticking, difficult to open/close.",
    status: "PENDING",
    priority: "HIGH",
    reportedDate: new Date('2024-12-18'),
    completedDate: null,
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18')
  }
];

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    // Return demo user for demo mode
    if (id === 'demo-user') {
      return {
        id: 'demo-user',
        email: 'shrikar.kaduluri@igloo.com',
        firstName: 'Shrikar',
        lastName: 'Kaduluri',
        profileImageUrl: null,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    const dbProperties = await db.select().from(properties).orderBy(desc(properties.createdAt));
    return dbProperties.length > 0 ? dbProperties : DEMO_PROPERTIES;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  // Tenant operations
  async getTenants(): Promise<Tenant[]> {
    const dbTenants = await db.select().from(tenants).orderBy(desc(tenants.createdAt));
    return dbTenants.length > 0 ? dbTenants : DEMO_TENANTS;
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db.insert(tenants).values(tenant).returning();
    return newTenant;
  }

  async updateTenant(id: string, tenant: Partial<InsertTenant>): Promise<Tenant> {
    const [updatedTenant] = await db
      .update(tenants)
      .set({ ...tenant, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return updatedTenant;
  }

  async deleteTenant(id: string): Promise<void> {
    await db.delete(tenants).where(eq(tenants.id, id));
  }

  // Lease operations
  async getLeases(): Promise<Lease[]> {
    const dbLeases = await db.select().from(leases).orderBy(desc(leases.createdAt));
    return dbLeases.length > 0 ? dbLeases : DEMO_LEASES;
  }

  async getLease(id: string): Promise<Lease | undefined> {
    const [lease] = await db.select().from(leases).where(eq(leases.id, id));
    return lease;
  }

  async createLease(lease: InsertLease): Promise<Lease> {
    const [newLease] = await db.insert(leases).values(lease).returning();
    return newLease;
  }

  async updateLease(id: string, lease: Partial<InsertLease>): Promise<Lease> {
    const [updatedLease] = await db
      .update(leases)
      .set({ ...lease, updatedAt: new Date() })
      .where(eq(leases.id, id))
      .returning();
    return updatedLease;
  }

  async deleteLease(id: string): Promise<void> {
    await db.delete(leases).where(eq(leases.id, id));
  }

  // Payment operations
  async getPayments(): Promise<Payment[]> {
    const dbPayments = await db.select().from(payments).orderBy(desc(payments.createdAt));
    return dbPayments.length > 0 ? dbPayments : DEMO_PAYMENTS;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ ...payment, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  async deletePayment(id: string): Promise<void> {
    await db.delete(payments).where(eq(payments.id, id));
  }

  async getOverduePayments(): Promise<Payment[]> {
    const dbPayments = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.status, "LATE"),
          sql`${payments.dueDate} < CURRENT_DATE`
        )
      )
      .orderBy(desc(payments.dueDate));
    
    if (dbPayments.length > 0) return dbPayments;
    
    // Return demo overdue payments
    return DEMO_PAYMENTS.filter(p => p.status === "LATE");
  }

  // Maintenance Request operations
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    const dbRequests = await db.select().from(maintenanceRequests).orderBy(desc(maintenanceRequests.createdAt));
    return dbRequests.length > 0 ? dbRequests : DEMO_MAINTENANCE;
  }

  async getMaintenanceRequest(id: string): Promise<MaintenanceRequest | undefined> {
    const [request] = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, id));
    return request;
  }

  async createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const [newRequest] = await db.insert(maintenanceRequests).values(request).returning();
    return newRequest;
  }

  async updateMaintenanceRequest(id: string, request: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest> {
    const [updatedRequest] = await db
      .update(maintenanceRequests)
      .set({ ...request, updatedAt: new Date() })
      .where(eq(maintenanceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async deleteMaintenanceRequest(id: string): Promise<void> {
    await db.delete(maintenanceRequests).where(eq(maintenanceRequests.id, id));
  }

  async getHighPriorityMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    const dbRequests = await db
      .select()
      .from(maintenanceRequests)
      .where(
        and(
          eq(maintenanceRequests.priority, "HIGH"),
          or(
            eq(maintenanceRequests.status, "PENDING"),
            eq(maintenanceRequests.status, "IN_PROGRESS")
          )
        )
      )
      .orderBy(desc(maintenanceRequests.reportedDate));
    
    if (dbRequests.length > 0) return dbRequests;
    
    // Return demo high priority requests
    return DEMO_MAINTENANCE.filter(m => 
      m.priority === "HIGH" && 
      (m.status === "PENDING" || m.status === "IN_PROGRESS")
    );
  }

  // Document operations
  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(desc(documents.createdAt));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }

  async updateDocument(id: string, document: Partial<InsertDocument>): Promise<Document> {
    const [updatedDocument] = await db
      .update(documents)
      .set({ ...document, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Dashboard metrics
  async getDashboardMetrics() {
    const [
      totalPropertiesResult,
      activeLeases,
      monthlyRevenueResult,
      overduePaymentsResult,
      openRequestsResult,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(properties),
      db.select({ count: sql<number>`count(*)` }).from(leases).where(eq(leases.status, "ACTIVE")),
      db.select({ total: sql<number>`COALESCE(SUM(${leases.monthlyRent}), 0)` }).from(leases).where(eq(leases.status, "ACTIVE")),
      db.select({ 
        total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
        count: sql<number>`count(*)`
      }).from(payments).where(eq(payments.status, "LATE")),
      db.select({ count: sql<number>`count(*)` }).from(maintenanceRequests).where(
        or(
          eq(maintenanceRequests.status, "PENDING"),
          eq(maintenanceRequests.status, "IN_PROGRESS")
        )
      ),
    ]);

    const totalProperties = totalPropertiesResult[0]?.count || 0;
    const occupiedProperties = activeLeases[0]?.count || 0;
    const vacantProperties = totalProperties - occupiedProperties;
    const monthlyRevenue = Number(monthlyRevenueResult[0]?.total || 0);
    const overduePayments = Number(overduePaymentsResult[0]?.total || 0);
    const openRequests = openRequestsResult[0]?.count || 0;

    // If no real data, return demo metrics
    if (totalProperties === 0) {
      const demoTotalProperties = DEMO_PROPERTIES.length;
      const demoActiveLeases = DEMO_LEASES.filter(l => l.status === "ACTIVE").length;
      const demoVacantProperties = demoTotalProperties - demoActiveLeases;
      const demoMonthlyRevenue = DEMO_LEASES
        .filter(l => l.status === "ACTIVE")
        .reduce((sum, l) => sum + Number(l.monthlyRent), 0);
      const demoOverduePayments = DEMO_PAYMENTS
        .filter(p => p.status === "LATE")
        .reduce((sum, p) => sum + Number(p.amount), 0);
      const demoOpenRequests = DEMO_MAINTENANCE.filter(m => 
        m.status === "PENDING" || m.status === "IN_PROGRESS"
      ).length;

      return {
        totalProperties: demoTotalProperties,
        occupiedProperties: demoActiveLeases,
        vacantProperties: demoVacantProperties,
        monthlyRevenue: demoMonthlyRevenue,
        overduePayments: demoOverduePayments,
        openRequests: demoOpenRequests,
      };
    }

    return {
      totalProperties,
      occupiedProperties,
      vacantProperties,
      monthlyRevenue,
      overduePayments,
      openRequests,
    };
  }
}

export const storage = new DatabaseStorage();
