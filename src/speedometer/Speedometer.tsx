import {
  Box,
  Card,
  Center,
  Grid,
  Group,
  MantineTheme,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconCar,
  IconCaretDown,
  IconCaretUp,
  IconCaretUpDown,
  IconPlane,
  IconRocket,
  IconSailboat2,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';

import ControlButtons from '@/common/ControlButtons';
import NumberSlider from '@/common/NumberSlider';

import styles from './Speedometer.module.css';

interface SpeedometerProps {}

const minSpeedLimit = 25;
const maxSpeedLimit = 65;

const slowDeltaThreshold = 15;
const fastDeltaThreshold = 10;

enum SpeedCategory {
  SLOW = 'slow',
  BELOW = 'below',
  OVER = 'over',
  TOO_FAST = 'too_fast',
}

enum Activity {
  Accelerating = 'accelerating',
  Decelerating = 'decelerating',
  Idle = 'idle',
}

const getSpeedCategory = (speed: number, speedLimit: number): SpeedCategory => {
  if (speed < speedLimit - slowDeltaThreshold) {
    return SpeedCategory.SLOW;
  } else if (speed > speedLimit && speed <= speedLimit + fastDeltaThreshold) {
    return SpeedCategory.OVER;
  } else if (speed > speedLimit + fastDeltaThreshold) {
    return SpeedCategory.TOO_FAST;
  } else {
    return SpeedCategory.BELOW;
  }
};

const getSpeedColor = (theme: MantineTheme, speedCategory: SpeedCategory): string => {
  switch (speedCategory) {
    case SpeedCategory.SLOW:
      return theme.black;
    case SpeedCategory.BELOW:
      return theme.colors.yellow[5];
    case SpeedCategory.OVER:
      return theme.colors.yellow[5];
    case SpeedCategory.TOO_FAST:
      return theme.colors.red[6];
  }
};

const Speedometer: FC<SpeedometerProps> = ({}) => {
  const theme = useMantineTheme();
  const [speed, setSpeed] = useState(25);
  const [speedLimit, setSpeedLimit] = useState(30);
  const [activeStatus, setActiveStatus] = useState<Activity>(Activity.Idle);

  const minSpeed = minSpeedLimit - slowDeltaThreshold - 5;
  const maxSpeed = maxSpeedLimit + fastDeltaThreshold + 20;

  const speedCategory = getSpeedCategory(speed, speedLimit);
  const displayColor = getSpeedColor(theme, speedCategory);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStatus === Activity.Accelerating) {
      if (speed < maxSpeed) {
        interval = setInterval(() => {
          setSpeed((prev) => (prev + 1 > maxSpeed ? maxSpeed : prev + 1));
        }, 50);
      } else {
        setActiveStatus(Activity.Idle);
      }
    } else if (activeStatus === Activity.Decelerating) {
      if (speed > minSpeed) {
        interval = setInterval(() => {
          setSpeed((prev) => (prev - 1 < minSpeed ? minSpeed : prev - 1));
        }, 50);
      } else {
        setActiveStatus(Activity.Idle);
      }
    }
    return () => clearInterval(interval);
  }, [activeStatus, maxSpeed, minSpeed, speed]);

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
          <Group gap="lg">
            <Box
              id="speed-limit"
              py="1px"
              px="10px"
              h={200}
              w={140}
              style={{
                borderRadius: theme.radius.md,
                borderWidth: 4,
                border: '4px solid black',
                textAlign: 'center',
              }}
            >
              <Stack gap={0}>
                <Title size={35} fw={600}>
                  SPEED
                </Title>
                <Title size={35} fw={600}>
                  LIMIT
                </Title>
                <Title size={80} fw={800}>
                  {speedLimit}
                </Title>
              </Stack>
            </Box>

            <Box
              id="speedometer"
              py="1px"
              px="10px"
              h={200}
              w={140}
              style={{
                borderRadius: theme.radius.md,
                borderWidth: 4,
                backgroundColor: theme.colors.yellow[5],
                border: '4px solid black',
                textAlign: 'center',
                display: 'grid',
                gridTemplateRows: '45% 50%',
                gap: '5px',
              }}
            >
              <Stack gap={0}>
                <Title size={35} fw={600}>
                  YOUR
                </Title>
                <Title size={35} fw={600}>
                  SPEED
                </Title>
              </Stack>

              <Box
                style={{
                  flex: '1 1 45%',
                  backgroundColor: theme.black,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                {speedCategory === SpeedCategory.TOO_FAST ? (
                  <Text
                    c={displayColor}
                    fw={800}
                    style={{
                      fontSize: 'calc(2em)',
                      lineHeight: 1,
                    }}
                    className={speedCategory === SpeedCategory.TOO_FAST ? styles.flash : ''}
                  >
                    SLOW
                    <br />
                    DOWN
                  </Text>
                ) : speedCategory === SpeedCategory.SLOW ? (
                  <></>
                ) : (
                  <Text
                    c={displayColor}
                    fw={800}
                    style={{ fontSize: 'calc(4.6em)' }}
                    className={speedCategory === SpeedCategory.OVER ? styles.flash : ''}
                  >
                    {speed}
                  </Text>
                )}
              </Box>
            </Box>
          </Group>
        </Card.Section>

        <Stack gap="xl">
          <Grid>
            <Grid.Col span={4}>
              <Title order={4}>Speed Limit</Title>
            </Grid.Col>
            <Grid.Col span={8}>
              <NumberSlider
                color="gray"
                value={speedLimit}
                setValue={setSpeedLimit}
                min={minSpeedLimit}
                max={maxSpeedLimit}
                marks={[
                  { value: 25, label: 25 },
                  { value: 45, label: 45 },
                  { value: 65, label: 65 },
                ]}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4}>
              <Title order={4}>Your Speed</Title>
            </Grid.Col>
            <Grid.Col span={8}>
              <NumberSlider
                color="gray"
                value={speed}
                setValue={setSpeed}
                min={minSpeed}
                max={maxSpeed}
                marks={[
                  { value: 25, label: 25 },
                  { value: 45, label: 45 },
                  { value: 65, label: 65 },
                ]}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4}>
              <Title order={4}>Shift</Title>
            </Grid.Col>
            <Grid.Col span={8}>
              <ControlButtons<SpeedCategory>
                currentValue={speedCategory}
                setCurrentValue={(value) => {
                  if (value === SpeedCategory.SLOW) {
                    setSpeed(speedLimit - slowDeltaThreshold - 5);
                  } else if (value === SpeedCategory.BELOW) {
                    setSpeed(speedLimit);
                  } else if (value === SpeedCategory.OVER) {
                    setSpeed(speedLimit + fastDeltaThreshold);
                  } else {
                    setSpeed(speedLimit + fastDeltaThreshold + 5);
                  }
                }}
                values={[
                  {
                    value: SpeedCategory.SLOW,
                    color: theme.black,
                    icon: IconSailboat2,
                    label: 'Slowest',
                  },
                  {
                    value: SpeedCategory.BELOW,
                    color: theme.colors.green[5],
                    icon: IconCar,
                    label: 'Slow',
                  },
                  {
                    value: SpeedCategory.OVER,
                    color: theme.colors.yellow[5],
                    icon: IconPlane,
                    label: 'Fast',
                  },
                  {
                    value: SpeedCategory.TOO_FAST,
                    color: theme.colors.red[5],
                    icon: IconRocket,
                    label: 'Fastest',
                  },
                ]}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4}>
              <Title order={4}>Operations</Title>
            </Grid.Col>
            <Grid.Col span={8}>
              <ControlButtons<Activity>
                currentValue={activeStatus}
                setCurrentValue={setActiveStatus}
                values={[
                  {
                    value: Activity.Idle,
                    color: theme.colors.gray[5],
                    icon: IconCaretUpDown,
                    label: 'Idle',
                  },
                  {
                    value: Activity.Accelerating,
                    color: theme.colors.green[5],
                    icon: IconCaretUp,
                    label: 'Accelerate',
                    disabled: speed === maxSpeed,
                  },
                  {
                    value: Activity.Decelerating,
                    color: theme.colors.red[5],
                    icon: IconCaretDown,
                    label: 'Decelerate',
                    disabled: speed === minSpeed,
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

export default Speedometer;
