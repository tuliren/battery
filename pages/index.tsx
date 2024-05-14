import { Container, Tabs, Title, rem } from '@mantine/core';
import { IconBatteryCharging2, IconWind } from '@tabler/icons-react';
import type { NextPage } from 'next';

import Battery from '@/battery/Battery';

const iconStyle = { width: rem(30), height: rem(30) };
const iconStroke = 1.8;

const Home: NextPage = () => {
  return (
    <Container size="lg" py="xl">
      <Tabs defaultValue="battery">
        <Tabs.List grow justify="center">
          <Tabs.Tab
            leftSection={
              <IconBatteryCharging2 color="green" stroke={iconStroke} style={iconStyle} />
            }
            value="battery"
          >
            <Title c="green" order={2}>
              Battery
            </Title>
          </Tabs.Tab>
          <Tabs.Tab
            leftSection={<IconWind color="red" stroke={iconStroke} style={iconStyle} />}
            value="speedometer"
          >
            <Title c="red" order={2}>
              Speedometer
            </Title>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="battery">
          <Battery />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default Home;
