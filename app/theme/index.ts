import { extendTheme } from "@chakra-ui/core"
import theme from "@chakra-ui/theme"

export const brandColors = {
  50: "#fbf4e2",
  100: "#eadfc5",
  200: "#d9caa4",
  300: "#c8b582",
  400: "#b99f60",
  500: "#9f8646",
  600: "#7c6836",
  700: "#594a25",
  800: "#362d12",
  900: "#160f00",
}

const primaryBtnColors = {
  50: "#e0f6ff",
  100: "#b6e0fa",
  200: "#8bcbf4",
  300: "#60b6ee",
  400: "#37a1e7",
  500: "#2287ce",
  600: "#1669a1",
  700: "#0b4b74",
  800: "#002d48",
  900: "#00101c",
}

const fontFamily = "Roboto, sans-serif"

const fonts = {
  body: "Roboto, sans-serif",
  heading: "Roboto, sans-serif",
  mono: "Menlo, monospace",
}

const getGlobalStyles = (_) => ({
  "*": {
    fontFamily: fontFamily,
  },
  ".Toastify__toast": {
    borderRadius: "10px",
    overflow: "hidden",
  },
})

const size = {
  lg: {
    fontSize: "lg",
    pl: 4,
    pr: 4,
    h: 12,
    borderRadius: "8px",
  },

  md: {
    fontSize: "md",
    pl: 4,
    pr: 4,
    h: 10,
    borderRadius: "8px",
  },

  sm: {
    fontSize: "sm",
    pl: 3,
    pr: 3,
    h: 8,
    borderRadius: "8px",
  },
}

const sizes = {
  lg: {
    field: size.lg,
    addon: size.lg,
  },
  md: {
    field: size.md,
    addon: size.md,
  },
  sm: {
    field: size.sm,
    addon: size.sm,
  },
}

const defaultThemeExtension = {
  ...theme,
  components: {
    ...theme.components,
    Input: {
      sizes,
    },
    Button: {
      baseStyle: {
        borderRadius: "8px",
      },
    },
  },
  fonts: {
    ...theme.fonts,
    ...fonts,
  },
  colors: {
    ...theme.colors,
    brand: brandColors,
    primaryBtn: primaryBtnColors,
    sidebar: "rgba(226,232,240,1)",
  },
  styles: {
    ...theme.styles,
    global: getGlobalStyles,
  },
}

export const customTheme = extendTheme(defaultThemeExtension)

export default defaultThemeExtension
