export interface PortData {
  port: number;
}

let API_URL: string | null = null;

export const getApiUrl = async (): Promise<string> => {
  if (API_URL) return API_URL;

  const res = await fetch("/port");  // <-- backend endpoint returns current port
  const data: PortData = await res.json();
  API_URL = `http://127.0.0.1:${data.port}`;

  return API_URL;
};