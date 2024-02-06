import { Box, Paper, useMantineTheme } from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const theme = useMantineTheme();

  return (
    <Paper
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <Box
        style={{
          // boxShadow: `5px 5px 10px ${theme.colors.dark[2]}`,
          border: `8px solid ${theme.colors.dark[4]}`,
          width: 300,
          height: 100,
          borderRadius: '15px',
          backgroundColor: '#f3f3f3',
          zIndex: 10,
        }}
      />

      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
        }}
      >
        <IconBolt size={55} stroke={1.4} color={theme.colors.dark[4]} />
      </Box>
    </Paper>
  );
};

export default Home;
