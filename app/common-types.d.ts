declare module "common-types" {
  export type UUID = string

  export type Maybe<T> = T | null

  export type GeneralObject = { [index: string]: any }

  export type ReactRefFunc = (el: Maybe<Element>) => Maybe<Element>

  export type GenericEventHandler = (event: Event) => any

  export type GenericMouseEventHandler = (event: MouseEvent) => void

  export type GenericFocusEventHandler = (event: FocusEvent) => any

  export type GenericOnChangeHandler = (event: React.ChangeEvent) => any

  export type GenericOnKeyDownHandler = (event: React.KeyboardEvent) => any
}
