"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns false during server rendering and the first client render, then true
 * after hydration. Safe for components that must not render client-only UI on
 * the server without triggering a setState-in-effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
