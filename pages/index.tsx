import {
  Box,
  Card,
  Center,
  Grid,
  Progress,
  SegmentedControl,
  Slider,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';
import type { NextPage } from 'next';
import { useState } from 'react';

const percentageMargin = 8;

const Home: NextPage = () => {
  const [chargingStatus, setChargingStatus] = useState<'on' | 'off'>('on');
  const [percentage, setPercentage] = useState(85);
  const theme = useMantineTheme();
  const lowBatteryColor = theme.colors.red[4];
  const mediumBatteryColor = theme.colors.blue[4];
  const highBatteryColor = theme.colors.green[4];

  return (
    <Center>
      <Card w="70vw">
        <Card.Section
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
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
              color={
                chargingStatus === 'on'
                  ? highBatteryColor
                  : percentage < 20
                  ? lowBatteryColor
                  : percentage < 80
                  ? mediumBatteryColor
                  : highBatteryColor
              }
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
            <Grid.Col span={4}>Charging</Grid.Col>
            <Grid.Col span={8}>
              <SegmentedControl
                value={chargingStatus}
                onChange={(value) => setChargingStatus(value as 'on' | 'off')}
                data={[
                  { label: 'On', value: 'on' },
                  { label: 'Off', value: 'off' },
                ]}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4}>Percentage</Grid.Col>
            <Grid.Col span={8}>
              <Slider
                min={1}
                max={100}
                value={percentage}
                onChange={setPercentage}
                marks={[
                  { value: 20, label: '20%' },
                  { value: 50, label: '50%' },
                  { value: 80, label: '80%' },
                ]}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </Center>
  );
};

export default Home;
