import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { createAuditLog } from '../utils/auditLogger.js';
import { safeJsonParse, sanitizeSearchQuery } from '../utils/json.js';

export async function getScams(req: Request, res: Response) {
  try {
    const { search, riskTier, fraudType, status } = req.query;

    const where: any = {};

    if (riskTier && riskTier !== 'ALL') {
      where.riskTier = riskTier as string;
    }

    if (fraudType && fraudType !== 'ALL') {
      where.fraudType = fraudType as string;
    }

    if (status && status !== 'ALL') {
      where.status = status as string;
    }

    const q = sanitizeSearchQuery(search, 100);
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { detailedDescription: { contains: q } },
        { behavioralRedFlags: { contains: q } },
      ];
    }

    const scams = await prisma.scamPattern.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formatted = scams.map((scam) => ({
      ...scam,
      behavioralRedFlags: safeJsonParse<string[]>(scam.behavioralRedFlags, []),
      protectionTips: safeJsonParse<string[]>(scam.protectionTips, []),
    }));

    return res.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function getScamById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const scam = await prisma.scamPattern.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!scam) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Scam pattern not found' },
      });
    }

    return res.json({
      success: true,
      data: {
        ...scam,
        behavioralRedFlags: safeJsonParse<string[]>(scam.behavioralRedFlags, []),
        protectionTips: safeJsonParse<string[]>(scam.protectionTips, []),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

const scamSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  detailedDescription: z.string().min(10),
  fraudType: z.enum([
    'IDENTITY_THEFT',
    'ONBOARDING_FRAUD',
    'ACCOUNT_TAKEOVER',
    'SOCIAL_ENGINEERING',
    'DEVICE_FRAUD',
    'TRANSACTION_FRAUD',
  ]),
  riskTier: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  status: z.enum(['ACTIVE', 'HISTORICAL', 'UNDER_REVIEW']).default('ACTIVE'),
  behavioralRedFlags: z.array(z.string()).or(z.string()),
  firstIdentified: z.string().default('2024'),
  lastSeen: z.string().default('Active Now'),
  protectionTips: z.array(z.string()).or(z.string()),
  exampleRiskScore: z.number().min(0).max(100).default(75),
});

export async function createScam(req: AuthRequest, res: Response) {
  try {
    const parseResult = scamSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parseResult.error.errors[0].message },
      });
    }

    const data = parseResult.data;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const redFlags = Array.isArray(data.behavioralRedFlags)
      ? JSON.stringify(data.behavioralRedFlags)
      : data.behavioralRedFlags;
    const tips = Array.isArray(data.protectionTips)
      ? JSON.stringify(data.protectionTips)
      : data.protectionTips;

    const scam = await prisma.scamPattern.create({
      data: {
        title: data.title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        description: data.description,
        detailedDescription: data.detailedDescription,
        fraudType: data.fraudType,
        riskTier: data.riskTier,
        status: data.status,
        behavioralRedFlags: redFlags,
        firstIdentified: data.firstIdentified,
        lastSeen: data.lastSeen,
        protectionTips: tips,
        exampleRiskScore: data.exampleRiskScore,
      },
    });

    await createAuditLog({
      userId: req.user?.id,
      userName: req.user?.name,
      userRole: req.user?.role,
      action: 'SCAM_PATTERN_CREATED',
      entityType: 'ScamPattern',
      entityId: scam.id,
      metadata: { title: scam.title, riskTier: scam.riskTier },
    });

    return res.status(201).json({
      success: true,
      data: {
        ...scam,
        behavioralRedFlags: safeJsonParse<string[]>(scam.behavioralRedFlags, []),
        protectionTips: safeJsonParse<string[]>(scam.protectionTips, []),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function updateScam(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const existing = await prisma.scamPattern.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Scam pattern not found' },
      });
    }

    const { behavioralRedFlags, protectionTips, ...rest } = req.body;

    const updateData: any = { ...rest };
    if (behavioralRedFlags) {
      updateData.behavioralRedFlags = Array.isArray(behavioralRedFlags)
        ? JSON.stringify(behavioralRedFlags)
        : behavioralRedFlags;
    }

    if (protectionTips) {
      updateData.protectionTips = Array.isArray(protectionTips)
        ? JSON.stringify(protectionTips)
        : protectionTips;
    }

    const updated = await prisma.scamPattern.update({
      where: { id },
      data: updateData,
    });

    await createAuditLog({
      userId: req.user?.id,
      userName: req.user?.name,
      userRole: req.user?.role,
      action: 'SCAM_PATTERN_UPDATED',
      entityType: 'ScamPattern',
      entityId: updated.id,
    });

    return res.json({
      success: true,
      data: {
        ...updated,
        behavioralRedFlags: safeJsonParse<string[]>(updated.behavioralRedFlags, []),
        protectionTips: safeJsonParse<string[]>(updated.protectionTips, []),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function deleteScam(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const existing = await prisma.scamPattern.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Scam pattern not found' },
      });
    }

    await prisma.scamPattern.delete({ where: { id } });

    await createAuditLog({
      userId: req.user?.id,
      userName: req.user?.name,
      userRole: req.user?.role,
      action: 'SCAM_PATTERN_DELETED',
      entityType: 'ScamPattern',
      entityId: id,
    });

    return res.json({
      success: true,
      data: { message: 'Scam pattern deleted successfully' },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}
