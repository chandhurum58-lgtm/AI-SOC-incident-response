import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Server-side AI Security Copilot API Route
app.post('/api/copilot', async (req, res) => {
  try {
    const { prompt, activeIncident, currentStats } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 15) {
      try {
        const ai = new GoogleGenAI();
        const systemContext = `
You are the AI Security Copilot for AegisSOC, an enterprise Security Operations Center (SOC) incident response platform.
You assist Tier 1, Tier 2, and Tier 3 security analysts in diagnosing cyber threats, calculating risk, predicting kill-chain progression, and recommending containment playbooks based on NIST SP 800-61r2 and MITRE ATT&CK.

CURRENT SOC CONTEXT:
- Security Score: ${currentStats?.securityScore || 84}/100
- Active Threats: ${currentStats?.activeThreats || 13}
- Current Network Traffic: ${currentStats?.currentNetworkTrafficMbps || 842} MB/s
- Targeted Active Incident: ${activeIncident?.id || 'INC-8402'} (${activeIncident?.title || 'Credential Access & Password Spray'})
- Incident Severity: ${activeIncident?.severity || 'HIGH'}
- Adversary Source IP: ${activeIncident?.sourceIp || '198.51.100.23'}
- Targeted Asset: ${activeIncident?.targetAsset || 'Auth-Cluster-Alpha & alex.vance@enterprise.com'}
- MITRE Technique: ${activeIncident?.aiAnalysis?.attackClassification?.technique || 'Password Spraying (T1110.003)'}

CRITICAL GUIDELINES:
1. Distinguish between DETECTED, SUSPECTED, PREDICTED, CONFIRMED, and RESOLVED states.
2. Predictions must never be stated as confirmed breaches.
3. IP geolocation represents approximate network origin, not proof of an attacker's physical home or identity.
4. Recommend defense steps with clear justifications; highlight when actions are disruptive and require human approval.
5. Provide actionable, concise, formatted answers with markdown bullet points.
`;

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemContext}\n\nANALYST QUERY:\n${prompt}`,
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini API timeout')), 4000)
        );

        const result: any = await Promise.race([geminiPromise, timeoutPromise]);
        if (result && result.text) {
          return res.json({ answer: result.text });
        }
      } catch (genAiErr) {
        console.warn('Gemini generateContent fell back to local intelligence:', genAiErr);
      }
    }

    // High-quality structured fallback if GEMINI_API_KEY is unset in test environment
    const queryLower = (prompt || '').toLowerCase();
    let responseText = '';

    if (queryLower.includes('what happened') || queryLower.includes('happened')) {
      responseText = `### Incident Summary: ${activeIncident?.id || 'INC-8402'}\n- **Activity:** External host \`${activeIncident?.sourceIp || '198.51.100.23'}\` executed a password spray across 42 identities on \`${activeIncident?.targetAsset || 'Auth-Cluster-Alpha'}\`.\n- **Compromise:** Single success was recorded for user account \`alex.vance@enterprise.com\`.\n- **Corroboration:** Out-of-band communication with user Alex Vance confirmed they are in Seattle, WA and did not authenticate from Frankfurt.`;
    } else if (queryLower.includes('why') || queryLower.includes('suspicious')) {
      responseText = `### Detection Heuristics\n1. **Volumetric Anomaly:** 42 failed logins in 90 seconds (standard threshold is <2/hr).\n2. **BGP/ASN Inconsistency:** Traffic originated from Frankfurt, Germany (AS13335) whereas user baseline is Seattle, WA.\n3. **JA3 Fingerprint Discrepancy:** Client TLS handshake signature matches automated scripting frameworks rather than standard enterprise browsers.`;
    } else if (queryLower.includes('contain') || queryLower.includes('defense')) {
      responseText = `### Recommended Containment Playbook (NIST SP 800-61r2)\n1. **P0 (Immediate):** Revoke all active OAuth refresh tokens and JWT sessions for \`alex.vance@enterprise.com\`.\n2. **P1 (Edge Barrier):** Apply 72-hour ingress drop rule on edge WAF for IP \`${activeIncident?.sourceIp || '198.51.100.23'}\`.\n3. **P1 (Credential Reset):** Mandate hardware FIDO2 authentication re-enrollment before unlocking account.\n4. **P2 (Integrity):** Query PostgreSQL transaction logs to confirm no unauthorized data was read.`;
    } else {
      responseText = `### AegisSOC Copilot Analysis\nRegarding your inquiry: "${prompt}"\n\n- **Active Incident:** ${activeIncident?.id || 'INC-8402'} (${activeIncident?.title || 'Credential Access'})\n- **Risk Assessment:** ${activeIncident?.severity || 'HIGH'} (Confidence: ${activeIncident?.aiConfidence || 94}%)\n- **Playbook Status:** Containment simulation indicates 86% risk reduction upon perimeter IP drop. Please approve the pending defense action in the AI Response tab.`;
    }

    return res.json({ answer: responseText });
  } catch (error: any) {
    console.error('Copilot API error:', error);
    return res.status(500).json({ error: error.message || 'Internal AI Copilot error' });
  }
});

// Vite middleware in dev; static dist in production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AegisSOC server running at http://0.0.0.0:${PORT}`);
});
