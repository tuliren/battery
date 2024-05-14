import { Center, SegmentedControl, rem } from '@mantine/core';
import type { SegmentedControlItem } from '@mantine/core/lib/components/SegmentedControl';
import { Icon } from '@tabler/icons-react';

interface ControlButtonsProps<T extends string> {
  currentValue: T;
  setCurrentValue: (value: T) => void;
  values: Array<{
    value: T;
    color: string;
    icon: Icon;
    label: string;
    disabled?: boolean;
  }>;
}

function ControlButtons<T extends string>({
  currentValue,
  setCurrentValue,
  values,
}: ControlButtonsProps<T>) {
  return (
    <SegmentedControl
      value={currentValue}
      onChange={(value) => setCurrentValue(value as T)}
      data={values.map(
        ({ value, color, icon: Icon, label, disabled }) =>
          ({
            value,
            disabled: disabled ?? false,
            label: (
              <Center style={{ gap: 5 }}>
                <Icon color={color} style={{ width: rem(16), height: rem(16) }} />
                <span>{label}</span>
              </Center>
            ),
          } as SegmentedControlItem)
      )}
    />
  );
}

export default ControlButtons;
