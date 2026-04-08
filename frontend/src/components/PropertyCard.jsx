import image from '../components/assests/image.jpg'
export default function PropertyCard({ property, isFav, onToggle, index = 0 }) {

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-slate-200 hover:shadow-lg hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300 flex flex-col"
      style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.07}s both` }}
    >
      {/* Image */}
      <div className="relative h-44 bg-slate-200 flex items-end p-4">
      <img src={image} alt="" srcset="" className="absolute inset-0 w-full h-full object-cover" />
        {/* Price badge */}
        <span className="relative z-10 bg-white/90 backdrop-blur-sm text-slate-800 font-bold text-sm px-3 py-1.5 rounded-xl shadow-sm">
          NPR {property.price?.toLocaleString()}
        </span>

        {/* Favourite button */}
        <button
          onClick={onToggle}
          className="absolute z-10 top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        >
          {isFav ? (
            <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        {/* For Sale badge */}
        <span className="absolute z-10 top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
          For Sale
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1">
            {property.title}
          </h3>
          {property.location && (
            <div className="flex items-center gap-1 mt-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-slate-400 line-clamp-1">{property.location}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {property.description || 'No description provided.'}
        </p>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Price</div>
            <div className="text-base font-bold text-indigo-600">
              NPR {property.price?.toLocaleString()}
            </div>
          </div>
          <button
            onClick={onToggle}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isFav
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {isFav ? 'Unsave' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}