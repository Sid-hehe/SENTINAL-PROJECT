import { prisma } from './prisma.js';

export async function createAuditLog(params: {
  userId?: string;
  userName?: string;
  userRole?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        userName: params.userName || null,
        userRole: params.userRole || null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId || null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    console.error('[AUDIT ERROR] Failed to create audit log entry:', error, params);
  }
}
