import React from 'react';
import { useSoc } from '../../context/SocContext';

export const SeverityRadarChart: React.FC = () => {
  const { setActiveTab } = useSoc();

  const centerX = 120;
  const centerY = 110;
  const maxR = 75;

  const critVal = 0.35;
  const highVal = 0.64;
  const medVal = 0.52;
  const lowVal = 0.47;

  const topX = centerX;
  const topY = centerY - critVal * maxR;
  const rightX = centerX + highVal * maxR;
  const rightY = centerY;
  const bottomX = centerX;
  const bottomY = centerY + medVal * maxR;
  const leftX = centerX - lowVal * maxR;
  const leftY = centerY;

  const polygonPoints = `${topX},${topY} ${rightX},${rightY} ${bottomX},${bottomY} ${leftX},${leftY}`;

  return (
    <div 
      onClick={() => setActiveTab('alerts')}
      className="bg-[#0b1028] border border-[#16214a] rounded-xl p-3.5 flex flex-col justify-between hover:border-blue-500/40 transition-all cursor-pointer h-full shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-[#152044] pb-2">
        <h3 className="text-xs font-semibold text-slate-200 tracking-wide font-sans">
          Threat Distribution by Severity
        </h3>
        <span className="text-[10px] font-mono text-cyan-400">Live</span>
      </div>

      <div className="relative flex items-center justify-center my-auto py-1">
        <svg viewBox="0 0 240 220" className="w-full max-w-[230px] h-auto overflow-visible">
          {/* Concentric grid circles */}
          {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={maxR * level}
              fill="none"
              stroke="#18234e"
              strokeWidth="0.8"
              strokeDasharray={i === 3 ? "none" : "2,3"}
            />
          ))}

          {/* Cross lines */}
          <line x1={centerX - maxR - 12} y1={centerY} x2={centerX + maxR + 12} y2={centerY} stroke="#18234e" strokeWidth="0.8" />
          <line x1={centerX} y1={centerY - maxR - 12} x2={centerX} y2={centerY + maxR + 12} stroke="#18234e" strokeWidth="0.8" />

          {/* Glowing radar polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(249, 115, 22, 0.22)"
            stroke="#f97316"
            strokeWidth="2"
            filter="drop-shadow(0 0 6px rgba(249, 115, 22, 0.5))"
          />

          {/* Vertex dots */}
          <circle cx={topX} cy={topY} r="3.5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
          <circle cx={rightX} cy={rightY} r="3.5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
          <circle cx={bottomX} cy={bottomY} r="3.5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
          <circle cx={leftX} cy={leftY} r="3.5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />

          {/* 4 Axis Labels exactly as in the picture */}
          {/* Top: 35% Critical */}
          <text x={centerX} y={centerY - maxR - 14} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            35%
          </text>
          <text x={centerX} y={centerY - maxR - 4} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
            Critical
          </text>

          {/* Right: 64% High */}
          <text x={centerX + maxR + 18} y={centerY - 2} textAnchor="start" fill="#e2e8f0" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            64%
          </text>
          <text x={centerX + maxR + 18} y={centerY + 9} textAnchor="start" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
            High
          </text>

          {/* Bottom: 52% Medium */}
          <text x={centerX} y={centerY + maxR + 14} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            52%
          </text>
          <text x={centerX} y={centerY + maxR + 24} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
            Medium
          </text>

          {/* Left: 47% Low */}
          <text x={centerX - maxR - 18} y={centerY - 2} textAnchor="end" fill="#e2e8f0" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            47%
          </text>
          <text x={centerX - maxR - 18} y={centerY + 9} textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
            Low
          </text>
        </svg>
      </div>
    </div>
  );
};
