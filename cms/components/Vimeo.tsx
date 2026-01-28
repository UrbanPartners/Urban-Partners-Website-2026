import React, {useState, useEffect} from 'react'
import {ObjectInputProps, set, unset} from 'sanity'
import {Box, Button, Card, Stack, Text, TextInput} from '@sanity/ui'

const Vimeo = (props: ObjectInputProps) => {
  const {value, onChange} = props
  const [vimeoId, setVimeoId] = useState(value?.vimeoId || '')
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(value?.thumbnailUrl || null)
  const [name, setName] = useState<string | null>(value?.name || null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [url240, setUrl240] = useState<string | null>(value?.url240 || null)
  const [url360, setUrl360] = useState<string | null>(value?.url360 || null)
  const [url540, setUrl540] = useState<string | null>(value?.url540 || null)
  const [url720, setUrl720] = useState<string | null>(value?.url720 || null)
  const [url1080, setUrl1080] = useState<string | null>(value?.url1080 || null)
  const [urlHls, setUrlHls] = useState<string | null>(value?.urlHls || null)

  // Sync state with value changes
  useEffect(() => {
    if (value) {
      setVimeoId(value.vimeoId || '')
      setThumbnailUrl(value.thumbnailUrl || null)
      setName(value.name || null)
      setUrl240(value.url240 || null)
      setUrl360(value.url360 || null)
      setUrl540(value.url540 || null)
      setUrl720(value.url720 || null)
      setUrl1080(value.url1080 || null)
      setUrlHls(value.urlHls || null)
    }
  }, [value])

  const handleFetch = async () => {
    if (!vimeoId.trim()) {
      setError('Please enter a Vimeo ID')
      return
    }

    setLoading(true)
    setError(null)
    setThumbnailUrl(null)

    try {
      const headers: HeadersInit = {}

      if (process.env.SANITY_STUDIO_VIMEO_ACCESS_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.SANITY_STUDIO_VIMEO_ACCESS_TOKEN}`
      }

      const response = await fetch(`https://api.vimeo.com/videos/${vimeoId}`, {
        headers,
      })
      const data = await response.json()

      // Log the response
      console.log('Vimeo API Response:', data)

      if (data?.error_code === 9000) {
        setError('Rate limit exceeded. Please try again in 1 minute.')
        return
      }

      let url240 = null
      let url360 = null
      let url540 = null
      let url720 = null
      let url1080 = null
      let urlHls = null

      if (data?.files?.length > 0) {
        data?.files.forEach((file: any) => {
          // 240p
          if (file?.rendition === '240p') {
            url240 = file?.link
          }

          // 360p
          if (file?.rendition === '360p') {
            url360 = file?.link
          }

          // 540p
          if (file?.rendition === '540p') {
            url540 = file?.link
          }

          // 720p
          if (file?.rendition === '720p') {
            url720 = file?.link
          }

          // 1080p
          if (file?.rendition === '1080p') {
            url1080 = file?.link
          }

          // HLS
          if (file?.rendition === 'adaptive') {
            urlHls = file?.link
          }
        })
      }

      //   [
      //     {
      //         "quality": "sd",
      //         "rendition": "240p",
      //         "type": "video/mp4",
      //         "width": 426,
      //         "height": 240,
      //         "link": "https://player.vimeo.com/progressive_redirect/playback/1060464431/rendition/240p/file.mp4?loc=external&oauth2_token_id=1803646434&signature=c3828f7a11836d103aa71a97a68547cbe8514968368307e1d8325f69b21582aa",
      //         "created_time": "2025-02-26T12:53:05+00:00",
      //         "fps": 25,
      //         "size": 7100196,
      //         "md5": null,
      //         "public_name": "240p",
      //         "size_short": "6.77MB"
      //     },
      // ]

      // Check for response.embed.pictures.sizes array
      if (
        data?.pictures?.sizes &&
        Array.isArray(data.pictures.sizes) &&
        data.pictures.sizes.length > 0
      ) {
        // Select the last item in the array
        const lastItem = data.pictures.sizes[data.pictures.sizes.length - 1]

        // Check if link exists
        if (lastItem?.link) {
          const videoName = data?.name || ''

          // Update state
          setThumbnailUrl(lastItem.link)
          setName(videoName)
          setUrl240(url240)
          setUrl360(url360)
          setUrl540(url540)
          setUrl720(url720)
          setUrl1080(url1080)
          setUrlHls(urlHls)

          // Save to object fields
          onChange(
            set({
              vimeoId: vimeoId,
              name: videoName,
              thumbnailUrl: lastItem.link,
              url240: url240,
              url360: url360,
              url540: url540,
              url720: url720,
              url1080: url1080,
              urlHls: urlHls,
            }),
          )
        } else {
          setError('Error fetching by ID: No link found in thumbnail data')
        }
      } else {
        setError('Error fetching by ID: No thumbnail data found in response')
      }
    } catch (err) {
      console.error('Vimeo API Error:', err)
      setError('Error fetching by ID: Failed to fetch video data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setVimeoId(newValue)
    if (!newValue) {
      onChange(unset())
      setThumbnailUrl(null)
      setName(null)
      setError(null)
    } else {
      // Update vimeoId in the object, preserve other fields if they exist
      onChange(
        set({
          ...(value || {}),
          vimeoId: newValue,
        }),
      )
    }
  }

  return (
    <Stack space={3}>
      <Box>
        <Text size={1} weight="semibold" style={{marginBottom: '8px', display: 'block'}}>
          Vimeo ID
        </Text>
        <TextInput
          value={vimeoId}
          onChange={handleInputChange}
          placeholder="Enter Vimeo video ID"
          disabled={loading}
        />
      </Box>

      <Button
        text={loading ? 'Fetching...' : 'Fetch Video'}
        tone="primary"
        onClick={handleFetch}
        disabled={loading || !vimeoId.trim()}
      />

      {error && (
        <Card padding={3} tone="critical" radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {thumbnailUrl && (
        <Card radius={2}>
          <Stack space={2} paddingTop={3}>
            <Text size={3} style={{marginBottom: '8px'}} weight="semibold">
              {name}
            </Text>
            <Box>
              <img
                src={thumbnailUrl}
                alt="Vimeo thumbnail"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '4px',
                }}
              />
            </Box>
          </Stack>
        </Card>
      )}

      <FileInput title="240p" value={url240} />
      <FileInput title="360p" value={url360} />
      <FileInput title="540p" value={url540} />
      <FileInput title="720p" value={url720} />
      <FileInput title="1080p" value={url1080} />
      <FileInput title="HLS" value={urlHls} />
    </Stack>
  )
}

const FileInput = ({title, value}: {title: string; value?: string | null}) => {
  if (!value) return null
  return (
    <Card radius={2} paddingBottom={3}>
      <Stack space={2}>
        <Text size={1} style={{marginBottom: '3px'}} weight="semibold">
          {title}:
        </Text>
        <input type="text" value={value} readOnly />
      </Stack>
    </Card>
  )
}

export default Vimeo
