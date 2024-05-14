import { Slider, rem, useMantineTheme } from '@mantine/core';
import { IconGripHorizontal } from '@tabler/icons-react';
import { FC, ReactNode } from 'react';

interface NumberSliderProps {
  color: string;
  value: number;
  setValue: (percentage: number) => void;
  min: number;
  max: number;
  marks?: Array<{
    value: number;
    label?: ReactNode;
  }>;
}

const NumberSlider: FC<NumberSliderProps> = ({ color, value, setValue, min, max, marks }) => {
  const theme = useMantineTheme();
  return (
    <Slider
      min={min}
      max={max}
      color={color}
      value={value}
      onChange={setValue}
      marks={marks}
      thumbChildren={
        <IconGripHorizontal style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      }
      styles={{
        thumb: {
          border: `${rem('1px')} solid light-dark(${theme.colors.gray[3]}, ${
            theme.colors.dark[2]
          })`,
          width: rem('28px'),
          height: rem('22px'),
          color: theme.colors.gray[6],
          backgroundColor: theme.colors.gray[0],
          borderRadius: theme.radius.sm,
        },
      }}
    />
  );
};

export default NumberSlider;
