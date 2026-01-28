const COOKIES_NAME = 'auth-token'

export async function POST(request: Request) {
  const body = await request.json()
  const pass = body?.pass

  if (!pass || pass !== process.env.AUTH_PASSWORD) {
    return new Response('Pass invalid', {
      status: 500,
      headers: { 'Set-Cookie': `${COOKIES_NAME}=''; path=/; sameSite=strict; httpOnly=true; maxAge=0;` },
    })
  }

  const expirySeconds = parseInt(process.env.AUTH_EXPIRY_MINUTES ? process.env.AUTH_EXPIRY_MINUTES : '60') * 60

  return new Response('Success', {
    status: 200,
    headers: {
      'Set-Cookie': `${COOKIES_NAME}=${process.env.AUTH_PASSWORD}; Path=/; sameSite=strict; httpOnly=true; max-age=${expirySeconds};`,
    },
  })
}
