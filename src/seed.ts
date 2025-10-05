import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database with entity data...');

  // Clear existing data
  await prisma.account.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.employee.deleteMany();

  // Seed Employees
  const employees = [
    { id: '2345', name: 'John Doe', department: 'Engineering', status: 'active' },
    { id: '5678', name: 'Sarah Johnson', department: 'Marketing', status: 'active' },
    { id: '9012', name: 'Mike Chen', department: 'Sales', status: 'active' },
    { id: '3456', name: 'Emily Rodriguez', department: 'HR', status: 'active' },
    { id: '7890', name: 'David Wilson', department: 'Finance', status: 'active' },
    { id: '1234', name: 'Lisa Brown', department: 'Operations', status: 'active' },
    { id: '4567', name: 'Alex Kim', department: 'Engineering', status: 'active' },
    { id: '8901', name: 'Maria Garcia', department: 'Marketing', status: 'active' },
    { id: '2468', name: 'Tom Anderson', department: 'Sales', status: 'active' },
    { id: '1357', name: 'Jennifer Lee', department: 'Finance', status: 'active' }
  ];

  for (const employee of employees) {
    await prisma.employee.create({ data: employee });
  }

  // Seed Customers
  const customers = [
    { id: 'CUST-001', email: 'john.doe@acmecorp.com', name: 'John Doe', company: 'Acme Corp', tier: 'Gold', status: 'active' },
    { id: 'CUST-002', email: 'sarah.johnson@techcorp.com', name: 'Sarah Johnson', company: 'TechCorp', tier: 'Bronze', status: 'active' },
    { id: 'CUST-003', email: 'mike.chen@startup.io', name: 'Mike Chen', company: 'Startup.io', tier: 'Silver', status: 'prospect' },
    { id: 'CUST-004', email: 'emily.rodriguez@enterprise.com', name: 'Emily Rodriguez', company: 'Enterprise Corp', tier: 'Gold', status: 'active' },
    { id: 'CUST-005', email: 'bob.wilson@techcorp.com', name: 'Bob Wilson', company: 'TechCorp', tier: 'Bronze', status: 'inactive' },
    { id: 'CUST-006', email: 'alice.smith@bigcorp.com', name: 'Alice Smith', company: 'BigCorp', tier: 'Platinum', status: 'active' },
    { id: 'CUST-007', email: 'charlie.brown@smallbiz.com', name: 'Charlie Brown', company: 'SmallBiz', tier: 'Bronze', status: 'active' },
    { id: 'CUST-008', email: 'diana.prince@wonder.com', name: 'Diana Prince', company: 'Wonder Corp', tier: 'Gold', status: 'active' },
    { id: 'CUST-009', email: 'bruce.wayne@wayne.com', name: 'Bruce Wayne', company: 'Wayne Enterprises', tier: 'Platinum', status: 'active' },
    { id: 'CUST-010', email: 'clark.kent@daily.com', name: 'Clark Kent', company: 'Daily Planet', tier: 'Silver', status: 'active' }
  ];

  for (const customer of customers) {
    await prisma.customer.create({ data: customer });
  }

  // Seed Accounts
  const accounts = [
    { id: '12345', type: 'investment', owner: 'John Doe', balance: 125000, currency: 'USD' },
    { id: '67890', type: 'checking', owner: 'Sarah Johnson', balance: 8750, currency: 'USD' },
    { id: '54321', type: 'investment', owner: 'Mike Chen', balance: 85000, currency: 'USD' },
    { id: '98765', type: 'savings', owner: 'Emily Rodriguez', balance: 25000, currency: 'USD' },
    { id: '11111', type: 'retirement', owner: 'David Wilson', balance: 200000, currency: 'USD' },
    { id: '22222', type: 'checking', owner: 'Lisa Brown', balance: 15000, currency: 'USD' },
    { id: '33333', type: 'investment', owner: 'Alex Kim', balance: 75000, currency: 'USD' },
    { id: '44444', type: 'savings', owner: 'Maria Garcia', balance: 30000, currency: 'USD' },
    { id: '55555', type: 'investment', owner: 'Tom Anderson', balance: 100000, currency: 'USD' },
    { id: '66666', type: 'retirement', owner: 'Jennifer Lee', balance: 180000, currency: 'USD' }
  ];

  for (const account of accounts) {
    await prisma.account.create({ data: account });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${employees.length} employees, ${customers.length} customers, ${accounts.length} accounts`);
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
