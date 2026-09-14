"use client";

import { useEffect, useState } from "react";

import {
  getLocalAccount,
  subscribeToLocalAccount,
  type LocalAccount,
} from "@/lib/localAccount";

export function useLocalAccount() {
  const [account, setAccount] = useState<LocalAccount | null>(
    null
  );

  useEffect(() => {
    setAccount(getLocalAccount());
    return subscribeToLocalAccount(setAccount);
  }, []);

  return account;
}
