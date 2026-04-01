const BACKEND_BASE = "https://backend.delhimetrorail.com/api/v2/en";

const HEADERS: HeadersInit = {
  "content-type": "application/json",
  origin: "https://delhimetrorail.com",
  referer: "https://delhimetrorail.com/",
};

export async function metroFetch(path: string, init?: RequestInit) {
  const url = `${BACKEND_BASE}${path}`;
  return fetch(url, {
    ...init,
    headers: {
      ...HEADERS,
      ...init?.headers,
    },
  });
}
