import { PortfolioSummaryRequest, PortfolioSummaryResponse } from '../../types/index.js';
import { db } from '../../services/db.js';
import { generateNotFoundResponse } from '../../utils/gpt-responses.js';

export async function getPortfolioSummary(input: PortfolioSummaryRequest): Promise<PortfolioSummaryResponse> {
  const { accountId } = input;
  
  try {
    // Check if account exists in database
    const account = await db.client.account.findUnique({
      where: { id: accountId }
    });

    if (!account) {
      // Account not found - use GPT to generate appropriate response
      const gptResponse = await generateNotFoundResponse('account', accountId, 'banking system');
      return {
        accountId,
        error: gptResponse,
        totalValue: 0,
        pnlPct: 0,
        topHoldings: [],
      };
    }

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate realistic portfolio data based on account type and balance
    const baseValue = account.balance;
    const pnlPct = (Math.random() - 0.5) * 20; // Random P&L between -10% and +10%
    const totalValue = Math.floor(baseValue * (1 + pnlPct / 100));
    
    // Generate holdings based on account type
    const holdingsByType = {
      'investment': [
        { symbol: 'AAPL', weight: 0.25 },
        { symbol: 'MSFT', weight: 0.20 },
        { symbol: 'GOOGL', weight: 0.15 },
        { symbol: 'TSLA', weight: 0.10 },
        { symbol: 'NVDA', weight: 0.10 },
        { symbol: 'META', weight: 0.10 },
        { symbol: 'AMZN', weight: 0.10 },
      ],
      'retirement': [
        { symbol: 'SPY', weight: 0.40 },
        { symbol: 'QQQ', weight: 0.30 },
        { symbol: 'VTI', weight: 0.20 },
        { symbol: 'BND', weight: 0.10 },
      ],
      'checking': [
        { symbol: 'CASH', weight: 1.0 },
      ],
      'savings': [
        { symbol: 'CASH', weight: 1.0 },
      ],
    };

    const holdings = holdingsByType[account.type as keyof typeof holdingsByType] || [
      { symbol: 'CASH', weight: 1.0 },
    ];

    return {
      accountId: account.id,
      totalValue,
      pnlPct: Math.round(pnlPct * 100) / 100,
      topHoldings: holdings.slice(0, 4), // Top 4 holdings
    };
  } catch (error) {
    // Database error - use GPT to generate error response
    const gptResponse = await generateNotFoundResponse('account', accountId, 'banking system', 'database error');
    return {
      accountId,
      error: gptResponse,
      totalValue: 0,
      pnlPct: 0,
      topHoldings: [],
    };
  }
}
