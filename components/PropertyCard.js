export default function PropertyCard({ property, onSelect }) {
  return (
    <div className="card cursor-pointer" onClick={() => onSelect?.(property)}>
      <img
        src={property.thumbnail_url || '/placeholder.jpg'}
        alt={property.title}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <div className="text-indigo-600 font-semibold">£{property.price.toLocaleString()}</div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{property.address}</p>
      <p className="text-sm text-gray-600">{property.bedrooms} bed • {property.bathrooms} bath</p>
    </div>
  )
}
