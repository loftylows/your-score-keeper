import Filter from "bad-words"
const filter = new Filter({ replaceRegex: /(?<!^).(?!$)/g })

export const cleanProfaneStringDataInObj = <T>(data: T, filterFields: string[] = []): T => {
  if (!(data instanceof Object)) return data

  return Object.entries(data).reduce(
    (accu, [k, v]) =>
      typeof v === "string" && filterFields.length && filterFields.includes(k)
        ? { ...accu, [k]: filter.clean(v) }
        : { ...accu, [k]: v },
    {} as T
  )
}

export default filter
