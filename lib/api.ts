import axios from 'axios';
import type { PredictRequest, PredictResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function predict(data: PredictRequest): Promise<PredictResponse> {
  const response = await axios.post<PredictResponse>(`${BASE_URL}/predict`, data);
  console.log('API request payload:', data);
  console.log('API response:', response);
  return response.data;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return 'Backend unreachable — running in offline mode. Sliders and 3D preview remain active.';
    }
    const detail = error.response.data as { detail?: string };
    if (typeof detail?.detail === 'string') return detail.detail;
    return `API error (${error.response.status})`;
  }
  if (error instanceof Error) return error.message;
  return 'Unknown error occurred';
}
