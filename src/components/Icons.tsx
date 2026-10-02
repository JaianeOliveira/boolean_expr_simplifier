type IconProps = { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const MoonIcon = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)

export const SunIcon = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const CloseIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ArrowRightIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ShuffleIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

export const BackspaceIcon = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
    <path d="M17 9l-5 6M12 9l5 6" />
  </svg>
)

export const CopyIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
)

export const CheckIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.4}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)
