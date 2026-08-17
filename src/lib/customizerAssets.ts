export interface GraphicAsset {
  id: string
  name: string
  category: 'streetwear' | 'brutalist' | 'minimal' | 'typography'
  svg: string
  preview: string
}

export interface FontOption {
  id: string
  name: string
  fontFamily: string
  category: 'sans' | 'serif' | 'display' | 'mono'
}

export const CUSTOMIZER_FONTS: FontOption[] = [
  { id: 'inter', name: 'Inter Clean', fontFamily: 'Inter, sans-serif', category: 'sans' },
  { id: 'space-grotesk', name: 'Space Grotesk', fontFamily: 'Space Grotesk, sans-serif', category: 'display' },
  { id: 'cinzel', name: 'Cinzel Serif', fontFamily: 'Cinzel, serif', category: 'serif' },
  { id: 'jetbrains-mono', name: 'JetBrains Mono', fontFamily: 'JetBrains Mono, monospace', category: 'mono' },
  { id: 'helvetica', name: 'Helvetica Neue', fontFamily: '"Helvetica Neue", Arial, sans-serif', category: 'sans' },
  { id: 'playfair', name: 'Playfair Display', fontFamily: '"Playfair Display", Georgia, serif', category: 'serif' },
]

export const CUSTOMIZER_GRAPHICS: GraphicAsset[] = [
  {
    id: 'graphic-crosshair',
    name: 'Target Crosshair',
    category: 'brutalist',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="2"/>
      <circle cx="50" cy="50" r="20" stroke="currentColor" stroke-width="1.5"/>
      <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="2"/>
      <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="2"/>
      <circle cx="50" cy="50" r="4" fill="currentColor"/>
    </svg>`,
    preview: 'Crosshair',
  },
  {
    id: 'graphic-barcode',
    name: 'Archival Barcode',
    category: 'streetwear',
    svg: `<svg viewBox="0 0 140 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="4" height="45"/>
      <rect x="7" y="0" width="2" height="45"/>
      <rect x="12" y="0" width="6" height="45"/>
      <rect x="22" y="0" width="3" height="45"/>
      <rect x="28" y="0" width="5" height="45"/>
      <rect x="37" y="0" width="2" height="45"/>
      <rect x="42" y="0" width="8" height="45"/>
      <rect x="54" y="0" width="3" height="45"/>
      <rect x="60" y="0" width="5" height="45"/>
      <rect x="68" y="0" width="2" height="45"/>
      <rect x="73" y="0" width="7" height="45"/>
      <rect x="83" y="0" width="4" height="45"/>
      <rect x="90" y="0" width="2" height="45"/>
      <rect x="95" y="0" width="6" height="45"/>
      <rect x="104" y="0" width="3" height="45"/>
      <rect x="110" y="0" width="8" height="45"/>
      <rect x="121" y="0" width="3" height="45"/>
      <rect x="127" y="0" width="5" height="45"/>
      <rect x="135" y="0" width="3" height="45"/>
      <text x="70" y="56" font-size="9" font-family="monospace" text-anchor="middle" font-weight="bold" letter-spacing="3">090808-MDY</text>
    </svg>`,
    preview: 'Barcode',
  },
  {
    id: 'graphic-star-burst',
    name: '4-Point Star',
    category: 'brutalist',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0 Z"/>
    </svg>`,
    preview: 'Star',
  },
  {
    id: 'graphic-smiley-invert',
    name: 'Anarchic Smile',
    category: 'streetwear',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke-width="4"/>
      <line x1="32" y1="35" x2="38" y2="45" stroke-width="4"/>
      <line x1="38" y1="35" x2="32" y2="45" stroke-width="4"/>
      <line x1="62" y1="35" x2="68" y2="45" stroke-width="4"/>
      <line x1="68" y1="35" x2="62" y2="45" stroke-width="4"/>
      <path d="M 28 68 Q 50 82 72 68" stroke-width="4" fill="none"/>
    </svg>`,
    preview: 'Smile',
  },
  {
    id: 'graphic-warning-box',
    name: 'Heavy Caution Sign',
    category: 'typography',
    svg: `<svg viewBox="0 0 120 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="120" height="50" fill="none" stroke="currentColor" stroke-width="4"/>
      <rect x="6" y="6" width="108" height="38" fill="currentColor"/>
      <text x="60" y="28" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle" fill="#FFFFFF" letter-spacing="2">AUTHENTIC</text>
      <text x="60" y="38" font-size="7" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#FFFFFF" letter-spacing="1">MOODIFYS / 2026</text>
    </svg>`,
    preview: 'Caution Box',
  },
  {
    id: 'graphic-globe-wire',
    name: 'Digital Sphere',
    category: 'minimal',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44"/>
      <ellipse cx="50" cy="50" rx="44" ry="18"/>
      <ellipse cx="50" cy="50" rx="18" ry="44"/>
      <line x1="6" y1="50" x2="94" y2="50"/>
      <line x1="50" y1="6" x2="50" y2="94"/>
    </svg>`,
    preview: 'Sphere',
  },
]
