// src/components/GooglePlaceAutocomplete.jsx
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GooglePlaceAutocomplete = ({ onPlaceSelected, initialText = '' }) => {
  const inputRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (!inputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        onPlaceSelected(place);
      });
    });
  }, []);

  // Set value awal dari prop (sekali saja)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = initialText || '';
    }
  }, [initialText]);


  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Cari lokasi cabang..."
        ref={inputRef}
        className="input-field w-full px-4 py-2 pr-10 rounded-lg"
      />
      <div
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <i className="fas fa-question-circle text-sm" />
        {showTooltip && (
          <div className="absolute z-10 top-full right-0 mt-1 w-64 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg">
            Ketik nama lokasi atau alamat dan pilih dari saran untuk mendapatkan <strong>Place ID</strong>.
          </div>
        )}
      </div>
    </div>
  );
};

export default GooglePlaceAutocomplete;
