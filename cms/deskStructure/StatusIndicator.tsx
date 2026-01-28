import { Box, Flex, Inline, Stack, Text, Tooltip } from '@sanity/ui';
import React from 'react';

const Dot = ({ color }: { color: string }) => (
  <Box
    style={{
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: color,
      boxShadow: '0 0 0 1px var(--card-bg-color)',
    }}
  />
);

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

export const StatusIndicator = ({
  status,
  publishedAt,
  draftUpdatedAt,
}: {
  status: 'published' | 'draft' | 'changed';
  publishedAt?: string;
  draftUpdatedAt?: string;
}) => {
  const publishedDate = formatDate(publishedAt);
  const draftDate = formatDate(draftUpdatedAt);

  const publishedNode = (
    <Flex align="center">
      <Dot color="#3fce8b" />
      <Inline marginLeft={1}>
        <Text size={1}>{'Published ​'}</Text>
        <Text size={1} muted>
          {publishedDate}
        </Text>
      </Inline>
    </Flex>
  );

  const draftNode = (
    <Flex align="center">
      <Dot color="#f29e2f" />
      <Inline marginLeft={1}>
        <Text size={1}>{'Draft ​'}</Text>
        <Text size={1} muted>
          Edited {draftDate}
        </Text>
      </Inline>
    </Flex>
  );

  return (
    <Tooltip
      content={
        <Box padding={0}>
          <Stack space={2}>
            {(status === 'published' || status === 'changed') && publishedNode}
            {(status === 'draft' || status === 'changed') && draftNode}
          </Stack>
        </Box>
      }
      portal
    >
      <Inline marginLeft={2} padding={0}>
        {(status === 'published' || status === 'changed') && (
          <Dot color="#3fce8b" />
        )}
        {(status === 'draft' || status === 'changed') && (
          <Dot color="#f29e2f" />
        )}
      </Inline>
    </Tooltip>
  );
};
