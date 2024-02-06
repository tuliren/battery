import { Box, Center, Paper, Progress, useMantineTheme } from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <Paper
        style={{
          boxShadow: theme.shadows.xl,
          position: 'relative',
        }}
      >
        <Box
          style={{
            boxShadow: `5px 5px 10px ${theme.colors.dark[2]}`,
            border: `10px solid ${theme.colors.dark[4]}`,
            width: 300,
            height: 100,
            borderRadius: '15px',
            backgroundColor: '#f3f3f3',
          }}
        />

        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <IconBolt size={55} stroke={1.2} color={theme.colors.dark[4]} />
        </Box>
      </Paper>
    </div>
  );
};

export default Home;
