export type DeviceLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

const CACHE_KEY = "erp.deviceLocation";

export function readCachedDeviceLocation(): DeviceLocation | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeviceLocation;
    if (typeof parsed.latitude !== "number" || typeof parsed.longitude !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Device location collection is disabled (no browser location prompt). */
export async function readDeviceLocation(_timeoutMs = 5000): Promise<DeviceLocation | null> {
  return null;
}

export function deviceLocationPayload(loc: DeviceLocation | null) {
  if (!loc) return {};
  return {
    latitude: loc.latitude,
    longitude: loc.longitude,
    ...(loc.accuracy != null ? { location_accuracy: loc.accuracy } : {})
  };
}
