'use client'
import { useState } from 'react'

export default function Filters({ onApply }) {
  const [q, setQ] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [beds, setBeds] = useState('')

  return (
    <div className="card">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="label">Search</label>
          <input className="input" placeholder="City, area, address" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <div>
          <label className="label">Min Price</label>
          <input className="input" type="number" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
        </div>
        <div>
          <label className="label">Max Price</label>
          <input className="input" type="number" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
        </div>
        <div>
          <label className="label">Bedrooms</label>
          <input className="input" type="number" value={beds} onChange={e=>setBeds(e.target.value)} />
        </div>
        <div className="md:col-span-1">
          <button className="btn w-full" onClick={()=>onApply({ q, minPrice, maxPrice, beds })}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
