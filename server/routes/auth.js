const express = require("express");
const router = express.Router();
const { checkJwt } = require("../config/auth");

// Resend verification email
router.post("/resend-verification", checkJwt, async (req, res) => {
    try {
        const userId = req.auth.payload.sub;

        // 1. Get Management API Token
        // Ideally these should be in process.env
        const domain = process.env.AUTH0_DOMAIN;
        const clientId = process.env.AUTH0_M2M_CLIENT_ID;
        const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error("Missing AUTH0_M2M_CLIENT_ID or AUTH0_M2M_CLIENT_SECRET");
            return res.status(500).json({ error: "Server misconfiguration: Missing Auth0 credentials." });
        }

        const tokenRes = await fetch(`https://${domain}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                audience: `https://${domain}/api/v2/`,
                grant_type: "client_credentials"
            })
        });

        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) {
            throw new Error(tokenData.error_description || "Failed to get management token");
        }

        const managementToken = tokenData.access_token;

        // 2. Call Verification Email Endpoint
        const verificationRes = await fetch(`https://${domain}/api/v2/jobs/verification-email`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${managementToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                client_id: process.env.AUTH0_CLIENT_ID // Optional: authenticating client hints
            })
        });

        if (!verificationRes.ok) {
            const errData = await verificationRes.json();
            throw new Error(errData.message || "Failed to send verification email");
        }

        res.json({ message: "Verification email sent successfully." });

    } catch (err) {
        console.error("Resend verification error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
