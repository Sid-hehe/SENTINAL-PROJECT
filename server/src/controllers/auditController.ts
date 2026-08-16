import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { safeJsonParse, sanitizeSearchQuery } from '../utils/json.js';

export async function getAuditLogs(req: AuthRequest, res: Response) {
  try {
    const { action, entityType, search } = req.query;

    const where: any = {};
    if (action) where.action = { contains: action as string };
    if (entityType) where.entityType = entityType as string;

    const q = sanitizeSearchQuery(search, 100);
    if (q) {
      where.OR = [
        { action: { contains: q } },
        { entityType: { contains: q } },
        { entityId: { contains: q } },
        { metadata: { contains: q } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    const formatted = logs.map((log) => ({
      ...log,
      metadata: safeJsonParse<any>(log.metadata, null),
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
