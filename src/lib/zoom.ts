import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

const API_KEY = import.meta.env.VITE_ZOOM_API_KEY;
const API_SECRET = import.meta.env.VITE_ZOOM_API_SECRET;

export async function generateSignature(meetingNumber: string) {
  const role = 0; // 0 for attendee, 1 for host
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(API_KEY + meetingNumber + timestamp + role).toString('base64');
  const hash = crypto.createHmac('sha256', API_SECRET).update(msg).digest('base64');
  const signature = Buffer.from(`${API_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

  return signature;
}

export async function initializeZoomMeeting(
  meetingNumber: string,
  userName: string,
  userEmail: string,
  password: string
) {
  const signature = await generateSignature(meetingNumber);

  return new Promise((resolve, reject) => {
    ZoomMtg.init({
      leaveUrl: window.location.origin,
      success: () => {
        ZoomMtg.join({
          signature,
          meetingNumber,
          userName,
          userEmail,
          passWord: password,
          apiKey: API_KEY,
          success: (res: any) => resolve(res),
          error: (err: any) => reject(err)
        });
      },
      error: (err: any) => reject(err)
    });
  });
}