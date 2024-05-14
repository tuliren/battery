import { Box, Card, Center, Grid, Stack, Title, useMantineTheme } from '@mantine/core';
import { FC, useState } from 'react';

import NumberSlider from '@/common/NumberSlider';

interface SpeedometerProps {}

const Speedometer: FC<SpeedometerProps> = ({}) => {
  const theme = useMantineTheme();
  const [speedLimit, setSpeedLimit] = useState(25);

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
          <Stack gap="sm">
            <Box
              id="speed-limit"
              py="1px"
              px="10px"
              style={{
                borderRadius: theme.radius.sm,
                borderWidth: 4,
                border: '1px solid black',
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
            <Box id="speedometer"></Box>
          </Stack>
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
                max={99}
                marks={[
                  { value: 25, label: 25 },
                  { value: 45, label: 45 },
                  { value: 65, label: 65 },
                  { value: 75, label: 75 },
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
