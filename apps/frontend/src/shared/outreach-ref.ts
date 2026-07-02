const KEY = "erp.outreachRef";

export function captureOutreachRefFromUrl() {
  try {
    const ref = new URLSearchParams(window.location.search).get("wftref");
    if (ref?.trim()) sessionStorage.setItem(KEY, ref.trim());
  } catch {
    // ignore
  }
}

export function getOutreachRef() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function outreachRefPayload() {
  const ref = getOutreachRef();
  return ref ? { outreach_ref: ref } : {};
}
