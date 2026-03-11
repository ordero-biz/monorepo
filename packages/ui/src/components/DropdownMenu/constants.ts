// Default positioning values for DropdownMenu components
export const DROPDOWN_MENU_DEFAULTS = {
  content: {
    align: "start" as const,
    alignOffset: 0,
    side: "bottom" as const,
    sideOffset: 4,
  },
  subContent: {
    align: "start" as const,
    alignOffset: -3,
    side: "right" as const,
    sideOffset: 0,
  },
} as const

// Variant options
export const DROPDOWN_MENU_VARIANTS = {
  item: {
    default: "default",
    destructive: "destructive",
  },
} as const