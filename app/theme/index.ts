import theme from "@chakra-ui/theme"

export const brandColors = {
  50: "#fffddb",
  100: "#fef1af",
  200: "#fbe281",
  300: "#f8d151",
  400: "#f6bd22",
  500: "#dd9c09",
  600: "#ac8503",
  700: "#7c6700",
  800: "#4b4300",
  900: "#1d1800",
}

const fontFamily = "Roboto, sans-serif"

export const custom = {
  colors: {
    brand: brandColors,
  },
}

const fonts = {
  body: "Roboto, sans-serif",
  heading: "Roboto, sans-serif",
  mono: "Menlo, monospace",
}

const getGlobalStyles = (_) => ({
  "*": {
    fontFamily: fontFamily,
  },
})

const defaultThemeExtension = {
  ...theme,
  fonts: {
    ...theme.fonts,
    ...fonts,
  },
  styles: {
    ...theme.styles,
    global: getGlobalStyles,
  },
  custom: custom,
}

export default defaultThemeExtension
