import {useEffect, useState} from 'react';

interface Props {
  startValue: number;
  minValue: number;
  maxValue: number;
}

export default function useMinMaxValue({startValue, minValue, maxValue}: Props) {
  const [value, setValue] = useState(startValue);

  useEffect(() => {
    if (minValue >= maxValue) {
      throw new Error('Min Value must be lesser than Max Value');
    }

    if (startValue < minValue || startValue > maxValue) {
      throw new Error('Start Value must be between Min and Max Value');
    }
  }, []);

  useEffect(() => {
    setValue(prevState => {
      if (prevState > maxValue)
        return maxValue;
      else if (prevState < minValue)
        return minValue;

      return prevState;
    });
  }, [value]);

  return {value, setValue};
}