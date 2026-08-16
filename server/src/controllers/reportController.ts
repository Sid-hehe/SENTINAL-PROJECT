import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { createAuditLog } from '../utils/auditLogger.js';

const reportSchema = z.object({
  reporterName: z.string().min(2, 'Name must be at least 2 characters'),
  reporterEmail: z.string().email('Invalid email address'),
  fraudType: z.enum([
    'IDENTITY_THEFT',
    'ONBOARDING_FRAUD',
    'ACCOUNT_TAKEOVER',
    'SOCIAL_ENGINEERING',
    'DEVICE_FRAUD',
    'TRANSACTION_FRAUD',
  ]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  suspectedPattern: z.string().optional(),
  evidence: z.string().optional(),
});

export async function submitReport(req: Request, res: Response) {
  try {
    const parseResult = reportSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parseResult.error.errors[0].message,
        },
      });
    }

    const data = parseResult.data;

    const report = await prisma.suspiciousReport.create({
      data: {
        reporterName: data.reporterName,
        reporterEmail: data.reporterEmail,
        fraudType: data.fraudType,
        description: data.description,
        suspectedPattern: data.suspectedPattern || null,
        evidence: data.evidence || null,
        status: 'NEW',
      },
    });

    await createAuditLog({
      action: 'PUBLIC_REPORT_SUBMITTED',
      entityType: 'SuspiciousReport',
      entityId: report.id,
      metadata: { reporterEmail: report.reporterEmail, fraudType: report.fraudType },
    });

    return res.status(201).json({
      success: true,
      data: {
        report,
        message: 'Report submitted successfully. Our fraud review team will assess the information.',
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function getReports(req: AuthRequest, res: Response) {
  try {
    const { status, fraudType } = req.query;

    const where: any = {};
    if (status && status !== 'ALL') where.status = status as string;
    if (fraudType && fraudType !== 'ALL') where.fraudType = fraudType as string;

    const reports = await prisma.suspiciousReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: reports,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function getReportById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const report = await prisma.suspiciousReport.findUnique({
      where: { id },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Report not found' },
      });
    }

    return res.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}

export async function updateReportStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['NEW', 'UNDER_REVIEW', 'CONFIRMED', 'DISMISSED'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Invalid status value' },
      });
    }

    const report = await prisma.suspiciousReport.update({
      where: { id },
      data: { status },
    });

    await createAuditLog({
      userId: req.user?.id,
      userName: req.user?.name,
      userRole: req.user?.role,
      action: `REPORT_STATUS_UPDATED_${status}`,
      entityType: 'SuspiciousReport',
      entityId: id,
      metadata: { newStatus: status },
    });

    return res.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}
