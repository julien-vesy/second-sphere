import type { Handler, HandlerResponse } from '@netlify/functions'

export const handler: Handler = async (): Promise<HandlerResponse> => {
  try {
    const response = await fetch(
      `${process.env.PUBLIC_SUPABASE_URL}/rest/v1/Config?select=enableOrder&limit=1`,
      {
        headers: {
          apikey: process.env.PUBLIC_SUPABASE_ANON_KEY || '',
        },
      }
    )

    if (!response.ok) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
        },
        body: JSON.stringify({ ordersOpen: false }),
      }
    }

    const data: Array<{
      enableOrder: boolean
    }> = await response.json()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify({ ordersOpen: data[0]?.enableOrder }),
    }
  } catch (error) {
    console.error('Error fetching config:', error)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify({ ordersOpen: false }),
    }
  }
}
