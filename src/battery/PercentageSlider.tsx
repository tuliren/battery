import { Slider, rem, useMantineTheme } from '@mantine/core';
import { IconGripHorizontal } from '@tabler/icons-react';
import { FC } from 'react';

interface PercentageSliderProps {
  color: string;
  percentage: number;
  setPercentage: (percentage: number) => void;
}

const PercentageSlider: FC<PercentageSliderProps> = ({ color, percentage, setPercentage }) => {
  const theme = useMantineTheme();
  return (
    <Slider
      min={1}
      max={100}
      color={color}
      value={percentage}
      onChange={setPercentage}
      marks={[
        { value: 20, label: '20%' },
        { value: 50, label: '50%' },
        { value: 80, label: '80%' },
      ]}
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

export default PercentageSlider;
