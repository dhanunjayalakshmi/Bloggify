export function getAuthToken() {
  try {
    const storageData = localStorage?.getItem("auth-storage");
    if (!storageData) return null;

    const parsed = JSON.parse(storageData);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}
