import { Response } from 'express';

export function setupSSEHeaders(res: Response): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });
}

export function sendSSEMessage(res: Response, data: any): void {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export function sendSSEError(res: Response, error: string): void {
  res.write(`data: ${JSON.stringify({ error })}\n\n`);
}

export function closeSSE(res: Response): void {
  res.write('data: [DONE]\n\n');
  res.end();
}
