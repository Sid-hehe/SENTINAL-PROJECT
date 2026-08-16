// Sentinel Risk Engine Service

export interface SignalInput {
  signalType: string;
  description: string;
  scoreContribution: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface RiskEngineResult {
  riskScore: number; // 0 - 100
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  topSignal: string;
  recommendation: string;
  contributingSignals: Array<{
    signalType: string;
    description: string;
    scoreContribution: number;
  }>;
}

export interface IRiskModel {
  calculateRisk(signals: SignalInput[]): RiskEngineResult;
}

export class DeterministicRiskModel implements IRiskModel {
  calculateRisk(signals: SignalInput[]): RiskEngineResult {
    if (!signals || signals.length === 0) {
      return {
        riskScore: 10,
        riskTier: 'LOW',
        topSignal: 'Normal Session Activity',
        recommendation: 'Auto-approve transaction. Standard monitoring active.',
        contributingSignals: [],
      };
    }

    // Weight dictionary for signal scoring
    const rawTotal = signals.reduce((sum, sig) => sum + sig.scoreContribution, 0);

    // Normalize score to 0 - 100
    const riskScore = Math.min(100, Math.max(0, rawTotal));

    // Determine Risk Tier
    let riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (riskScore >= 80) {
      riskTier = 'CRITICAL';
    } else if (riskScore >= 60) {
      riskTier = 'HIGH';
    } else if (riskScore >= 30) {
      riskTier = 'MEDIUM';
    }

    // Find highest contributing signal
    const sortedSignals = [...signals].sort((a, b) => b.scoreContribution - a.scoreContribution);
    const topSigObj = sortedSignals[0];
    const topSignal = topSigObj ? topSigObj.signalType.replace(/_/g, ' ') : 'Multiple Anomalies';

    // Generate human-explainable recommendation
    let recommendation = 'Auto-approve transaction. Standard behavioral monitoring.';
    if (riskTier === 'CRITICAL') {
      recommendation = 'ROUTE TO HUMAN REVIEW BEFORE FINAL APPROVAL. High-risk behavioral anomaly detected (Device switching + velocity spikes).';
    } else if (riskTier === 'HIGH') {
      recommendation = 'Route case to Fraud Analyst for manual verification. Perform step-up MFA challenge.';
    } else if (riskTier === 'MEDIUM') {
      recommendation = 'Monitor session closely. Request secondary identity verification if high transaction value.';
    }

    return {
      riskScore,
      riskTier,
      topSignal,
      recommendation,
      contributingSignals: signals.map(s => ({
        signalType: s.signalType,
        description: s.description,
        scoreContribution: s.scoreContribution,
      })),
    };
  }
}

export const riskEngine = new DeterministicRiskModel();
