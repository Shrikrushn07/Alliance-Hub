import { Response } from 'express';

interface RealtimeEvent {
  type: 
    | 'OPPORTUNITY_CREATED' 
    | 'OPPORTUNITY_VERIFIED' 
    | 'FESTIVAL_CREATED' 
    | 'FESTIVAL_VERIFIED' 
    | 'EVENT_CREATED' 
    | 'EVENT_VERIFIED' 
    | 'EVENT_REGISTERED' 
    | 'APPLICATION_SUBMITTED' 
    | 'APPLICATION_STATUS_UPDATED' 
    | 'ANNOUNCEMENT_BROADCAST' 
    | 'ROLE_UPDATED' 
    | 'NOTIFICATION_ADDED';
  payload: any;
  timestamp: string;
}

class RealtimeHub {
  private clients: Set<Response> = new Set();

  constructor() {
    // Heartbeat to keep SSE connection alive through proxy / Cloud Run
    setInterval(() => {
      this.sendHeartbeat();
    }, 25000);
  }

  public registerClient(res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx/proxies
    res.flushHeaders?.();

    this.clients.add(res);

    // Initial connection ack
    const initialPayload = JSON.stringify({
      type: 'CONNECTED',
      timestamp: new Date().toISOString(),
      clientCount: this.clients.size
    });
    res.write(`data: ${initialPayload}\n\n`);

    res.on('close', () => {
      this.clients.delete(res);
    });
  }

  public broadcast(type: RealtimeEvent['type'], payload: any): void {
    const event: RealtimeEvent = {
      type,
      payload,
      timestamp: new Date().toISOString()
    };

    const data = `data: ${JSON.stringify(event)}\n\n`;

    for (const client of this.clients) {
      try {
        client.write(data);
      } catch (err) {
        this.clients.delete(client);
      }
    }
  }

  private sendHeartbeat(): void {
    const ping = `: ping - ${new Date().toISOString()}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(ping);
      } catch {
        this.clients.delete(client);
      }
    }
  }

  public getConnectedClientCount(): number {
    return this.clients.size;
  }
}

export const realtimeHub = new RealtimeHub();
