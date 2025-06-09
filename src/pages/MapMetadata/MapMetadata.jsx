import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geojsonData from './metadata-lokasi.json';
import { Rnd } from 'react-rnd';

const MapMetadata = () => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  useEffect(() => {
    if (!leafletMap.current && mapRef.current) {
      const map = L.map(mapRef.current).setView([-6.8, 107], 9);
      leafletMap.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.geoJSON(geojsonData, {
        style: {
          color: 'blue',
          weight: 2,
          fillColor: 'lightblue',
          fillOpacity: 0.5,
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          const popupContent = `<b>${p.KAB_KOTA}</b>`;
          layer.bindPopup(popupContent);
        }
      }).addTo(map);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  const handleResizeStop = () => {
    if (leafletMap.current) {
      setTimeout(() => {
        leafletMap.current.invalidateSize();
      }, 100);
    }
  };

  return (
    <div className="w-full h-[800px] relative">
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: '100%',
          height: 500,
        }}
        minWidth={300}
        minHeight={300}
        bounds="parent"
        enableResizing={{
          bottom: true,
        //   bottomRight: true,
        //   bottomLeft: true,
        //   right: true,
        }}
        disableDragging={true} // 👈 nonaktifkan drag
        onResizeStop={handleResizeStop}
        className="rounded-lg border border-gray-700 bg-white"
      >
        <div
          ref={mapRef}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: '12px',
            zIndex: 0,
          }}
          id="map"
        />
      </Rnd>
    </div>
  );
};

export default MapMetadata;
