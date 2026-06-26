// ─── Scorpius Health Theme ────────────────────────────────────────────────────
// A clinical-grade design system: deep navy base, precise neutrals,
// unambiguous semantic states, and a single cobalt accent.

export const theme = {
  bg: {
    base:       '#0B1120', // deep navy — primary canvas
    surface:    '#111827', // card / panel surface
    elevated:   '#1C2A3A', // elevated cards, popovers
    muted:      '#1F2D3D', // subtle section backgrounds
    overlay:    '#0D1B2A', // modal overlays
  },

  border: {
    default:  '#1E3048', // standard border
    subtle:   '#162438', // faint dividers
    emphasis: '#2A4A6B', // highlighted borders
    focus:    '#3B7DD8', // focus ring
  },

  text: {
    primary:    '#F0F4F8', // near-white body text
    secondary:  '#94A3B8', // supporting text
    muted:      '#64748B', // labels, placeholders
    inverse:    '#0B1120', // text on light surfaces
    heading:    '#E2EAF4', // section headings
    code:       '#7DD3FC', // inline code / monospace values
  },

  accent: {
    cobalt:     '#3B7DD8', // primary brand action
    cobaltHover:'#2563EB',
    cobaltLight:'#BFDBFE', // tinted badge text
    cobaltMuted:'#1E3A5F', // low-contrast accent fill
  },

  semantic: {
    // Critical / error
    critical:       '#DC2626',
    criticalBg:     '#3B0F0F',
    criticalBorder: '#7F1D1D',
    criticalText:   '#FCA5A5',

    // High / warning
    high:           '#D97706',
    highBg:         '#3B2000',
    highBorder:     '#78350F',
    highText:       '#FCD34D',

    // Medium / info
    medium:         '#2563EB',
    mediumBg:       '#0F1E3B',
    mediumBorder:   '#1E3A6E',
    mediumText:     '#93C5FD',

    // Low / success / normal
    low:            '#16A34A',
    lowBg:          '#0A2015',
    lowBorder:      '#14532D',
    lowText:        '#86EFAC',

    // Neutral / pending
    pending:        '#6B7280',
    pendingBg:      '#1C2333',
    pendingBorder:  '#374151',
    pendingText:    '#D1D5DB',
  },

  chart: {
    grid:     '#1E3048',
    axis:     '#64748B',
    fill:     '#3B7DD820', // area fill (low opacity cobalt)
    stroke:   '#3B7DD8',
    endpoint: '#F0F4F8',
    danger:   '#DC2626',
    warning:  '#D97706',
    success:  '#16A34A',
  },

  radius: {
    sm:   '4px',
    md:   '6px',
    lg:   '10px',
    full: '9999px',
  },

  shadow: {
    card:     '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
    elevated: '0 4px 16px rgba(0,0,0,0.5)',
    focus:    '0 0 0 2px #3B7DD8',
  },
} as const;

export type Theme = typeof theme;
