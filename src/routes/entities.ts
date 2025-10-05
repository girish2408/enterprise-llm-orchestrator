import { Router, Request, Response } from 'express';
import { apiKeyAuth } from '../services/auth.js';
import { logger } from '../config/logger.js';
import { db } from '../services/db.js';

const router = Router();

// Apply auth middleware to all routes
router.use(apiKeyAuth);

// Get all HR employee IDs
router.get('/hr/employees', async (req: Request, res: Response) => {
  try {
    const employees = await db.client.employee.findMany({
      orderBy: { name: 'asc' }
    });

    const departments = await db.client.employee.findMany({
      select: { department: true },
      distinct: ['department']
    });

    res.json({
      employees,
      total: employees.length,
      departments: departments.map(d => d.department)
    });
  } catch (error) {
    logger.error('Failed to fetch HR employees:', error);
    res.status(500).json({
      error: 'Failed to fetch HR employees',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get all CRM customer emails
router.get('/crm/customers', async (req: Request, res: Response) => {
  try {
    const customers = await db.client.customer.findMany({
      orderBy: { name: 'asc' }
    });

    const companies = await db.client.customer.findMany({
      select: { company: true },
      distinct: ['company']
    });

    const tiers = await db.client.customer.findMany({
      select: { tier: true },
      distinct: ['tier']
    });

    res.json({
      customers,
      total: customers.length,
      companies: companies.map(c => c.company),
      tiers: tiers.map(t => t.tier)
    });
  } catch (error) {
    logger.error('Failed to fetch CRM customers:', error);
    res.status(500).json({
      error: 'Failed to fetch CRM customers',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get all banking account IDs
router.get('/banking/accounts', async (req: Request, res: Response) => {
  try {
    const accounts = await db.client.account.findMany({
      orderBy: { id: 'asc' }
    });

    const types = await db.client.account.findMany({
      select: { type: true },
      distinct: ['type']
    });

    const totalValue = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    res.json({
      accounts,
      total: accounts.length,
      types: types.map(t => t.type),
      totalValue
    });
  } catch (error) {
    logger.error('Failed to fetch banking accounts:', error);
    res.status(500).json({
      error: 'Failed to fetch banking accounts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get all available entities (combined view)
router.get('/all', async (req: Request, res: Response) => {
  try {
    const [hrRes, crmRes, bankingRes] = await Promise.all([
      fetch(`${req.protocol}://${req.get('host')}/entities/hr/employees`, {
        headers: { 'x-api-key': req.headers['x-api-key'] as string }
      }),
      fetch(`${req.protocol}://${req.get('host')}/entities/crm/customers`, {
        headers: { 'x-api-key': req.headers['x-api-key'] as string }
      }),
      fetch(`${req.protocol}://${req.get('host')}/entities/banking/accounts`, {
        headers: { 'x-api-key': req.headers['x-api-key'] as string }
      })
    ]);

    const [hr, crm, banking] = await Promise.all([
      hrRes.json(),
      crmRes.json(),
      bankingRes.json()
    ]);

    res.json({
      hr: {
        employees: hr.employees,
        total: hr.total,
        departments: hr.departments
      },
      crm: {
        customers: crm.customers,
        total: crm.total,
        companies: crm.companies,
        tiers: crm.tiers
      },
      banking: {
        accounts: banking.accounts,
        total: banking.total,
        types: banking.types,
        totalValue: banking.totalValue
      }
    });
  } catch (error) {
    logger.error('Failed to fetch all entities:', error);
    res.status(500).json({
      error: 'Failed to fetch all entities',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
