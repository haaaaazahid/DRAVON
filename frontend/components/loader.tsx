'use client';
import {useEffect, useState} from 'react';

/**
 * Each pose is a minimal stick-figure drawn with a few strokes on a
 * 100x60 viewBox. Coordinates are hand-placed to read clearly at small
 * size — head (circle) + torso/arms/legs (polylines).
 */
const POSES = [
  {
    name: 'PLANCHE',
    head: {cx: 22, cy: 30, r: 4},
    lines: [
      // arms (straight down to hands on floor)
      [22, 34, 30, 50],
      [30, 50, 34, 50],
      // torso (horizontal, held above hands)
      [26, 32, 78, 24],
      // legs (extended straight back, in line with torso)
      [78, 24, 92, 20],
    ],
  },
  {
    name: 'FRONT LEVER',
    head: {cx: 20, cy: 14, r: 4},
    lines: [
      // arms up to the bar
      [20, 18, 26, 6],
      [26, 6, 34, 6], // bar
      // torso horizontal, held out straight
      [24, 16, 80, 16],
      // legs continuing the line
      [80, 16, 94, 16],
    ],
  },
  {
    name: 'HANDSTAND',
    head: {cx: 50, cy: 48, r: 4},
    lines: [
      // arms down to hands on floor
      [46, 44, 40, 54],
      [54, 44, 60, 54],
      // torso straight up
      [50, 44, 50, 16],
      // legs straight up, slightly split for balance
      [50, 16, 44, 4],
      [50, 16, 58, 4],
    ],
  },
  {
    name: 'DRAGON FLAG',
    head: {cx: 18, cy: 46, r: 4},
    lines: [
      // arms braced overhead, holding support behind head
      [18, 42, 10, 38],
      [10, 38, 10, 30],
      // torso lifted, straight diagonal line off the shoulders
      [20, 44, 70, 18],
      // legs continuing the line, fully extended
      [70, 18, 92, 8],
    ],
  },
];

export function Loader() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);
  const [poseIdx, setPoseIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('dravon-loader')) return;
    setShow(true);
    sessionStorage.setItem('dravon-loader', '1');

    let n = 0;
    const progressTimer = setInterval(() => {
      n += 7;
      setPct(Math.min(n, 100));
      if (n >= 100) {
        clearInterval(progressTimer);
        setTimeout(() => setShow(false), 420);
      }
    }, 55);

    // cycle poses independently of progress, with a quick crossfade
    const poseTimer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPoseIdx((i) => (i + 1) % POSES.length);
        setFade(true);
      }, 160);
    }, 620);

    return () => {
      clearInterval(progressTimer);
      clearInterval(poseTimer);
    };
  }, []);

  if (!show) return null;

  const pose = POSES[poseIdx];

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center">
      <div className="w-[min(520px,82vw)]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[11px] tracking-[.35em] text-white/50 mb-2">DRAVON</div>
            <div className="text-3xl font-black tracking-tight">LOADING MOVEMENT</div>
          </div>
          <div className="text-xs tracking-[.25em]">{pct}%</div>
        </div>

        <div className="h-[1px] bg-white/15 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[#8b0000] transition-all duration-75"
            style={{width: `${pct}%`}}
          />
        </div>

        <div className="mt-8 h-24 relative flex items-center justify-center">
          <svg
            viewBox="0 0 100 60"
            className="w-40 h-24 transition-opacity duration-150"
            style={{opacity: fade ? 1 : 0}}
          >
            <circle
              cx={pose.head.cx}
              cy={pose.head.cy}
              r={pose.head.r}
              fill="white"
            />
            {pose.lines.map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            ))}
            {/* ground line */}
            <line x1="4" y1="56" x2="96" y2="56" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
          </svg>
          <div className="absolute -bottom-1 text-[9px] tracking-[.3em] text-white/40">
            {pose.name}
          </div>
        </div>
      </div>
    </div>
  );
}
