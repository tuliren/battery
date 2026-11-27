import { CSSProperties, FC, ReactNode } from 'react';

import styles from './SalmonLifeCycle.module.css';
import { CREAM, INK, PAL, toneOf } from './palette';

// Every scene is drawn inside a circle of radius 140 centered at (0, 0).
export const SCENE_RADIUS = 140;

const R = SCENE_RADIUS;

// Ink keeps the same weight however much a shape is scaled.
const ink = (width = 1.2, color = INK) => ({
  stroke: color,
  strokeWidth: width * 1.4,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
  vectorEffect: 'non-scaling-stroke' as const,
});

interface FishProps {
  fill: string;
  size?: number;
  flip?: boolean;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
  spots?: boolean;
  /** A green hooked head, as spawning salmon have. */
  head?: string;
  belly?: string;
}

/** A small round salmon with dot eyes and a blush, facing right. */
export const Fish: FC<FishProps> = ({
  fill,
  size = 1,
  flip = false,
  bodyClassName,
  bodyStyle,
  spots = false,
  head,
  belly = CREAM,
}) => (
  <g transform={`scale(${flip ? -size : size} ${size})`}>
    <path
      d="M -22 0 C -30 -10 -40 -15 -41 -7 L -37 0 L -41 7 C -40 15 -30 10 -22 0 Z"
      fill={fill}
      className={bodyClassName}
      style={bodyStyle}
      {...ink()}
    />
    <path
      d="M -8 -13 C -4 -22 6 -21 8 -12 Z"
      fill={fill}
      className={bodyClassName}
      style={bodyStyle}
      {...ink()}
    />
    <path
      d="M -26 0 C -20 -17 12 -19 25 -8 C 33 -3 33 3 25 8 C 12 19 -20 17 -26 0 Z"
      fill={fill}
      className={bodyClassName}
      style={bodyStyle}
      {...ink(1.5)}
    />
    <path d="M -20 4 C -6 13 14 13 26 6 C 14 15 -8 15 -20 4 Z" fill={belly} opacity={0.7} />
    {head && (
      <path d="M 14 -12 C 26 -10 33 -4 33 0 C 33 4 26 10 14 12 C 10 4 10 -4 14 -12 Z" fill={head} />
    )}
    <path d="M 14 -9 C 18 -3 18 3 14 9" fill="none" {...ink(0.7, toneOf(fill))} />
    <ellipse cx={19} cy={5} rx={3.6} ry={2.1} fill={PAL.pink} opacity={0.9} />
    <circle cx={23} cy={-3} r={2.7} fill={INK} />
    <circle cx={23.9} cy={-3.9} r={0.9} fill={CREAM} />
    <path d="M 28 3 Q 29.5 5 31.5 3.4" fill="none" {...ink(0.9)} />
    {spots && (
      <g fill={INK} opacity={0.45}>
        <circle cx={-12} cy={-7} r={1.2} />
        <circle cx={-3} cy={-9} r={1.2} />
        <circle cx={6} cy={-8} r={1.2} />
        <circle cx={-17} cy={-2} r={1.2} />
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

const Full: FC<{ fill: string }> = ({ fill }) => (
  <rect x={-R} y={-R} width={2 * R} height={2 * R} fill={fill} />
);

/** Soft round pebbles, placed the same way on server and client. */
const Pebbles: FC<{ seed: number; colors: string[]; yMin: number; count?: number }> = ({
  seed,
  colors,
  yMin,
  count = 26,
}) => {
  const pebbles = Array.from({ length: count }, (_, i) => {
    const a = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
    const b = Math.sin((i + 1) * 39.3468 + seed * 11.135) * 24634.6345;
    const fa = a - Math.floor(a);
    const fb = b - Math.floor(b);
    return {
      x: -R + fa * 2 * R,
      y: yMin + fb * (R - yMin),
      r: 6 + ((fa * 7 + fb * 3) % 1) * 8,
      c: colors[i % colors.length],
    };
  });
  return (
    <g>
      {pebbles.map((p, i) => (
        <ellipse
          key={i}
          cx={p.x}
          cy={p.y}
          rx={p.r}
          ry={p.r * 0.72}
          fill={p.c}
          {...ink(0.7, toneOf(p.c))}
        />
      ))}
    </g>
  );
};

/** A soft puff of a plant: one round blob with a single ink line, like the Tinycharts shrubs. */
const Puff: FC<{ x: number; y: number; r: number; fill?: string }> = ({
  x,
  y,
  r,
  fill = PAL.leaf,
}) => (
  <g>
    <path
      d={`M ${x - r} ${y} C ${x - r} ${y - r * 1.3} ${x + r} ${y - r * 1.3} ${x + r} ${y} Z`}
      fill={fill}
      {...ink(1.1)}
    />
    <path d={`M ${x} ${y} L ${x} ${y - r * 0.55}`} fill="none" {...ink(0.7)} />
  </g>
);

const Wave: FC<{ y: number; d?: number }> = ({ y, d = 0 }) => (
  <path
    d={`M -150 ${y} q 12 -6 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0`}
    fill="none"
    className={styles.bob}
    style={delay(d)}
    {...ink(1, CREAM)}
    opacity={0.8}
  />
);

// ---------------------------------------------------------------------------
// Stage 1: salmon swim in through the bay, turning from silver to red.
// ---------------------------------------------------------------------------

const BayScene: FC = () => (
  <g>
    <Full fill="#fbf1e2" />
    <circle cx={-70} cy={-88} r={16} fill={PAL.gold} opacity={0.7} {...ink(1)} />
    {/* a little hillside town */}
    {[
      { x: -118, w: 30, h: 52, c: PAL.city },
      { x: -86, w: 26, h: 84, c: PAL.cityDark },
      { x: -58, w: 30, h: 64, c: PAL.tan },
      { x: -26, w: 24, h: 98, c: PAL.city },
      { x: 0, w: 28, h: 56, c: PAL.pink },
    ].map((b) => (
      <g key={b.x}>
        <rect x={b.x} y={-b.h} width={b.w} height={b.h} rx={3} fill={b.c} {...ink(1.2)} />
        {Array.from({ length: Math.floor(b.h / 18) }, (_, i) => (
          <rect
            key={i}
            x={b.x + b.w / 2 - 4}
            y={-b.h + 9 + i * 18}
            width={8}
            height={8}
            rx={1.5}
            fill={CREAM}
            {...ink(0.6, toneOf(b.c))}
          />
        ))}
      </g>
    ))}
    <Puff x={36} y={0} r={14} />
    {/* a soft red bridge */}
    <g fill="none" {...ink(3, PAL.rose)}>
      <path d="M 50 -14 Q 74 -64 76 -70 Q 98 -18 120 -70 Q 132 -40 150 -20" strokeWidth={2} />
      <line x1={76} y1={-74} x2={76} y2={0} />
      <line x1={120} y1={-74} x2={120} y2={0} />
      <line x1={44} y1={-16} x2={150} y2={-16} />
    </g>
    {/* the bay */}
    <rect x={-R} y={0} width={2 * R} height={R} fill={PAL.water} />
    <line x1={-R} y1={0} x2={R} y2={0} {...ink(1.3)} />
    <Wave y={20} />
    <Wave y={118} d={-1.2} />
    {[
      { y: 58, d: 0, s: 0.9 },
      { y: 92, d: -3, s: 1.1 },
      { y: 74, d: -6, s: 0.75 },
    ].map((f, i) => (
      <At key={i} x={0} y={f.y} className={styles.swimAcross} style={delay(f.d)}>
        <g className={styles.bob} style={delay(-i)}>
          <Fish
            fill={PAL.silver}
            size={f.s}
            bodyClassName={styles.silverToRed}
            bodyStyle={delay(f.d)}
          />
        </g>
      </At>
    ))}
    {[-70, 10, 70].map((x, i) => (
      <circle
        key={x}
        cx={x}
        cy={134}
        r={3.5}
        fill={CREAM}
        className={styles.bubble}
        style={delay(-i * 1.5)}
        {...ink(0.7)}
      />
    ))}
  </g>
);

// ---------------------------------------------------------------------------
// Stage 2: salmon leap up a little waterfall while a bear watches.
// ---------------------------------------------------------------------------

const UpstreamScene: FC = () => (
  <g>
    <Full fill="#eef4ee" />
    <path
      d="M -150 -50 C -90 -100 -10 -96 40 -60 C 80 -34 120 -44 150 -36 L 150 150 L -150 150 Z"
      fill={PAL.moss}
      {...ink(1.2)}
    />
    <Puff x={-92} y={-62} r={16} />
    <Puff x={-56} y={-74} r={12} fill={PAL.sage} />
    {/* rocky ledge and waterfall */}
    <path
      d="M -150 -18 C -100 -34 -34 -38 4 -24 C 16 -14 14 -2 2 4 L -150 8 Z"
      fill={PAL.stone}
      {...ink(1.2)}
    />
    <path
      d="M -150 2 C -90 -4 -20 -8 2 -4 C 12 40 16 100 22 150 L -150 150 Z"
      fill={PAL.water}
      {...ink(1.2)}
    />
    <g fill="none" className={styles.flow} {...ink(2.4, CREAM)}>
      <path d="M -100 4 C -92 50 -84 90 -76 150" />
      <path d="M -60 0 C -52 50 -46 90 -40 150" />
      <path d="M -20 -4 C -14 50 -10 90 -4 150" />
    </g>
    <path
      d="M -150 104 Q -90 88 -30 104 T 90 104 T 150 100 L 150 150 L -150 150 Z"
      fill={PAL.deep}
      {...ink(1.2)}
    />
    <g fill={CREAM} {...ink(0.8)}>
      <circle cx={-44} cy={104} r={6} className={styles.bob} />
      <circle cx={-14} cy={100} r={4} className={styles.bob} style={delay(-0.8)} />
      <circle cx={-74} cy={106} r={5} className={styles.bob} style={delay(-1.6)} />
    </g>
    {/* leaping salmon */}
    <At x={-30} y={0} className={styles.leap}>
      <Fish fill={PAL.spawn} head={PAL.leaf} size={0.85} />
    </At>
    <At x={-62} y={8} className={styles.leap} style={delay(-1.7)}>
      <Fish fill={PAL.salmon} head={PAL.leaf} size={0.7} />
    </At>
    {/* a round, friendly bear sitting on the bank */}
    <g className={styles.bearBob}>
      <ellipse cx={92} cy={30} rx={46} ry={54} fill={PAL.bear} {...ink(1.6)} />
      <ellipse cx={92} cy={44} rx={26} ry={32} fill={PAL.bearLight} opacity={0.8} />
      <circle cx={70} cy={-50} r={13} fill={PAL.bear} {...ink(1.4)} />
      <circle cx={112} cy={-50} r={13} fill={PAL.bear} {...ink(1.4)} />
      <circle cx={70} cy={-50} r={6} fill={PAL.pink} />
      <circle cx={112} cy={-50} r={6} fill={PAL.pink} />
      <circle cx={91} cy={-24} r={36} fill={PAL.bear} {...ink(1.6)} />
      <ellipse cx={86} cy={-12} rx={16} ry={12} fill={PAL.bearLight} {...ink(1.1)} />
      <ellipse cx={86} cy={-17} rx={5.5} ry={4} fill={INK} />
      <path d="M 80 -6 Q 86 -1 92 -6" fill="none" {...ink(1.2)} />
      <circle cx={76} cy={-32} r={3.2} fill={INK} />
      <circle cx={100} cy={-32} r={3.2} fill={INK} />
      <circle cx={77} cy={-33} r={1} fill={CREAM} />
      <circle cx={101} cy={-33} r={1} fill={CREAM} />
      <ellipse cx={68} cy={-16} rx={5} ry={3} fill={PAL.pink} />
      <ellipse cx={108} cy={-16} rx={5} ry={3} fill={PAL.pink} />
      <g className={styles.wave}>
        <ellipse cx={52} cy={22} rx={12} ry={18} fill={PAL.bear} {...ink(1.4)} />
      </g>
      <ellipse cx={130} cy={30} rx={11} ry={17} fill={PAL.bear} {...ink(1.4)} />
    </g>
  </g>
);

// ---------------------------------------------------------------------------
// Stage 3: salmon lay eggs in the gravel; their bodies feed the forest.
// ---------------------------------------------------------------------------

const EGGS = [
  [-70, 76],
  [-52, 88],
  [-34, 74],
  [-60, 104],
  [-40, 100],
  [-20, 90],
  [20, 80],
  [38, 94],
  [56, 78],
  [30, 110],
  [50, 108],
  [70, 96],
];

const Egg: FC<{ r?: number }> = ({ r = 6 }) => (
  <g>
    <circle r={r} fill={PAL.egg} {...ink(0.9)} />
    <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.3} fill={CREAM} />
  </g>
);

const SpawnScene: FC = () => (
  <g>
    <Full fill="#eaf1f6" />
    {/* hillside with trees that grow once the parents are gone */}
    <path
      d="M -150 -60 C -60 -60 10 -100 60 -110 C 100 -118 130 -110 150 -100 L 150 0 L -150 0 Z"
      fill={PAL.moss}
      {...ink(1.3)}
    />
    {[
      [-90, -56, 6, 18],
      [-34, -70, 6.4, 22],
      [30, -100, 6.8, 20],
      [90, -110, 7.2, 24],
    ].map(([x, y, d, r]) => (
      <At key={x} x={x} y={y} className={styles.grow} style={delay(d)}>
        <rect x={-3} y={-4} width={6} height={12} rx={2} fill={PAL.bark} {...ink(0.9)} />
        <circle cx={0} cy={-r} r={r} fill={PAL.leaf} {...ink(1.2)} />
        <circle cx={-r * 0.35} cy={-r * 1.25} r={r * 0.22} fill={PAL.sage} />
      </At>
    ))}
    {/* stream over gravel */}
    <rect x={-R} y={0} width={2 * R} height={R} fill={PAL.gravel} />
    <Pebbles seed={3} colors={[PAL.stone, PAL.shade, PAL.tan]} yMin={50} />
    <rect x={-R} y={0} width={2 * R} height={48} fill={PAL.water} opacity={0.9} />
    <line x1={-R} y1={0} x2={R} y2={0} {...ink(1.3)} />
    <Wave y={14} />
    {EGGS.map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <g className={styles.popIn} style={delay(0.8 + i * 0.3)}>
          <Egg />
        </g>
      </g>
    ))}
    {/* parents */}
    <g className={styles.parentFade}>
      <At x={-22} y={38} className={styles.bob}>
        <g className={styles.wiggle}>
          <Fish fill={PAL.spawn} head={PAL.leaf} size={1.3} spots />
        </g>
      </At>
      <At x={42} y={50} className={styles.bob} style={delay(-1)}>
        <g className={styles.wiggle} style={delay(-0.3)}>
          <Fish fill={PAL.salmon} head={PAL.leaf} size={1.1} flip spots />
        </g>
      </At>
    </g>
    {/* nutrients rising to the forest */}
    {[-60, -10, 40, 80].map((x, i) => (
      <At key={x} x={x} y={40} className={styles.sparkleRise} style={delay(5.4 + i * 0.5)}>
        <path
          d="M 0 -6 L 1.6 -1.6 L 6 0 L 1.6 1.6 L 0 6 L -1.6 1.6 L -6 0 L -1.6 -1.6 Z"
          fill={PAL.gold}
          {...ink(0.7)}
        />
      </At>
    ))}
  </g>
);

// ---------------------------------------------------------------------------
// Stage 4: eggs hatch into alevins that live off their yolk, then swim out.
// ---------------------------------------------------------------------------

const NEST = [
  [-62, 74],
  [-26, 94],
  [10, 70],
  [46, 96],
  [80, 70],
];

const HatchScene: FC = () => (
  <g>
    <Full fill={PAL.water} />
    <rect x={-R} y={-R} width={2 * R} height={56} fill={PAL.sky} />
    <line x1={-R} y1={-84} x2={R} y2={-84} {...ink(1.1)} />
    <Wave y={-60} d={-0.5} />
    {[-96, -44, 64, 104].map((x, i) => (
      <At key={x} x={x} y={36} className={styles.sway} style={delay(-i * 0.9)}>
        <path d="M 0 0 C -6 -40 8 -80 0 -112" fill="none" {...ink(2.4, PAL.leaf)} />
        <ellipse cx={6} cy={-58} rx={9} ry={4} fill={PAL.leaf} {...ink(0.8)} />
        <ellipse cx={-6} cy={-88} rx={9} ry={4} fill={PAL.leaf} {...ink(0.8)} />
      </At>
    ))}
    <path
      d="M -150 36 Q -60 24 0 40 T 150 32 L 150 150 L -150 150 Z"
      fill={PAL.gravel}
      {...ink(1.3)}
    />
    <Pebbles seed={7} colors={[PAL.stone, PAL.shade, PAL.tan]} yMin={50} count={20} />
    {[
      [-92, 114],
      [-42, 124],
      [20, 120],
      [72, 120],
      [-104, 84],
      [104, 100],
    ].map(([x, y]) => (
      <g key={`${x},${y}`} transform={`translate(${x} ${y})`}>
        <Egg r={5} />
      </g>
    ))}
    {NEST.map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <g className={styles.eggHatch} style={delay(i * 0.2)}>
          <Egg r={7} />
        </g>
        <g className={styles.alevinAppear} style={delay(2.4 + i * 0.2)}>
          <g className={styles.riseUp} style={delay(4.8 + i * 0.35)}>
            <g className={styles.wiggle} style={delay(-i * 0.15)}>
              <g transform="scale(0.5)">
                <Fish fill={PAL.silver} />
                <ellipse
                  cx={4}
                  cy={12}
                  rx={10}
                  ry={8}
                  fill={PAL.egg}
                  className={styles.yolkShrink}
                  style={delay(4.6 + i * 0.35)}
                  {...ink(1)}
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
// Stage 5: young salmon head to sea, hiding from a bigger fish along the way.
// ---------------------------------------------------------------------------

const JourneyScene: FC = () => (
  <g>
    <Full fill={PAL.water} />
    {/* log */}
    <path d="M -150 -34 L 150 -92 L 150 -50 L -150 8 Z" fill={PAL.bark} {...ink(1.4)} />
    <path d="M -150 -14 L 150 -72" fill="none" {...ink(0.7)} />
    <ellipse cx={-40} cy={-22} rx={8} ry={5} fill={PAL.tan} {...ink(0.8)} />
    <Puff x={60} y={-66} r={10} fill={PAL.moss} />
    <path
      d="M -150 84 Q -60 64 0 90 T 150 80 L 150 150 L -150 150 Z"
      fill={PAL.gravel}
      {...ink(1.3)}
    />
    <Pebbles seed={11} colors={[PAL.stone, PAL.shade]} yMin={100} count={14} />
    {/* bigger fish passing */}
    <At x={0} y={24} className={styles.predator}>
      <Fish fill={PAL.steel} size={1.9} spots />
    </At>
    {/* plants to hide in */}
    {[-104, -58, 68, 108].map((x, i) => (
      <At key={x} x={x} y={104} className={styles.sway} style={delay(-i * 1.1)}>
        <path d="M 0 0 C -10 -50 10 -100 -4 -164" fill="none" {...ink(3, PAL.leaf)} />
        {[-40, -70, -100, -130].map((y, j) => (
          <ellipse
            key={y}
            cx={j % 2 === 0 ? 9 : -9}
            cy={y}
            rx={11}
            ry={5}
            fill={PAL.leaf}
            transform={`rotate(${j % 2 === 0 ? -30 : 30} ${j % 2 === 0 ? 9 : -9} ${y})`}
            {...ink(0.8)}
          />
        ))}
      </At>
    ))}
    {/* young salmon */}
    {[
      { x: 10, y: 44, d: 0 },
      { x: 32, y: 64, d: -0.5 },
      { x: -10, y: 32, d: -1 },
    ].map((f, i) => (
      <At key={i} x={f.x} y={f.y} className={styles.dart} style={delay(f.d)}>
        <g className={styles.wiggle} style={delay(-i * 0.2)}>
          <Fish fill={PAL.sage} size={0.55} spots />
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
    <Full fill={PAL.water} />
    <rect x={-R} y={-R} width={2 * R} height={70} fill={PAL.sky} />
    <rect x={-R} y={60} width={2 * R} height={80} fill={PAL.deep} opacity={0.35} />
    <Wave y={-72} />
    <g fill={CREAM}>
      <polygon points="-90,-70 -62,-70 -16,140 -70,140" className={styles.shimmer} />
      <polygon
        points="12,-70 40,-70 88,140 32,140"
        className={styles.shimmer}
        style={delay(-2.5)}
      />
    </g>
    {/* krill */}
    {[
      [-80, -40],
      [-30, -56],
      [44, -46],
      [92, -24],
      [-62, 16],
      [72, 24],
      [0, -20],
    ].map(([x, y], i) => (
      <At key={i} x={x} y={y} className={styles.drift} style={delay(-i * 1.1)}>
        <path d="M -5 0 Q 0 -4.5 5 0 Q 0 2.5 -5 0 Z" fill={PAL.krill} {...ink(0.6)} />
      </At>
    ))}
    {/* adult salmon */}
    <At x={0} y={-4} className={styles.swimAcrossSlow}>
      <g className={styles.bob}>
        <Fish fill={PAL.silver} size={1.9} bodyClassName={styles.grayToPink} spots />
      </g>
    </At>
    <At x={0} y={-48} className={styles.swimAcrossSlow} style={delay(-7)}>
      <Fish fill={PAL.silver} size={1.1} bodyClassName={styles.grayToPink} bodyStyle={delay(-7)} />
    </At>
    {/* sea floor */}
    <path
      d="M -150 110 Q -60 92 0 110 T 150 102 L 150 150 L -150 150 Z"
      fill={PAL.tan}
      {...ink(1.3)}
    />
    <At x={-92} y={118} className={styles.sway}>
      <path
        d="M 0 0 L 0 -46 M 0 -18 L -16 -36 M 0 -28 L 14 -50 M -16 -36 L -22 -52"
        fill="none"
        {...ink(6, PAL.coral)}
      />
    </At>
    {[-40, 10, 60, 102].map((x, i) => (
      <At key={x} x={x} y={128} className={styles.sway} style={delay(-i * 0.9)}>
        <path
          d="M 0 0 C -16 -40 16 -70 0 -104 C 12 -70 -4 -40 10 0 Z"
          fill={i % 2 === 0 ? PAL.leaf : PAL.moss}
          {...ink(1.1)}
        />
      </At>
    ))}
  </g>
);

export interface Stage {
  /** Short name on the medallion tag and the readout. */
  name: string;
  /** Two to six words under the name. */
  note: string;
  /** One sentence said when the arrow reaches this stage. */
  story: string;
  /** Pale wash behind the medallion. */
  tint: string;
  Scene: FC;
}

export const STAGES: Stage[] = [
  {
    name: 'into the bay',
    note: 'silver turns to red',
    story:
      'Millions of salmon swim in from the ocean, changing from silver to red as they head inland.',
    tint: '#fbf1e2',
    Scene: BayScene,
  },
  {
    name: 'up the river',
    note: 'following the scent home',
    story:
      'They follow a scent trail back to the stream where they hatched, while bears watch for a snack.',
    tint: '#eef4ee',
    Scene: UpstreamScene,
  },
  {
    name: 'laying eggs',
    note: 'then feeding the forest',
    story:
      'They tuck orange eggs into the gravel; when their lives end, their bodies feed the forest.',
    tint: '#eaf1f6',
    Scene: SpawnScene,
  },
  {
    name: 'hatching',
    note: 'living off the yolk',
    story: 'Baby salmon hide in the gravel eating their yolk, then wriggle free when it runs out.',
    tint: '#eef0f6',
    Scene: HatchScene,
  },
  {
    name: 'off to sea',
    note: 'hiding under logs',
    story:
      'Young salmon swim down to the ocean, resting and hiding among logs and plants on the way.',
    tint: '#edf5ef',
    Scene: JourneyScene,
  },
  {
    name: 'ocean life',
    note: 'krill makes them pink',
    story:
      'Grown salmon spend two to five years at sea eating fish and krill, which turns them pink.',
    tint: '#f6eef2',
    Scene: OceanScene,
  },
];
