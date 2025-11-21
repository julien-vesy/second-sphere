export async function handler() {
  const response = await fetch(
    `${process.env.PUBLIC_SUPABASE_URL}/rest/v1/Config?select=enableOrder&limit=1`,
    {
      headers: {
        apikey: process.env.PUBLIC_SUPABASE_ANON_KEY,
      },
    }
  )

  const data = await response.json()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
    body: JSON.stringify({ ordersOpen: data[0]?.enableOrder }),
  }
}
