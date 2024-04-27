export const random = (array: any[]) => {
  return array[Math.round(Math.random() * (array.length - 1))]
}
