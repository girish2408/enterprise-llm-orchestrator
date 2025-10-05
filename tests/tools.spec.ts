import { describe, it, expect } from 'vitest';
import { getLeaveBalance } from '../src/mcp/tools/hr.js';
import { lookupCustomer } from '../src/mcp/tools/crm.js';
import { getPortfolioSummary } from '../src/mcp/tools/banking.js';

describe('MCP Tools', () => {
  describe('HR Tool - getLeaveBalance', () => {
    it('should return leave balance for valid employee ID', async () => {
      const result = await getLeaveBalance({ employeeId: '1001' });
      
      expect(result).toHaveProperty('employeeId', '1001');
      expect(result).toHaveProperty('annual');
      expect(result).toHaveProperty('sick');
      expect(result).toHaveProperty('remaining');
      expect(typeof result.annual).toBe('number');
      expect(typeof result.sick).toBe('number');
      expect(typeof result.remaining).toBe('number');
    });

    it('should return default values for unknown employee ID', async () => {
      const result = await getLeaveBalance({ employeeId: '9999' });
      
      expect(result).toHaveProperty('employeeId', '9999');
      expect(result.annual).toBe(15);
      expect(result.sick).toBe(8);
      expect(result.remaining).toBe(5);
    });
  });

  describe('CRM Tool - lookupCustomer', () => {
    it('should return customer data for valid email', async () => {
      const result = await lookupCustomer({ email: 'john.doe@example.com' });
      
      expect(result).toHaveProperty('email', 'john.doe@example.com');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('tier');
      expect(result).toHaveProperty('lastOrder');
      expect(result.lastOrder).toHaveProperty('date');
      expect(result.lastOrder).toHaveProperty('value');
    });

    it('should return default values for unknown email', async () => {
      const result = await lookupCustomer({ email: 'unknown@example.com' });
      
      expect(result).toHaveProperty('email', 'unknown@example.com');
      expect(result).toHaveProperty('id');
      expect(result.tier).toBe('Bronze');
    });
  });

  describe('Banking Tool - getPortfolioSummary', () => {
    it('should return portfolio data for valid account ID', async () => {
      const result = await getPortfolioSummary({ accountId: '123' });
      
      expect(result).toHaveProperty('accountId', '123');
      expect(result).toHaveProperty('totalValue');
      expect(result).toHaveProperty('pnlPct');
      expect(result).toHaveProperty('topHoldings');
      expect(Array.isArray(result.topHoldings)).toBe(true);
      expect(result.topHoldings.length).toBeGreaterThan(0);
    });

    it('should return default portfolio for unknown account ID', async () => {
      const result = await getPortfolioSummary({ accountId: '999' });
      
      expect(result).toHaveProperty('accountId', '999');
      expect(result.totalValue).toBe(100000);
      expect(result.pnlPct).toBe(2.5);
    });
  });
});
