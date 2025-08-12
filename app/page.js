'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Filters from '../components/Filters'
import PropertyCard from '../components/PropertyCard'
import MapView from '../components/MapView'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  async function fetchProperties(filters={}) {
    setLoading(true)
    let query = supabase
      .from('property')
      .select('id, title, price, bedrooms, bathrooms, address, lat, lng, thumbnail_url')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(60)

    if (filters.q) {
      query = query.ilike('address', `%${filters.q}%`)
    }
    if (filters.minPrice) {
      query = query.gte('price', Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      query = query.lte('price', Number(filters.maxPrice))
    }
    if (filters.beds) {
      query = query.gte('bedrooms', Number(filters.beds))
    }

    const { data, error } = await query
    if (error) console.error(error)
    setProperties(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProperties() }, [])

  return (
    <main className="container py-6 space-y-4">
      <h1 className="text-2xl font-bold">Rightmove-style MVP</h1>
      <Filters onApply={fetchProperties} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {loading ? <div className="card">Loading...</div> : (
            <div className="grid-list">
              {properties.map(p => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onSelect={(prop)=>router.push(`/property/${prop.id}`)}
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <MapView properties={properties} />
        </div>
      </div>
    </main>
  )
}
