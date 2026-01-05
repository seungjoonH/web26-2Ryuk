import IS from '@/utils/is';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class HttpService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  private static async request<T>(url: string, method: HttpMethod, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const requestInit: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (!IS.nil(body)) requestInit.body = JSON.stringify(body);

    const response = await fetch(this.BASE_URL + url, requestInit);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) return response.json();

    return response.text() as T;
  }

  static async get<T>(url: string): Promise<T> {
    return this.request<T>(url, 'GET');
  }

  static async post<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>(url, 'POST', data);
  }

  static async put<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>(url, 'PUT', data);
  }

  static async patch<T>(url: string, data?: unknown): Promise<T> {
    return this.request<T>(url, 'PATCH', data);
  }

  static async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, 'DELETE');
  }
}
