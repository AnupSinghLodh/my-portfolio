import { lazy, Suspense, useCallback, useState, type ComponentType, type RefObject } from "react";
import { withFallback } from "../../lib/lazyWithFallback";
import type { EvilEyeProps } from "../reactbits/EvilEye";
import EvilEyeLoadFailure from "./EvilEyeLoadFailure";

const EvilEye = lazy(
  withFallback<ComponentType<EvilEyeProps>>(() => import("../reactbits/EvilEye"), EvilEyeLoadFailure)
);

type HeroBackgroundProps = { trackingRef: RefObject<HTMLElement | null> };

const glowClassName =
  "absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,111,55,0.32),transparent_55%)] lg:bg-[radial-gradient(circle_at_50%_50%,rgba(255,111,55,0.38),transparent_45%)]";

export default function HeroBackground({ trackingRef }: HeroBackgroundProps) {
  const [failed, setFailed] = useState(false);
  const handleError = useCallback(() => setFailed(true), []);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {/* Wider than the hero on lg so the eye centres at ~65vw without a hard left edge. */}
      <div className="absolute inset-0 opacity-45 lg:-right-[30vw] lg:opacity-100">
        {failed ? (
          <div className={glowClassName} data-reason="webgl-unavailable" />
        ) : (
          <Suspense fallback={<div className={glowClassName} />}>
            <EvilEye
              eyeColor="#ff6f37"
              backgroundColor="#07080a"
              intensity={1.4}
              glowIntensity={0.35}
              scale={0.75}
              pupilFollow={1}
              trackingRef={trackingRef}
              onError={handleError}
            />
          </Suspense>
        )}
      </div>
      <div className="absolute inset-0 bg-bg/40 lg:hidden" />
      <div className="absolute inset-y-0 left-0 hidden w-[72%] bg-linear-to-r from-bg from-35% via-bg/85 to-transparent lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />
    </div>
  );
}
