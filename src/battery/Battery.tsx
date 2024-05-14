import {
  Box,
  Card,
  Center,
  Grid,
  Progress,
  SegmentedControl,
  Space,
  Stack,
  Table,
  Title,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconBolt, IconPlug, IconPlugX } from '@tabler/icons-react';
import { FC, useState } from 'react';

import PercentageSlider from '@/battery/PercentageSlider';

const percentageMargin = 8;
const lowBatteryThreshold = 20;
const mediumBatteryThreshold = 50;

interface BatteryProps {}

const Battery: FC<BatteryProps> = ({}) => {
  const [chargingStatus, setChargingStatus] = useState<'on' | 'off'>('on');
  const [percentage, setPercentage] = useState(85);
  const theme = useMantineTheme();
  const lowBatteryColor = theme.colors.red[4];
  const mediumBatteryColor = theme.colors.orange[4];
  const highBatteryColor = theme.colors.green[5];

  const color =
    chargingStatus === 'on'
      ? highBatteryColor
      : percentage < lowBatteryThreshold
      ? lowBatteryColor
      : percentage < mediumBatteryThreshold
      ? mediumBatteryColor
      : highBatteryColor;

  return (
    <Center>
      <Card w="70vw">
        <Card.Section
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '55vh',
          }}
        >
          <Box
            style={{
              border: `8px solid ${theme.colors.dark[4]}`,
              width: 300,
              height: 100,
              borderRadius: theme.radius.sm,
              backgroundColor: '#f3f3f3',
              position: 'relative',
            }}
          >
            <Progress
              size="xl"
              value={percentage}
              color={color}
              style={{
                position: 'absolute',
                bottom: percentageMargin, // Align to the bottom of the parent Box with margin
                left: percentageMargin, // Align to the left of the parent Box with margin
                right: percentageMargin, // Align to the right of the parent Box with margin
                width: `calc(100% - ${percentageMargin * 2}px)`, // Calculate width based on margins
                height: `calc(100% - ${percentageMargin * 2}px)`, // Adjust the height to your preference for the charge level indication
                borderRadius: theme.radius.sm,
                zIndex: 10,
              }}
            />
          </Box>

          {chargingStatus === 'on' && (
            <Box
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 20,
              }}
            >
              <IconBolt size={55} stroke={1.4} color={theme.colors.dark[4]} />
            </Box>
          )}
        </Card.Section>

        <Stack gap="xl">
          <Grid>
            <Grid.Col span={4}>
              <Title order={4}>Percentage</Title>
            </Grid.Col>
            <Grid.Col span={8}>
              <PercentageSlider
                color={color}
                percentage={percentage}
                setPercentage={setPercentage}
              />
            </Grid.Col>
          </Grid>

          <Space />

          <Grid>
            <Grid.Col span={4}>
              <Title order={4}>Charging</Title>
            </Grid.Col>
            <Grid.Col span={8}>
              <SegmentedControl
                value={chargingStatus}
                onChange={(value) => setChargingStatus(value as 'on' | 'off')}
                data={[
                  {
                    value: 'on',
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconPlug color="green" style={{ width: rem(16), height: rem(16) }} />
                        <span>On</span>
                      </Center>
                    ),
                  },
                  {
                    value: 'off',
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconPlugX color="gray" style={{ width: rem(16), height: rem(16) }} />
                        <span>Off</span>
                      </Center>
                    ),
                  },
                ]}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </Center>
  );
};

export default Battery;
