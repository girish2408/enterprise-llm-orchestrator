import { LeaveBalanceRequest, LeaveBalanceResponse } from '../../types/index.js';
import { db } from '../../services/db.js';
import { generateNotFoundResponse } from '../../utils/gpt-responses.js';

export async function getLeaveBalance(input: LeaveBalanceRequest): Promise<LeaveBalanceResponse> {
  const { employeeId } = input;
  
  try {
    // Check if employee exists in database
    const employee = await db.client.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      // Employee not found - use GPT to generate appropriate response
      const gptResponse = await generateNotFoundResponse('employee', employeeId, 'HR system');
      return {
        employeeId,
        error: gptResponse,
        annual: 0,
        sick: 0,
        remaining: 0,
      };
    }

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Generate realistic leave balance based on employee data
    const baseAnnual = 20;
    const baseSick = 10;
    const departmentMultiplier = employee.department === 'Engineering' ? 1.2 : 1.0;
    
    const annual = Math.floor(baseAnnual * departmentMultiplier);
    const sick = Math.floor(baseSick * departmentMultiplier);
    const remaining = Math.floor(annual * 0.3); // 30% remaining

    return {
      employeeId,
      annual,
      sick,
      remaining,
    };
  } catch (error) {
    // Database error - use GPT to generate error response
    const gptResponse = await generateNotFoundResponse('employee', employeeId, 'HR system', 'database error');
    return {
      employeeId,
      error: gptResponse,
      annual: 0,
      sick: 0,
      remaining: 0,
    };
  }
}
