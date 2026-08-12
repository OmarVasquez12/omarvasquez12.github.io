import { Request, Response, Router } from 'express';
import { GoogleGenAI } from '@google/genai';

export const apiRouter = Router();

// In-memory session store for demo auth sessions
const userSessions = new Map<string, any>();

// Helper to construct App URL
function getAppUrl(req: Request): string {
  if (process.env.APP_URL && process.env.APP_URL.startsWith('http')) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

// 1. Get OAuth Authorization URL
apiRouter.get('/auth/discord/url', (req: Request, res: Response) => {
  const baseUrl = getAppUrl(req);
  const redirectUri = `${baseUrl}/api/auth/discord/callback`;
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!clientId) {
    // Return setup info if Client ID is missing
    return res.json({
      configured: false,
      redirectUri,
      message: 'DISCORD_CLIENT_ID no configurado en variables de entorno.',
      url: null,
    });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify guilds email',
    prompt: 'consent',
  });

  const url = `https://discord.com/oauth2/authorize?${params.toString()}`;
  return res.json({
    configured: true,
    redirectUri,
    url,
  });
});

// 2. OAuth Callback
apiRouter.get(['/auth/discord/callback', '/auth/discord/callback/'], async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  const baseUrl = getAppUrl(req);
  const redirectUri = `${baseUrl}/api/auth/discord/callback`;

  if (error) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Error de Autenticación</title></head>
        <body style="background:#1e1f22;color:#f2f3f5;font-family:sans-serif;padding:2rem;text-align:center;">
          <h2 style="color:#f23f43;">Error al autorizar con Discord</h2>
          <p>${error}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}' }, '*');
              setTimeout(() => window.close(), 2000);
            }
          </script>
        </body>
      </html>
    `);
  }

  try {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;

    let userData: any = null;

    if (clientId && clientSecret && code) {
      // Real Discord OAuth token exchange
      const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errJson = await tokenResponse.json();
        throw new Error(errJson.error_description || 'Fallo en intercambio de token Discord');
      }

      const tokens = await tokenResponse.json();

      // Fetch user profile from Discord API
      const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (userResponse.ok) {
        userData = await userResponse.json();
      }
    } else {
      // Demo / Test fallback user if testing mode or local trial
      userData = {
        id: '123456789012345678',
        username: 'DiscordUser',
        discriminator: '0',
        global_name: 'Usuario Conectado',
        avatar: null,
        email: 'usuario@discord.app',
        verified: true,
        accent_color: 5793266,
        isDemo: true,
      };
    }

    // Return HTML response that posts message to opener window
    const jsonUser = JSON.stringify(userData).replace(/'/g, "\\'");
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Autenticación Exitosa</title>
          <style>
            body {
              background: #1e1f22;
              color: #f2f3f5;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .card {
              background: #2b2d31;
              padding: 24px 32px;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(0,0,0,0.4);
              text-align: center;
              max-width: 360px;
            }
            .btn {
              background: #5865f2;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-weight: 600;
              margin-top: 16px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h3 style="margin-top:0; color:#5865f2;">¡Conectado con Éxito!</h3>
            <p style="font-size:14px; color:#b5bac1;">Tu cuenta de Discord ha sido enlazada correctamente.</p>
            <p style="font-size:12px; color:#949ba4;">Esta ventana se cerrará automáticamente...</p>
            <button class="btn" onclick="finish()">Continuar</button>
          </div>
          <script>
            const user = ${JSON.stringify(userData)};
            function finish() {
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            }
            setTimeout(finish, 1200);
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Error OAuth</title></head>
        <body style="background:#1e1f22;color:#f2f3f5;font-family:sans-serif;padding:2rem;text-align:center;">
          <h3 style="color:#f23f43;">Error al completar el inicio de sesión</h3>
          <p>${err.message || 'Error desconocido'}</p>
          <button onclick="window.close()" style="background:#5865f2;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">Cerrar</button>
        </body>
      </html>
    `);
  }
});

// 3. Webhook Sender Proxy
apiRouter.post('/discord/webhook', async (req: Request, res: Response) => {
  const { webhookUrl, payload } = req.body;

  const targetUrl = webhookUrl || process.env.DISCORD_WEBHOOK_URL;

  if (!targetUrl) {
    return res.status(400).json({
      success: false,
      error: 'No se proporcionó URL de Webhook y no hay DISCORD_WEBHOOK_URL por defecto.',
    });
  }

  // Validate format
  if (!targetUrl.startsWith('https://discord.com/api/webhooks/') && !targetUrl.startsWith('https://discordapp.com/api/webhooks/')) {
    return res.status(400).json({
      success: false,
      error: 'URL de Webhook inválida. Debe comenzar con https://discord.com/api/webhooks/',
    });
  }

  try {
    const discordRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (discordRes.status === 204 || discordRes.ok) {
      return res.json({
        success: true,
        status: discordRes.status,
        message: '¡Mensaje enviado a Discord correctamente!',
      });
    } else {
      const errBody = await discordRes.text();
      return res.status(discordRes.status).json({
        success: false,
        status: discordRes.status,
        error: `Discord API error (${discordRes.status}): ${errBody}`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Fallo de red al conectar con Discord',
    });
  }
});

// 4. Server Widget Info Proxy
apiRouter.get('/discord/widget/:guildId', async (req: Request, res: Response) => {
  const { guildId } = req.params;

  try {
    const widgetRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/widget.json`);

    if (widgetRes.ok) {
      const widgetData = await widgetRes.json();
      return res.json({ success: true, data: widgetData });
    } else {
      // Fallback sample server widget
      return res.json({
        success: false,
        error: 'El Widget del servidor está desactivado en los ajustes de Discord o la ID es incorrecta.',
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. AI Assistant endpoint (Gemini Server Side)
apiRouter.post('/ai/generate', async (req: Request, res: Response) => {
  const { prompt, type } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'GEMINI_API_KEY no está configurada.',
      });
    }

    const ai = new GoogleGenAI({});
    
    let systemInstruction = "Eres un asistente experto en Discord, diseño de servidores, bot config y formato de embeds de Discord Markdown.";
    if (type === 'embed') {
      systemInstruction += " Genera respuestas estructuradas en formato JSON para un Embed de Discord con campos: title, description, color (número decimal de color como 5793266), fields ([{name, value, inline}]), footer ({text}). Responde SOLO con el JSON del Embed.";
    } else if (type === 'rules') {
      systemInstruction += " Genera un conjunto profesional de Reglas de Servidor de Discord formateadas con emojis y Markdown de Discord.";
    } else if (type === 'welcome') {
      systemInstruction += " Genera un mensaje de bienvenida llamativo para nuevos miembros de un servidor de Discord.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      success: true,
      text: response.text,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error al procesar con Gemini AI',
    });
  }
});

// 6. Current App & Discord System Configuration Status
apiRouter.get('/config', (req: Request, res: Response) => {
  const baseUrl = getAppUrl(req);
  res.json({
    appUrl: baseUrl,
    redirectUri: `${baseUrl}/api/auth/discord/callback`,
    hasClientId: Boolean(process.env.DISCORD_CLIENT_ID),
    hasClientSecret: Boolean(process.env.DISCORD_CLIENT_SECRET),
    hasDefaultWebhook: Boolean(process.env.DISCORD_WEBHOOK_URL),
    hasBotToken: Boolean(process.env.DISCORD_BOT_TOKEN),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});
