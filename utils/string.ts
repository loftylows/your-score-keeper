export const capitalize = (str: string) => {
  var splitStr = str.toLowerCase().split(" ")
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  // Directly return the joined string
  return splitStr.join(" ")
}

export const trimAndLowercaseStringValsInObject = <T>(data: T, filterFields: string[] = []): T => {
  if (!(data instanceof Object)) return data

  return Object.entries(data).reduce(
    (accu, [k, v]) =>
      typeof v === "string" && filterFields.length && filterFields.includes(k)
        ? { ...accu, [k]: v.trim().toLocaleLowerCase() }
        : { ...accu, [k]: v },
    {} as T
  )
}
