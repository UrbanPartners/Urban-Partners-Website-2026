import React, {useEffect, useState} from 'react'
import {useClient} from 'sanity'
import {Box, Card, Flex, Text, Stack} from '@sanity/ui'

const MAX_REDIRECTS = 2048

export default function RedirectsNumberLeft() {
  const [redirectCount, setRedirectCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const client = useClient()

  useEffect(() => {
    const fetchRedirectCount = async () => {
      try {
        setLoading(true)
        setError(null)

        // Query to count all redirect documents
        const query = `count(*[_type == "redirect"])`
        const count = await client.fetch(query)

        setRedirectCount(count)
      } catch (err) {
        console.error('Error fetching redirect count:', err)
        setError('Failed to fetch redirect count')
      } finally {
        setLoading(false)
      }
    }

    fetchRedirectCount()
  }, [client])

  const remainingRedirects = MAX_REDIRECTS - redirectCount
  const percentageUsed = (redirectCount / MAX_REDIRECTS) * 100
  const percentageRemaining = (remainingRedirects / MAX_REDIRECTS) * 100

  if (loading) {
    return (
      <Card padding={4} radius={2} shadow={1}>
        <Text>Loading redirect data...</Text>
      </Card>
    )
  }

  if (error) {
    return (
      <Card padding={4} radius={2} shadow={1} tone="critical">
        <Text>{error}</Text>
      </Card>
    )
  }

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        <Box>
          <Stack space={3}>
            <Text size={3} weight="semibold">
              Redirect Usage
            </Text>
            <Text size={1} muted>
              Maximum allowed: {MAX_REDIRECTS.toLocaleString()}
            </Text>
          </Stack>
        </Box>

        <Stack space={3}>
          <Flex justify="space-between" align="center">
            <Text size={2}>Current Redirects</Text>
            <Text size={2} weight="semibold">
              {redirectCount.toLocaleString()}
            </Text>
          </Flex>

          <Flex justify="space-between" align="center">
            <Text size={2}>Remaining</Text>
            <Text
              size={2}
              weight="semibold"
              style={{
                color:
                  remainingRedirects < 100
                    ? 'var(--card-shadow-ambient-color)'
                    : 'var(--card-focus-ring-color)',
              }}
            >
              {remainingRedirects.toLocaleString()}
            </Text>
          </Flex>
        </Stack>

        {/* Progress Bar */}
        <Box>
          <Box
            style={{
              width: '100%',
              height: '24px',
              backgroundColor: 'var(--card-shadow-ambient-color)',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Used redirects bar */}
            <Box
              style={{
                width: `${percentageUsed}%`,
                height: '100%',
                backgroundColor: 'var(--card-focus-ring-color)',
                transition: 'width 0.3s ease',
              }}
            />

            {/* Remaining redirects bar */}
            <Box
              style={{
                width: `${percentageRemaining}%`,
                height: '100%',
                backgroundColor: 'var(--card-border-color)',
                position: 'absolute',
                right: 0,
                top: 0,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>

          <Flex justify="space-between" marginTop={2}>
            <Text size={1} muted>
              Used: {percentageUsed.toFixed(1)}%
            </Text>
            <Text size={1} muted>
              Available: {percentageRemaining.toFixed(1)}%
            </Text>
          </Flex>
        </Box>

        {/* Warning message if getting close to limit */}
        {remainingRedirects < 100 && (
          <Card padding={3} radius={2} tone="caution">
            <Text size={1}>
              ⚠️ Warning: You're approaching the redirect limit. Only {remainingRedirects} redirects
              remaining.
            </Text>
          </Card>
        )}

        {remainingRedirects === 0 && (
          <Card padding={3} radius={2} tone="critical">
            <Text size={1}>
              🚨 Critical: You've reached the maximum number of redirects ({MAX_REDIRECTS}). You'll
              need to delete some redirects before creating new ones.
            </Text>
          </Card>
        )}
      </Stack>
    </Card>
  )
}
