import { useEffect } from "react";
import type { EvilEyeProps } from "../reactbits/EvilEye";

/** Stands in for EvilEye when its chunk fails to load, reporting the failure like a WebGL error. */
export default function EvilEyeLoadFailure({ onError }: EvilEyeProps) {
  useEffect(() => {
    onError?.(new Error("EvilEye chunk failed to load"));
  }, [onError]);

  return null;
}
