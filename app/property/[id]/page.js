'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useParams } from 'next/navigation'

export default function PropertyPage() {
  const params = useParams()
  const [prop, setProp] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    async function run() {
      const { data } = await supabase
        .from('property')
        .select('*')
        .eq('id', params.id)
        .single()
      setProp(data)
    }
    run()
  }, [params.id])

  async function submitLead(e) {
    e.preventDefault()
    const { error } = await supabase.from('lead').insert({
      property_id: prop.id, name: form.name, email: form.email, message: form.message
    })
    if (!error) setSent(true)
  }

  if (!prop) return <main className="container py-6"><div className="card">Loading...</div></main>

  return (
    <main className="container py-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <img src={prop.thumbnail_url || '/placeholder.jpg'} className="w-full h-80 object-cover rounded-xl mb-3" />
          <h1 className="text-2xl font-bold">{prop.title}</h1>
          <div className="text-indigo-600 text-xl font-semibold">£{prop.price.toLocaleString()}</div>
          <div className="text-sm text-gray-600">{prop.address}</div>
          <p className="mt-3 whitespace-pre-wrap">{prop.description}</p>
          <div className="mt-2 text-sm text-gray-600">{prop.bedrooms} bed • {prop.bathrooms} bath • {prop.floor_area} sqft</div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Enquire</h2>
          {sent ? <div className="text-green-700">Thanks! The agent will contact you.</div> : (
            <form className="space-y-2" onSubmit={submitLead}>
              <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
              <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
              <textarea className="input" placeholder="Message" rows={4} value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
              <button className="btn w-full" type="submit">Send</button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
