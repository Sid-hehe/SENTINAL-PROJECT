// Model Health Service for Sentinel

export interface ModelComponentStatus {
  name: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  accuracy: string;
  lastTrained: string;
}

export class ModelHealthService {
  private anomalyModelStatus: 'ONLINE' | 'OFFLINE' = 'ONLINE';

  public getHealth() {
    const isAnomalyOnline = this.anomalyModelStatus === 'ONLINE';

    const components: ModelComponentStatus[] = [
      {
        name: 'Known Pattern Model',
        status: 'ONLINE',
        latencyMs: 12,
        accuracy: '99.4%',
        lastTrained: '2 hours ago',
      },
      {
        name: 'Anomaly Detection Model',
        status: isAnomalyOnline ? 'ONLINE' : 'OFFLINE',
        latencyMs: isAnomalyOnline ? 24 : 0,
        accuracy: isAnomalyOnline ? '96.8%' : 'N/A',
        lastTrained: '6 hours ago',
      },
      {
        name: 'Unified Risk Engine',
        status: isAnomalyOnline ? 'ONLINE' : 'DEGRADED',
        latencyMs: 18,
        accuracy: isAnomalyOnline ? '98.1%' : '91.2% (Fallback Rules)',
        lastTrained: 'Real-time',
      },
      {
        name: 'Database',
        status: 'ONLINE',
        latencyMs: 3,
        accuracy: '100%',
        lastTrained: 'System',
      },
      {
        name: 'API',
        status: 'ONLINE',
        latencyMs: 8,
        accuracy: '100%',
        lastTrained: 'System',
      },
    ];

    return {
      overallStatus: isAnomalyOnline ? 'HEALTHY' : 'DEGRADED',
      components,
      anomalyModelEnabled: isAnomalyOnline,
      fallbackMessage: !isAnomalyOnline
        ? 'Anomaly detection unavailable. Sentinel is operating using known-pattern detection + deterministic rules.'
        : null,
    };
  }

  public toggleAnomalyDetection(enabled?: boolean) {
    if (enabled !== undefined) {
      this.anomalyModelStatus = enabled ? 'ONLINE' : 'OFFLINE';
    } else {
      this.anomalyModelStatus = this.anomalyModelStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    }
    return this.getHealth();
  }
}

export const modelHealthService = new ModelHealthService();
