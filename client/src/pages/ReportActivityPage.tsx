import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HeaderAlertBanner } from '../components/common/HeaderAlertBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { reportApi } from '../api/reportApi';
import { useToast } from '../context/ToastContext';
import { AlertOctagon, Send, CheckCircle2, Shield, Lock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

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

type ReportFormValues = z.infer<typeof reportSchema>;

export const ReportActivityPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      fraudType: 'ACCOUNT_TAKEOVER',
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    setSubmitting(true);
    try {
      const res = await reportApi.submitReport(data);
      if (res.success) {
        setSubmitted(true);
        reset();
        toast.success(
          'Report Submitted Successfully',
          'Our fraud intelligence team has received your incident report.'
        );
      } else {
        toast.error('Submission Failed', res.error?.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0D] text-[#F5F7FA] flex flex-col font-sans">
      <HeaderAlertBanner />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase px-3 py-1 rounded bg-red-950/60 border border-red-800/40">
            Public Incident Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Report Suspicious Activity
          </h1>
          <p className="text-gray-400 text-sm font-sans">
            Help Sentinel analysts investigate potential scam patterns, unauthorized logins, or impersonation attempts.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyber-card p-8 rounded-2xl border-emerald-500/40 text-center space-y-4 max-w-xl mx-auto shadow-glow-green"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-white font-mono">Report Submitted Successfully</h2>
            <blockquote className="text-emerald-200 font-mono text-xs p-3 rounded bg-[#0B0D10] border border-emerald-900/40">
              "Report submitted successfully. Our fraud review team will assess the information."
            </blockquote>

            <p className="text-gray-300 text-xs font-sans leading-relaxed">
              Your submission has been securely written to Sentinel PostgreSQL database with a unique incident tracking reference.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-mono font-semibold text-xs transition-colors"
            >
              Submit Another Report
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="cyber-card p-6 sm:p-8 rounded-2xl border-[#1E2631] space-y-6 font-mono text-xs shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-[#1E2631] pb-3 text-red-400">
              <AlertOctagon className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider text-sm">Suspicious Incident Form</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Reporter Name */}
              <div className="space-y-1">
                <label className="text-gray-300 block font-semibold">Your Full Name *</label>
                <input
                  type="text"
                  {...register('reporterName')}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans"
                />
                {errors.reporterName && (
                  <span className="text-red-400 text-[11px]">{errors.reporterName.message}</span>
                )}
              </div>

              {/* Reporter Email */}
              <div className="space-y-1">
                <label className="text-gray-300 block font-semibold">Contact Email Address *</label>
                <input
                  type="email"
                  {...register('reporterEmail')}
                  placeholder="s.jenkins@example.com"
                  className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans"
                />
                {errors.reporterEmail && (
                  <span className="text-red-400 text-[11px]">{errors.reporterEmail.message}</span>
                )}
              </div>
            </div>

            {/* Fraud Type */}
            <div className="space-y-1">
              <label className="text-gray-300 block font-semibold">Fraud Typology Category *</label>
              <select
                {...register('fraudType')}
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-red-500"
              >
                <option value="ACCOUNT_TAKEOVER">Account Takeover (Unauthorized Access / Password Reset)</option>
                <option value="ONBOARDING_FRAUD">Onboarding Fraud (Fake / Bot Identity Signup)</option>
                <option value="IDENTITY_THEFT">Identity Theft (Stolen SSN / Personal Data)</option>
                <option value="SOCIAL_ENGINEERING">Social Engineering / Phishing Call</option>
                <option value="DEVICE_FRAUD">Device Spoofing / Remote Access Scam</option>
                <option value="TRANSACTION_FRAUD">Unauthorized Transaction / Transfer Velocity</option>
              </select>
            </div>

            {/* Suspected Pattern */}
            <div className="space-y-1">
              <label className="text-gray-300 block font-semibold">Suspected Scam Pattern Title (Optional)</label>
              <input
                type="text"
                {...register('suspectedPattern')}
                placeholder="e.g. Device-Switching Session Hijack"
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-gray-300 block font-semibold">Incident Description *</label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Provide details of the suspicious behavior, timestamps, IP alerts, or unexpected account setting changes..."
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans leading-relaxed"
              ></textarea>
              {errors.description && (
                <span className="text-red-400 text-[11px]">{errors.description.message}</span>
              )}
            </div>

            {/* Evidence */}
            <div className="space-y-1">
              <label className="text-gray-300 block font-semibold">Evidence / Technical Context (Optional)</label>
              <textarea
                rows={2}
                {...register('evidence')}
                placeholder="Paste IP addresses, suspicious domain URLs, phone numbers, or email headers..."
                className="w-full bg-[#0B0D10] border border-[#1E2631] rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 font-sans"
              ></textarea>
            </div>

            {/* Trust Note */}
            <div className="p-3 rounded bg-[#0B0D10] border border-[#1E2631] text-[11px] text-gray-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Reports are encrypted and reviewed exclusively by authorized Sentinel fraud analysts.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-mono font-bold text-sm shadow-glow-red flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Report...' : 'Submit Incident Report'}</span>
            </button>
          </form>
        )}

      </main>

      <Footer />
    </div>
  );
};
