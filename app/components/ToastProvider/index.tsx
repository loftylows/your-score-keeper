import * as React from "react"
import { useToast } from "@chakra-ui/core"

export type ToastType = ReturnType<typeof useToast>
// create toast context
// @ts-ignore
export const ToastContext = React.createContext<ReturnType<typeof useToast>>(() => {})

interface IProps {
  children: React.ReactChild
}
// create provider
const ToastProvider = ({ children }: IProps) => {
  const toast = useToast()
  return <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
}

export default ToastProvider
