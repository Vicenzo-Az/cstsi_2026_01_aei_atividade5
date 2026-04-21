import { useEffect, useMemo, useRef, useState } from "react";

type Scenario = "stable" | "growth" | "alert";

type ScenarioData = {
  values: number[];
  color: string;
};

const SCENARIOS: Record<Scenario, ScenarioData> = {
  stable: {
    values: [42, 48, 51, 49],
    color: "#34d399",
  },
  growth: {
    values: [30, 44, 63, 78],
    color: "#22d3ee",
  },
  alert: {
    values: [60, 54, 38, 31],
    color: "#f97316",
  },
};

const SCENARIO_ORDER: Scenario[] = ["stable", "growth", "alert"];

const BASELINE_Y = 270;
const MAX_BAR_HEIGHT = 160;
const MIN_BAR_HEIGHT = 24;

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function renderBar(
  bar: SVGRectElement,
  value: number,
  maxValue: number,
  color: string,
) {
  const scaledHeight = Math.max(
    MIN_BAR_HEIGHT,
    Math.round((value / maxValue) * MAX_BAR_HEIGHT),
  );
  const y = BASELINE_Y - scaledHeight;

  bar.setAttribute("y", String(y));
  bar.setAttribute("height", String(scaledHeight));
  bar.setAttribute("fill", color);
  bar.dataset.currentValue = String(value);
}

function animateScenarioToSvg(
  objectRef: HTMLObjectElement,
  values: number[],
  color: string,
) {
  const doc = objectRef.contentDocument;

  if (!doc) return;

  const maxValue = Math.max(...values, 1);
  const bars: SVGRectElement[] = [];
  const fromValues: number[] = [];

  values.forEach((value, index) => {
    const position = index + 1;
    const bar = doc.getElementById(
      `chart-bar-${position}`,
    ) as SVGRectElement | null;

    if (!bar) return;

    bars.push(bar);
    const current = Number.parseFloat(
      bar.dataset.currentValue ?? String(value),
    );
    fromValues.push(Number.isNaN(current) ? value : current);
  });

  if (bars.length === 0) return;

  const duration = 900;
  const start = performance.now();

  const frame = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    bars.forEach((bar, index) => {
      const from = fromValues[index];
      const to = values[index];
      const interpolated = from + (to - from) * eased;
      renderBar(bar, interpolated, maxValue, color);
    });

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
}

export function InteractiveSvgChart() {
  const objectRef = useRef<HTMLObjectElement | null>(null);
  const [scenario, setScenario] = useState<Scenario>("stable");

  const selectedScenario = useMemo(() => SCENARIOS[scenario], [scenario]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScenario((current) => {
        const currentIndex = SCENARIO_ORDER.indexOf(current);
        const nextIndex = (currentIndex + 1) % SCENARIO_ORDER.length;
        return SCENARIO_ORDER[nextIndex];
      });
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const objectElement = objectRef.current;

    if (!objectElement) return;

    animateScenarioToSvg(
      objectElement,
      selectedScenario.values,
      selectedScenario.color,
    );
  }, [selectedScenario]);

  return (
    <div className="svgator-panel space-y-4">
      <object
        ref={objectRef}
        data="/finance-orbit.svg"
        type="image/svg+xml"
        aria-label="Grafico SVG animado e interativo"
        className="mx-auto h-56 w-full rounded-xl"
        onLoad={() => {
          if (!objectRef.current) return;

          animateScenarioToSvg(
            objectRef.current,
            selectedScenario.values,
            selectedScenario.color,
          );
        }}
      >
        Seu navegador nao conseguiu carregar o SVG animado.
      </object>
    </div>
  );
}
