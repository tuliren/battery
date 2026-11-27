import { Gaegu, Young_Serif } from 'next/font/google';
import { FC, KeyboardEvent, PointerEvent, useCallback, useEffect, useRef, useState } from 'react';

import styles from './SalmonLifeCycle.module.css';
import { INK, LN, PAL, RED, SHADOW, toneOf } from './palette';
import { SCENE_RADIUS, STAGES } from './stages';
import { COLUMN_X, STAGE_COUNT, TRACK, TRACK_PATH, activeStageAt, pointAtProgress } from './track';

const gaegu = Gaegu({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-gaegu' });
const youngSerif = Young_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-young-serif',
});

const WIDTH = 1400;
const HEIGHT = 975;
const TOP_Y = 280;
const BOTTOM_Y = 720;
const KNOB = { x: 1290, y: 500, r: 72 };
const WINDOW_RADIUS = SCENE_RADIUS - 12;

// Board-level ink, in sheet units (the sheet is drawn at roughly 0.75 px per unit).
const OUTLINE = 2.4;
const DETAIL = 1.3;

// Start between the last and first stage, on the left end of the track.
const START_PROGRESS = -0.4;

// Degrees the knob must turn before a press counts as a drag rather than a click.
const DRAG_THRESHOLD = 8;

const STAGE_POSITIONS = [
  { x: COLUMN_X[0], y: TOP_Y },
  { x: COLUMN_X[1], y: TOP_Y },
  { x: COLUMN_X[2], y: TOP_Y },
  { x: COLUMN_X[2], y: BOTTOM_Y },
  { x: COLUMN_X[1], y: BOTTOM_Y },
  { x: COLUMN_X[0], y: BOTTOM_Y },
];

const normalizeDegrees = (degrees: number): number => {
  const d = ((degrees % 360) + 360) % 360;
  return d > 180 ? d - 360 : d;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

interface StageProps {
  index: number;
  active: boolean;
  dimmed: boolean;
  activation: number;
}

const StageCircle: FC<StageProps> = ({ index, active, dimmed, activation }) => {
  const { x, y } = STAGE_POSITIONS[index];
  const { Scene, tint } = STAGES[index];
  const clipId = `salmon-circle-${index}`;
  const windowClipId = `salmon-window-${index}`;
  const windowPath = `M ${-WINDOW_RADIUS} 0 A ${WINDOW_RADIUS} ${WINDOW_RADIUS} 0 0 0 ${WINDOW_RADIUS} 0 Z`;

  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={clipId}>
          <circle r={SCENE_RADIUS} />
        </clipPath>
        <clipPath id={windowClipId}>
          <path d={windowPath} />
        </clipPath>
      </defs>

      {/* soft ground shadow */}
      <circle cx={5} cy={8} r={SCENE_RADIUS} fill={SHADOW} opacity={0.16} />

      <g className={styles.medallion} opacity={dimmed ? 0.8 : 1}>
        <circle r={SCENE_RADIUS} fill={tint} />
        <g clipPath={`url(#${clipId})`}>
          <g filter={active ? undefined : 'url(#salmon-dim)'}>
            {/* Remount on every activation so the scene's animation starts from the beginning. */}
            <g key={activation} className={active ? undefined : styles.paused}>
              <Scene />
            </g>
          </g>

          {/* A frosted disc behind the lower window turns away when the stage is reached. */}
          <g clipPath={`url(#${windowClipId})`}>
            <g className={`${styles.shutter} ${active ? styles.shutterOpen : ''}`}>
              <path d={windowPath} fill="#f4efe6" opacity={0.6} />
              <path
                d={`M ${-WINDOW_RADIUS + 34} 18 L ${-WINDOW_RADIUS + 64} 18 L -20 ${
                  WINDOW_RADIUS - 8
                } L -56 ${WINDOW_RADIUS - 24} Z`}
                fill="#ffffff"
                opacity={0.4}
              />
            </g>
          </g>
        </g>

        <path d={windowPath} fill="none" stroke={toneOf(PAL.wood)} strokeWidth={DETAIL} />
        <circle r={SCENE_RADIUS} fill="none" stroke={INK} strokeWidth={OUTLINE} />
      </g>

      {/* the red pen rings the stage the arrow has reached */}
      <circle
        r={SCENE_RADIUS + 11}
        fill="none"
        stroke={RED}
        strokeWidth={4.5}
        strokeLinecap="round"
        className={`${styles.ring} ${active ? styles.ringOn : ''}`}
      />
    </g>
  );
};

const StageLabel: FC<{ index: number; active: boolean; dimmed: boolean }> = ({
  index,
  active,
  dimmed,
}) => {
  const { x, y } = STAGE_POSITIONS[index];
  const { name, note } = STAGES[index];
  const isTop = y === TOP_Y;
  const nameY = isTop ? 72 : BOTTOM_Y + SCENE_RADIUS + 54;

  return (
    <g className={styles.label} opacity={dimmed ? 0.7 : 1} textAnchor="middle">
      <text x={x} y={nameY} fontSize={32} className={styles.smallCaps} fill={active ? RED : INK}>
        {`${index + 1}. ${name}`}
      </text>
      <text x={x} y={nameY + 32} fontSize={26} fill={LN}>
        {note}
      </text>
    </g>
  );
};

const SalmonLifeCycle: FC = () => {
  const [progress, setProgress] = useState(START_PROGRESS);
  const [started, setStarted] = useState(false);
  const [activations, setActivations] = useState<number[]>(() => Array(STAGE_COUNT).fill(0));

  const progressRef = useRef(START_PROGRESS);
  const targetRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const knobRef = useRef<SVGGElement>(null);
  const dragRef = useRef<{ lastAngle: number; turned: number; dragging: boolean } | null>(null);

  const activeStage = started ? activeStageAt(progress) : null;

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    []
  );

  const lastStageRef = useRef<number | null>(null);

  const updateProgress = useCallback((value: number) => {
    progressRef.current = value;
    setProgress(value);
    setStarted(true);
    // Count each arrival so the stage's animation restarts from the beginning.
    const stage = activeStageAt(value);
    if (stage !== lastStageRef.current) {
      lastStageRef.current = stage;
      setActivations((prev) => prev.map((count, i) => (i === stage ? count + 1 : count)));
    }
  }, []);

  const runAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = targetRef.current;
      if (target === null) {
        frameRef.current = null;
        return;
      }
      const remaining = target - progressRef.current;
      if (Math.abs(remaining) < 0.002) {
        updateProgress(target);
        targetRef.current = null;
        frameRef.current = null;
        return;
      }
      // Ease out near the target, but never crawl.
      const speed = clamp(Math.abs(remaining) * 1.8, 0.4, 1.2);
      const delta = Math.sign(remaining) * Math.min(Math.abs(remaining), speed * dt);
      updateProgress(progressRef.current + delta);
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  }, [updateProgress]);

  const moveBy = useCallback(
    (stages: number) => {
      const from = targetRef.current ?? progressRef.current;
      const base = stages > 0 ? Math.floor(from + 0.05) : Math.ceil(from - 0.05);
      targetRef.current = base + stages;
      runAnimation();
    },
    [runAnimation]
  );

  const angleFromKnob = (event: PointerEvent): number => {
    const rect = knobRef.current?.getBoundingClientRect();
    if (!rect) {
      return 0;
    }
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(event.clientY - cy, event.clientX - cx) * 180) / Math.PI;
  };

  const onPointerDown = (event: PointerEvent<SVGGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { lastAngle: angleFromKnob(event), turned: 0, dragging: false };
  };

  const onPointerMove = (event: PointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    const angle = angleFromKnob(event);
    const delta = normalizeDegrees(angle - drag.lastAngle);
    drag.lastAngle = angle;
    drag.turned += Math.abs(delta);
    if (!drag.dragging && drag.turned > DRAG_THRESHOLD) {
      drag.dragging = true;
      targetRef.current = null;
    }
    if (drag.dragging) {
      // One full turn of the knob moves the arrow by one stage.
      updateProgress(progressRef.current + delta / 360);
    }
  };

  const onPointerUp = (event: PointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag && !drag.dragging) {
      moveBy(1);
    }
  };

  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (['Enter', ' ', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      moveBy(1);
    } else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      moveBy(-1);
    }
  };

  const arrow = pointAtProgress(progress);
  const knobAngle = progress * 360;
  const trackMidY = (TRACK.top + TRACK.bottom) / 2;
  const labelRadius = KNOB.r + 26;
  const rail = PAL.tan;

  return (
    <div className={`${styles.desk} ${gaegu.variable} ${youngSerif.variable}`}>
      <div className={styles.card}>
        <div className={styles.cap}>
          <h3>The salmon life cycle</h3>
          <span>six stops, round and round</span>
        </div>

        <svg
          className={styles.board}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="The salmon life cycle. Turn the red knob to move the arrow through each stage."
        >
          <defs>
            <filter id="salmon-dim">
              <feColorMatrix type="saturate" values="0.6" />
            </filter>
            <path
              id="salmon-knob-label"
              d={`M ${KNOB.x - labelRadius} ${KNOB.y} A ${labelRadius} ${labelRadius} 0 0 1 ${
                KNOB.x + labelRadius
              } ${KNOB.y}`}
            />
          </defs>

          {STAGES.map((_, i) => (
            <StageLabel
              key={i}
              index={i}
              active={activeStage === i}
              dimmed={activeStage !== null && activeStage !== i}
            />
          ))}

          {/* the rail the arrow runs round */}
          <path
            d={TRACK_PATH}
            fill="none"
            stroke={SHADOW}
            strokeWidth={34}
            opacity={0.14}
            transform="translate(4 7)"
          />
          <path d={TRACK_PATH} fill="none" stroke={INK} strokeWidth={34 + OUTLINE * 2} />
          <path d={TRACK_PATH} fill="none" stroke={rail} strokeWidth={34} />
          <path d={TRACK_PATH} fill="none" stroke={toneOf(rail)} strokeWidth={DETAIL} />
          <text
            x={(TRACK.left + TRACK.right) / 2}
            y={trackMidY + 15}
            textAnchor="middle"
            fontSize={42}
            fill={INK}
            className={styles.serif}
          >
            The Salmon Life Cycle
          </text>

          {STAGES.map((_, i) => (
            <StageCircle
              key={i}
              index={i}
              active={activeStage === i}
              dimmed={activeStage !== null && activeStage !== i}
              activation={activations[i]}
            />
          ))}

          {/* the red arrow */}
          <g transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}>
            <polygon
              points="28,0 -8,-19 -8,19"
              fill={RED}
              stroke={INK}
              strokeWidth={OUTLINE}
              strokeLinejoin="round"
            />
            <path
              d="M 18 -2 L 0 -11"
              stroke="#ffffff"
              strokeWidth={2}
              opacity={0.45}
              strokeLinecap="round"
            />
          </g>

          {/* the knob */}
          <text fontSize={28} fill={LN}>
            <textPath href="#salmon-knob-label" startOffset="50%" textAnchor="middle">
              turn me
            </textPath>
          </text>
          <g
            ref={knobRef}
            className={styles.knob}
            transform={`translate(${KNOB.x} ${KNOB.y})`}
            role="button"
            tabIndex={0}
            aria-label="Turn the knob to the next stage"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          >
            <circle cx={5} cy={8} r={KNOB.r + 8} fill={SHADOW} opacity={0.18} />
            <circle r={KNOB.r + 8} fill={toneOf(PAL.knob)} stroke={INK} strokeWidth={OUTLINE} />
            <circle
              r={KNOB.r}
              fill={PAL.knob}
              stroke={INK}
              strokeWidth={DETAIL}
              className={styles.knobFocus}
            />
            <g transform={`rotate(${knobAngle})`}>
              <circle r={KNOB.r - 12} fill="none" stroke={toneOf(PAL.knob)} strokeWidth={DETAIL} />
              <circle
                cx={0}
                cy={KNOB.r - 28}
                r={13}
                fill={PAL.steel}
                stroke={INK}
                strokeWidth={OUTLINE}
              />
              <circle cx={-3.5} cy={KNOB.r - 31.5} r={4} fill="#ffffff" opacity={0.8} />
            </g>
          </g>
        </svg>

        <p className={styles.note} aria-live="polite">
          {activeStage === null
            ? 'Turn the red knob, or click it, to follow one salmon round its life. Each stop wakes up as the arrow reaches it.'
            : `${activeStage + 1} of ${STAGE_COUNT}, ${STAGES[activeStage].name}: ${
                STAGES[activeStage].story
              }`}
        </p>
      </div>
    </div>
  );
};

export default SalmonLifeCycle;
