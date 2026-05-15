const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'https://api.kyndara.ai'
const PROFILE_SERVICE_URL = process.env.NEXT_PUBLIC_PROFILE_SERVICE_URL || '/api-proxy'
const CONTENT_SERVICE_URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '/api-proxy'

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token");

    const res = await fetch(`${AUTH_SERVICE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error("Refresh rejected");

    const { token, refreshToken: newRefreshToken, user } = json.data;

    localStorage.setItem("auth_token", token);
    localStorage.setItem("refresh_token", newRefreshToken);
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));

    return token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return null;
  }
};

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let res = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;

    if (newToken) {
      res = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(), 
          ...options.headers,
        },
      });
    } else {
      throw new Error("Session expired.");
    }
  }

  if (res.status === 403) {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("auth:unauthorized"));
    throw new Error("Access denied.");
  }

  return res;
}

export interface AnalyticsData {
  totalUsers: number;
  totalContent: number;
  pendingApprovals: number;
  verifiedPublishers: number;
  monthlyGrowth: Array<{ month: string; users: number }>;
}

export interface ContentItem {
  id: string
  title: string
  publisher: string
  type: 'Video' | 'Article' | 'Short' | 'Audio'
  status: string
  submittedDate: string
  description: string
  playbackUrl?: string
  thumbnailUrl?: string
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  try {
    const res = await fetchWithAuth(`${CONTENT_SERVICE_URL}/admin/analytics/content`);

    if (!res.ok) throw new Error("Failed to fetch analytics");
    const json = await res.json();
    const data = json.data || {};

    return {
      totalUsers: data.totalUsers || 0,
      totalContent: data.totalContent || 0,
      pendingApprovals: data.pendingApprovals || 0,
      verifiedPublishers: data.verifiedPublishers || 0,
      monthlyGrowth: data.monthlyGrowth || [], 
    };
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return {
      totalUsers: 0, totalContent: 0, pendingApprovals: 0, verifiedPublishers: 0, monthlyGrowth: [],
    };
  }
}

export async function fetchModerationQueue(): Promise<ContentItem[]> {
  const res = await fetchWithAuth(`${CONTENT_SERVICE_URL}/moderate/pending`);
  if (!res.ok) throw new Error(`Failed to fetch moderation queue`);

  const json = await res.json();
  const items = json.data?.items || json.data || json.items || [];

  const typeMap: Record<string, 'Video' | 'Article' | 'Short' | 'Audio'> = {
    VIDEO: 'Video', ARTICLE: 'Article', SHORT: 'Short', SHORTS: 'Short', AUDIO: 'Audio',
  }

  return items.map((item: any) => ({
    id: item.id?.toString() || '',
    title: item.title || 'Untitled',
    publisher: item.publisher?.displayName || 'Unknown Publisher',
    type: typeMap[String(item.type ?? '').toUpperCase()] ?? 'Video',
    status: item.status || 'PENDING',
    submittedDate: item.createdAt || new Date().toISOString(),
    description: item.description || '',
    playbackUrl: item.media?.videos?.[0] || '',
    thumbnailUrl: item.media?.thumbnail || item.media?.images?.[0] || '',
  }))
}

export async function approveContent(id: string): Promise<{ success: boolean }> {
  const res = await fetchWithAuth(`${CONTENT_SERVICE_URL}/moderate/${id}/approve`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to approve content");
  return await res.json();
}

export async function rejectContent(id: string): Promise<{ success: boolean }> {
  const res = await fetchWithAuth(`${CONTENT_SERVICE_URL}/moderate/${id}/reject`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to reject content");
  return await res.json();
}

export interface PublisherApplication {
  id: string
  userId: string
  displayName: string
  email: string
  bio?: string
  website?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    youtube?: string
  }
  category?: string
  appliedDate: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  followerCount?: number
  contentCount?: number
  avatarUrl?: string
}
 
export async function fetchPublisherApplications(): Promise<PublisherApplication[]> {
  const res = await fetchWithAuth(`${PROFILE_SERVICE_URL}/admin/publishers/pending`)
  if (!res.ok) throw new Error('Failed to fetch publisher applications')
 
  const json = await res.json()
  const items = json.data?.items || json.data || json.items || []
 
  return items.map((item: any) => ({
    id: item.id?.toString() || '',
    userId: item.userId?.toString() || item.user?.id?.toString() || '',
    displayName: item.displayName || item.user?.displayName || item.name || 'Unknown',
    email: item.email || item.user?.email || '',
    bio: item.bio || item.description || '',
    website: item.website || item.websiteUrl || '',
    socialLinks: item.socialLinks || {},
    category: item.category || item.contentCategory || '',
    appliedDate: item.createdAt || item.appliedAt || new Date().toISOString(),
    status: item.status || 'PENDING',
    followerCount: item.followerCount || item.followers || 0,
    contentCount: item.contentCount || item.totalContent || 0,
    avatarUrl: item.avatarUrl || item.profileImage || item.user?.avatarUrl || '',
  }))
}
 
export async function approvePublisher(id: string): Promise<{ success: boolean }> {
  const res = await fetchWithAuth(`${PROFILE_SERVICE_URL}/admin/publishers/${id}/approve`, {
    method: 'PUT',
  })
 
  let body: any = null
  try { body = await res.json() } catch {}
 
  if (!res.ok) {
    const message = body?.message || body?.error || body?.detail || `HTTP ${res.status}`
    console.error('approvePublisher failed:', res.status, body)
    throw new Error(`Failed to approve publisher: ${message}`)
  }
 
  return body
}
 
export async function rejectPublisher(id: string): Promise<{ success: boolean }> {
  const res = await fetchWithAuth(`${PROFILE_SERVICE_URL}/admin/publishers/${id}/reject`, {
    method: 'PUT',
  })
 
  let body: any = null
  try { body = await res.json() } catch {}
 
  if (!res.ok) {
    const message = body?.message || body?.error || body?.detail || `HTTP ${res.status}`
    console.error('rejectPublisher failed:', res.status, body)
    throw new Error(`Failed to reject publisher: ${message}`)
  }
 
  return body
}