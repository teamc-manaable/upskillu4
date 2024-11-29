import axios from 'axios';

const ZOOM_API_BASE = 'https://api.zoom.us/v2';
const CLIENT_ID = import.meta.env.VITE_ZOOM_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_ZOOM_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiration: number | null = null;

export async function getZoomAccessToken() {
  // Check if we have a valid cached token
  if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
    return accessToken;
  }

  const authString = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  
  try {
    const response = await axios.post('https://zoom.us/oauth/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Cache the token and set expiration
    accessToken = response.data.access_token;
    tokenExpiration = Date.now() + (response.data.expires_in * 1000);

    return accessToken;
  } catch (error) {
    console.error('Error getting Zoom access token:', error);
    throw new Error('Failed to authenticate with Zoom');
  }
}

export async function validateZoomWebhook(request: Request) {
  const timestamp = request.headers.get('x-zm-request-timestamp');
  const signature = request.headers.get('x-zm-signature');
  const secretToken = import.meta.env.VITE_ZOOM_SECRET_TOKEN;

  if (!timestamp || !signature || !secretToken) {
    return false;
  }

  try {
    // Validate webhook using secret token
    const message = `v0:${timestamp}:${await request.text()}`;
    const hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(message + secretToken)
    );
    
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const expectedSignature = `v0=${hashHex}`;

    return signature === expectedSignature;
  } catch (error) {
    console.error('Error validating Zoom webhook:', error);
    return false;
  }
}

export function formatZoomDateTime(date: string, time: string) {
  return `${date}T${time}:00Z`;
}

export function parseDurationToMinutes(duration: string): number {
  const match = duration.match(/(\d+(?:\.\d+)?)\s*(hour|hours)/);
  return match ? Math.round(parseFloat(match[1]) * 60) : 60;
}