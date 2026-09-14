export type LocalAccount = {
  email: string;
  trialStartedAt?: string;
};

const STORAGE_KEY = "the-angle-report-account";
const CHANGE_EVENT = "the-angle-report-account-change";

function readAccount(): LocalAccount | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as LocalAccount;

    if (!parsed?.email || typeof parsed.email !== "string") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function emitChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getLocalAccount(): LocalAccount | null {
  return readAccount();
}

export function saveLocalAccount(account: LocalAccount) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(account)
  );
  emitChange();
}

export function clearLocalAccount() {
  window.localStorage.removeItem(STORAGE_KEY);
  emitChange();
}

export function subscribeToLocalAccount(
  listener: (account: LocalAccount | null) => void
) {
  const notify = () => listener(readAccount());

  notify();
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener("storage", notify);

  return () => {
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}
