export function attachHttpStatus(error: Error, status: number): Error {
  (error as Error & { status: number }).status = status;
  return error;
}

export function readHttpStatus(error: unknown): number | null {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return null;
  }

  const status = (error as { status: unknown }).status;

  if (typeof status !== "number" || status < 100 || status > 599) {
    return null;
  }

  return status;
}
