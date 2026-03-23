import * as client from "openid-client";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { Express, Request } from "express";
import { createServer, type Server } from "node:http";
import { Pool } from "pg";

const ISSUER_URL = process.env.ISSUER_URL ?? "https://replit.com/oidc";

function getBaseUrl(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
  const host = (req.headers["x-forwarded-host"] as string) || (req.headers.host as string) || "";
  return `${proto}://${host}`;
}

function getCallbackUrl(req: Request): string {
  return `${getBaseUrl(req)}/api/auth/callback`;
}

export function setupSession(app: Express) {
  const PgSession = connectPgSimple(session);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  app.use(
    session({
      store: new PgSession({
        pool,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "daily-grace-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
    })
  );
}

export function setupAuth(app: Express) {
  app.get("/api/auth/login", async (req, res) => {
    try {
      const clientId = req.hostname;
      const config = await client.discovery(new URL(ISSUER_URL), clientId);

      const codeVerifier = client.randomPKCECodeVerifier();
      const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
      const state = client.randomState();

      const sess = req.session as any;
      sess.codeVerifier = codeVerifier;
      sess.state = state;
      sess.returnTo = (req.query.returnTo as string) || "/";

      const redirectUri = getCallbackUrl(req);

      const authUrl = client.buildAuthorizationUrl(config, {
        redirect_uri: redirectUri,
        scope: "openid profile email",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state,
      });

      res.redirect(authUrl.toString());
    } catch (err) {
      console.error("Auth login error:", err);
      res.status(500).json({ error: "Failed to initiate login. Replit Auth may not be enabled." });
    }
  });

  app.get("/api/auth/callback", async (req, res) => {
    try {
      const clientId = req.hostname;
      const config = await client.discovery(new URL(ISSUER_URL), clientId);

      const sess = req.session as any;
      const codeVerifier = sess.codeVerifier;
      const state = sess.state;
      const returnTo = sess.returnTo || "/";

      delete sess.codeVerifier;
      delete sess.state;
      delete sess.returnTo;

      const redirectUri = getCallbackUrl(req);
      const currentUrl = new URL(`${getBaseUrl(req)}${req.url}`);

      const tokens = await client.authorizationCodeGrant(
        config,
        currentUrl,
        { pkceCodeVerifier: codeVerifier, expectedState: state },
        { redirectUri }
      );

      const claims = tokens.claims();
      if (!claims) throw new Error("No claims in token");

      sess.user = {
        id: claims.sub,
        name: (claims as any).name || (claims as any).username || claims.sub,
        email: (claims.email as string) || "",
        profileImage: (claims as any).profile_image || null,
      };

      res.redirect(returnTo);
    } catch (err) {
      console.error("Auth callback error:", err);
      res.redirect("/?auth_error=1");
    }
  });

  app.get("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  app.get("/api/auth/user", (req, res) => {
    const sess = req.session as any;
    if (sess?.user) {
      res.json({ user: sess.user, isAuthenticated: true });
    } else {
      res.json({ user: null, isAuthenticated: false });
    }
  });
}

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      name: string;
      email: string;
      profileImage: string | null;
    };
  }
}
