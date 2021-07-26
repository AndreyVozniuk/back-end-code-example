export const convertFromBase64ToBinary = (base64: string, contentType: string): { binary: Buffer, contentType: string } => {
  return {
    binary: Buffer.alloc(base64.length, base64, 'base64'),
    contentType
  }
}

export const convertFromBinaryToBase64 = (binary: Buffer, contentType: string): { base64: string, contentType: string } => {
  const bufferArray = binary.buffer || binary

  return {
    base64: Buffer.from(bufferArray).toString('base64'),
    contentType
  }
}

export const convertTrialPeriodDurationToPayPalFormat = (duration: {day?: number, month?: number, year?: number}):
  { interval_unit: string, total_cycles: number } => {
  if(duration.day) {
    return {
      interval_unit: 'DAY',
      total_cycles: duration.day
    }
  }

  if(duration.month) {
    return {
      interval_unit: 'MONTH',
      total_cycles: duration.month
    }
  }

  if(duration.year) {
    return {
      interval_unit: 'YEAR',
      total_cycles: duration.year
    }
  }

  return {
    interval_unit: 'DAY',
    total_cycles: 1
  }
}
