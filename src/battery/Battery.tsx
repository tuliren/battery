import {
  Box,
  Card,
  Center,
  Grid,
  Progress,
  SegmentedControl,
  Stack,
  Title,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBattery2,
  IconBatteryCharging2,
  IconBolt,
  IconPlug,
  IconPlugX,
} from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';

import NumberSlider from '@/common/NumberSlider';

const percentageMargin = 8;
const lowBatteryThreshold = 20;
const mediumBatteryThreshold = 50;

enum Activity {
  CHARGING = 'charging',
  RELEASING = 'releasing',
  IDLE = 'idle',
}

interface BatteryProps {}

const Battery: FC<BatteryProps> = ({}) => {
  const [chargingStatus, setChargingStatus] = useState<Activity.CHARGING | Activity.IDLE>(
    Activity.IDLE
  );
  const [percentage, setPercentage] = useState(85);
  const [activeStatus, setActiveStatus] = useState<Activity>(Activity.IDLE);
  const theme = useMantineTheme();
  const lowBatteryColor = theme.colors.red[4];
  const mediumBatteryColor = theme.colors.orange[4];
  const highBatteryColor = theme.colors.green[5];

  const color =
    chargingStatus === Activity.CHARGING
      ? highBatteryColor
      : percentage < lowBatteryThreshold
      ? lowBatteryColor
      : percentage < mediumBatteryThreshold
      ? mediumBatteryColor
      : highBatteryColor;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStatus === Activity.CHARGING) {
      setChargingStatus(Activity.CHARGING);
      if (percentage < 100) {
        interval = setInterval(() => {
          setPercentage((prev) => (prev + 1 > 100 ? 100 : prev + 1));
        }, 50);
      } else {
        setChargingStatus(Activity.IDLE);
        setActiveStatus(Activity.IDLE);
      }
    } else if (activeStatus === Activity.RELEASING) {
      setChargingStatus(Activity.IDLE);
      if (percentage > 0) {
        interval = setInterval(() => {
          setPercentage((prev) => (prev - 1 < 0 ? 0 : prev - 1));
        }, 50);
      } else {
        setChargingStatus(Activity.IDLE);
        setActiveStatus(Activity.IDLE);
      }
    }
    return () => clearInterval(interval);
  }, [activeStatus, percentage]);

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

          {chargingStatus === Activity.CHARGING && (
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
              <Title order={4}>Percentage: {percentage}%</Title>
            </Grid.Col>
            <Grid.Col span={8}>
              <NumberSlider
                color={color}
                value={percentage}
                setValue={setPercentage}
                min={0}
                max={100}
                marks={[
                  { value: 20, label: '20%' },
                  { value: 50, label: '50%' },
                  { value: 80, label: '80%' },
                ]}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4}>
              <Title order={4}>Charging Status</Title>
            </Grid.Col>
            <Grid.Col span={8}>
              <SegmentedControl
                value={chargingStatus}
                onChange={(value) => setChargingStatus(value as Activity.CHARGING | Activity.IDLE)}
                data={[
                  {
                    value: Activity.CHARGING,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconPlug color="green" style={{ width: rem(16), height: rem(16) }} />
                        <span>On</span>
                      </Center>
                    ),
                  },
                  {
                    value: Activity.IDLE,
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

          <Grid>
            <Grid.Col span={4}>
              <Title order={4}>Operation</Title>
            </Grid.Col>
            <Grid.Col span={8}>
              <SegmentedControl
                value={activeStatus}
                onChange={(value) => setActiveStatus(value as Activity)}
                data={[
                  {
                    value: Activity.IDLE,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconBattery2 color="blue" style={{ width: rem(16), height: rem(16) }} />
                        <span>Idle</span>
                      </Center>
                    ),
                  },
                  {
                    value: Activity.CHARGING,
                    disabled: percentage === 100,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconBatteryCharging2
                          color="green"
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <span>Charge</span>
                      </Center>
                    ),
                  },
                  {
                    value: Activity.RELEASING,
                    disabled: percentage === 0,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconPlugX color="orange" style={{ width: rem(16), height: rem(16) }} />
                        <span>Release</span>
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
