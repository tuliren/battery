import {
  Box,
  Card,
  Center,
  Grid,
  Group,
  MantineTheme,
  SegmentedControl,
  Stack,
  Text,
  Title,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconCar, IconPlane, IconRocket, IconSailboat2 } from '@tabler/icons-react';
import { FC, useState } from 'react';

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

  const speedCategory = getSpeedCategory(speed, speedLimit);
  const displayColor = getSpeedColor(theme, speedCategory);

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
                min={minSpeedLimit - slowDeltaThreshold - 5}
                max={maxSpeedLimit + fastDeltaThreshold + 20}
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
              <SegmentedControl
                value={speedCategory}
                onChange={(value) => {
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
                data={[
                  {
                    value: SpeedCategory.SLOW,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconSailboat2
                          color={theme.colors.blue[5]}
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <span>Slowest</span>
                      </Center>
                    ),
                  },
                  {
                    value: SpeedCategory.BELOW,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconCar
                          color={theme.colors.green[5]}
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <span>Slow</span>
                      </Center>
                    ),
                  },
                  {
                    value: SpeedCategory.OVER,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconPlane
                          color={theme.colors.yellow[5]}
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <span>Fast</span>
                      </Center>
                    ),
                  },
                  {
                    value: SpeedCategory.TOO_FAST,
                    label: (
                      <Center style={{ gap: 5 }}>
                        <IconRocket
                          color={theme.colors.red[5]}
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <span>Fastest</span>
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

export default Speedometer;
