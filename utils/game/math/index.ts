
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


