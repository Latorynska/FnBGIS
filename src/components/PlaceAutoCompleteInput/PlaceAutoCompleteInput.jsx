import { useEffect, useRef } from 'react';

const PlaceAutocompleteInput = ({ onPlaceSelected }) => {
    const inputRef = useRef();

    useEffect(() => {
        if (!window.google || !window.google.maps) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['establishment'], // Bisa diganti jadi ['geocode'] jika ingin bebas
            fields: ['place_id', 'name', 'formatted_address'],
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place && place.place_id) {
                onPlaceSelected(place);
            }
        });
    }, []);

    return (
        <input
            type="text"
            ref={inputRef}
            className="input-field w-full px-4 py-2 rounded-lg"
            placeholder="Cari lokasi (Google Maps)"
        />
    );
};

export default PlaceAutocompleteInput;
