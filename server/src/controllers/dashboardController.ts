import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { modelHealthService } from '../services/modelHealth.js';

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const totalSessions = await prisma.session.count();
    const confirmedFraud = await prisma.session.count({
      where: { status: 'CONFIRMED_FRAUD' },
    });
    const criticalSessions = await prisma.session.count({
      where: { riskTier: 'CRITICAL' },
    });
    const highSessions = await prisma.session.count({
      where: { riskTier: 'HIGH' },
    });

    const stats = {
      fraudCaughtPreTransaction: {
        value: '94.2%',
        change: '+8.4%',
        trend: 'up',
        description: 'Prevented before final checkout/transfer execution',
      },
      falsePositiveRate: {
        value: '3.7%',
        change: '-1.2%',
        trend: 'down',
        description: 'Legitimate customer sessions flagged for review',
      },
      medianTimeToDecision: {
        value: '4m 18s',
        change: '-18%',
        trend: 'down',
        description: 'Average time analysts take to review & resolve cases',
      },
      onboardingCompletionRate: {
        value: '91.8%',
        change: '+3.1%',
        trend: 'up',
        description: 'Low-risk customer onboarding completion',
      },
      summaryCounts: {
        totalSessions,
        confirmedFraud,
        criticalSessions,
        highSessions,
      },
    };

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function getDashboardTrends(req: Request, res: Response) {
  try {
    // Risk tier distribution
    const lowCount = await prisma.session.count({ where: { riskTier: 'LOW' } });
    const mediumCount = await prisma.session.count({ where: { riskTier: 'MEDIUM' } });
    const highCount = await prisma.session.count({ where: { riskTier: 'HIGH' } });
    const criticalCount = await prisma.session.count({ where: { riskTier: 'CRITICAL' } });

    const riskDistribution = [
      { name: 'Low Risk (0-29)', count: lowCount, color: '#22C55E' },
      { name: 'Medium Risk (30-59)', count: mediumCount, color: '#3B82F6' },
      { name: 'High Risk (60-79)', count: highCount, color: '#F59E0B' },
      { name: 'Critical Risk (80-100)', count: criticalCount, color: '#E11D2A' },
    ];

    // Fraud trends over 7 days
    const fraudTrend = [
      { day: 'Mon', totalSessions: 1420, flaggedAnomalies: 88, confirmedFraud: 14 },
      { day: 'Tue', totalSessions: 1580, flaggedAnomalies: 94, confirmedFraud: 18 },
      { day: 'Wed', totalSessions: 1690, flaggedAnomalies: 112, confirmedFraud: 22 },
      { day: 'Thu', totalSessions: 1810, flaggedAnomalies: 135, confirmedFraud: 29 },
      { day: 'Fri', totalSessions: 2100, flaggedAnomalies: 168, confirmedFraud: 41 },
      { day: 'Sat', totalSessions: 1950, flaggedAnomalies: 152, confirmedFraud: 38 },
      { day: 'Sun', totalSessions: 1730, flaggedAnomalies: 120, confirmedFraud: 26 },
    ];

    // Signal Frequency
    const signals = await prisma.behavioralSignal.findMany({
      select: { signalType: true, scoreContribution: true },
    });

    const signalCounts: Record<string, number> = {};
    signals.forEach(s => {
      const type = s.signalType.replace(/_/g, ' ');
      signalCounts[type] = (signalCounts[type] || 0) + 1;
    });

    const signalFrequency = Object.entries(signalCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Detection Performance
    const detectionPerformance = [
      { category: 'Device Switch', preTransaction: 88, postTransaction: 12 },
      { category: 'Typing Cadence', preTransaction: 92, postTransaction: 8 },
      { category: 'Fast Completion', preTransaction: 95, postTransaction: 5 },
      { category: 'Navigation Anomaly', preTransaction: 90, postTransaction: 10 },
      { category: 'Transaction Velocity', preTransaction: 84, postTransaction: 16 },
    ];

    return res.json({
      success: true,
      data: {
        riskDistribution,
        fraudTrend,
        signalFrequency,
        detectionPerformance,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function getModelHealth(req: Request, res: Response) {
  try {
    const health = modelHealthService.getHealth();
    return res.json({
      success: true,
      data: health,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function toggleModelHealth(req: Request, res: Response) {
  try {
    const { enabled } = req.body;
    const updated = modelHealthService.toggleAnomalyDetection(enabled);
    return res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}
