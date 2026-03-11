import { NextResponse } from 'next/server'
import { fetchProductHuntTrending, FALLBACK_TRENDING } from '@/lib/sources/product-hunt'

export async function GET() {
  try {
    const products = await fetchProductHuntTrending()

    const trending = products.length > 0 ? products : FALLBACK_TRENDING

    return NextResponse.json(
      { products: trending },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    )
  } catch (err) {
    console.error('Discover fetch error:', err)
    return NextResponse.json({ products: FALLBACK_TRENDING })
  }
}
