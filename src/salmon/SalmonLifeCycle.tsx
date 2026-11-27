import { Card, Center, Text } from '@mantine/core';
import { FC, KeyboardEvent, PointerEvent, useCallback, useEffect, useRef, useState } from 'react';

import styles from './SalmonLifeCycle.module.css';
import { SCENE_RADIUS, STAGES } from './stages';
import { COLUMN_X, STAGE_COUNT, TRACK, TRACK_PATH, activeStageAt, pointAtProgress } from './track';

const WIDTH = 1400;
const HEIGHT = 980;
const TOP_Y = 280;
const BOTTOM_Y = 720;
const KNOB = { x: 1290, y: 500, r: 75 };
const WINDOW_RADIUS = SCENE_RADIUS - 12;

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

interface StageCircleProps {
  index: number;
  active: boolean;
  activation: number;
}

const StageCircle: FC<StageCircleProps> = ({ index, active, activation }) => {
  const { x, y } = STAGE_POSITIONS[index];
  const { Scene } = STAGES[index];
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

      <circle
        r={SCENE_RADIUS + 14}
        fill="none"
        stroke="#ffb703"
        strokeWidth={8}
        className={`${styles.glow} ${active ? styles.glowOn : ''}`}
      />

      <g clipPath={`url(#${clipId})`}>
        <g filter={active ? undefined : 'url(#salmon-dim)'}>
          {/* Remount on every activation so the scene's animation starts from the beginning. */}
          <g key={activation} className={active ? undefined : styles.paused}>
            <Scene />
          </g>
        </g>

        {/* Frosted disc behind the lower window that turns away when the stage is active. */}
        <g clipPath={`url(#${windowClipId})`}>
          <g className={`${styles.shutter} ${active ? styles.shutterOpen : ''}`}>
            <path d={windowPath} fill="#cfd8de" opacity={0.85} />
            <path
              d={`M ${-WINDOW_RADIUS + 30} 20 L ${
                -WINDOW_RADIUS + 70
              } 20 L -10 ${WINDOW_RADIUS} L -60 ${WINDOW_RADIUS - 20} Z`}
              fill="#ffffff"
              opacity={0.35}
            />
          </g>
        </g>
      </g>

      <path d={windowPath} fill="none" stroke="#b08d4a" strokeWidth={4} />
      <circle r={SCENE_RADIUS} fill="none" stroke="#1f6fb3" strokeWidth={6} />
    </g>
  );
};

interface CaptionProps {
  index: number;
  active: boolean;
}

const Caption: FC<CaptionProps> = ({ index, active }) => {
  const { x, y } = STAGE_POSITIONS[index];
  const { title, lines } = STAGES[index];
  const isTop = y === TOP_Y;
  const startY = isTop ? 42 : BOTTOM_Y + SCENE_RADIUS + 34;

  return (
    <g className={styles.caption} opacity={active ? 1 : 0.7} textAnchor="middle">
      <text x={x} y={startY} fontSize={23} fontWeight={700} fill={active ? '#c92a2a' : '#333'}>
        {title}
      </text>
      {lines.map((line, i) => (
        <text key={i} x={x} y={startY + 23 + i * 21} fontSize={16} fill="#333">
          {line}
        </text>
      ))}
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

  useEffect(() => {
    if (activeStage === null) {
      return;
    }
    setActivations((prev) => prev.map((count, i) => (i === activeStage ? count + 1 : count)));
  }, [activeStage]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    []
  );

  const updateProgress = useCallback((value: number) => {
    progressRef.current = value;
    setProgress(value);
    setStarted(true);
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
      const speed = clamp(Math.abs(remaining) * 2.2, 0.5, 1.6);
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
  const labelRadius = KNOB.r + 22;

  return (
    <Center>
      <Card w="100%" maw={1200} p="md">
        <svg
          className={styles.board}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="The salmon life cycle. Turn the red knob to move the arrow through each stage."
        >
          <defs>
            <filter id="salmon-dim">
              <feColorMatrix type="saturate" values="0.15" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.75" intercept="0.12" />
                <feFuncG type="linear" slope="0.75" intercept="0.12" />
                <feFuncB type="linear" slope="0.75" intercept="0.14" />
              </feComponentTransfer>
            </filter>
            <path
              id="salmon-knob-label"
              d={`M ${KNOB.x - labelRadius} ${KNOB.y} A ${labelRadius} ${labelRadius} 0 0 1 ${
                KNOB.x + labelRadius
              } ${KNOB.y}`}
            />
          </defs>

          {/* board */}
          <rect x={0} y={0} width={WIDTH} height={HEIGHT} rx={60} fill="#cfe3ee" />
          <rect
            x={150}
            y={TOP_Y}
            width={1240}
            height={BOTTOM_Y - TOP_Y}
            rx={(BOTTOM_Y - TOP_Y) / 2}
            fill="#fdf8f1"
          />

          {STAGES.map((_, i) => (
            <Caption key={i} index={i} active={activeStage === i} />
          ))}

          {STAGES.map((_, i) => (
            <StageCircle key={i} index={i} active={activeStage === i} activation={activations[i]} />
          ))}

          {/* track */}
          <rect
            x={TRACK.left - 95}
            y={trackMidY - 95}
            width={TRACK.right - TRACK.left + 190}
            height={190}
            rx={95}
            fill="#e4e8ea"
            stroke="#b9c1c6"
            strokeWidth={4}
          />
          <path d={TRACK_PATH} fill="none" stroke="#2d2d2d" strokeWidth={12} />
          <path d={TRACK_PATH} fill="none" stroke="#5a5a5a" strokeWidth={4} />
          <text
            x={(TRACK.left + TRACK.right) / 2}
            y={trackMidY + 14}
            textAnchor="middle"
            fontSize={42}
            fontWeight={700}
            fill="#c0392b"
          >
            The Salmon Life Cycle
          </text>

          {/* arrow */}
          <g transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}>
            <polygon
              points="26,0 -10,-18 -10,18"
              fill="#e8402a"
              stroke="#8f1d10"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          </g>

          {/* knob */}
          <text fontSize={19} fontWeight={600} fill="#222">
            <textPath href="#salmon-knob-label" startOffset="50%" textAnchor="middle">
              Turn to follow the salmon&apos;s journey ➜
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
            <circle r={KNOB.r + 8} fill="#7a1f12" />
            <circle r={KNOB.r} fill="#f04a23" className={styles.knobFocus} />
            <g transform={`rotate(${knobAngle})`}>
              <circle r={KNOB.r - 10} fill="none" stroke="#ff7a55" strokeWidth={3} />
              <circle
                cx={0}
                cy={KNOB.r - 26}
                r={13}
                fill="#9aa3a8"
                stroke="#5d666b"
                strokeWidth={3}
              />
              <circle cx={-3} cy={KNOB.r - 29} r={4} fill="#e6eaec" />
            </g>
          </g>
        </svg>

        <Text ta="center" mt="sm" size="lg" fw={600} aria-live="polite">
          {activeStage === null
            ? 'Click or turn the red knob to follow the salmon’s story.'
            : `Stage ${activeStage + 1} of ${STAGE_COUNT}: ${STAGES[activeStage].title}`}
        </Text>
      </Card>
    </Center>
  );
};

export default SalmonLifeCycle;
