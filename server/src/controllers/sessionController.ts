import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { createAuditLog } from '../utils/auditLogger.js';
import { safeJsonParse, sanitizeSearchQuery } from '../utils/json.js';

export async function getSessions(req: AuthRequest, res: Response) {
  try {
    const { riskTier, status, search, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (riskTier && riskTier !== 'ALL') {
      where.riskTier = riskTier as string;
    }

    if (status && status !== 'ALL') {
      where.status = status as string;
    }

    const q = sanitizeSearchQuery(search, 100);
    if (q) {
      where.OR = [
        { sessionId: { contains: q } },
        { customerReference: { contains: q } },
        { topSignal: { contains: q } },
        { recommendation: { contains: q } },
      ];
    }

    const [total, sessions] = await Promise.all([
      prisma.session.count({ where }),
      prisma.session.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          signals: {
            take: 5,
            orderBy: { scoreContribution: 'desc' },
          },
          _count: {
            select: { notes: true },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        sessions: sessions.map(s => ({
          ...s,
          signals: s.signals.map(sig => ({
            ...sig,
            metadata: safeJsonParse<any>(sig.metadata, null),
          })),
        })),
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function getSessionById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const session = await prisma.session.findFirst({
      where: {
        OR: [{ id }, { sessionId: id }],
      },
      include: {
        signals: {
          orderBy: { scoreContribution: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { id: true, name: true, role: true, avatar: true },
            },
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Session not found' },
      });
    }

    return res.json({
      success: true,
      data: {
        ...session,
        signals: session.signals.map(sig => ({
          ...sig,
          metadata: safeJsonParse<any>(sig.metadata, null),
        })),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function updateSessionStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'NEW',
      'IN_REVIEW',
      'CONFIRMED_FRAUD',
      'CONFIRMED_LEGITIMATE',
      'NEEDS_MORE_INFO',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Invalid session status value' },
      });
    }

    const session = await prisma.session.findFirst({
      where: { OR: [{ id }, { sessionId: id }] },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Session not found' },
      });
    }

    const updated = await prisma.session.update({
      where: { id: session.id },
      data: {
        status,
        reviewedBy: req.user?.name || 'Analyst',
        reviewedAt: new Date(),
      },
    });

    await createAuditLog({
      userId: req.user?.id,
      userName: req.user?.name,
      userRole: req.user?.role,
      action: `CASE_STATUS_CHANGED_${status}`,
      entityType: 'Session',
      entityId: session.sessionId,
      metadata: { previousStatus: session.status, newStatus: status },
    });

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

export async function getSessionSignals(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const session = await prisma.session.findFirst({
      where: { OR: [{ id }, { sessionId: id }] },
      select: { id: true },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Session not found' },
      });
    }

    const signals = await prisma.behavioralSignal.findMany({
      where: { sessionId: session.id },
      orderBy: { scoreContribution: 'desc' },
    });

    return res.json({
      success: true,
      data: signals.map(s => ({
        ...s,
        metadata: safeJsonParse<any>(s.metadata, null),
      })),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function getSessionNotes(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const session = await prisma.session.findFirst({
      where: { OR: [{ id }, { sessionId: id }] },
      select: { id: true },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Session not found' },
      });
    }

    const notes = await prisma.caseNote.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, role: true, avatar: true },
        },
      },
    });

    return res.json({
      success: true,
      data: notes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function addSessionNote(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Note content cannot be empty' },
      });
    }

    const session = await prisma.session.findFirst({
      where: { OR: [{ id }, { sessionId: id }] },
      select: { id: true, sessionId: true },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Session not found' },
      });
    }

    const note = await prisma.caseNote.create({
      data: {
        sessionId: session.id,
        authorId: req.user!.id,
        content: content.trim(),
      },
      include: {
        author: {
          select: { id: true, name: true, role: true, avatar: true },
        },
      },
    });

    await createAuditLog({
      userId: req.user?.id,
      userName: req.user?.name,
      userRole: req.user?.role,
      action: 'CASE_NOTE_ADDED',
      entityType: 'Session',
      entityId: session.sessionId,
      metadata: { noteId: note.id },
    });

    return res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

// Server-Sent Events (SSE) Client Connections
const sseClients = new Set<Response>();

export function streamSessionEvents(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  // Send initial connection event
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Real-time telemetry stream active' })}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
}

export function broadcastSSE(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  });
}

export async function simulateSession(req: AuthRequest, res: Response) {
  try {
    const { scenarioType = 'ACCOUNT_TAKEOVER' } = req.body;

    const randomId = Math.floor(48300 + Math.random() * 900);
    const sessionCode = `#${randomId}`;
    const custRef = `CUS•••${Math.floor(100 + Math.random() * 900)}`;

    const scenarioConfigs: Record<string, { topSignal: string; rec: string; signals: any[] }> = {
      ACCOUNT_TAKEOVER: {
        topSignal: 'Device Switch Hijack',
        rec: 'CRITICAL: Mid-session User-Agent jump detected during credential update. Re-authenticate passkey.',
        signals: [
          { type: 'DEVICE_SWITCH', desc: 'Jump from Mobile iOS Safari to Desktop Linux Chrome', score: 28, sev: 'CRITICAL' },
          { type: 'FIELD_CORRECTIONS', desc: '100% paste ratio across security fields', score: 18, sev: 'HIGH' },
          { type: 'TRANSACTION_VELOCITY', desc: 'Immediate payment attempt after password change', score: 24, sev: 'CRITICAL' },
        ],
      },
      CARD_TESTING: {
        topSignal: 'Rapid Authorization Storm',
        rec: 'HIGH: Automated script testing 15 card numbers in under 60 seconds. Block IP subnet.',
        signals: [
          { type: 'FAST_COMPLETION', desc: 'Checkout form submitted in 1.2s per card attempt', score: 26, sev: 'HIGH' },
          { type: 'TYPING_CADENCE', desc: '0ms timing variance (automated bot script)', score: 22, sev: 'HIGH' },
          { type: 'NAVIGATION_ANOMALY', desc: 'Direct HTTP POST bypass of shopping cart UI', score: 18, sev: 'MEDIUM' },
        ],
      },
      VELOCITY_ABUSE: {
        topSignal: 'Velocity Transfer Spike',
        rec: 'CRITICAL: 5 peer-to-peer transfers exceeding daily baseline by 400%. Hold for analyst review.',
        signals: [
          { type: 'TRANSACTION_VELOCITY', desc: '5 outgoing transfers to unverified payees in 120s', score: 32, sev: 'CRITICAL' },
          { type: 'LOGIN_TIMING', desc: 'Access at 03:22 AM from unfamiliar location', score: 20, sev: 'HIGH' },
          { type: 'PROFILE_CHANGE', desc: 'Email address modified prior to cash-out', score: 22, sev: 'HIGH' },
        ],
      },
      SYNTHETIC_IDENTITY: {
        topSignal: 'Synthetic SSN Application Farm',
        rec: 'CRITICAL: Identical browser fingerprint submitting 10 distinct SSN onboarding forms.',
        signals: [
          { type: 'FIELD_CORRECTIONS', desc: 'Sequential copy-paste of stolen SSN & DOB', score: 26, sev: 'CRITICAL' },
          { type: 'FAST_COMPLETION', desc: 'Form speed-run completed in 3.4 seconds', score: 24, sev: 'CRITICAL' },
          { type: 'DEVICE_SWITCH', desc: 'Spoofed canvas fingerprint & proxy exit node', score: 20, sev: 'HIGH' },
        ],
      },
      DEVICE_HIJACK: {
        topSignal: 'Remote Control AnyDesk Session',
        rec: 'CRITICAL: Virtual mouse driver inputs & active voice call indicators detected during wire transfer.',
        signals: [
          { type: 'NAVIGATION_ANOMALY', desc: 'Extended hesitations followed by rapid virtual mouse clicks', score: 30, sev: 'CRITICAL' },
          { type: 'SESSION_DURATION', desc: '18-minute idle window followed by sudden transfer attempt', score: 24, sev: 'HIGH' },
          { type: 'FIELD_CORRECTIONS', desc: 'Multiple field deletion loops under phone coercion', score: 22, sev: 'HIGH' },
        ],
      },
    };

    const config = scenarioConfigs[scenarioType] || scenarioConfigs.ACCOUNT_TAKEOVER;
    const totalScore = Math.min(100, config.signals.reduce((acc, s) => acc + s.score, 10));

    const newSession = await prisma.session.create({
      data: {
        sessionId: sessionCode,
        customerReference: custRef,
        riskScore: totalScore,
        riskTier: totalScore >= 80 ? 'CRITICAL' : 'HIGH',
        identityStatus: 'SUSPICIOUS',
        behavioralStatus: 'ANOMALOUS',
        transactionStatus: 'ELEVATED',
        topSignal: config.topSignal,
        recommendation: config.rec,
        status: 'NEW',
      },
    });

    // Add signals
    for (const sig of config.signals) {
      await prisma.behavioralSignal.create({
        data: {
          sessionId: newSession.id,
          signalType: sig.type,
          description: sig.desc,
          scoreContribution: sig.score,
          severity: sig.sev,
        },
      });
    }

    await createAuditLog({
      userId: req.user?.id,
      userName: req.user?.name || 'Simulator',
      userRole: req.user?.role || 'SYSTEM',
      action: `SIMULATED_ATTACK_${scenarioType}`,
      entityType: 'Session',
      entityId: sessionCode,
      metadata: { riskScore: totalScore, scenarioType },
    });

    const fullSession = await prisma.session.findUnique({
      where: { id: newSession.id },
      include: {
        signals: { orderBy: { scoreContribution: 'desc' } },
      },
    });

    // Broadcast Real-time Server-Sent Event to all active clients!
    broadcastSSE('FRAUD_ATTACK_SIMULATED', {
      session: fullSession,
      timestamp: new Date().toISOString(),
      scenarioType,
    });

    return res.status(201).json({
      success: true,
      data: fullSession,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}


