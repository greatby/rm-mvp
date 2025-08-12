'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Agent() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [form, setForm] = useState({
    title:'', price:'', bedrooms:'', bathrooms:'', address:'', lat:'', lng:'', description:'', thumbnail_url:''
  })
  const [mine, setMine] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function signIn(e) {
    e.preventDefault()
    await supabase.auth.signInWithOtp({ email })
    alert('Check your email for the magic link.')
  }

  async function createListing(e) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Please sign in')
    const payload = {
      title: form.title,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      address: form.address,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
      description: form.description,
      thumbnail_url: form.thumbnail_url,
      agent_id: user.id,
      approved: true
    }
    const { error } = await supabase.from('property').insert(payload)
    if (error) alert(error.message); else {
      setForm({title:'', price:'', bedrooms:'', bathrooms:'', address:'', lat:'', lng:'', description:'', thumbnail_url:''})
      loadMine()
    }
  }

  async function loadMine() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('property')
      .select('id,title,price,address')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })
    setMine(data || [])
  }

  useEffect(() => { loadMine() }, [session?.user?.id])

  return (
    <main className="container py-6 space-y-4">
      <h1 className="text-2xl font-bold">Agent Dashboard</h1>

      {!session && (
        <form className="card flex gap-2 items-end" onSubmit={signIn}>
          <div className="flex-1">
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <button className="btn" type="submit">Sign in / Magic link</button>
        </form>
      )}

      {session && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <form className="card space-y-2" onSubmit={createListing}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
              <input className="input" placeholder="Price (GBP)" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
              <input className="input" placeholder="Bedrooms" type="number" value={form.bedrooms} onChange={e=>setForm({...form, bedrooms:e.target.value})} required />
              <input className="input" placeholder="Bathrooms" type="number" value={form.bathrooms} onChange={e=>setForm({...form, bathrooms:e.target.value})} required />
              <input className="input" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} required />
              <input className="input" placeholder="Latitude" value={form.lat} onChange={e=>setForm({...form, lat:e.target.value})} />
              <input className="input" placeholder="Longitude" value={form.lng} onChange={e=>setForm({...form, lng:e.target.value})} />
              <input className="input" placeholder="Thumbnail URL" value={form.thumbnail_url} onChange={e=>setForm({...form, thumbnail_url:e.target.value})} />
            </div>
            <textarea className="input" rows={5} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            <button className="btn w-full" type="submit">Create Listing</button>
          </form>

          <div className="card">
            <h2 className="text-lg font-semibold mb-2">My Listings</h2>
            <ul className="space-y-2">
              {mine.map(m => (
                <li key={m.id} className="flex justify-between items-center border rounded-xl p-2">
                  <div>
                    <div className="font-semibold">{m.title}</div>
                    <div className="text-sm text-gray-600">{m.address}</div>
                  </div>
                  <div className="text-indigo-600 font-semibold">£{m.price.toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}
