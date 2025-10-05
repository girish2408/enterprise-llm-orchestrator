import { CustomerLookupRequest, CustomerLookupResponse } from '../../types/index.js';
import { db } from '../../services/db.js';
import { generateNotFoundResponse } from '../../utils/gpt-responses.js';

export async function lookupCustomer(input: CustomerLookupRequest): Promise<CustomerLookupResponse> {
  const { email } = input;
  
  try {
    // Check if customer exists in database
    const customer = await db.client.customer.findUnique({
      where: { email }
    });

    if (!customer) {
      // Customer not found - use GPT to generate appropriate response
      const gptResponse = await generateNotFoundResponse('customer', email, 'CRM system');
      return {
        email,
        error: gptResponse,
        id: '',
        tier: '',
        lastOrder: {
          date: '',
          value: 0,
        },
      };
    }

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Generate realistic last order data based on customer tier
    const tierMultipliers = {
      'Bronze': 0.5,
      'Silver': 1.0,
      'Gold': 1.5,
      'Platinum': 2.0
    };
    
    const baseValue = 500;
    const multiplier = tierMultipliers[customer.tier as keyof typeof tierMultipliers] || 1.0;
    const orderValue = Math.floor(baseValue * multiplier);
    
    // Generate a recent date (within last 6 months)
    const daysAgo = Math.floor(Math.random() * 180);
    const lastOrderDate = new Date();
    lastOrderDate.setDate(lastOrderDate.getDate() - daysAgo);

    return {
      email: customer.email,
      id: customer.id,
      tier: customer.tier,
      lastOrder: {
        date: lastOrderDate.toISOString().split('T')[0],
        value: orderValue,
      },
    };
  } catch (error) {
    // Database error - use GPT to generate error response
    const gptResponse = await generateNotFoundResponse('customer', email, 'CRM system', 'database error');
    return {
      email,
      error: gptResponse,
      id: '',
      tier: '',
      lastOrder: {
        date: '',
        value: 0,
      },
    };
  }
}
