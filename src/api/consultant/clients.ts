interface ClientsRequest {
  consultantId?: string;
  consultantEmail?: string;
  countryId: number;
  search?: string;
  limit?: number;
  offset?: number;
}

interface ClientsResponse {
  data?: any[];
  count?: number;
  error?: string;
}

export async function getConsultantClients(request: ClientsRequest): Promise<ClientsResponse> {
  try {
    // This function now makes a fetch call to the server-side API
    const response = await fetch('/api/consultant/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.error || `API error: ${response.status}` };
    }

    const result = await response.json();
    return { data: result.data || [], count: result.count || 0 };
  } catch (error: any) {
    return { error: error.message || 'fetch error' };
  }
}

// Browser-compatible fetch wrapper
export async function fetchConsultantClients(request: ClientsRequest): Promise<ClientsResponse> {
  try {
    return await getConsultantClients(request);
  } catch (e: any) {
    console.error('❌ [CLIENT] Fetch error:', e);
    return { error: e.message || 'fetch error' };
  }
}