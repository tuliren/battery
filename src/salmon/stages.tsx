import { CSSProperties, FC, ReactNode } from 'react';

import styles from './SalmonLifeCycle.module.css';

// Every scene is drawn inside a circle of radius 140 centered at (0, 0).
export const SCENE_RADIUS = 140;

const R = SCENE_RADIUS;

interface FishProps {
  fill: string;
  size?: number;
  flip?: boolean;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
  spots?: boolean;
  head?: string;
}

export const Fish: FC<FishProps> = ({
  fill,
  size = 1,
  flip = false,
  bodyClassName,
  bodyStyle,
  spots = false,
  head,
}) => (
  <g transform={`scale(${flip ? -size : size} ${size})`}>
    <path
      d="M -26 0 L -41 -12 L -36 0 L -41 12 Z"
      fill={fill}
      className={bodyClassName}
      style={bodyStyle}
    />
    <path d="M -5 -11 L 3 -19 L 9 -10 Z" fill={fill} className={bodyClassName} style={bodyStyle} />
    <path
      d="M -28 0 Q -8 -15 16 -9 Q 30 -5 34 0 Q 30 5 16 9 Q -8 15 -28 0 Z"
      fill={fill}
      className={bodyClassName}
      style={bodyStyle}
    />
    {head && <path d="M 16 -9 Q 30 -5 34 0 Q 30 5 16 9 Q 12 0 16 -9 Z" fill={head} />}
    <path d="M -24 2 Q 4 9 30 2" stroke="rgba(255,255,255,0.35)" strokeWidth={2} fill="none" />
    <path d="M 18 -6 Q 22 0 18 6" stroke="rgba(0,0,0,0.35)" strokeWidth={1.5} fill="none" />
    <circle cx={26} cy={-2} r={2.2} fill="#1b1b1b" />
    {spots && (
      <g fill="rgba(0,0,0,0.35)">
        <circle cx={-14} cy={-5} r={1.3} />
        <circle cx={-6} cy={-7} r={1.3} />
        <circle cx={2} cy={-5} r={1.3} />
        <circle cx={-18} cy={-1} r={1.3} />
        <circle cx={8} cy={-7} r={1.3} />
      </g>
    )}
  </g>
);

/** Positions children at (x, y) and lets a CSS animation move them from there. */
const At: FC<{
  x: number;
  y: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}> = ({ x, y, className, style, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className={className} style={style}>
      {children}
    </g>
  </g>
);

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

const Stones: FC<{ seed: number; color: string; yMin: number; count?: number }> = ({
  seed,
  color,
  yMin,
  count = 34,
}) => {
  // Deterministic pseudo-random pebbles so server and client render the same thing.
  const stones = Array.from({ length: count }, (_, i) => {
    const a = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
    const b = Math.sin((i + 1) * 39.3468 + seed * 11.135) * 24634.6345;
    const fa = a - Math.floor(a);
    const fb = b - Math.floor(b);
    return {
      x: -R + fa * 2 * R,
      y: yMin + fb * (R - yMin),
      r: 5 + ((fa * 7 + fb * 3) % 1) * 9,
    };
  });
  return (
    <g fill={color}>
      {stones.map((s, i) => (
        <ellipse key={i} cx={s.x} cy={s.y} rx={s.r} ry={s.r * 0.75} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Stage 1: salmon swim in through the bay, turning from silver to red.
// ---------------------------------------------------------------------------

const BayScene: FC = () => (
  <g>
    <rect x={-R} y={-R} width={2 * R} height={2 * R} fill="#f7ead8" />
    {/* skyline */}
    <g fill="#77757c">
      <rect x={-112} y={-70} width={26} height={70} />
      <rect x={-82} y={-98} width={22} height={98} fill="#5e5c63" />
      <polygon points="-50,0 -38,-120 -26,0" fill="#4d4b52" />
      <rect x={-22} y={-86} width={24} height={86} />
      <rect x={4} y={-60} width={20} height={60} fill="#5e5c63" />
      <rect x={-124} y={-34} width={40} height={34} fill="#a49e96" />
    </g>
    <g fill="#f7ead8" opacity={0.8}>
      {[-108, -100, -92, -78, -70, -18, -10, -2].map((x) =>
        [-60, -48, -36, -24].map((y) => <rect key={`${x},${y}`} x={x} y={y} width={4} height={6} />)
      )}
    </g>
    <circle cx={-6} cy={-104} r={10} fill="#3d8f4d" />
    <circle cx={34} cy={-24} r={14} fill="#3d8f4d" />
    {/* bridge */}
    <g stroke="#d8452f" strokeWidth={4} fill="none">
      <line x1={70} y1={-74} x2={70} y2={0} />
      <line x1={118} y1={-74} x2={118} y2={0} />
      <path d="M 40 -10 Q 70 -78 70 -74 Q 94 -20 118 -74 Q 130 -40 150 -14" strokeWidth={2.5} />
      <line x1={36} y1={-16} x2={150} y2={-16} strokeWidth={5} />
    </g>
    <rect x={-R} y={-4} width={2 * R} height={8} fill="#3a3a40" />
    {/* bay */}
    <rect x={-R} y={4} width={2 * R} height={R} fill="#2f7fc1" />
    <g stroke="#7fb8e6" strokeWidth={2} fill="none" opacity={0.7}>
      <path d="M -120 24 q 15 -8 30 0 t 30 0 t 30 0" className={styles.bob} />
      <path d="M 10 40 q 15 -8 30 0 t 30 0 t 30 0" className={styles.bob} style={delay(-1)} />
    </g>
    {[
      { y: 62, d: 0, s: 0.9 },
      { y: 96, d: -2, s: 1.1 },
      { y: 78, d: -4, s: 0.8 },
    ].map((f, i) => (
      <At key={i} x={0} y={f.y} className={styles.swimAcross} style={delay(f.d)}>
        <Fish fill="#c9d4dd" size={f.s} bodyClassName={styles.silverToRed} bodyStyle={delay(f.d)} />
      </At>
    ))}
    {[-70, 0, 60].map((x, i) => (
      <circle
        key={x}
        cx={x}
        cy={130}
        r={3}
        fill="#bfe0ff"
        className={styles.bubble}
        style={delay(-i * 1.1)}
      />
    ))}
  </g>
);

// ---------------------------------------------------------------------------
// Stage 2: salmon leap up a waterfall while a bear tries to catch them.
// ---------------------------------------------------------------------------

const UpstreamScene: FC = () => (
  <g>
    <rect x={-R} y={-R} width={2 * R} height={2 * R} fill="#e8eef1" />
    <path d="M -140 -40 Q -60 -90 20 -50 L 20 140 L -140 140 Z" fill="#9fc4a8" />
    {/* waterfall */}
    <path d="M -140 -10 L -10 -30 L 10 140 L -140 140 Z" fill="#2f7fc1" />
    <g stroke="#cfe8fb" strokeWidth={3} fill="none" className={styles.flow}>
      <path d="M -100 -10 C -90 40 -80 80 -70 140" />
      <path d="M -60 -18 C -50 40 -40 80 -30 140" />
      <path d="M -20 -26 C -10 40 -5 80 0 140" />
    </g>
    <path d="M -140 100 Q -80 80 -20 100 T 140 100 L 140 140 L -140 140 Z" fill="#1f62a3" />
    <g fill="#ffffff" opacity={0.85}>
      <circle cx={-40} cy={102} r={6} className={styles.bob} />
      <circle cx={-10} cy={98} r={4} className={styles.bob} style={delay(-0.8)} />
      <circle cx={-70} cy={104} r={5} className={styles.bob} style={delay(-1.4)} />
    </g>
    {/* leaping salmon */}
    <At x={-30} y={0} className={styles.leap}>
      <Fish fill="#d8323c" head="#5b7a4a" size={0.9} />
    </At>
    <At x={-60} y={10} className={styles.leap} style={delay(-1.3)}>
      <Fish fill="#c22e3a" head="#5b7a4a" size={0.75} />
    </At>
    {/* bear */}
    <g fill="#2b2526">
      <path d="M 40 140 L 46 30 Q 60 -40 120 -40 L 150 -40 L 150 140 Z" />
      <g className={styles.chomp}>
        <path d="M 30 -60 Q 60 -100 100 -76 L 110 -40 Q 80 -20 50 -36 Z" />
        <path d="M 30 -60 L -4 -66 L 2 -52 L 30 -50 Z" />
        <path d="M 6 -44 L 40 -42 L 30 -30 L 2 -36 Z" />
        <circle cx={80} cy={-92} r={9} />
        <circle cx={56} cy={-74} r={3} fill="#f7ead8" />
        <g fill="#ffffff">
          <polygon points="4,-52 8,-46 12,-52" />
          <polygon points="14,-52 18,-46 22,-52" />
          <polygon points="8,-38 12,-44 16,-38" />
        </g>
      </g>
    </g>
  </g>
);

// ---------------------------------------------------------------------------
// Stage 3: salmon lay eggs in the gravel, die, and nourish the forest.
// ---------------------------------------------------------------------------

const EGGS = [
  [-70, 70],
  [-52, 82],
  [-34, 68],
  [-60, 96],
  [-40, 92],
  [-20, 84],
  [20, 74],
  [38, 88],
  [56, 72],
  [30, 104],
  [50, 102],
  [70, 90],
];

const SpawnScene: FC = () => (
  <g>
    <rect x={-R} y={-R} width={2 * R} height={2 * R} fill="#1f6fb0" />
    {/* hillside with trees that grow once the parents are gone */}
    <path d="M -140 -70 Q -40 -60 30 -110 Q 90 -150 140 -120 L 140 0 L -140 0 Z" fill="#2d2a35" />
    {[
      [-80, -66, 5.6],
      [-20, -80, 6.0],
      [40, -110, 6.4],
      [90, -122, 6.8],
    ].map(([x, y, d]) => (
      <At key={x} x={x} y={y} className={styles.grow} style={delay(d)}>
        <polygon points="0,-44 -16,0 16,0" fill="#3d8f4d" />
        <rect x={-3} y={0} width={6} height={10} fill="#6b4a2f" />
      </At>
    ))}
    <rect x={-R} y={0} width={2 * R} height={R} fill="#2d2a35" />
    <Stones seed={3} color="#46424f" yMin={20} />
    {/* stream over the gravel */}
    <rect x={-R} y={0} width={2 * R} height={40} fill="#1f6fb0" opacity={0.85} />
    {EGGS.map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <g className={styles.popIn} style={delay(0.6 + i * 0.25)}>
          <circle r={6} fill="#f26b3a" />
          <circle cx={-2} cy={-2} r={2} fill="#ffc6a3" />
        </g>
      </g>
    ))}
    {/* parents */}
    <g className={styles.parentFade}>
      <At x={-20} y={40} className={styles.bob}>
        <g className={styles.wiggle}>
          <Fish fill="#c22e3a" head="#5b7a4a" size={1.5} spots />
        </g>
      </At>
      <At x={40} y={52} className={styles.bob} style={delay(-1)}>
        <g className={styles.wiggle} style={delay(-0.2)}>
          <Fish fill="#d8323c" head="#6b8a55" size={1.3} flip spots />
        </g>
      </At>
    </g>
    {/* nutrients rising to the forest */}
    {[-60, -10, 40, 80].map((x, i) => (
      <At key={x} x={x} y={40} className={styles.sparkleRise} style={delay(5 + i * 0.4)}>
        <circle r={3.5} fill="#ffe27a" />
      </At>
    ))}
  </g>
);

// ---------------------------------------------------------------------------
// Stage 4: eggs hatch into alevins that live off their yolk, then swim out.
// ---------------------------------------------------------------------------

const NEST = [
  [-60, 70],
  [-24, 90],
  [12, 66],
  [48, 92],
  [80, 64],
];

const HatchScene: FC = () => (
  <g>
    <rect x={-R} y={-R} width={2 * R} height={2 * R} fill="#2c6fae" />
    <rect x={-R} y={-R} width={2 * R} height={50} fill="#3f86c4" />
    {[-90, -40, 60, 100].map((x, i) => (
      <At key={x} x={x} y={30} className={styles.sway} style={delay(-i * 0.7)}>
        <path d="M 0 0 C -6 -40 8 -80 0 -120" stroke="#6fbf73" strokeWidth={3} fill="none" />
        <ellipse cx={4} cy={-60} rx={7} ry={3} fill="#6fbf73" />
        <ellipse cx={-4} cy={-90} rx={7} ry={3} fill="#6fbf73" />
      </At>
    ))}
    <path d="M -140 30 Q -60 20 0 34 T 140 28 L 140 140 L -140 140 Z" fill="#2a2833" />
    <Stones seed={7} color="#3d3a48" yMin={40} />
    {/* extra unhatched eggs scattered around */}
    {[
      [-90, 110],
      [-40, 120],
      [20, 116],
      [70, 118],
      [-100, 80],
      [100, 96],
    ].map(([x, y]) => (
      <circle key={`${x},${y}`} cx={x} cy={y} r={5} fill="#f26b3a" opacity={0.85} />
    ))}
    {NEST.map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <g className={styles.eggHatch} style={delay(i * 0.15)}>
          <circle r={7} fill="#f26b3a" />
          <circle cx={-2} cy={-2} r={2.4} fill="#ffc6a3" />
        </g>
        <g className={styles.alevinAppear} style={delay(2 + i * 0.15)}>
          <g className={styles.riseUp} style={delay(4.2 + i * 0.3)}>
            <g className={styles.wiggle} style={delay(-i * 0.1)}>
              <g transform="scale(0.45)">
                <Fish fill="#d6dde3" />
                <ellipse
                  cx={6}
                  cy={10}
                  rx={10}
                  ry={8}
                  fill="#f26b3a"
                  className={styles.yolkShrink}
                  style={delay(4 + i * 0.3)}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------------------
// Stage 5: young salmon head to sea, hiding from predators along the way.
// ---------------------------------------------------------------------------

const JourneyScene: FC = () => (
  <g>
    <rect x={-R} y={-R} width={2 * R} height={2 * R} fill="#2b6cb0" />
    {/* log */}
    <path d="M -150 -30 L 150 -90 L 150 -50 L -150 10 Z" fill="#8a4b2c" />
    <path d="M -150 -14 L 150 -74" stroke="#a8613c" strokeWidth={4} />
    <path d="M -140 80 Q -60 60 0 86 T 140 76 L 140 140 L -140 140 Z" fill="#2a2833" />
    <Stones seed={11} color="#3d3a48" yMin={95} count={18} />
    {/* plants */}
    {[-100, -55, 70, 105].map((x, i) => (
      <At key={x} x={x} y={100} className={styles.sway} style={delay(-i * 0.9)}>
        <path d="M 0 0 C -10 -50 10 -100 -4 -170" stroke="#5fbf4f" strokeWidth={4} fill="none" />
        {[-40, -70, -100, -130].map((y, j) => (
          <ellipse
            key={y}
            cx={j % 2 === 0 ? 8 : -8}
            cy={y}
            rx={10}
            ry={4}
            fill="#5fbf4f"
            transform={`rotate(${j % 2 === 0 ? -30 : 30} ${j % 2 === 0 ? 8 : -8} ${y})`}
          />
        ))}
      </At>
    ))}
    {/* predator */}
    <At x={0} y={20} className={styles.predator}>
      <Fish fill="#1c2b3a" size={2.2} />
    </At>
    {/* young salmon */}
    {[
      { x: 10, y: 40, d: 0 },
      { x: 30, y: 60, d: -0.4 },
      { x: -10, y: 30, d: -0.8 },
    ].map((f, i) => (
      <At key={i} x={f.x} y={f.y} className={styles.dart} style={delay(f.d)}>
        <g className={styles.wiggle} style={delay(-i * 0.15)}>
          <Fish fill="#c6d6c2" size={0.55} spots />
        </g>
      </At>
    ))}
  </g>
);

// ---------------------------------------------------------------------------
// Stage 6: adults feed in the ocean, turning pink.
// ---------------------------------------------------------------------------

const OceanScene: FC = () => (
  <g>
    <defs>
      <linearGradient id="salmon-ocean" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6fb6e3" />
        <stop offset="1" stopColor="#1b5c97" />
      </linearGradient>
    </defs>
    <rect x={-R} y={-R} width={2 * R} height={2 * R} fill="url(#salmon-ocean)" />
    <g fill="#ffffff">
      <polygon points="-90,-140 -60,-140 -10,140 -70,140" className={styles.shimmer} />
      <polygon
        points="10,-140 40,-140 90,140 30,140"
        className={styles.shimmer}
        style={delay(-2)}
      />
    </g>
    {/* krill */}
    <g fill="#ffb3a7">
      {[
        [-80, -60],
        [-30, -90],
        [40, -70],
        [90, -40],
        [-60, 10],
        [70, 20],
        [0, -30],
      ].map(([x, y], i) => (
        <At key={i} x={x} y={y} className={styles.drift} style={delay(-i * 0.9)}>
          <path d="M -5 0 Q 0 -4 5 0 Q 0 2 -5 0 Z" />
        </At>
      ))}
    </g>
    {/* adult salmon */}
    <At x={0} y={-10} className={styles.swimAcrossSlow}>
      <g className={styles.bob}>
        <Fish fill="#b8c4cc" size={2.1} bodyClassName={styles.grayToPink} spots />
      </g>
    </At>
    <At x={0} y={-60} className={styles.swimAcrossSlow} style={delay(-5)}>
      <Fish fill="#b8c4cc" size={1.2} bodyClassName={styles.grayToPink} bodyStyle={delay(-5)} />
    </At>
    {/* sea floor */}
    <path d="M -140 110 Q -60 90 0 110 T 140 100 L 140 140 L -140 140 Z" fill="#1d4f7a" />
    <At x={-90} y={120} className={styles.sway}>
      <g stroke="#d6336c" strokeWidth={6} strokeLinecap="round" fill="none">
        <path d="M 0 0 L 0 -50 M 0 -20 L -18 -40 M 0 -30 L 16 -56 M -18 -40 L -26 -58" />
      </g>
    </At>
    {[-40, 10, 60, 100].map((x, i) => (
      <At key={x} x={x} y={130} className={styles.sway} style={delay(-i * 0.8)}>
        <path
          d="M 0 0 C -16 -40 16 -70 0 -110 C 10 -70 -6 -40 10 0 Z"
          fill={i % 2 === 0 ? '#4caf50' : '#8bc34a'}
        />
      </At>
    ))}
  </g>
);

export interface Stage {
  title: string;
  lines: string[];
  Scene: FC;
}

export const STAGES: Stage[] = [
  {
    title: 'Into the Bay',
    lines: [
      'Millions of salmon swim in from the',
      'ocean. Heading inland, they change',
      'from slim silver fish to bright red.',
    ],
    Scene: BayScene,
  },
  {
    title: 'Back Upstream',
    lines: [
      'They follow a scent trail home to the',
      'stream where they hatched. Bears and',
      'other animals catch some on the way.',
    ],
    Scene: UpstreamScene,
  },
  {
    title: 'Laying Eggs',
    lines: [
      'Salmon hide orange eggs in the gravel,',
      'then their lives end. Their bodies',
      'feed the forest with ocean nutrients.',
    ],
    Scene: SpawnScene,
  },
  {
    title: 'Hatching',
    lines: [
      'Baby salmon stay in the gravel, living',
      'off their yolk sacs. When the yolk is',
      'gone, they wriggle out to swim.',
    ],
    Scene: HatchScene,
  },
  {
    title: 'Heading to Sea',
    lines: [
      'Young salmon swim down to the ocean.',
      'Logs and plants give them places to',
      'rest and hide from predators.',
    ],
    Scene: JourneyScene,
  },
  {
    title: 'Ocean Life',
    lines: [
      'Adults roam the ocean for 2–5 years,',
      'eating fish and krill. That rich diet',
      'gives them their pink color.',
    ],
    Scene: OceanScene,
  },
];
