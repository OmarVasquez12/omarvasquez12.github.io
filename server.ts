import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

dotenv.config();

import {
  INITIAL_PRODUCTS,
  INITIAL_TOP_BUYERS,
  INITIAL_USER,
  INITIAL_LICENSES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_TICKETS,
  INITIAL_LOGS
} from './src/data/mockData.ts';

const app = express();

const PORT = Number(process.env.PORT || 3000);

const APP_URL =
  process.env.APP_URL || 'https://papeletascript.netlify.app/';

const DISCORD_CLIENT_ID =
  process.env.DISCORD_CLIENT_ID || '1536893381739946066';

const DISCORD_CLIENT_SECRET =
  process.env.DISCORD_CLIENT_SECRET || '9ff7e8e355227b4874248f236843882fed37d56acbd539356cab340d26eb5ab6';

const DISCORD_REDIRECT_URI =
  process.env.DISCORD_REDIRECT_URI ||
  'https://papeletascript.netlify.app/';

const DISCORD_ADMIN_IDS =
  (process.env.DISCORD_ADMIN_IDS || '890526767608127489')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

const LICENSE_API_SECRET =
  process.env.LICENSE_API_SECRET || 'XF_CODE_LICENSE_8fK2mQ9xV7pL4nR6';

const PAYPAL_CLIENT_ID =
  process.env.PAYPAL_CLIENT_ID || 'BAABDjigUQBsSGlR359OdkYsg5VYFkfvKyZDUR0ocQi5zIuIjDRKa7gQLM0nnCnJtJoTGR_0-jz3srrWzM';

const PAYPAL_CLIENT_SECRET =
  process.env.PAYPAL_CLIENT_SECRET || 'EPD0ynE0HMUhtqQiUx66wii5xZ6XCxWZC0V8wW6Pfr1wBxm20RrHCU2N3TCGzHPueWtdGJsrns0CX6bB';

const PAYPAL_MODE =
  process.env.PAYPAL_MODE || 'live';

const PAYPAL_EMAIL =
  process.env.PAYPAL_EMAIL || 'jhonespinal921@gmail.com';

const DISCORD_WEBHOOK_PURCHASES =
  process.env.DISCORD_WEBHOOK_PURCHASES || 'https://discord.com/api/webhooks/1535352755990822953/5biUrONnLKHKNSZB61Z5oYjobL5mSDRAwJCDHAYD0aZci2qLfwA37uWs6B-wYsRmMG8i';

const DISCORD_WEBHOOK_REVIEWS =
  process.env.DISCORD_WEBHOOK_REVIEWS || 'https://discord.com/api/webhooks/1536836698174914572/CYdYTpXznLxjO9GL0M8nK2xg06ByjjaCseI4ZwZMa3jnLNstiCO9DMwq1zUQR-gTAUZg';

const DISCORD_API =
  'https://discord.com/api/v10';

const PAYPAL_API =
  PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';


// =============================================================
// EXPRESS
// =============================================================

app.use(express.json({ limit: '2mb' }));


// =============================================================
// IN-MEMORY DATA
// =============================================================

let productsList: any[] = [...INITIAL_PRODUCTS];
let topBuyersList: any[] = [...INITIAL_TOP_BUYERS];

let currentUser: any =
  INITIAL_USER ? { ...INITIAL_USER } : null;

let licensesList: any[] = [...INITIAL_LICENSES];
let ordersList: any[] = [...INITIAL_ORDERS];
let reviewsList: any[] = [...INITIAL_REVIEWS];
let ticketsList: any[] = [...INITIAL_TICKETS];
let auditLogs: any[] = [...INITIAL_LOGS];


// =============================================================
// SYSTEM SETTINGS
// =============================================================

let systemSettings = {
  discordWebhookPurchases:
    DISCORD_WEBHOOK_PURCHASES,

  discordWebhookReviews:
    DISCORD_WEBHOOK_REVIEWS,

  paypalEmail:
    PAYPAL_EMAIL,

  paypalClientId:
    PAYPAL_CLIENT_ID,

  paypalMode:
    PAYPAL_MODE
};


// =============================================================
// DISCORD OAUTH STATE
// =============================================================

const discordStates =
  new Map<string, number>();


// =============================================================
// SESSION STORAGE
// =============================================================

const sessions =
  new Map<string, string>();


// =============================================================
// HELPERS
// =============================================================

function addAuditLog(
  action: string,
  target: string,
  user: string,
  details: string,
  ip: string = '127.0.0.1'
) {
  const newLog = {
    id:
      `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,

    timestamp:
      new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19),

    action,
    target,
    user,
    details,
    ip
  };

  auditLogs.unshift(newLog);

  if (auditLogs.length > 5000) {
    auditLogs.length = 5000;
  }
}


function randomSegment() {
  return crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase();
}


function generateLicenseKey(prefix = 'XF') {
  return `${prefix}-${randomSegment()}-${randomSegment()}-${randomSegment()}`;
}


function getCookie(
  req: Request,
  name: string
) {
  const cookieHeader =
    req.headers.cookie || '';

  const cookies =
    cookieHeader.split(';');

  for (const cookie of cookies) {
    const [key, ...value] =
      cookie.trim().split('=');

    if (key === name) {
      return decodeURIComponent(
        value.join('=')
      );
    }
  }

  return null;
}


function getSessionUser(req: Request) {
  const token =
    getCookie(req, 'xfcode_session');

  if (!token) {
    return null;
  }

  const discordId =
    sessions.get(token);

  if (!discordId) {
    return null;
  }

  if (
    currentUser &&
    currentUser.discordId === discordId
  ) {
    return currentUser;
  }

  return null;
}


function isAdmin(req: Request) {
  const user =
    getSessionUser(req);

  return !!(
    user &&
    user.isAdmin
  );
}


function requireAdmin(
  req: Request,
  res: Response
) {
  const user =
    getSessionUser(req);

  if (!user || !user.isAdmin) {
    res.status(403).json({
      error:
        'Acceso exclusivo de administrador XF CODE.'
    });

    return null;
  }

  return user;
}


// =============================================================
// PUBLIC CONFIG
// =============================================================

app.get(
  '/api/config',
  (req, res) => {
    res.json({
      appName:
        'XF CODE - MTA RESOURCES STORE',

      appUrl:
        APP_URL,

      hasClientId:
        Boolean(DISCORD_CLIENT_ID),

      hasClientSecret:
        Boolean(DISCORD_CLIENT_SECRET),

      redirectUri:
        DISCORD_REDIRECT_URI,

      hasDatabaseUrl:
        Boolean(process.env.DATABASE_URL),

      hasLicenseApiSecret:
        Boolean(LICENSE_API_SECRET),

      hasPayPal:
        Boolean(
          PAYPAL_CLIENT_ID &&
          PAYPAL_CLIENT_SECRET
        )
    });
  }
);


// =============================================================
// PUBLIC PAYPAL SETTINGS
// =============================================================

app.get(
  '/api/settings/public',
  (req, res) => {
    res.json({
      paypalEmail:
        systemSettings.paypalEmail,

      paypalClientId:
        systemSettings.paypalClientId,

      paypalMode:
        systemSettings.paypalMode
    });
  }
);


// =============================================================
// DISCORD OAUTH - LOGIN
// =============================================================

app.get(
  '/api/auth/discord',
  (req, res) => {
    try {
      if (
        !DISCORD_CLIENT_ID ||
        !DISCORD_CLIENT_SECRET
      ) {
        return res.status(500).json({
          error:
            'Discord OAuth no está configurado.'
        });
      }

      const state =
        crypto
          .randomBytes(32)
          .toString('hex');

      discordStates.set(
        state,
        Date.now()
      );

      const params =
        new URLSearchParams({
          client_id:
            DISCORD_CLIENT_ID,

          response_type:
            'code',

          redirect_uri:
            DISCORD_REDIRECT_URI,

          scope:
            'identify email',

          state
        });

      const url =
        `https://discord.com/oauth2/authorize?${params.toString()}`;

      return res.redirect(url);

    } catch (error) {
      console.error(
        'Discord OAuth start error:',
        error
      );

      return res.status(500).json({
        error:
          'No se pudo iniciar sesión con Discord.'
      });
    }
  }
);


// =============================================================
// DISCORD OAUTH - CALLBACK
// =============================================================

app.get(
  '/api/auth/discord/callback',
  async (req, res) => {
    try {
      const {
        code,
        state,
        error
      } = req.query;

      if (error) {
        return res.status(400).send(
          `Discord canceló la autenticación: ${String(error)}`
        );
      }

      if (!code || !state) {
        return res.status(400).send(
          'Falta el código o estado de Discord.'
        );
      }

      const stateString =
        String(state);

      const stateCreated =
        discordStates.get(
          stateString
        );

      if (!stateCreated) {
        return res.status(400).send(
          'Estado OAuth inválido.'
        );
      }

      const age =
        Date.now() - stateCreated;

      discordStates.delete(
        stateString
      );

      if (age > 10 * 60 * 1000) {
        return res.status(400).send(
          'La sesión de Discord expiró. Intenta nuevamente.'
        );
      }

      // -------------------------------------------------------
      // Exchange code
      // -------------------------------------------------------

      const tokenResponse =
        await fetch(
          `${DISCORD_API}/oauth2/token`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded'
            },

            body:
              new URLSearchParams({
                client_id:
                  DISCORD_CLIENT_ID,

                client_secret:
                  DISCORD_CLIENT_SECRET,

                grant_type:
                  'authorization_code',

                code:
                  String(code),

                redirect_uri:
                  DISCORD_REDIRECT_URI
              })
          }
        );

      if (!tokenResponse.ok) {
        const errorText =
          await tokenResponse.text();

        console.error(
          'Discord token error:',
          errorText
        );

        return res.status(401).send(
          'Discord no pudo validar la autenticación.'
        );
      }

      const tokenData: any =
        await tokenResponse.json();

      // -------------------------------------------------------
      // Get Discord user
      // -------------------------------------------------------

      const userResponse =
        await fetch(
          `${DISCORD_API}/users/@me`,
          {
            headers: {
              Authorization:
                `${tokenData.token_type} ${tokenData.access_token}`
            }
          }
        );

      if (!userResponse.ok) {
        return res.status(401).send(
          'No se pudo obtener el usuario de Discord.'
        );
      }

      const discordUser: any =
        await userResponse.json();

      // -------------------------------------------------------
      // User information
      // -------------------------------------------------------

      const username =
        discordUser.global_name ||
        discordUser.username ||
        'Discord_User';

      const avatar =
        discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
          : 'https://cdn.discordapp.com/embed/avatars/0.png';

      const email =
        discordUser.email ||
        `${discordUser.id}@discord.xfcode.local`;

      const existingUser =
        currentUser &&
        currentUser.discordId ===
          discordUser.id
          ? currentUser
          : null;

      const admin =
        DISCORD_ADMIN_IDS.includes(
          discordUser.id
        );

      currentUser = {
        id:
          existingUser?.id ||
          `usr-${discordUser.id}`,

        username,

        email,

        avatar,

        discordId:
          discordUser.id,

        registeredAt:
          existingUser?.registeredAt ||
          new Date()
            .toISOString()
            .split('T')[0],

        totalSpent:
          existingUser?.totalSpent || 0,

        purchasedProductIds:
          existingUser?.purchasedProductIds ||
          [],

        activeLicenseCount:
          existingUser?.activeLicenseCount ||
          0,

        hideInRanking:
          existingUser?.hideInRanking ||
          false,

        isAdmin:
          admin,

        favorites:
          existingUser?.favorites ||
          []
      };

      // -------------------------------------------------------
      // Create session
      // -------------------------------------------------------

      const sessionToken =
        crypto
          .randomBytes(48)
          .toString('hex');

      sessions.set(
        sessionToken,
        discordUser.id
      );

      const secure =
        process.env.NODE_ENV ===
        'production';

      res.setHeader(
        'Set-Cookie',
        [
          `xfcode_session=${encodeURIComponent(sessionToken)}`,
          'Path=/',
          'HttpOnly',
          'SameSite=Lax',
          'Max-Age=604800',
          secure ? 'Secure' : ''
        ]
          .filter(Boolean)
          .join('; ')
      );

      addAuditLog(
        'DISCORD_LOGIN',
        'Discord OAuth',
        currentUser.username,
        `Usuario verificado mediante Discord (${discordUser.id})`,
        req.ip || '127.0.0.1'
      );

      return res.redirect('/');
    } catch (error) {
      console.error(
        'Discord callback error:',
        error
      );

      return res.status(500).send(
        'Error procesando la autenticación de Discord.'
      );
    }
  }
);


// =============================================================
// AUTH ME
// =============================================================

app.get(
  '/api/auth/me',
  (req, res) => {
    const user =
      getSessionUser(req);

    res.json({
      user: user || null
    });
  }
);


// =============================================================
// LOGOUT
// =============================================================

app.post(
  '/api/auth/logout',
  (req, res) => {
    const token =
      getCookie(
        req,
        'xfcode_session'
      );

    if (token) {
      sessions.delete(token);
    }

    currentUser = null;

    res.setHeader(
      'Set-Cookie',
      [
        'xfcode_session=',
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        'Max-Age=0'
      ].join('; ')
    );

    res.json({
      success: true,
      message:
        'Sesión cerrada exitosamente.'
    });
  }
);


// =============================================================
// LEGACY LOGIN DISABLED
// =============================================================

app.post(
  '/api/auth/login',
  (req, res) => {
    res.status(400).json({
      success: false,
      error:
        'El inicio de sesión se realiza mediante Discord.',
      loginUrl:
        '/api/auth/discord'
    });
  }
);


app.post(
  '/api/auth/register',
  (req, res) => {
    res.status(400).json({
      success: false,
      error:
        'El registro manual está deshabilitado. Usa Discord.'
    });
  }
);


// =============================================================
// USER SETTINGS
// =============================================================

app.put(
  '/api/user/settings',
  (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.status(401).json({
        error:
          'Debes iniciar sesión con Discord.'
      });
    }

    const {
      username,
      email,
      hideInRanking,
      avatar
    } = req.body || {};

    if (username) {
      user.username =
        String(username).trim();
    }

    if (email) {
      user.email =
        String(email).trim();
    }

    if (
      hideInRanking !== undefined
    ) {
      user.hideInRanking =
        Boolean(hideInRanking);
    }

    if (avatar) {
      user.avatar =
        String(avatar);
    }

    res.json({
      success: true,
      user
    });
  }
);


// =============================================================
// PRODUCTS
// =============================================================

app.get(
  '/api/products',
  (req, res) => {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      type,
      sort
    } = req.query;

    let filtered =
      [...productsList];

    if (
      category &&
      category !== 'TODOS'
    ) {
      filtered =
        filtered.filter(
          p =>
            String(p.category)
              .toLowerCase() ===
            String(category)
              .toLowerCase()
        );
    }

    if (search) {
      const q =
        String(search)
          .toLowerCase();

      filtered =
        filtered.filter(p =>
          String(p.name)
            .toLowerCase()
            .includes(q) ||

          String(p.shortDescription)
            .toLowerCase()
            .includes(q) ||

          String(p.productIdCode)
            .toLowerCase()
            .includes(q)
        );
    }

    if (type === 'FREE') {
      filtered =
        filtered.filter(
          p => p.isFree
        );
    }

    if (type === 'PREMIUM') {
      filtered =
        filtered.filter(
          p => !p.isFree
        );
    }

    if (minPrice) {
      filtered =
        filtered.filter(
          p =>
            Number(p.price) >=
            Number(minPrice)
        );
    }

    if (maxPrice) {
      filtered =
        filtered.filter(
          p =>
            Number(p.price) <=
            Number(maxPrice)
        );
    }

    if (sort === 'sales') {
      filtered.sort(
        (a, b) =>
          Number(b.salesCount || 0) -
          Number(a.salesCount || 0)
      );
    }

    if (sort === 'rating') {
      filtered.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sort === 'price_asc') {
      filtered.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === 'price_desc') {
      filtered.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    res.json({
      products: filtered
    });
  }
);


app.get(
  '/api/products/:slug',
  (req, res) => {
    const product =
      productsList.find(
        p =>
          p.slug === req.params.slug ||
          p.id === req.params.slug
      );

    if (!product) {
      return res.status(404).json({
        error:
          'Recurso no encontrado.'
      });
    }

    res.json({
      product
    });
  }
);


// =============================================================
// LICENSES
// =============================================================

app.get(
  '/api/licenses',
  (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.json({
        licenses: []
      });
    }

    const licenses =
      licensesList.filter(
        license =>
          license.userId === user.id ||
          user.isAdmin
      );

    res.json({
      licenses
    });
  }
);


// =============================================================
// BIND LICENSE
// =============================================================

app.post(
  '/api/licenses/bind',
  (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.status(401).json({
        error:
          'Debes iniciar sesión.'
      });
    }

    const {
      licenseKey,
      serverIp,
      serverPort
    } = req.body || {};

    if (
      !licenseKey ||
      !serverIp ||
      !serverPort
    ) {
      return res.status(400).json({
        error:
          'Proporcione License Key, IP pública y Puerto.'
      });
    }

    const license =
      licensesList.find(
        l =>
          String(l.licenseKey)
            .toUpperCase() ===
          String(licenseKey)
            .trim()
            .toUpperCase()
      );

    if (!license) {
      return res.status(404).json({
        error:
          'Licencia no encontrada.'
      });
    }

    if (
      license.userId !== user.id &&
      !user.isAdmin
    ) {
      return res.status(403).json({
        error:
          'No tienes permisos sobre esta licencia.'
      });
    }

    license.serverIp =
      String(serverIp).trim();

    license.serverPort =
      Number.parseInt(
        String(serverPort),
        10
      );

    license.lastValidatedAt =
      new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);

    addAuditLog(
      'LICENSE_BIND_IP',
      license.productName,
      user.username,
      `IP configurada: ${serverIp}:${serverPort}`,
      req.ip || '127.0.0.1'
    );

    res.json({
      success: true,
      license
    });
  }
);


// =============================================================
// RESET IP
// =============================================================

app.post(
  '/api/licenses/reset-ip',
  (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.status(401).json({
        error:
          'Debes iniciar sesión.'
      });
    }

    const {
      licenseKey
    } = req.body || {};

    const license =
      licensesList.find(
        l =>
          String(l.licenseKey)
            .toUpperCase() ===
          String(licenseKey)
            .trim()
            .toUpperCase()
      );

    if (!license) {
      return res.status(404).json({
        error:
          'Licencia no encontrada.'
      });
    }

    if (
      license.userId !== user.id &&
      !user.isAdmin
    ) {
      return res.status(403).json({
        error:
          'No tienes permisos sobre esta licencia.'
      });
    }

    if (
      license.ipResetCooldownUntil &&
      new Date(
        license.ipResetCooldownUntil
      ) > new Date() &&
      !user.isAdmin
    ) {
      return res.status(429).json({
        error:
          `Debes esperar hasta ${license.ipResetCooldownUntil}.`,
        cooldownUntil:
          license.ipResetCooldownUntil
      });
    }

    license.serverIp = '';
    license.serverPort = 0;

    const cooldown =
      new Date();

    cooldown.setHours(
      cooldown.getHours() + 12
    );

    license.ipResetCooldownUntil =
      cooldown
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);

    res.json({
      success: true,
      license,
      cooldownUntil:
        license.ipResetCooldownUntil
    });
  }
);


// =============================================================
// MTA LICENSE VALIDATION
// =============================================================

app.post(
  '/api/license/validate',
  (req, res) => {
    const providedSecret =
      String(
        req.headers['x-license-secret'] ||
        req.body?.api_secret ||
        ''
      );

    if (
      LICENSE_API_SECRET &&
      providedSecret !==
        LICENSE_API_SECRET
    ) {
      return res.status(401).json({
        valid: false,
        reason:
          'UNAUTHORIZED',
        message:
          'API secret inválido.'
      });
    }

    const {
      license_key,
      product_id,
      discord_id,
      server_ip,
      server_port
    } = req.body || {};

    if (
      !license_key ||
      !product_id
    ) {
      return res.status(400).json({
        valid: false,
        reason:
          'INVALID_REQUEST',
        message:
          'license_key and product_id are mandatory.'
      });
    }

    const license =
      licensesList.find(
        l =>
          String(l.licenseKey)
            .trim()
            .toUpperCase() ===
          String(license_key)
            .trim()
            .toUpperCase()
      );

    if (!license) {
      return res.json({
        valid: false,
        reason:
          'INVALID_LICENSE',
        message:
          'Licencia no registrada en XF CODE.'
      });
    }

    if (
      license.status ===
      'REVOKED'
    ) {
      return res.json({
        valid: false,
        reason:
          'LICENSE_REVOKED',
        message:
          'Licencia revocada.'
      });
    }

    if (
      license.status ===
        'SUSPENDED' ||
      license.status ===
        'EXPIRED'
    ) {
      return res.json({
        valid: false,
        reason:
          license.status ===
          'SUSPENDED'
            ? 'LICENSE_SUSPENDED'
            : 'LICENSE_EXPIRED',
        message:
          `La licencia se encuentra ${license.status}.`
      });
    }

    const requestedProduct =
      String(product_id);

    if (
      license.productId !==
        requestedProduct &&
      license.productId !==
        `prod-${requestedProduct}`
    ) {
      return res.json({
        valid: false,
        reason:
          'PRODUCT_NOT_OWNED',
        message:
          'Esta licencia pertenece a otro recurso XF CODE.'
      });
    }

    if (
      discord_id &&
      license.discordId &&
      String(license.discordId) !==
        String(discord_id)
    ) {
      return res.json({
        valid: false,
        reason:
          'DISCORD_MISMATCH',
        message:
          'La licencia no pertenece a este usuario de Discord.'
      });
    }

    if (
      server_ip &&
      license.serverIp &&
      license.serverIp !==
        String(server_ip).trim()
    ) {
      return res.json({
        valid: false,
        reason:
          'IP_MISMATCH',
        bound_ip:
          license.serverIp,
        message:
          'La IP del servidor no coincide.'
      });
    }

    if (
      server_port &&
      license.serverPort &&
      Number(server_port) !==
        Number(license.serverPort)
    ) {
      return res.json({
        valid: false,
        reason:
          'PORT_MISMATCH',
        bound_port:
          license.serverPort,
        message:
          'El puerto del servidor no coincide.'
      });
    }

    if (
      server_ip &&
      !license.serverIp
    ) {
      license.serverIp =
        String(server_ip).trim();
    }

    if (
      server_port &&
      !license.serverPort
    ) {
      license.serverPort =
        Number(server_port);
    }

    license.lastValidatedAt =
      new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);

    res.json({
      valid: true,
      status:
        license.status,
      product:
        license.productName,
      bound_ip:
        license.serverIp,
      bound_port:
        license.serverPort,
      validated_at:
        license.lastValidatedAt,
      message:
        'Licencia válida y activa en XF CODE.'
    });
  }
);


// =============================================================
// PAYPAL ACCESS TOKEN
// =============================================================

async function getPayPalAccessToken() {
  if (
    !PAYPAL_CLIENT_ID ||
    !PAYPAL_CLIENT_SECRET
  ) {
    throw new Error(
      'PayPal no está configurado.'
    );
  }

  const credentials =
    Buffer
      .from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
      )
      .toString('base64');

  const response =
    await fetch(
      `${PAYPAL_API}/v1/oauth2/token`,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Basic ${credentials}`,

          'Content-Type':
            'application/x-www-form-urlencoded'
        },

        body:
          'grant_type=client_credentials'
      }
    );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      `PayPal authentication failed: ${text}`
    );
  }

  const data: any =
    await response.json();

  return data.access_token;
}


// =============================================================
// PAYPAL CREATE ORDER
// =============================================================

app.post(
  '/api/paypal/create-order',
  async (req, res) => {
    try {
      const user =
        getSessionUser(req);

      if (!user) {
        return res.status(401).json({
          error:
            'Debes iniciar sesión con Discord.'
        });
      }

      const {
        productId
      } = req.body || {};

      const product =
        productsList.find(
          p => p.id === productId
        );

      if (!product) {
        return res.status(404).json({
          error:
            'Producto no encontrado.'
        });
      }

      if (product.isFree) {
        return res.status(400).json({
          error:
            'Este producto es gratuito.'
        });
      }

      const amount =
        Number(product.price).toFixed(2);

      const token =
        await getPayPalAccessToken();

      const paypalResponse =
        await fetch(
          `${PAYPAL_API}/v2/checkout/orders`,
          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${token}`,

              'Content-Type':
                'application/json',

              'PayPal-Request-Id':
                crypto.randomUUID()
            },

            body:
              JSON.stringify({
                intent: 'CAPTURE',

                purchase_units: [
                  {
                    custom_id:
                      product.id,

                    description:
                      product.name,

                    amount: {
                      currency_code:
                        'USD',

                      value:
                        amount
                    }
                  }
                ],

                application_context: {
                  brand_name:
                    'XF CODE',

                  user_action:
                    'PAY_NOW',

                  return_url:
                    `${APP_URL}/payment/success`,

                  cancel_url:
                    `${APP_URL}/payment/cancel`
                }
              })
          }
        );

      const data: any =
        await paypalResponse.json();

      if (!paypalResponse.ok) {
        console.error(
          'PayPal create order:',
          data
        );

        return res.status(500).json({
          error:
            'PayPal no pudo crear la orden.'
        });
      }

      res.json({
        success: true,
        orderId:
          data.id,
        links:
          data.links || []
      });

    } catch (error) {
      console.error(
        'PayPal create error:',
        error
      );

      res.status(500).json({
        error:
          'Error creando el pago de PayPal.'
      });
    }
  }
);


// =============================================================
// PAYPAL CAPTURE ORDER
// =============================================================

app.post(
  '/api/paypal/capture-order',
  async (req, res) => {
    try {
      const user =
        getSessionUser(req);

      if (!user) {
        return res.status(401).json({
          error:
            'Debes iniciar sesión con Discord.'
        });
      }

      const {
        orderId,
        productId
      } = req.body || {};

      if (
        !orderId ||
        !productId
      ) {
        return res.status(400).json({
          error:
            'orderId y productId son requeridos.'
        });
      }

      const product =
        productsList.find(
          p => p.id === productId
        );

      if (!product) {
        return res.status(404).json({
          error:
            'Producto no encontrado.'
        });
      }

      const token =
        await getPayPalAccessToken();

      const captureResponse =
        await fetch(
          `${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${token}`,

              'Content-Type':
                'application/json'
            }
          }
        );

      const captureData: any =
        await captureResponse.json();

      if (!captureResponse.ok) {
        console.error(
          'PayPal capture:',
          captureData
        );

        return res.status(400).json({
          error:
            'PayPal no pudo confirmar el pago.'
        });
      }

      const completed =
        captureData.status ===
        'COMPLETED';

      if (!completed) {
        return res.status(400).json({
          success: false,
          error:
            'El pago todavía no está completado.'
        });
      }

      // -------------------------------------------------------
      // Verify captured amount
      // -------------------------------------------------------

      const purchaseUnit =
        captureData
          .purchase_units?.[0];

      const capture =
        purchaseUnit
          ?.payments
          ?.captures?.[0];

      const paidAmount =
        Number(
          capture?.amount?.value || 0
        );

      const expectedAmount =
        Number(product.price);

      if (
        paidAmount !==
        expectedAmount
      ) {
        console.error(
          'PayPal amount mismatch',
          {
            paidAmount,
            expectedAmount
          }
        );

        return res.status(400).json({
          error:
            'El monto pagado no coincide con el producto.'
        });
      }

      // -------------------------------------------------------
      // Prevent duplicate capture
      // -------------------------------------------------------

      const existingOrder =
        ordersList.find(
          o =>
            o.transactionId ===
            orderId
        );

      if (existingOrder) {
        return res.json({
          success: true,
          order:
            existingOrder,
          message:
            'Este pago ya fue procesado.'
        });
      }

      // -------------------------------------------------------
      // Generate license AFTER payment
      // -------------------------------------------------------

      const generatedKey =
        generateLicenseKey();

      const newOrder = {
        id:
          `ord-${Date.now()}`,

        orderNumber:
          `XF-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,

        userId:
          user.id,

        username:
          user.username,

        userEmail:
          user.email,

        productId:
          product.id,

        productName:
          product.name,

        productImage:
          product.image,

        amount:
          expectedAmount,

        paymentMethod:
          'PAYPAL',

        status:
          'PAID',

        createdAt:
          new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19),

        transactionId:
          orderId,

        paypalCaptureId:
          capture?.id || '',

        licenseKey:
          generatedKey
      };

      ordersList.unshift(
        newOrder
      );

      const newLicense = {
        id:
          `lic-${Date.now()}`,

        licenseKey:
          generatedKey,

        productId:
          product.id,

        productName:
          product.name,

        userId:
          user.id,

        username:
          user.username,

        discordId:
          user.discordId,

        serverIp:
          '',

        serverPort:
          22003,

        status:
          'ACTIVE',

        activatedAt:
          new Date()
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19),

        lastValidatedAt:
          'Pendiente de primer inicio'
      };

      licensesList.unshift(
        newLicense
      );

      if (
        !user.purchasedProductIds
      ) {
        user.purchasedProductIds =
          [];
      }

      if (
        !user.purchasedProductIds.includes(
          product.id
        )
      ) {
        user.purchasedProductIds.push(
          product.id
        );
      }

      user.totalSpent =
        Number(
          (
            Number(user.totalSpent || 0) +
            expectedAmount
          ).toFixed(2)
        );

      user.activeLicenseCount =
        Number(
          user.activeLicenseCount || 0
        ) + 1;

      product.salesCount =
        Number(
          product.salesCount || 0
        ) + 1;

      addAuditLog(
        'PAYPAL_PAYMENT_COMPLETED',
        product.name,
        user.username,
        `Pago PayPal confirmado. Orden: ${newOrder.orderNumber}`,
        req.ip || '127.0.0.1'
      );

      // -------------------------------------------------------
      // Discord webhook
      // -------------------------------------------------------

      if (
        systemSettings
          .discordWebhookPurchases
      ) {
        try {
          await fetch(
            systemSettings
              .discordWebhookPurchases,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({
                  embeds: [
                    {
                      title:
                        '🛒 Nueva Compra - XF CODE',

                      color:
                        0xef4444,

                      fields: [
                        {
                          name:
                            'Cliente',

                          value:
                            `\`${user.username}\` (${user.email})`,

                          inline:
                            true
                        },

                        {
                          name:
                            'Producto',

                          value:
                            product.name,

                          inline:
                            true
                        },

                        {
                          name:
                            'Monto',

                          value:
                            `$${expectedAmount.toFixed(2)} USD`,

                          inline:
                            true
                        },

                        {
                          name:
                            'Método',

                          value:
                            'PayPal',

                          inline:
                            true
                        },

                        {
                          name:
                            'Orden',

                          value:
                            newOrder.orderNumber,

                          inline:
                            true
                        },

                        {
                          name:
                            'Licencia',

                          value:
                            `\`${generatedKey}\``,

                          inline:
                            false
                        }
                      ],

                      footer: {
                        text:
                          'XF CODE - Tienda Oficial MTA'
                      },

                      timestamp:
                        new Date()
                          .toISOString()
                    }
                  ]
                })
            }
          );
        } catch (error) {
          console.error(
            'Purchase webhook error:',
            error
          );
        }
      }

      res.json({
        success: true,
        order:
          newOrder,
        license:
          newLicense,
        message:
          'Pago confirmado. Tu licencia fue generada.'
      });

    } catch (error) {
      console.error(
        'PayPal capture error:',
        error
      );

      res.status(500).json({
        error:
          'Error procesando el pago.'
      });
    }
  }
);


// =============================================================
// FREE CHECKOUT
// =============================================================

app.post(
  '/api/orders/checkout',
  (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.status(401).json({
        error:
          'Debes iniciar sesión con Discord.'
      });
    }

    const {
      productId
    } = req.body || {};

    const product =
      productsList.find(
        p => p.id === productId
      );

    if (!product) {
      return res.status(404).json({
        error:
          'Producto no encontrado.'
      });
    }

    // Paid products MUST use PayPal
    if (!product.isFree) {
      return res.status(400).json({
        error:
          'Los productos de pago deben comprarse mediante PayPal.',
        paymentMethod:
          'PAYPAL'
      });
    }

    const generatedKey =
      generateLicenseKey();

    const newOrder = {
      id:
        `ord-${Date.now()}`,

      orderNumber:
        `XF-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,

      userId:
        user.id,

      username:
        user.username,

      userEmail:
        user.email,

      productId:
        product.id,

      productName:
        product.name,

      productImage:
        product.image,

      amount:
        0,

      paymentMethod:
        'FREE',

      status:
        'PAID',

      createdAt:
        new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19),

      transactionId:
        `FREE-${Date.now()}`,

      licenseKey:
        generatedKey
    };

    ordersList.unshift(
      newOrder
    );

    const newLicense = {
      id:
        `lic-${Date.now()}`,

      licenseKey:
        generatedKey,

      productId:
        product.id,

      productName:
        product.name,

      userId:
        user.id,

      username:
        user.username,

      discordId:
        user.discordId,

      serverIp:
        '',

      serverPort:
        22003,

      status:
        'ACTIVE',

      activatedAt:
        new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19),

      lastValidatedAt:
        'Pendiente de primer inicio'
    };

    licensesList.unshift(
      newLicense
    );

    if (
      !user.purchasedProductIds
    ) {
      user.purchasedProductIds =
        [];
    }

    if (
      !user.purchasedProductIds.includes(
        product.id
      )
    ) {
      user.purchasedProductIds.push(
        product.id
      );
    }

    user.activeLicenseCount =
      Number(
        user.activeLicenseCount || 0
      ) + 1;

    product.salesCount =
      Number(
        product.salesCount || 0
      ) + 1;

    res.json({
      success: true,
      order:
        newOrder,
      license:
        newLicense
    });
  }
);


// =============================================================
// ORDERS
// =============================================================

app.get(
  '/api/orders',
  (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.json({
        orders: []
      });
    }

    const orders =
      ordersList.filter(
        order =>
          order.userId === user.id ||
          user.isAdmin
      );

    res.json({
      orders
    });
  }
);


// =============================================================
// DOWNLOADS
// =============================================================

app.get(
  '/api/downloads/:productId',
  (req, res) => {
    const product =
      productsList.find(
        p =>
          p.id ===
          req.params.productId
      );

    if (!product) {
      return res.status(404).json({
        error:
          'Recurso no encontrado.'
      });
    }

    const user =
      getSessionUser(req);

    if (!user) {
      if (product.isFree) {
        return res.json({
          success: true,

          downloadUrl:
            product.downloadUrl || '',

          filename:
            `${product.slug}-v${product.version}.zip`,

          fileSize:
            '12.1 MB',

          checksum:
            'free-resource-checksum'
        });
      }

      return res.status(403).json({
        error:
          'Debes iniciar sesión con Discord.'
      });
    }

    const owned =
      (
        user.purchasedProductIds ||
        []
      ).includes(product.id);

    if (
      !owned &&
      !product.isFree &&
      !user.isAdmin
    ) {
      return res.status(403).json({
        error:
          'Debes adquirir este recurso antes de descargarlo.'
      });
    }

    addAuditLog(
      'FILE_DOWNLOAD',
      product.name,
      user.username,
      'Descarga autorizada',
      req.ip || '127.0.0.1'
    );

    res.json({
      success: true,

      downloadUrl:
        product.downloadUrl || '',

      filename:
        `${product.slug}-v${product.version}.zip`,

      fileSize:
        '18.4 MB',

      checksum:
        'a8f9c2d1e0b5438a912f'
    });
  }
);


// =============================================================
// TOP BUYERS
// =============================================================

app.get(
  '/api/top-buyers',
  (req, res) => {
    const visible =
      topBuyersList.filter(
        buyer =>
          !buyer.hideInRanking
      );

    res.json({
      topBuyers:
        visible
    });
  }
);


// =============================================================
// REVIEWS
// =============================================================

app.get(
  '/api/reviews/:productId',
  (req, res) => {
    const reviews =
      reviewsList.filter(
        review =>
          review.productId ===
          req.params.productId
      );

    res.json({
      reviews
    });
  }
);

app.post(
  '/api/reviews',
  async (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.status(401).json({
        error:
          'Debes iniciar sesión con Discord.'
      });
    }

    const {
      productId,
      rating,
      comment
    } = req.body || {};

    if (
      !productId ||
      !rating ||
      !comment
    ) {
      return res.status(400).json({
        error:
          'Faltan campos requeridos.'
      });
    }

    const numericRating =
      Number(rating);

    if (
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        error:
          'La calificación debe ser de 1 a 5.'
      });
    }

    const verified =
      (
        user.purchasedProductIds ||
        []
      ).includes(productId);

    const review = {
      id:
        `rev-${Date.now()}`,

      productId,

      userId:
        user.id,

      username:
        user.username,

      userAvatar:
        user.avatar,

      rating:
        numericRating,

      comment:
        String(comment).trim(),

      isVerifiedPurchase:
        verified,

      createdAt:
        new Date()
          .toISOString()
          .split('T')[0]
    };

    reviewsList.unshift(
      review
    );

    const productReviews =
      reviewsList.filter(
        r =>
          r.productId ===
          productId
      );

    const product =
      productsList.find(
        p =>
          p.id === productId
      );

    if (product) {
      const average =
        productReviews.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(item.rating),
          0
        ) /
        productReviews.length;

      product.rating =
        Number(
          average.toFixed(1)
        );

      product.reviewCount =
        productReviews.length;
    }

    // ---------------------------------------------------------
    // DISCORD REVIEW WEBHOOK
    // ---------------------------------------------------------

    if (
      systemSettings
        .discordWebhookReviews
    ) {
      try {
        await fetch(
          systemSettings
            .discordWebhookReviews,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({
                embeds: [
                  {
                    title:
                      '⭐ Nueva Reseña - XF CODE',

                    color:
                      0xef4444,

                    fields: [
                      {
                        name:
                          'Producto',

                        value:
                          product?.name ||
                          productId,

                        inline:
                          true
                      },

                      {
                        name:
                          'Usuario',

                        value:
                          user.username,

                        inline:
                          true
                      },

                      {
                        name:
                          'Calificación',

                        value:
                          '⭐'.repeat(
                            numericRating
                          ),

                        inline:
                          true
                      },

                      {
                        name:
                          'Verificado',

                        value:
                          verified
                            ? '✅ Sí'
                            : '❌ No',

                        inline:
                          true
                      },

                      {
                        name:
                          'Comentario',

                        value:
                          String(comment)
                      }
                    ]
                  }
                ]
              })
          }
        );
      } catch (error) {
        console.error(
          'Review webhook error:',
          error
        );
      }
    }

    res.json({
      success:
        true,

      review
    });
  }
);
// =============================================================
// TICKETS
// =============================================================

app.get(
  '/api/tickets',
  (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.json({
        tickets: []
      });
    }

    const tickets =
      ticketsList.filter(
        ticket =>
          ticket.userId === user.id ||
          user.isAdmin
      );

    res.json({
      tickets
    });
  }
);


app.post(
  '/api/tickets',
  (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.status(401).json({
        error:
          'Debes iniciar sesión.'
      });
    }

    const {
      subject,
      category,
      message,
      productId
    } = req.body || {};

    if (
      !subject ||
      !message
    ) {
      return res.status(400).json({
        error:
          'Escriba un asunto y mensaje.'
      });
    }

    const product =
      productsList.find(
        p =>
          p.id === productId
      );

    const now =
      new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);

    const ticket = {
      id:
        `tkt-${Date.now()}`,

      ticketNumber:
        `TKT-${Math.floor(1000 + Math.random() * 9000)}`,

      userId:
        user.id,

      username:
        user.username,

      userAvatar:
        user.avatar,

      subject,

      category:
        category ||
        'Soporte General',

      message,

      productId,

      productName:
        product?.name,

      status:
        'OPEN',

      createdAt:
        now,

      updatedAt:
        now,

      messages: [
        {
          id:
            `msg-${Date.now()}`,

          sender:
            user.username,

          senderRole:
            'USER',

          avatar:
            user.avatar,

          message,

          createdAt:
            now
        }
      ]
    };

    ticketsList.unshift(
      ticket
    );

    res.json({
      success: true,
      ticket
    });
  }
);


app.post(
  '/api/tickets/:id/message',
  (req, res) => {
    const user =
      getSessionUser(req);

    if (!user) {
      return res.status(401).json({
        error:
          'Debes iniciar sesión.'
      });
    }

    const {
      message,
      isAdminResponse
    } = req.body || {};

    const ticket =
      ticketsList.find(
        t =>
          t.id ===
          req.params.id
      );

    if (!ticket) {
      return res.status(404).json({
        error:
          'Ticket no encontrado.'
      });
    }

    if (
      ticket.userId !== user.id &&
      !user.isAdmin
    ) {
      return res.status(403).json({
        error:
          'No tienes acceso a este ticket.'
      });
    }

    const adminResponse =
      Boolean(
        isAdminResponse &&
        user.isAdmin
      );

    const now =
      new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);

    ticket.messages.push({
      id:
        `msg-${Date.now()}`,

      sender:
        adminResponse
          ? 'Soporte XF CODE'
          : user.username,

      senderRole:
        adminResponse
          ? 'ADMIN'
          : 'USER',

      avatar:
        user.avatar,

      message:
        String(message || ''),

      createdAt:
        now
    });

    ticket.updatedAt =
      now;

    ticket.status =
      adminResponse
        ? 'IN_PROGRESS'
        : 'OPEN';

    res.json({
      success: true,
      ticket
    });
  }
);


// =============================================================
// ADMIN SETTINGS
// =============================================================

app.get(
  '/api/admin/settings',
  (req, res) => {
    const user =
      requireAdmin(req, res);

    if (!user) return;

    res.json({
      settings:
        systemSettings
    });
  }
);


app.put(
  '/api/admin/settings',
  (req, res) => {
    const user =
      requireAdmin(req, res);

    if (!user) return;

    const {
      discordWebhookPurchases,
      discordWebhookReviews,
      paypalEmail,
      paypalClientId,
      paypalMode
    } = req.body || {};

    if (
      discordWebhookPurchases !==
      undefined
    ) {
      systemSettings
        .discordWebhookPurchases =
        discordWebhookPurchases;
    }

    if (
      discordWebhookReviews !==
      undefined
    ) {
      systemSettings
        .discordWebhookReviews =
        discordWebhookReviews;
    }

    if (
      paypalEmail !==
      undefined
    ) {
      systemSettings
        .paypalEmail =
        paypalEmail;
    }

    if (
      paypalClientId !==
      undefined
    ) {
      systemSettings
        .paypalClientId =
        paypalClientId;
    }

    if (
      paypalMode !==
      undefined
    ) {
      systemSettings
        .paypalMode =
        paypalMode;
    }

    addAuditLog(
      'ADMIN_UPDATE_SETTINGS',
      'System Settings',
      user.username,
      'Configuración actualizada',
      req.ip || '127.0.0.1'
    );

    res.json({
      success: true,
      settings:
        systemSettings
    });
  }
);


// =============================================================
// ADMIN DASHBOARD
// =============================================================

app.get(
  '/api/admin/dashboard',
  (req, res) => {
    const user =
      requireAdmin(req, res);

    if (!user) return;

    const totalRevenue =
      ordersList.reduce(
        (sum, order) =>
          sum +
          Number(order.amount || 0),
        0
      );

    const activeLicenses =
      licensesList.filter(
        l =>
          l.status === 'ACTIVE'
      ).length;

    res.json({
      stats: {
        totalUsers:
          1420,

        totalProducts:
          productsList.length,

        totalSales:
          ordersList.length,

        activeLicenses,

        totalRevenue:
          Number(
            totalRevenue.toFixed(2)
          ),

        freeDownloads:
          4040
      },

      products:
        productsList,

      licenses:
        licensesList,

      orders:
        ordersList,
    });
  }
);


// =============================================================
// ADMIN CREATE PRODUCT
// =============================================================

app.post(
  '/api/admin/products',
  (req, res) => {
    const user =
      requireAdmin(req, res);

    if (!user) return;

    const data =
      req.body || {};

    if (!data.name) {
      return res.status(400).json({
        error:
          'El nombre del producto es obligatorio.'
      });
    }

    const price =
      Number(data.price || 0);

    const slug =
      String(data.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const product = {
      id:
        `prod-${Date.now()}`,

      slug,

      name:
        String(data.name),

      shortDescription:
        data.shortDescription ||
        'Recurso XF CODE para MTA:SA.',

      fullDescription:
        data.fullDescription ||
        data.shortDescription ||
        '',

      category:
        data.category ||
        'Sistemas',

      price,

      originalPrice:
        data.originalPrice
          ? Number(data.originalPrice)
          : undefined,

      discountPercent:
        data.discountPercent
          ? Number(data.discountPercent)
          : undefined,

      image:
        data.image || '',

      screenshots:
        data.image
          ? [data.image]
          : [],

      version:
        data.version ||
        '1.0.0',

      lastUpdated:
        new Date()
          .toISOString()
          .split('T')[0],

      changelog: [
        'v1.0.0: Publicación en XF CODE.'
      ],

      requirements: [
        'MTA:SA v1.5.9+'
      ],

      mtaCompatibility:
        'MTA 1.5.9 / 1.6',

      rating:
        5,

      reviewCount:
        0,

      salesCount:
        0,

      badge:
        data.badge ||
        'NUEVO',

      isFree:
        price === 0,

      isFeatured:
        Boolean(
          data.isFeatured
        ),

      isBestSeller:
        false,

      productIdCode:
        `MTA-XF-${Math.floor(10 + Math.random() * 90)}`
    };

    productsList.unshift(
      product
    );

    addAuditLog(
      'ADMIN_CREATE_PRODUCT',
      product.name,
      user.username,
      `Producto creado (${price} USD)`,
      req.ip || '127.0.0.1'
    );

    res.json({
      success: true,
      product
    });
  }
);


// =============================================================
// ADMIN UPDATE PRODUCT
// =============================================================

app.put(
  '/api/admin/products/:id',
  (req, res) => {
    const user =
      requireAdmin(req, res);

    if (!user) return;

    const index =
      productsList.findIndex(
        p =>
          p.id ===
          req.params.id
      );

    if (index === -1) {
      return res.status(404).json({
        error:
          'Producto no encontrado.'
      });
    }

    productsList[index] = {
      ...productsList[index],
      ...req.body
    };

    res.json({
      success: true,
      product:
        productsList[index]
    });
  }
);


// =============================================================
// ADMIN DELETE PRODUCT
// =============================================================

app.delete(
  '/api/admin/products/:id',
  (req, res) => {
    const user =
      requireAdmin(req, res);

    if (!user) return;

    const product =
      productsList.find(
        p =>
          p.id ===
          req.params.id
      );

    productsList =
      productsList.filter(
        p =>
          p.id !==
          req.params.id
      );

    if (product) {
      addAuditLog(
        'ADMIN_DELETE_PRODUCT',
        product.name,
        user.username,
        'Producto eliminado',
        req.ip || '127.0.0.1'
      );
    }

    res.json({
      success: true,
      message:
        'Producto eliminado.'
    });
  }
);


// =============================================================
// ADMIN GIFT
// =============================================================

app.post(
  '/api/admin/gift',
  (req, res) => {
    const user =
      requireAdmin(req, res);

    if (!user) return;

    const {
      targetUsername,
      productId
    } = req.body || {};

    if (!productId) {
      return res.status(400).json({
        error:
          'Seleccione un recurso.'
      });
    }

    const product =
      productsList.find(
        p =>
          p.id === productId
      );

    if (!product) {
      return res.status(404).json({
        error:
          'Producto no encontrado.'
      });
    }

    const recipient =
      targetUsername ||
      user.username;

    const license = {
      id:
        `lic-gift-${Date.now()}`,

      licenseKey:
        generateLicenseKey('XF-GIFT'),

      productId:
        product.id,

      productName:
        product.name,

      userId:
        recipient ===
        user.username
          ? user.id
          : `usr-${Date.now()}`,

      username:
        recipient,

      discordId:
        recipient ===
        user.username
          ? user.discordId
          : '',

      serverIp:
        '',

      serverPort:
        22003,

      status:
        'ACTIVE',

      activatedAt:
        new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19),

      lastValidatedAt:
        'Pendiente de inicio'
    };

    licensesList.unshift(
      license
    );

    if (
      recipient ===
      user.username
    ) {
      if (
        !user.purchasedProductIds
      ) {
        user.purchasedProductIds =
          [];
      }

      if (
        !user.purchasedProductIds.includes(
          product.id
        )
      ) {
        user.purchasedProductIds.push(
          product.id
        );
      }
    }

    res.json({
      success: true,
      license,
      message:
        `Recurso "${product.name}" regalado correctamente.`
    });
  }
);


// =============================================================
// ADMIN LICENSE STATUS
// =============================================================

app.post(
  '/api/admin/licenses/status',
  (req, res) => {
    const user =
      requireAdmin(req, res);

    if (!user) return;

    const {
      licenseKey,
      status
    } = req.body || {};

    const allowedStatuses = [
      'ACTIVE',
      'SUSPENDED',
      'REVOKED',
      'EXPIRED'
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        error:
          'Estado de licencia inválido.'
      });
    }

    const license =
      licensesList.find(
        l =>
          l.licenseKey ===
          licenseKey
      );

    if (!license) {
      return res.status(404).json({
        error:
          'Licencia no encontrada.'
      });
    }

    license.status =
      status;

    addAuditLog(
      'ADMIN_LICENSE_STATUS',
      license.productName,
      user.username,
      `Estado cambiado a ${status}`,
      req.ip || '127.0.0.1'
    );

    res.json({
      success: true,
      license
    });
  }
);


// =============================================================
// ADMIN LOGS
// =============================================================

app.get(
  '/api/admin/logs',
  (req, res) => {
    const user =
      requireAdmin(req, res);

    if (!user) return;

    res.json({
      logs:
        auditLogs
    });
  }
);


// =============================================================
// HEALTH CHECK
// =============================================================

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      status:
        'ok',

      app:
        'XF CODE',

      discord:
        Boolean(
          DISCORD_CLIENT_ID &&
          DISCORD_CLIENT_SECRET
        ),

      paypal:
        Boolean(
          PAYPAL_CLIENT_ID &&
          PAYPAL_CLIENT_SECRET
        ),

      database:
        Boolean(
          process.env.DATABASE_URL
        ),

      timestamp:
        new Date().toISOString()
    });
  }
);


// =============================================================
// VITE / STATIC
// =============================================================

async function startServer() {
  if (
    process.env.NODE_ENV !==
    'production'
  ) {
    const vite =
      await createViteServer({
        server: {
          middlewareMode: true
        },

        appType:
          'spa'
      });

    app.use(
      vite.middlewares
    );
  } else {
    const distPath =
      path.join(
        process.cwd(),
        'dist'
      );

    app.use(
      express.static(
        distPath
      )
    );

    app.get(
      '*',
      (req, res) => {
        res.sendFile(
          path.join(
            distPath,
            'index.html'
          )
        );
      }
    );
  }

  app.listen(
    PORT,
    '0.0.0.0',
    () => {
      console.log(
        `[XF CODE] Server running on port ${PORT}`
      );

      console.log(
        `[XF CODE] Discord OAuth: ${Boolean(DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET)}`
      );

      console.log(
        `[XF CODE] PayPal: ${Boolean(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET)}`
      );
    }
  );
}


startServer();

export default app;