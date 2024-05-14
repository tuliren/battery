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
import { FC, useState } from 'react';

import NumberSlider from '@/common/NumberSlider';

import styles from './Speedometer.module.css';

interface SpeedometerProps {}

const slowThreshold = 15;
const fastThreshold = 10;

enum SpeedCategory {
  SLOW,
  BELOW,
  OVER,
  TOO_FAST,
}

const getSpeedCategory = (speed: number, speedLimit: number): SpeedCategory => {
  if (speed < speedLimit - slowThreshold) {
    return SpeedCategory.SLOW;
  } else if (speed > speedLimit && speed <= speedLimit + fastThreshold) {
    return SpeedCategory.OVER;
  } else if (speed > speedLimit + fastThreshold) {
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
                borderRadius: theme.radius.sm,
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
                borderRadius: theme.radius.sm,
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
                  <Text c={displayColor} fw={800} style={{ fontSize: 'calc(4.6em)' }}>
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
                min={25}
                max={65}
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
                min={15}
                max={70}
                marks={[
                  { value: 25, label: 25 },
                  { value: 45, label: 45 },
                  { value: 65, label: 65 },
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
