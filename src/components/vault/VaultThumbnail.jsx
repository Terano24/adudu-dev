import React from 'react'

export default function VaultThumbnail({ type, title, onOpen }) {
  return (
    <div className="vault-thumbnail-wrap" onClick={onOpen} title={`Buka berkas: ${title}`}>
      {type === 'suspension' && (
        <svg viewBox="0 0 100 100" fill="none" className="vault-thumb-svg">
          <rect width="100" height="100" rx="8" fill="#0B1329" />
          {/* Shock Absorber Damper & Spring */}
          <line x1="30" y1="20" x2="70" y2="80" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <line x1="35" y1="26" x2="65" y2="74" stroke="#60A5FA" strokeWidth="3" />
          {/* Spring Coils */}
          <path d="M38 28 Q 50 25, 46 36 T 54 48 T 62 60 T 70 72" stroke="#94A3B8" strokeWidth="3.5" fill="none" />
          <circle cx="30" cy="20" r="5" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
          <circle cx="70" cy="80" r="5" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
          {/* Metallic linkages */}
          <line x1="20" y1="40" x2="45" y2="35" stroke="#475569" strokeWidth="2.5" />
          <line x1="55" y1="65" x2="80" y2="60" stroke="#475569" strokeWidth="2.5" />
          <circle cx="45" cy="50" r="1.5" fill="#38BDF8" />
        </svg>
      )}

      {type === 'cfd' && (
        <svg viewBox="0 0 100 100" fill="none" className="vault-thumb-svg">
          <rect width="100" height="100" rx="8" fill="#05172E" />
          {/* Streamlines */}
          <path d="M5 25 Q 40 18, 95 30" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.7" />
          <path d="M5 45 Q 35 30, 95 48" stroke="#60A5FA" strokeWidth="2.2" />
          <path d="M5 65 Q 45 55, 95 62" stroke="#0284C7" strokeWidth="1.8" />
          <path d="M5 80 Q 55 75, 95 82" stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.5" />
          {/* Aerodynamic Car Silhouette */}
          <path
            d="M20 58 Q 32 42, 52 40 L 72 44 Q 86 52, 90 58 L 18 58 Z"
            fill="#1E40AF"
            stroke="#93C5FD"
            strokeWidth="1.5"
          />
          {/* High velocity glow */}
          <ellipse cx="60" cy="46" rx="14" ry="5" fill="#67E8F9" fillOpacity="0.4" />
        </svg>
      )}

      {type === 'fuelcell' && (
        <svg viewBox="0 0 100 100" fill="none" className="vault-thumb-svg">
          <rect width="100" height="100" rx="8" fill="#061A1E" />
          {/* Fuel Cell Stack plates */}
          <rect x="22" y="24" width="56" height="52" rx="4" fill="#0F2D37" stroke="#14B8A6" strokeWidth="1.5" />
          {/* Parallel flow channels */}
          <line x1="28" y1="32" x2="72" y2="32" stroke="#5EEAD4" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="28" y1="40" x2="72" y2="40" stroke="#2DD4BF" strokeWidth="1.5" />
          <line x1="28" y1="48" x2="72" y2="48" stroke="#5EEAD4" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="28" y1="56" x2="72" y2="56" stroke="#2DD4BF" strokeWidth="1.5" />
          <line x1="28" y1="64" x2="72" y2="64" stroke="#5EEAD4" strokeWidth="1.5" strokeOpacity="0.8" />
          {/* Manifold Nozzles */}
          <rect x="16" y="34" width="7" height="10" rx="2" fill="#2DD4BF" />
          <rect x="77" y="56" width="7" height="10" rx="2" fill="#2DD4BF" />
          {/* Tension Rods */}
          <circle cx="28" cy="70" r="2" fill="#99F6E4" />
          <circle cx="72" cy="70" r="2" fill="#99F6E4" />
        </svg>
      )}

      {type === 'bldc' && (
        <svg viewBox="0 0 100 100" fill="none" className="vault-thumb-svg">
          <rect width="100" height="100" rx="8" fill="#1A1208" />
          {/* Motor Stator Outer Ring */}
          <circle cx="50" cy="50" r="38" stroke="#EA580C" strokeWidth="3" />
          <circle cx="50" cy="50" r="24" fill="#271B0D" stroke="#F97316" strokeWidth="1.5" />
          {/* Copper Coils */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            const x = 50 + 30 * Math.cos(angle)
            const y = 50 + 30 * Math.sin(angle)
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="6"
                fill="#C2410C"
                stroke="#FDBA74"
                strokeWidth="1.2"
              />
            )
          })}
          {/* Central Axle Rotor */}
          <circle cx="50" cy="50" r="10" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="50" cy="50" r="4" fill="#451A03" />
        </svg>
      )}

      {type === 'battery' && (
        <svg viewBox="0 0 100 100" fill="none" className="vault-thumb-svg">
          <rect width="100" height="100" rx="8" fill="#0C1B23" />
          {/* Battery module container */}
          <rect x="18" y="24" width="64" height="52" rx="4" fill="#132F3D" stroke="#0D9488" strokeWidth="1.5" />
          {/* Cells Array */}
          <circle cx="32" cy="38" r="6" fill="#14B8A6" stroke="#CCFBF1" strokeWidth="1" />
          <circle cx="50" cy="38" r="6" fill="#14B8A6" stroke="#CCFBF1" strokeWidth="1" />
          <circle cx="68" cy="38" r="6" fill="#14B8A6" stroke="#CCFBF1" strokeWidth="1" />
          <circle cx="32" cy="56" r="6" fill="#14B8A6" stroke="#CCFBF1" strokeWidth="1" />
          <circle cx="50" cy="56" r="6" fill="#14B8A6" stroke="#CCFBF1" strokeWidth="1" />
          <circle cx="68" cy="56" r="6" fill="#14B8A6" stroke="#CCFBF1" strokeWidth="1" />
          {/* Busbar Linkages */}
          <line x1="32" y1="38" x2="50" y2="38" stroke="#FDE047" strokeWidth="1.5" />
          <line x1="50" y1="56" x2="68" y2="56" stroke="#FDE047" strokeWidth="1.5" />
        </svg>
      )}

      {type === 'control' && (
        <svg viewBox="0 0 100 100" fill="none" className="vault-thumb-svg">
          <rect width="100" height="100" rx="8" fill="#0D111A" />
          {/* Terminal Window lines */}
          <rect x="14" y="18" width="72" height="64" rx="4" fill="#161F30" stroke="#3B82F6" strokeWidth="1.2" />
          {/* Top Window Dots */}
          <circle cx="22" cy="25" r="2" fill="#EF4444" />
          <circle cx="28" cy="25" r="2" fill="#F59E0B" />
          <circle cx="34" cy="25" r="2" fill="#10B981" />
          {/* Syntax Code lines */}
          <line x1="22" y1="36" x2="48" y2="36" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="52" y1="36" x2="68" y2="36" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="45" x2="60" y2="45" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="54" x2="74" y2="54" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="63" x2="42" y2="63" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="72" x2="56" y2="72" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* External Link Overlay Button ↗ */}
      <div className="thumb-external-link-btn" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </div>
    </div>
  )
}

