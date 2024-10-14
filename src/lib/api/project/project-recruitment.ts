import { getAuthHeader } from './header';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface IRecruitResponse {
  id: number;
  previewImageUrl: string;
  title: string;
  recruitmentRole: 'MODEL' | 'PHOTOGRAPHER';
  shootingAt: string; // Date
  timeOption: string;
  spot: string;
  concepts: string[];
  isBookmarked: boolean;
}

export const getRecruitAnnouncements = async (
  recruitmentRole: IRecruitResponse['recruitmentRole'],
) => {
  const queryParam = recruitmentRole
    ? `?recruitmentRole=${recruitmentRole}`
    : '';

  const headers = await getAuthHeader();

  const res = await fetch(`${API_URL}/projects/announcement${queryParam}`, {
    headers,
    cache: 'no-store',
  });
  const data = await res.json();
  if (res.status !== 200) {
    console.error(data.message);
    return []; // TODO: error handling
  }
  return data;
};

export const getRecruitAnnouncement = async (id: number) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_URL}/projects/${id}/announcement`, {
    headers,
    cache: 'no-store',
  });
  const data = await res.json();
  if (res.status !== 200) {
    console.error(data.message);
  }
  return data;
};

export const postAnnouncement = async (formData: FormData) => {
  const headers = await getAuthHeader();

  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      // throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const postRecruitBookmark = async (id: number) => {
  const headers = await getAuthHeader();

  try {
    await fetch(`${API_URL}/projects/${id}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

export const deleteRecruitBookmark = async (id: number) => {
  const headers = await getAuthHeader();

  try {
    await fetch(`${API_URL}/projects/${id}/bookmarks`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

export const postProjectApply = async (
  projectId: number,
  applyContent: string,
) => {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_URL}/projects/${projectId}/apply`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      applyContent,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch completed project');
  }
};