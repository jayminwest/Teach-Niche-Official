import React from 'react';
import Layout from '../components/Layout';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { Heading, Text } from '@chakra-ui/react';

const SellLessonsPage = () => {
  return (
    <Layout showHeader={true} showFooter={true}>
      <Section title="Sell Your Lessons">
        <Heading as="h2" size="lg" mb={4}>
          Share Your Knowledge and Earn
        </Heading>
        <Text mb={4}>
          Create and sell your own lessons on our platform. Reach a wide audience and monetize your expertise.
        </Text>
        <Button label="Start Creating" onClick={() => alert('Coming Soon!')} />
      </Section>
    </Layout>
  );
};

export default SellLessonsPage;
