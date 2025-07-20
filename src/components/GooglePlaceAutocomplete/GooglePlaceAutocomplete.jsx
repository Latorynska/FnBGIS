// src/components/GooglePlaceAutocomplete.jsx
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GooglePlaceAutocomplete = ({ onPlaceSelected }) => {
  const inputRef = useRef(null);

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

  return (
    <input
      type="text"
      placeholder="Cari lokasi cabang..."
      ref={inputRef}
      className="input-field w-full px-4 py-2 rounded-lg"
    />
  );
};

export default GooglePlaceAutocomplete;
