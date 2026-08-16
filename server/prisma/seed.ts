import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Sentinel Database Seeding...');

  // Clean existing tables
  await prisma.auditLog.deleteMany();
  await prisma.caseNote.deleteMany();
  await prisma.behavioralSignal.deleteMany();
  await prisma.session.deleteMany();
  await prisma.suspiciousReport.deleteMany();
  await prisma.scamPattern.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('SentinelDemo123!', 10);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Sentinel Chief Admin',
      email: 'admin@sentinel.demo',
      passwordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const analyst1 = await prisma.user.create({
    data: {
      name: 'Alex Vance (Lead Analyst)',
      email: 'analyst@sentinel.demo',
      passwordHash,
      role: 'ANALYST',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const analyst2 = await prisma.user.create({
    data: {
      name: 'Sarah Chen (Fraud Specialist)',
      email: 'sarah.chen@sentinel.demo',
      passwordHash,
      role: 'ANALYST',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'David Miller',
      email: 'user@sentinel.demo',
      passwordHash,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@sentinel.demo',
      passwordHash,
      role: 'USER',
    },
  });

  console.log('✅ Created Demo Users (Admin, 2 Analysts, 2 Public Users)');

  // 2. Create 15 Scam Patterns
  const scamPatternsData = [
    {
      title: 'Device-Switching Session Hijack',
      slug: 'device-switching-session-hijack',
      description: 'Attacker takes over an active web session from a different physical device or proxy without re-authenticating.',
      detailedDescription: 'The user initiates onboarding or banking login on a known mobile device, but midway through the flow, sensitive actions (e.g., wire transfer, password reset) originate from an unrecognized browser fingerprint with rapid IP changes.',
      fraudType: 'ACCOUNT_TAKEOVER' as const,
      riskTier: 'CRITICAL' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Mid-session user-agent jump from Mobile Safari to Desktop Linux Chrome',
        'Sub-second IP geolocation shift across international boundaries',
        'Sudden clipboard paste of 16-digit account credentials',
        'Zero mouse movement trajectory leading directly to submit button',
      ]),
      firstIdentified: 'Jan 2024',
      lastSeen: 'Active Today',
      protectionTips: JSON.stringify([
        'Enforce device binding and TLS fingerprint matching during high-value actions',
        'Trigger step-up biometric or passkey re-authentication upon device fingerprint drift',
      ]),
      exampleRiskScore: 88,
    },
    {
      title: 'Automated Form Speed-Running',
      slug: 'automated-form-speed-running',
      description: 'Bot or human fraudster pasting pre-crafted stolen identity payloads into application forms in under 3 seconds.',
      detailedDescription: 'Legitimate humans take between 45 to 120 seconds to complete identity onboarding. Automated script runners fill multi-page identity applications programmatically with uniform typing cadences under 400 milliseconds.',
      fraudType: 'ONBOARDING_FRAUD' as const,
      riskTier: 'HIGH' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Completion time under 5 seconds for a 12-field form',
        'Identical keystroke delay (0ms variance) across all input fields',
        'Absence of backspace, cursor movement, or correction pauses',
      ]),
      firstIdentified: 'Nov 2023',
      lastSeen: 'Active Today',
      protectionTips: JSON.stringify([
        'Analyze typing cadence micro-variations and keyup/keydown timing distribution',
        'Use invisible behavioral bot detection rather than intrusive CAPTCHAs',
      ]),
      exampleRiskScore: 82,
    },
    {
      title: 'Social Engineering Remote Access Takeover',
      slug: 'social-engineering-remote-access-takeover',
      description: 'Victom coerced by phone scammer into logging in via remote desktop tools (AnyDesk/TeamViewer).',
      detailedDescription: 'A victim is guided by a phone scammer to perform money transfers. The session shows long idle pauses followed by sudden rapid movements controlled via virtual mouse drivers, with frequent field deletions and re-types.',
      fraudType: 'SOCIAL_ENGINEERING' as const,
      riskTier: 'CRITICAL' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Extended hesitations (15s+) before clicking high-value transfer buttons',
        'Synthetic mouse movement inputs indicative of virtual desktop hooks',
        'Simultaneous active voice call background audio indicators',
      ]),
      firstIdentified: 'Feb 2024',
      lastSeen: '2 days ago',
      protectionTips: JSON.stringify([
        'Display prominent voice-call warning banners when unexpected remote administration tools are detected',
        'Delay high-value outgoing transfers when abnormal hesitation patterns occur',
      ]),
      exampleRiskScore: 91,
    },
    {
      title: 'Synthetic Identity Creation Ring',
      slug: 'synthetic-identity-creation-ring',
      description: 'Fraudsters combining real SSNs with fabricated names and addresses during credit application onboarding.',
      detailedDescription: 'Organized fraud syndicates submit batches of synthetic identities. Behavioral signals reveal identical browser canvas hashes, repeated copy-paste behaviors across multiple distinct user profiles, and synchronized application timing.',
      fraudType: 'IDENTITY_THEFT' as const,
      riskTier: 'CRITICAL' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Same browser profile hash creating 10+ distinct account applications',
        'Identical navigation path flow with 0% divergence across accounts',
        'Repeated use of disposable burner email domains',
      ]),
      firstIdentified: 'Mar 2023',
      lastSeen: 'Active Today',
      protectionTips: JSON.stringify([
        'Cross-reference cross-session behavioral signatures across distinct account signups',
        'Correlate device telemetry across synthetic identity batches',
      ]),
      exampleRiskScore: 95,
    },
    {
      title: 'Velocity Cash-Out Transfer Spikes',
      slug: 'velocity-cash-out-transfer-spikes',
      description: 'Unusual rapid sequence of peer-to-peer transfers immediately following account credential update.',
      detailedDescription: 'Immediately after changing email address or telephone number, an account initiates maximum limit transfers to newly created unverified payees within a 120-second window.',
      fraudType: 'TRANSACTION_FRAUD' as const,
      riskTier: 'HIGH' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Profile security modification immediately preceding payment initiation',
        '3+ outgoing transfers to new payees in under 3 minutes',
        'Bypassing typical browsing/dashboard viewing behavior straight to transfer URL',
      ]),
      firstIdentified: 'Oct 2023',
      lastSeen: 'Yesterday',
      protectionTips: JSON.stringify([
        'Enforce 24-hour cooling off period on new payees following profile changes',
        'Flag velocity anomalies exceeding 300% of historical user baseline',
      ]),
      exampleRiskScore: 78,
    },
    {
      title: 'Credential Stuffing Bot Attack',
      slug: 'credential-stuffing-bot-attack',
      description: 'Automated testing of leaked username/password combos against customer login endpoint.',
      detailedDescription: 'Bots attempt thousands of logins per minute using rotating residential proxies. Key signals include exact failure timing, headless browser signatures, and zero human mouse jitter.',
      fraudType: 'DEVICE_FRAUD' as const,
      riskTier: 'MEDIUM' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'High ratio of failed logins from distinct IP addresses pointing to single account',
        'Missing WebGL/AudioContext rendering features in browser fingerprint',
        'Exact 1000ms retry interval execution',
      ]),
      firstIdentified: 'Jan 2022',
      lastSeen: 'Active Today',
      protectionTips: JSON.stringify([
        'Rate limit login endpoints using IP reputation and behavioral risk threshold',
        'Require multi-factor authentication on unverified login devices',
      ]),
      exampleRiskScore: 58,
    },
    {
      title: 'SIM Swap Account Takeover',
      slug: 'sim-swap-account-takeover',
      description: 'Attacker intercepts SMS OTP after hijacking customer mobile number via mobile carrier scam.',
      detailedDescription: 'The attacker inputs correct SMS OTP codes instantly, but behavioral metrics show a completely unfamiliar device fingerprint, new geographic region, and instantaneous copy-paste OTP submission.',
      fraudType: 'ACCOUNT_TAKEOVER' as const,
      riskTier: 'CRITICAL' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Instantaneous paste of SMS OTP in < 200ms after dispatch',
        'New device fingerprint combined with novel AS/ISP provider',
        'Immediate navigation to account settings/fund transfer',
      ]),
      firstIdentified: 'Aug 2023',
      lastSeen: '3 days ago',
      protectionTips: JSON.stringify([
        'Prefer TOTP app authenticators or FIDO2 WebAuthn keys over SMS',
        'Verify SIM swap status with mobile carriers before sending sensitive OTPs',
      ]),
      exampleRiskScore: 89,
    },
    {
      title: 'Phishing Reverse Proxy Man-in-the-Middle',
      slug: 'phishing-reverse-proxy-mitm',
      description: 'Live proxy toolkits (Evilginx2) transparently capturing session cookies during login.',
      detailedDescription: 'Victim logs into a fake domain hosting a real-time proxy. The attacker steals session tokens and reuses them from a different geographic location while the original user session remains active.',
      fraudType: 'SOCIAL_ENGINEERING' as const,
      riskTier: 'HIGH' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Dual concurrent session activity from different TLS fingerprints',
        'Referrer header pointing to lookalike phishing domains',
        'Unusual request header ordering characteristic of automated proxy software',
      ]),
      firstIdentified: 'Dec 2023',
      lastSeen: 'Active Today',
      protectionTips: JSON.stringify([
        'Implement WebAuthn domain-bound authentication keys',
        'Monitor active session token geolocation jump anomalies',
      ]),
      exampleRiskScore: 76,
    },
    {
      title: 'Ghost Fingerprint Emulator Farm',
      slug: 'ghost-fingerprint-emulator-farm',
      description: 'Emulated mobile Android/iOS environments mimicking thousands of distinct mobile hardware IDs.',
      detailedDescription: 'Fraud farms use tools like Anti-Detect browser or Android emulators. Detailed sensor data reveals static accelerometer readings, zero battery discharge curves, and artificial canvas rendering.',
      fraudType: 'DEVICE_FRAUD' as const,
      riskTier: 'HIGH' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Static sensor/gyroscope data (0.000 variance)',
        'Inconsistent screen resolution vs hardware platform report',
        'Spoofed WebGL vendor strings',
      ]),
      firstIdentified: 'May 2023',
      lastSeen: '5 days ago',
      protectionTips: JSON.stringify([
        'Verify native device attestation (App Attest / Play Integrity API)',
        'Check for missing physical hardware sensor inputs',
      ]),
      exampleRiskScore: 68,
    },
    {
      title: 'Merchant Mule Refund Scam',
      slug: 'merchant-mule-refund-scam',
      description: 'Collusion between rogue merchant and buyer to generate fraudulent chargebacks and refund loops.',
      detailedDescription: 'Behavioral analysis shows buyers systematically purchasing items and immediately triggering refund requests via scripted navigation paths, with shared IP networks among buyers and merchants.',
      fraudType: 'TRANSACTION_FRAUD' as const,
      riskTier: 'MEDIUM' as const,
      status: 'HISTORICAL' as const,
      behavioralRedFlags: JSON.stringify([
        'Near 100% refund request rate within 10 minutes of checkout',
        'Shared IP/AS subnet between buyer accounts and merchant administrative accounts',
      ]),
      firstIdentified: 'Jan 2023',
      lastSeen: '1 month ago',
      protectionTips: JSON.stringify([
        'Correlate buyer and seller network topology and device fingerprints',
      ]),
      exampleRiskScore: 52,
    },
    {
      title: 'Session Replay Tampering',
      slug: 'session-replay-tampering',
      description: 'Replaying previously valid HTTP requests with modified monetary payloads.',
      detailedDescription: 'Attacker intercepts client-side payload submission and alters transaction amounts or beneficiary details before sending to server endpoints.',
      fraudType: 'TRANSACTION_FRAUD' as const,
      riskTier: 'HIGH' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Discrepancy between UI input interaction events and server request parameters',
        'Missing expected keystroke logs corresponding to modified payload fields',
      ]),
      firstIdentified: 'Sep 2023',
      lastSeen: 'Active Today',
      protectionTips: JSON.stringify([
        'Implement server-side HMAC validation of client behavioral telemetry',
      ]),
      exampleRiskScore: 74,
    },
    {
      title: 'Behavioral Copy-Paste Identity Theft',
      slug: 'behavioral-copy-paste-identity-theft',
      description: 'Fraudster pasting stolen identity data (Name, SSN, DOB) from external text document into form.',
      detailedDescription: 'Legitimate users type their own name and SSN from memory with characteristic rhythm. Fraudsters copy-paste all 5 sensitive identity fields sequentially without keypress events.',
      fraudType: 'IDENTITY_THEFT' as const,
      riskTier: 'MEDIUM' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        '100% paste input ratio across Name, SSN, DOB, and Address',
        'Sub-second field switching without tab or mouse focus delay',
      ]),
      firstIdentified: 'Jul 2023',
      lastSeen: 'Active Today',
      protectionTips: JSON.stringify([
        'Monitor paste ratios on high-friction identity fields',
      ]),
      exampleRiskScore: 48,
    },
    {
      title: 'Password Reset Hijack Loop',
      slug: 'password-reset-hijack-loop',
      description: 'Requesting password resets repeatedly to exhaust rate limits and force fallback verification.',
      detailedDescription: 'Attacker floods password reset endpoints to trigger account lockout, then contacts customer support pretending to be the victim needing emergency unlock.',
      fraudType: 'ACCOUNT_TAKEOVER' as const,
      riskTier: 'MEDIUM' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        '10+ password reset requests in 5 minutes',
        'Immediate customer service chat initiation after lockout',
      ]),
      firstIdentified: 'Jun 2023',
      lastSeen: '4 days ago',
      protectionTips: JSON.stringify([
        'Enforce strict behavioral verification before manual customer support overrides',
      ]),
      exampleRiskScore: 42,
    },
    {
      title: 'Micro-Deposit Verification Harvesting',
      slug: 'micro-deposit-verification-harvesting',
      description: 'Linking fraudulent bank accounts using scriptable micro-deposit testing.',
      detailedDescription: 'Automated scripts link multiple bank accounts using trial deposits, systematically testing valid routing numbers.',
      fraudType: 'TRANSACTION_FRAUD' as const,
      riskTier: 'LOW' as const,
      status: 'HISTORICAL' as const,
      behavioralRedFlags: JSON.stringify([
        'Multiple bank account linking attempts per hour',
        'Automated micro-amount input guesses',
      ]),
      firstIdentified: 'Feb 2023',
      lastSeen: '2 months ago',
      protectionTips: JSON.stringify([
        'Require instant open-banking API verification instead of micro-deposits',
      ]),
      exampleRiskScore: 28,
    },
    {
      title: 'Profile Settings Reconnaissance',
      slug: 'profile-settings-reconnaissance',
      description: 'Attacker testing account limits and privacy settings prior to launching major fraud action.',
      detailedDescription: 'Before stealing funds, attacker meticulously navigates profile settings, changing notification emails to muted folders and inspecting daily transaction limits.',
      fraudType: 'ACCOUNT_TAKEOVER' as const,
      riskTier: 'LOW' as const,
      status: 'ACTIVE' as const,
      behavioralRedFlags: JSON.stringify([
        'Unusual focus on notification settings and transfer limit pages',
        'Disabling security alerts prior to transaction attempt',
      ]),
      firstIdentified: 'Nov 2023',
      lastSeen: 'Yesterday',
      protectionTips: JSON.stringify([
        'Require step-up authentication when modifying security notification preferences',
      ]),
      exampleRiskScore: 25,
    },
  ];

  for (const scamData of scamPatternsData) {
    await prisma.scamPattern.create({ data: scamData });
  }

  console.log('✅ Created 15 Scam Patterns');

  // 3. Create Suspicious Sessions (30 sessions) including #48291
  const session48291 = await prisma.session.create({
    data: {
      sessionId: '#48291',
      customerReference: 'CUS•••719',
      riskScore: 87,
      riskTier: 'CRITICAL',
      identityStatus: 'VERIFIED',
      behavioralStatus: 'ANOMALOUS',
      transactionStatus: 'ELEVATED',
      topSignal: 'Device Switching',
      recommendation: 'ROUTE TO HUMAN REVIEW BEFORE FINAL APPROVAL. High-risk behavioral anomaly detected (Device switching + velocity spikes).',
      status: 'NEW',
    },
  });

  // Add signals for #48291
  await prisma.behavioralSignal.createMany({
    data: [
      {
        sessionId: session48291.id,
        signalType: 'DEVICE_SWITCH',
        description: 'Mid-session user-agent jump from iOS Safari to Linux Chrome',
        scoreContribution: 24,
        severity: 'CRITICAL',
        metadata: JSON.stringify({ oldDevice: 'iOS Safari 17.2', newDevice: 'Linux Chrome 121.0' }),
      },
      {
        sessionId: session48291.id,
        signalType: 'TRANSACTION_VELOCITY',
        description: '3 outgoing high-value transfer attempts in under 2 minutes',
        scoreContribution: 20,
        severity: 'CRITICAL',
        metadata: JSON.stringify({ velocityRatio: '350% above baseline', amount: '$14,500' }),
      },
      {
        sessionId: session48291.id,
        signalType: 'FAST_COMPLETION',
        description: 'Completed 8-field payment authorization in 4.1s (human baseline: 45s)',
        scoreContribution: 18,
        severity: 'HIGH',
        metadata: JSON.stringify({ completionTimeMs: 4100, medianHumanMs: 45000 }),
      },
      {
        sessionId: session48291.id,
        signalType: 'NAVIGATION_ANOMALY',
        description: 'Direct URL jump to wire transfer bypassing standard dashboard menu',
        scoreContribution: 15,
        severity: 'HIGH',
        metadata: JSON.stringify({ entryPoint: '/checkout/wire-transfer-direct' }),
      },
      {
        sessionId: session48291.id,
        signalType: 'FIELD_CORRECTIONS',
        description: '100% paste ratio with 0 backspace key events across sensitive fields',
        scoreContribution: 10,
        severity: 'MEDIUM',
        metadata: JSON.stringify({ pasteRatio: '1.00', backspaceCount: 0 }),
      },
    ],
  });

  // Create additional 29 sessions with realistic signals
  const sessionTemplates = [
    {
      sessionId: '#48292',
      customerReference: 'CUS•••831',
      riskScore: 74,
      riskTier: 'HIGH' as const,
      identityStatus: 'SUSPICIOUS',
      behavioralStatus: 'ANOMALOUS',
      transactionStatus: 'NORMAL',
      topSignal: 'Fast Completion',
      recommendation: 'Request secondary biometric identity check.',
      status: 'IN_REVIEW' as const,
      signals: [
        { type: 'FAST_COMPLETION', desc: 'Form submitted in 3.2 seconds', score: 28, sev: 'HIGH' as const },
        { type: 'FIELD_CORRECTIONS', desc: 'All fields pasted from clipboard', score: 22, sev: 'HIGH' as const },
        { type: 'TYPING_CADENCE', desc: 'Zero timing jitter between keystrokes', score: 24, sev: 'HIGH' as const },
      ],
    },
    {
      sessionId: '#48293',
      customerReference: 'CUS•••412',
      riskScore: 22,
      riskTier: 'LOW' as const,
      identityStatus: 'VERIFIED',
      behavioralStatus: 'NORMAL',
      transactionStatus: 'NORMAL',
      topSignal: 'Normal Session Activity',
      recommendation: 'Auto-approve transaction. Standard monitoring active.',
      status: 'CONFIRMED_LEGITIMATE' as const,
      signals: [
        { type: 'SESSION_DURATION', desc: 'Natural session duration of 3m 45s', score: 10, sev: 'LOW' as const },
        { type: 'TYPING_CADENCE', desc: 'Human typing variance verified (120ms avg)', score: 12, sev: 'LOW' as const },
      ],
    },
    {
      sessionId: '#48294',
      customerReference: 'CUS•••904',
      riskScore: 92,
      riskTier: 'CRITICAL' as const,
      identityStatus: 'UNVERIFIED',
      behavioralStatus: 'HIGH_RISK',
      transactionStatus: 'ANOMALOUS',
      topSignal: 'Login Timing Anomaly',
      recommendation: 'ROUTE TO HUMAN REVIEW. Multi-factor authentication failed 3 times.',
      status: 'CONFIRMED_FRAUD' as const,
      signals: [
        { type: 'LOGIN_TIMING', desc: 'Login attempt at 03:14 AM from novel geography', score: 32, sev: 'CRITICAL' as const },
        { type: 'DEVICE_SWITCH', desc: 'Unregistered Windows PC with headless browser headers', score: 30, sev: 'CRITICAL' as const },
        { type: 'TRANSACTION_VELOCITY', desc: 'Maximum limit wire transfer initiated immediately', score: 30, sev: 'CRITICAL' as const },
      ],
    },
    {
      sessionId: '#48295',
      customerReference: 'CUS•••158',
      riskScore: 65,
      riskTier: 'HIGH' as const,
      identityStatus: 'VERIFIED',
      behavioralStatus: 'ANOMALOUS',
      transactionStatus: 'ELEVATED',
      topSignal: 'Profile Change',
      recommendation: 'Hold transfer until phone verification completed.',
      status: 'NEEDS_MORE_INFO' as const,
      signals: [
        { type: 'PROFILE_CHANGE', desc: 'Email address modified 4 minutes prior to transfer', score: 25, sev: 'HIGH' as const },
        { type: 'TRANSACTION_VELOCITY', desc: 'First P2P payment to newly added beneficiary', score: 22, sev: 'HIGH' as const },
        { type: 'NAVIGATION_ANOMALY', desc: 'Rapid tab switching between security settings and payments', score: 18, sev: 'MEDIUM' as const },
      ],
    },
  ];

  // Generate 25 more random realistic sessions
  for (let i = 6; i <= 30; i++) {
    const idNum = 48290 + i;
    const sessionCode = `#${idNum}`;
    const custRef = `CUS•••${Math.floor(100 + Math.random() * 900)}`;
    const score = Math.floor(15 + Math.random() * 80);
    
    let tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 80) tier = 'CRITICAL';
    else if (score >= 60) tier = 'HIGH';
    else if (score >= 30) tier = 'MEDIUM';

    let status: 'NEW' | 'IN_REVIEW' | 'CONFIRMED_FRAUD' | 'CONFIRMED_LEGITIMATE' | 'NEEDS_MORE_INFO' = 'NEW';
    if (i % 5 === 0) status = 'CONFIRMED_FRAUD';
    else if (i % 4 === 0) status = 'CONFIRMED_LEGITIMATE';
    else if (i % 3 === 0) status = 'IN_REVIEW';

    const signalsList = [
      'DEVICE_SWITCH',
      'FAST_COMPLETION',
      'FIELD_CORRECTIONS',
      'NAVIGATION_ANOMALY',
      'TYPING_CADENCE',
      'LOGIN_TIMING',
      'TRANSACTION_VELOCITY',
    ] as const;

    const mainSig = signalsList[i % signalsList.length];

    sessionTemplates.push({
      sessionId: sessionCode,
      customerReference: custRef,
      riskScore: score,
      riskTier: tier,
      identityStatus: score > 70 ? 'SUSPICIOUS' : 'VERIFIED',
      behavioralStatus: score > 60 ? 'ANOMALOUS' : 'NORMAL',
      transactionStatus: score > 75 ? 'ANOMALOUS' : score > 40 ? 'ELEVATED' : 'NORMAL',
      topSignal: mainSig.replace(/_/g, ' '),
      recommendation: tier === 'CRITICAL' ? 'Route to fraud analyst for immediate intervention.' : 'Standard automated rule checks.',
      status,
      signals: [
        { type: mainSig, desc: `Detected anomalous ${mainSig.toLowerCase()} behavior`, score: Math.floor(score * 0.4), sev: tier },
        { type: 'FIELD_CORRECTIONS', desc: 'Multiple field focus and editing loops', score: Math.floor(score * 0.3), sev: tier },
      ],
    });
  }

  for (const s of sessionTemplates) {
    const createdSession = await prisma.session.create({
      data: {
        sessionId: s.sessionId,
        customerReference: s.customerReference,
        riskScore: s.riskScore,
        riskTier: s.riskTier,
        identityStatus: s.identityStatus,
        behavioralStatus: s.behavioralStatus,
        transactionStatus: s.transactionStatus,
        topSignal: s.topSignal,
        recommendation: s.recommendation,
        status: s.status,
      },
    });

    for (const sig of s.signals) {
      await prisma.behavioralSignal.create({
        data: {
          sessionId: createdSession.id,
          signalType: sig.type as any,
          description: sig.desc,
          scoreContribution: sig.score,
          severity: sig.sev,
        },
      });
    }
  }

  console.log('✅ Created 30 Suspicious Sessions with 100+ Behavioral Signals');

  // 4. Create Public Reports (8 reports)
  const publicReportsData = [
    {
      reporterName: 'Marcus Brody',
      reporterEmail: 'marcus.brody@example.com',
      fraudType: 'DEVICE_FRAUD' as const,
      description: 'I noticed an unauthorized login alert from a Linux computer in Frankfurt while I was at work in Chicago. My password was changed immediately after.',
      suspectedPattern: 'Device-Switching Session Hijack',
      evidence: 'Screenshot of IP alert email showing IP 185.220.101.5',
      status: 'CONFIRMED' as const,
    },
    {
      reporterName: 'Elena Rostova',
      reporterEmail: 'elena.r@example.org',
      fraudType: 'SOCIAL_ENGINEERING' as const,
      description: 'Received a phone call claiming to be bank fraud prevention asking me to download AnyDesk and log into my online banking portal.',
      suspectedPattern: 'Social Engineering Remote Access Takeover',
      evidence: 'Phone number +1 (800) 555-0199 call log record',
      status: 'UNDER_REVIEW' as const,
    },
    {
      reporterName: 'Carlos Santana',
      reporterEmail: 'carlos.s@example.net',
      fraudType: 'ACCOUNT_TAKEOVER' as const,
      description: 'My cellular service suddenly lost signal. 30 minutes later, my online bank account had 2 wire transfers completed to unknown recipients.',
      suspectedPattern: 'SIM Swap Account Takeover',
      evidence: 'Carrier SIM swap confirmation SMS receipt',
      status: 'CONFIRMED' as const,
    },
    {
      reporterName: 'Amanda Palmer',
      reporterEmail: 'amanda.p@example.com',
      fraudType: 'ONBOARDING_FRAUD' as const,
      description: 'Received a tax document for a loan application I never submitted. Someone used my SSN and address.',
      suspectedPattern: 'Synthetic Identity Creation Ring',
      evidence: 'Form 1099-C received in mail',
      status: 'UNDER_REVIEW' as const,
    },
    {
      reporterName: 'Kevin Flynn',
      reporterEmail: 'kflynn@example.io',
      fraudType: 'TRANSACTION_FRAUD' as const,
      description: 'Phishing website copied the exact login layout of Sentinel demo portal and prompted for token passcode.',
      suspectedPattern: 'Phishing Reverse Proxy Man-in-the-Middle',
      evidence: 'URL: https://sentinel-security-verify.com',
      status: 'NEW' as const,
    },
    {
      reporterName: 'Rachel Green',
      reporterEmail: 'rachel.g@example.com',
      fraudType: 'IDENTITY_THEFT' as const,
      description: 'Unauthorized credit inquiry recorded on my credit report from a fintech onboarding provider.',
      suspectedPattern: 'Synthetic Identity Creation Ring',
      evidence: 'Credit bureau alert screenshot',
      status: 'NEW' as const,
    },
    {
      reporterName: 'Liam Neeson',
      reporterEmail: 'liam.n@example.com',
      fraudType: 'TRANSACTION_FRAUD' as const,
      description: 'Rapid series of $499 micro-charges appeared on card within 120 seconds.',
      suspectedPattern: 'Velocity Cash-Out Transfer Spikes',
      evidence: 'Bank statement line items',
      status: 'DISMISSED' as const,
    },
    {
      reporterName: 'Sophia Loren',
      reporterEmail: 'sophia.l@example.org',
      fraudType: 'DEVICE_FRAUD' as const,
      description: 'Suspicious email asking to re-verify device credentials via embedded link.',
      suspectedPattern: 'Phishing Reverse Proxy Man-in-the-Middle',
      evidence: 'Raw email headers attached',
      status: 'NEW' as const,
    },
  ];

  for (const reportData of publicReportsData) {
    await prisma.suspiciousReport.create({ data: reportData });
  }

  console.log('✅ Created 8 Public Suspicious Reports');

  // 5. Add Case Notes for #48291
  await prisma.caseNote.create({
    data: {
      sessionId: session48291.id,
      authorId: analyst1.id,
      content: 'Initial automated score 87 (CRITICAL). User switching from iOS Safari to Linux Chrome with instantaneous clipboard paste of wire transfer details.',
    },
  });

  await prisma.caseNote.create({
    data: {
      sessionId: session48291.id,
      authorId: analyst2.id,
      content: 'Cross-referenced device fingerprint with known proxy exit nodes. Confirmed high probability of automated session hijacking. Recommending fraud confirmation.',
    },
  });

  console.log('✅ Created Analyst Case Notes');

  // 6. Create Initial Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'System',
      metadata: JSON.stringify({ version: '1.0.0', environment: 'production-demo' }),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: analyst1.id,
      action: 'CASE_REVIEW_STARTED',
      entityType: 'Session',
      entityId: '#48291',
      metadata: JSON.stringify({ initialStatus: 'NEW' }),
    },
  });

  console.log('✅ Created Initial Audit Logs');
  console.log('🎉 Sentinel Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
