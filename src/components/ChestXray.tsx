import React from "react";

interface ChestXrayProps {
  showHeatmap?: boolean;
  className?: string;
}

const ChestXray: React.FC<ChestXrayProps> = ({
  showHeatmap = false,
  className = "",
}) => {
  return (
    <div className={`relative inline-block ${className}`} style={{ lineHeight: 0 }}>
      <svg
        viewBox="0 0 480 560"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          {/* Body soft tissue gradient */}
          <radialGradient id="bodyGrad" cx="50%" cy="48%" r="52%">
            <stop offset="0%" stopColor="#191919" />
            <stop offset="70%" stopColor="#111" />
            <stop offset="100%" stopColor="#080808" />
          </radialGradient>

          {/* Left lung field gradient */}
          <radialGradient id="lungLeft" cx="38%" cy="45%" r="42%">
            <stop offset="0%" stopColor="#1a2d40" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#152330" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0d1820" stopOpacity="0.6" />
          </radialGradient>

          {/* Right lung field gradient - slightly brighter for pathology */}
          <radialGradient id="lungRight" cx="62%" cy="43%" r="42%">
            <stop offset="0%" stopColor="#22364c" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#1c2e42" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#152333" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0d1820" stopOpacity="0.6" />
          </radialGradient>

          {/* Heart shadow gradient */}
          <radialGradient id="heartGrad" cx="45%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#888" />
            <stop offset="40%" stopColor="#777" />
            <stop offset="75%" stopColor="#666" />
            <stop offset="100%" stopColor="#4a4a4a" stopOpacity="0.6" />
          </radialGradient>

          {/* Right upper lobe opacity (TB consolidation) */}
          <radialGradient id="tbOpacity" cx="60%" cy="32%" r="38%">
            <stop offset="0%" stopColor="#3a4e62" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#2e3f52" stopOpacity="0.65" />
            <stop offset="65%" stopColor="#1e2e3e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1e2e3e" stopOpacity="0" />
          </radialGradient>

          {/* Diaphragm gradient */}
          <linearGradient id="diaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#666" />
            <stop offset="100%" stopColor="#3a3a3a" />
          </linearGradient>

          {/* Hilar vascular blur filter */}
          <filter id="hilarBlur">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>

          {/* Soft edge filter for lung fields */}
          <filter id="lungBlur">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Subtle rib blur */}
          <filter id="ribBlur">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>

          {/* Spine texture */}
          <linearGradient id="spineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#555" stopOpacity="0.7" />
            <stop offset="30%" stopColor="#888" />
            <stop offset="50%" stopColor="#999" />
            <stop offset="70%" stopColor="#888" />
            <stop offset="100%" stopColor="#555" stopOpacity="0.7" />
          </linearGradient>

          {/* Trachea inner gradient */}
          <linearGradient id="tracheaGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="30%" stopColor="#080808" />
            <stop offset="70%" stopColor="#080808" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          {/* Clip for body outline */}
          <clipPath id="bodyClip">
            <ellipse cx="240" cy="295" rx="196" ry="258" />
          </clipPath>
        </defs>

        {/* ── Background ── */}
        <rect width="480" height="560" fill="#050505" />

        {/* ── Soft tissue body outline ── */}
        <ellipse
          cx="240"
          cy="295"
          rx="196"
          ry="258"
          fill="url(#bodyGrad)"
          opacity="1"
        />
        {/* Shoulder width bump - left */}
        <ellipse cx="90" cy="120" rx="72" ry="44" fill="#131313" opacity="0.85" />
        {/* Shoulder width bump - right */}
        <ellipse cx="390" cy="120" rx="72" ry="44" fill="#131313" opacity="0.85" />

        {/* ── Lung fields (rendered below ribs) ── */}
        {/* Left lung */}
        <ellipse
          cx="168"
          cy="265"
          rx="95"
          ry="148"
          fill="url(#lungLeft)"
          opacity="0.92"
          filter="url(#lungBlur)"
        />
        {/* Left lung sharper inner */}
        <ellipse cx="168" cy="260" rx="80" ry="132" fill="#1e2d3e" opacity="0.55" />

        {/* Right lung */}
        <ellipse
          cx="310"
          cy="260"
          rx="98"
          ry="145"
          fill="url(#lungRight)"
          opacity="0.92"
          filter="url(#lungBlur)"
        />
        {/* Right lung sharper inner */}
        <ellipse cx="310" cy="255" rx="82" ry="128" fill="#20303f" opacity="0.5" />

        {/* ── TB pathology: Right upper zone hazy opacity ── */}
        <ellipse
          cx="312"
          cy="175"
          rx="70"
          ry="62"
          fill="url(#tbOpacity)"
          opacity="1"
        />
        {/* Extra subtle consolidation patch */}
        <ellipse cx="318" cy="160" rx="45" ry="38" fill="#2e3e50" opacity="0.45" />
        <ellipse cx="308" cy="168" rx="28" ry="24" fill="#384e62" opacity="0.3" />

        {/* ── Spine ── */}
        {/* Spine body column */}
        <rect
          x="231"
          y="62"
          width="18"
          height="400"
          fill="url(#spineGrad)"
          rx="3"
          opacity="0.85"
        />
        {/* Vertebral bodies */}
        {[80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420].map(
          (y, i) => (
            <rect
              key={`vert-${i}`}
              x="228"
              y={y - 7}
              width="24"
              height="13"
              rx="2"
              fill="#999"
              opacity={0.55 + (i % 2) * 0.08}
            />
          )
        )}
        {/* Spinous process shadows */}
        {[80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360].map(
          (y, i) => (
            <rect
              key={`sp-${i}`}
              x="237"
              y={y - 4}
              width="6"
              height="8"
              rx="1"
              fill="#bbb"
              opacity="0.35"
            />
          )
        )}

        {/* ── Trachea ── */}
        {/* Outer trachea wall */}
        <rect
          x="232"
          y="38"
          width="16"
          height="148"
          rx="7"
          fill="#3a3a3a"
          opacity="0.7"
        />
        {/* Trachea air column */}
        <rect
          x="234.5"
          y="40"
          width="11"
          height="145"
          rx="5"
          fill="url(#tracheaGrad)"
          opacity="1"
        />
        {/* Tracheal ring markings */}
        {[50, 62, 74, 86, 98, 110, 122, 134, 146, 158, 170].map((y, i) => (
          <line
            key={`tring-${i}`}
            x1="234"
            y1={y}
            x2="246"
            y2={y}
            stroke="#4a4a4a"
            strokeWidth="1"
            opacity="0.6"
          />
        ))}

        {/* ── Carina & Main Bronchi ── */}
        {/* Carina bifurcation */}
        <path
          d="M 240 183 C 240 183 226 195 210 208 C 196 220 190 230 185 245"
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 240 183 C 240 183 254 195 268 208 C 282 220 288 230 292 245"
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.75"
        />
        {/* Left bronchus air */}
        <path
          d="M 240 183 C 240 183 226 195 210 208 C 196 220 190 230 185 245"
          fill="none"
          stroke="#050808"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Right bronchus air */}
        <path
          d="M 240 183 C 240 183 254 195 268 208 C 282 220 288 230 292 245"
          fill="none"
          stroke="#050808"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Carina point */}
        <circle cx="240" cy="183" r="3" fill="#1a1a1a" opacity="0.85" />

        {/* ── Clavicles ── */}
        {/* Left clavicle */}
        <path
          d="M 240 75 C 224 72 200 68 178 70 C 158 72 138 80 118 92"
          fill="none"
          stroke="#b8b8b8"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
          filter="url(#ribBlur)"
        />
        {/* Right clavicle */}
        <path
          d="M 240 75 C 256 72 280 68 302 70 C 322 72 342 80 362 92"
          fill="none"
          stroke="#b8b8b8"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
          filter="url(#ribBlur)"
        />

        {/* ── Scapulae ── */}
        {/* Left scapula */}
        <path
          d="M 108 108 L 88 175 L 112 245 L 125 210 L 118 148 Z"
          fill="none"
          stroke="#6a6a6a"
          strokeWidth="1.5"
          opacity="0.38"
          filter="url(#ribBlur)"
        />
        <line
          x1="108"
          y1="108"
          x2="130"
          y2="128"
          stroke="#6a6a6a"
          strokeWidth="1.5"
          opacity="0.38"
        />
        {/* Right scapula */}
        <path
          d="M 372 108 L 392 175 L 368 245 L 355 210 L 362 148 Z"
          fill="none"
          stroke="#6a6a6a"
          strokeWidth="1.5"
          opacity="0.38"
          filter="url(#ribBlur)"
        />
        <line
          x1="372"
          y1="108"
          x2="350"
          y2="128"
          stroke="#6a6a6a"
          strokeWidth="1.5"
          opacity="0.38"
        />

        {/* ── Ribs ── */}
        {/* Posterior ribs are more horizontal, anterior ribs angle downward */}
        {/* Each rib: posterior segment from spine, then anterior segment angling down */}

        {/* RIB PAIR 1 (top) */}
        {/* Left posterior rib 1 */}
        <path d="M 228 95 C 205 88 178 84 152 90 C 132 94 118 102 108 112"
          fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" opacity="0.75" filter="url(#ribBlur)" />
        {/* Left anterior rib 1 */}
        <path d="M 108 112 C 100 122 96 136 98 152 C 100 165 108 174 120 178"
          fill="none" stroke="#909090" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" filter="url(#ribBlur)" />
        {/* Right posterior rib 1 */}
        <path d="M 252 95 C 275 88 302 84 328 90 C 348 94 362 102 372 112"
          fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" opacity="0.75" filter="url(#ribBlur)" />
        {/* Right anterior rib 1 */}
        <path d="M 372 112 C 380 122 384 136 382 152 C 380 165 372 174 360 178"
          fill="none" stroke="#909090" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" filter="url(#ribBlur)" />

        {/* RIB PAIR 2 */}
        <path d="M 228 115 C 202 108 172 106 145 114 C 124 120 110 130 100 143"
          fill="none" stroke="#959595" strokeWidth="2" strokeLinecap="round" opacity="0.72" filter="url(#ribBlur)" />
        <path d="M 100 143 C 92 155 90 170 93 186 C 96 200 106 210 120 214"
          fill="none" stroke="#8c8c8c" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" filter="url(#ribBlur)" />
        <path d="M 252 115 C 278 108 308 106 335 114 C 356 120 370 130 380 143"
          fill="none" stroke="#959595" strokeWidth="2" strokeLinecap="round" opacity="0.72" filter="url(#ribBlur)" />
        <path d="M 380 143 C 388 155 390 170 387 186 C 384 200 374 210 360 214"
          fill="none" stroke="#8c8c8c" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" filter="url(#ribBlur)" />

        {/* RIB PAIR 3 */}
        <path d="M 228 138 C 200 131 168 130 140 140 C 118 148 103 160 94 175"
          fill="none" stroke="#929292" strokeWidth="1.9" strokeLinecap="round" opacity="0.7" filter="url(#ribBlur)" />
        <path d="M 94 175 C 86 190 85 208 89 225 C 93 240 104 250 118 254"
          fill="none" stroke="#888" strokeWidth="1.7" strokeLinecap="round" opacity="0.58" filter="url(#ribBlur)" />
        <path d="M 252 138 C 280 131 312 130 340 140 C 362 148 377 160 386 175"
          fill="none" stroke="#929292" strokeWidth="1.9" strokeLinecap="round" opacity="0.7" filter="url(#ribBlur)" />
        <path d="M 386 175 C 394 190 395 208 391 225 C 387 240 376 250 362 254"
          fill="none" stroke="#888" strokeWidth="1.7" strokeLinecap="round" opacity="0.58" filter="url(#ribBlur)" />

        {/* RIB PAIR 4 */}
        <path d="M 228 160 C 198 154 165 154 136 165 C 113 174 97 188 88 205"
          fill="none" stroke="#8e8e8e" strokeWidth="1.9" strokeLinecap="round" opacity="0.68" filter="url(#ribBlur)" />
        <path d="M 88 205 C 80 222 80 242 85 260 C 90 276 102 286 116 290"
          fill="none" stroke="#858585" strokeWidth="1.7" strokeLinecap="round" opacity="0.55" filter="url(#ribBlur)" />
        <path d="M 252 160 C 282 154 315 154 344 165 C 367 174 383 188 392 205"
          fill="none" stroke="#8e8e8e" strokeWidth="1.9" strokeLinecap="round" opacity="0.68" filter="url(#ribBlur)" />
        <path d="M 392 205 C 400 222 400 242 395 260 C 390 276 378 286 364 290"
          fill="none" stroke="#858585" strokeWidth="1.7" strokeLinecap="round" opacity="0.55" filter="url(#ribBlur)" />

        {/* RIB PAIR 5 */}
        <path d="M 228 182 C 196 177 162 178 132 191 C 108 202 91 217 82 236"
          fill="none" stroke="#8a8a8a" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" filter="url(#ribBlur)" />
        <path d="M 82 236 C 74 255 75 278 81 297 C 87 315 100 325 115 328"
          fill="none" stroke="#828282" strokeWidth="1.6" strokeLinecap="round" opacity="0.52" filter="url(#ribBlur)" />
        <path d="M 252 182 C 284 177 318 178 348 191 C 372 202 389 217 398 236"
          fill="none" stroke="#8a8a8a" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" filter="url(#ribBlur)" />
        <path d="M 398 236 C 406 255 405 278 399 297 C 393 315 380 325 365 328"
          fill="none" stroke="#828282" strokeWidth="1.6" strokeLinecap="round" opacity="0.52" filter="url(#ribBlur)" />

        {/* RIB PAIR 6 */}
        <path d="M 228 206 C 194 202 158 204 127 219 C 102 231 84 248 75 270"
          fill="none" stroke="#868686" strokeWidth="1.8" strokeLinecap="round" opacity="0.62" filter="url(#ribBlur)" />
        <path d="M 75 270 C 67 292 69 318 77 340 C 84 360 98 370 113 372"
          fill="none" stroke="#7f7f7f" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" filter="url(#ribBlur)" />
        <path d="M 252 206 C 286 202 322 204 353 219 C 378 231 396 248 405 270"
          fill="none" stroke="#868686" strokeWidth="1.8" strokeLinecap="round" opacity="0.62" filter="url(#ribBlur)" />
        <path d="M 405 270 C 413 292 411 318 403 340 C 396 360 382 370 367 372"
          fill="none" stroke="#7f7f7f" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" filter="url(#ribBlur)" />

        {/* RIB PAIR 7 */}
        <path d="M 228 230 C 193 227 155 230 123 247 C 97 261 79 280 70 305"
          fill="none" stroke="#828282" strokeWidth="1.7" strokeLinecap="round" opacity="0.58" filter="url(#ribBlur)" />
        <path d="M 70 305 C 62 330 64 360 74 384 C 82 406 98 416 113 418"
          fill="none" stroke="#7a7a7a" strokeWidth="1.5" strokeLinecap="round" opacity="0.47" filter="url(#ribBlur)" />
        <path d="M 252 230 C 287 227 325 230 357 247 C 383 261 401 280 410 305"
          fill="none" stroke="#828282" strokeWidth="1.7" strokeLinecap="round" opacity="0.58" filter="url(#ribBlur)" />
        <path d="M 410 305 C 418 330 416 360 406 384 C 398 406 382 416 367 418"
          fill="none" stroke="#7a7a7a" strokeWidth="1.5" strokeLinecap="round" opacity="0.47" filter="url(#ribBlur)" />

        {/* RIB PAIR 8 */}
        <path d="M 228 256 C 191 253 152 258 120 277 C 93 293 75 315 66 342"
          fill="none" stroke="#7e7e7e" strokeWidth="1.7" strokeLinecap="round" opacity="0.54" filter="url(#ribBlur)" />
        <path d="M 252 256 C 289 253 328 258 360 277 C 387 293 405 315 414 342"
          fill="none" stroke="#7e7e7e" strokeWidth="1.7" strokeLinecap="round" opacity="0.54" filter="url(#ribBlur)" />

        {/* RIB PAIR 9 */}
        <path d="M 228 282 C 190 280 150 286 118 308 C 91 327 73 352 65 380"
          fill="none" stroke="#7a7a7a" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" filter="url(#ribBlur)" />
        <path d="M 252 282 C 290 280 330 286 362 308 C 389 327 407 352 415 380"
          fill="none" stroke="#7a7a7a" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" filter="url(#ribBlur)" />

        {/* RIB PAIR 10 */}
        <path d="M 228 308 C 190 307 148 315 116 340 C 90 362 72 390 66 420"
          fill="none" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" opacity="0.44" filter="url(#ribBlur)" />
        <path d="M 252 308 C 290 307 332 315 364 340 C 390 362 408 390 414 420"
          fill="none" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" opacity="0.44" filter="url(#ribBlur)" />

        {/* ── Heart Shadow ── */}
        {/* Main heart blob - slightly left of midline */}
        <ellipse
          cx="222"
          cy="305"
          rx="74"
          ry="85"
          fill="url(#heartGrad)"
          opacity="0.88"
        />
        {/* Heart left border (sharper) */}
        <path
          d="M 200 230 C 175 248 158 270 155 295 C 152 322 160 348 175 365 C 190 382 212 388 228 386"
          fill="none"
          stroke="#777"
          strokeWidth="2"
          opacity="0.5"
        />
        {/* Heart right border / aortic knuckle */}
        <path
          d="M 230 230 C 248 232 262 244 268 260 C 275 278 272 300 265 316"
          fill="none"
          stroke="#777"
          strokeWidth="1.5"
          opacity="0.45"
        />
        {/* Aortic knuckle */}
        <ellipse cx="220" cy="228" rx="20" ry="14" fill="#6a6a6a" opacity="0.6" />
        {/* Pulmonary artery segment */}
        <ellipse cx="235" cy="244" rx="15" ry="10" fill="#707070" opacity="0.45" />
        {/* Right heart border */}
        <path
          d="M 265 316 C 262 334 255 352 240 364 C 225 375 208 380 228 386"
          fill="none"
          stroke="#777"
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* ── Hilar Markings ── */}
        {/* Left hilum vascular markings */}
        <g opacity="0.55" filter="url(#hilarBlur)">
          <line x1="185" y1="248" x2="155" y2="228" stroke="#8a8a8a" strokeWidth="2.5" />
          <line x1="185" y1="248" x2="148" y2="252" stroke="#8a8a8a" strokeWidth="2" />
          <line x1="185" y1="248" x2="152" y2="272" stroke="#8a8a8a" strokeWidth="2" />
          <line x1="185" y1="248" x2="160" y2="290" stroke="#7a7a7a" strokeWidth="1.5" />
          <line x1="155" y1="228" x2="138" y2="215" stroke="#7a7a7a" strokeWidth="1.5" />
          <line x1="155" y1="228" x2="140" y2="224" stroke="#7a7a7a" strokeWidth="1.5" />
          <circle cx="185" cy="248" r="5" fill="#7e7e7e" opacity="0.6" />
        </g>

        {/* Right hilum vascular markings */}
        <g opacity="0.55" filter="url(#hilarBlur)">
          <line x1="294" y1="244" x2="324" y2="222" stroke="#8a8a8a" strokeWidth="2.5" />
          <line x1="294" y1="244" x2="332" y2="248" stroke="#8a8a8a" strokeWidth="2" />
          <line x1="294" y1="244" x2="328" y2="268" stroke="#8a8a8a" strokeWidth="2" />
          <line x1="294" y1="244" x2="320" y2="286" stroke="#7a7a7a" strokeWidth="1.5" />
          <line x1="324" y1="222" x2="342" y2="208" stroke="#7a7a7a" strokeWidth="1.5" />
          <line x1="324" y1="222" x2="340" y2="220" stroke="#7a7a7a" strokeWidth="1.5" />
          <circle cx="294" cy="244" r="5" fill="#7e7e7e" opacity="0.6" />
        </g>

        {/* ── Pulmonary Vasculature (lung markings) ── */}
        {/* Left lung vessels */}
        <g opacity="0.28" filter="url(#hilarBlur)">
          <line x1="185" y1="248" x2="145" y2="195" stroke="#aaa" strokeWidth="1.5" />
          <line x1="185" y1="248" x2="132" y2="230" stroke="#aaa" strokeWidth="1.2" />
          <line x1="185" y1="248" x2="128" y2="270" stroke="#aaa" strokeWidth="1.2" />
          <line x1="185" y1="248" x2="135" y2="312" stroke="#aaa" strokeWidth="1" />
          <line x1="185" y1="248" x2="152" y2="340" stroke="#999" strokeWidth="1" />
          <line x1="145" y1="195" x2="128" y2="170" stroke="#999" strokeWidth="1" />
          <line x1="145" y1="195" x2="118" y2="192" stroke="#999" strokeWidth="1" />
          <line x1="132" y1="230" x2="112" y2="218" stroke="#999" strokeWidth="1" />
        </g>

        {/* Right lung vessels */}
        <g opacity="0.28" filter="url(#hilarBlur)">
          <line x1="294" y1="244" x2="335" y2="190" stroke="#aaa" strokeWidth="1.5" />
          <line x1="294" y1="244" x2="348" y2="226" stroke="#aaa" strokeWidth="1.2" />
          <line x1="294" y1="244" x2="352" y2="266" stroke="#aaa" strokeWidth="1.2" />
          <line x1="294" y1="244" x2="345" y2="308" stroke="#aaa" strokeWidth="1" />
          <line x1="294" y1="244" x2="328" y2="336" stroke="#999" strokeWidth="1" />
          <line x1="335" y1="190" x2="350" y2="165" stroke="#999" strokeWidth="1" />
          <line x1="335" y1="190" x2="362" y2="188" stroke="#999" strokeWidth="1" />
          <line x1="348" y1="226" x2="368" y2="212" stroke="#999" strokeWidth="1" />
        </g>

        {/* ── Diaphragm Domes ── */}
        {/* Left hemidiaphragm (lower, heart sits on it) */}
        <path
          d="M 68 415 C 80 385 118 365 170 362 C 200 360 222 366 238 375"
          fill="none"
          stroke="#777"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Left dome fill */}
        <path
          d="M 68 415 C 80 385 118 365 170 362 C 200 360 222 366 238 375 L 238 560 L 68 560 Z"
          fill="#1a1a1a"
          opacity="0.7"
        />

        {/* Right hemidiaphragm (higher than left — normal anatomy) */}
        <path
          d="M 242 368 C 262 355 302 345 345 348 C 378 350 406 362 420 390 C 426 404 428 415 428 422"
          fill="none"
          stroke="#808080"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.88"
        />
        {/* Right dome fill */}
        <path
          d="M 242 368 C 262 355 302 345 345 348 C 378 350 406 362 420 390 C 426 404 428 415 428 422 L 428 560 L 242 560 Z"
          fill="#191919"
          opacity="0.72"
        />

        {/* Gastric bubble hint under left diaphragm */}
        <ellipse cx="174" cy="400" rx="24" ry="12" fill="#0a0f0a" opacity="0.65" />

        {/* ── Costophrenic Angles ── */}
        {/* Left CP angle */}
        <path
          d="M 68 415 L 80 435 L 92 420"
          fill="none"
          stroke="#5a5a5a"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Right CP angle */}
        <path
          d="M 428 422 L 416 442 L 404 428"
          fill="none"
          stroke="#5a5a5a"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* ── Sub-diaphragm region ── */}
        <rect x="44" y="420" width="392" height="140" fill="#0d0d0d" opacity="0.85" rx="0" />

        {/* ── Image edge vignette ── */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="#020202" stopOpacity="0.8" />
        </radialGradient>
        <rect width="480" height="560" fill="url(#vignette)" />

        {/* ── Radiographic markers ── */}
        {/* R marker (patient's right = viewer's left on PA) */}
        <text
          x="22"
          y="42"
          fontFamily="monospace"
          fontSize="20"
          fontWeight="bold"
          fill="white"
          opacity="0.75"
          letterSpacing="1"
        >
          R
        </text>

        {/* L marker */}
        <text
          x="448"
          y="42"
          fontFamily="monospace"
          fontSize="20"
          fontWeight="bold"
          fill="white"
          opacity="0.75"
          textAnchor="middle"
          letterSpacing="1"
        >
          L
        </text>

        {/* ── Bottom-left labels ── */}
        <text
          x="18"
          y="536"
          fontFamily="monospace"
          fontSize="10"
          fill="white"
          opacity="0.55"
          letterSpacing="0.5"
        >
          PA VIEW
        </text>
        <text
          x="18"
          y="550"
          fontFamily="monospace"
          fontSize="10"
          fill="white"
          opacity="0.45"
          letterSpacing="0.5"
        >
          06 MAY 2026 · 10:12
        </text>
      </svg>

      {/* ── Heatmap Overlay ── */}
      {showHeatmap && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
            background: [
              /* Primary hotspot: right upper lobe (65% right, 28% down) */
              "radial-gradient(ellipse 22% 18% at 65% 28%, rgba(240,71,106,0.5) 0%, rgba(244,166,56,0.3) 30%, rgba(242,201,76,0.1) 55%, transparent 80%)",
              /* Secondary hotspot: right hilum */
              "radial-gradient(ellipse 14% 11% at 62% 44%, rgba(240,71,106,0.25) 0%, rgba(244,166,56,0.15) 40%, transparent 75%)",
              /* Tertiary soft blush: upper right quarter */
              "radial-gradient(ellipse 30% 22% at 67% 24%, rgba(244,166,56,0.12) 0%, transparent 70%)",
            ].join(", "),
          }}
        />
      )}
    </div>
  );
};

export default ChestXray;
