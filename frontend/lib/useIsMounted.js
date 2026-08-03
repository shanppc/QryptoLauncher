import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false during SSR and the first client render, true afterwards.
 * Used to gate wallet-dependent UI so markup matches on hydration.
 */
export function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client
    () => false // server
  );
}
