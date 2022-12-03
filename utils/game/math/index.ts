
export const findNormalizedValue = (value: number) => {
  const minOfValue = Math.floor(value)
  const maxOfValue = Math.ceil(value)
  const dividend = value - minOfValue
  let divisor = maxOfValue - minOfValue
  let normalizedValue;
  if(divisor === 0){
    normalizedValue = 0
  } else {
    normalizedValue = dividend / divisor
  }
  return normalizedValue
}

export const normalizedToRadians = (normalizedValue: number) => {
  return normalizedValue * 2 * Math.PI
}

export const randomizeNumBetweenMinAndMax = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}
