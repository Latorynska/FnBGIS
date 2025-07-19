import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import Button from '../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import CardLoadingOverlay from '../../components/CardLoadingOverlay/CardLoadingOverlay';
import { createDaerah, fetchDaerahs, updateDaerah } from '../../redux/thunks/daerahThunks';
import { calculatePolygonArea } from '../../utils/geoUtils';

// import geojsonData from './metadata-lokasi.json';
import Pagination from '../../components/Pagination/Pagination';

const MapMetadata = () => {
  const dispatch = useDispatch();
  const [mapMode, setMapMode] = useState(null); // 'view' | 'edit'
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const editLayerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [currentDaerahsData, setCurrentDaerahsData] = useState([]);
  const [formData, setFormData] = useState({
    nama: '', kode: '', jmlPenduduk: '', provinsi: '', umr: '', pendapatan: '', area: []
  });

  const { items: daerahs, loading } = useSelector(state => state.daerah);

  useEffect(() => {
    dispatch(fetchDaerahs());
  }, [dispatch]);

  const renderDaerahsToMap = () => {
    if (!leafletMap.current) return;

    leafletMap.current.eachLayer(layer => {
      if (layer instanceof L.Polygon) leafletMap.current.removeLayer(layer);
    });

    daerahs.forEach(daerah => {
      const polygonCoords = daerah.area.map(([lat, lng]) => [lat, lng]);

      const polygon = L.polygon(polygonCoords, {
        color: 'blue', weight: 2, fillColor: 'lightblue', fillOpacity: 0.5
      });

      polygon.bindPopup(`<b>${daerah.nama}</b>`);
      polygon.on('click', () => {
        setSelectedArea({ name: daerah.nama, coordinates: polygonCoords });
        setFormData({ ...daerah });
      });

      polygon.addTo(leafletMap.current);
    });
  };

  useEffect(() => {
    if (!leafletMap.current && mapRef.current) {
      leafletMap.current = L.map(mapRef.current, { editable: true }).setView([-6.8, 107], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap.current);
    }

    renderDaerahsToMap();

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [daerahs]);

  useEffect(() => {
    if (leafletMap.current) setTimeout(() => leafletMap.current.invalidateSize(), 200);
  }, [isExpanded]);

  const handleLihatLokasi = (e) => {
    setMapMode('view');
    if (selectedArea?.coordinates?.length && leafletMap.current) {
      leafletMap.current.fitBounds(selectedArea.coordinates);
    }
  };

  const handleUbahCakupanArea = () => {
    if (!selectedArea?.coordinates?.length || !leafletMap.current) return;

    setMapMode('edit');

    if (editLayerRef.current) {
      leafletMap.current.removeLayer(editLayerRef.current);
    }

    const polygon = L.polygon(selectedArea.coordinates, {
      color: 'red',
      weight: 2,
      fillColor: 'orange',
      fillOpacity: 0.6,
    }).addTo(leafletMap.current);

    editLayerRef.current = polygon;

    const drawControl = new L.EditToolbar.Edit(leafletMap.current, {
      featureGroup: L.featureGroup([polygon])
    });

    drawControl.enable();

    polygon.on('edit', () => {
      const latlngs = polygon.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
      setSelectedArea({ ...selectedArea, coordinates: latlngs });
    });
  };

  const handleSimpanArea = () => {
    if (!selectedArea || !formData?.id) return;

    dispatch(updateDaerah({
      id: formData.id,
      data: {
        ...formData,
        area: selectedArea.coordinates
      }
    }));

    setMapMode(null);

    if (editLayerRef.current) {
      leafletMap.current.removeLayer(editLayerRef.current);
      editLayerRef.current = null;
    }
  };

  const handleBatalEdit = (e) => {
    setMapMode(null);
    if (editLayerRef.current) {
      leafletMap.current.removeLayer(editLayerRef.current);
      editLayerRef.current = null;
    }
  };
  const handleCancelForm = () => {
    setSelectedArea(null);
    setFormData({
      nama: '',
      kode: '',
      jmlPenduduk: '',
      provinsi: '',
      umr: '',
      pendapatan: '',
      area: [],
      id: ''
    });
    setMapMode(null);

    if (editLayerRef.current && leafletMap.current) {
      leafletMap.current.removeLayer(editLayerRef.current);
      editLayerRef.current = null;
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!selectedArea || !selectedArea.coordinates?.length) {
      alert('Silakan pilih area di peta terlebih dahulu.');
      return;
    }

    const formSubmit = {
      ...formData,
      area: selectedArea.coordinates,
    };

    console.log('Submitting:', formSubmit);
    dispatch(createDaerah(formSubmit));
  };

  return (
    <>
      <div className="w-full relative">
        {/* Toggle Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            {isExpanded ? 'Collapse Map' : 'Expand Map'}
          </button>
        </div>

        <CardLoadingOverlay isVisible={loading} />
        {/* Map Container */}
        <div
          ref={mapRef}
          id="map"
          className="rounded-lg border border-gray-700 bg-white transition-all duration-300 ease-in-out"
          style={{ height: isExpanded ? 800 : 400 }}
        />
        {/* hanya aktif ketika sedang edit area */}
        {mapMode === 'edit' && (
          <div className="flex justify-end gap-2 mt-2">
            <Button variant='neutral' onClick={handleBatalEdit}>Batal</Button>
            <Button variant='primary' onClick={handleSimpanArea}>Simpan</Button>
          </div>
        )}

      </div>
      {/* Cards section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 relative z-10">
        <div className="card p-6 shadow rounded-lg border border-gray-200 bg-white">
          <CardLoadingOverlay isVisible={loading} />
          {/* datalist table */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">All Branches</h3>
              <div className="flex space-x-2">
                <Button variant="primary" size="small" icon="fas fa-plus"
                >
                  Tambah Daerah
                </Button>
                <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg flex items-center">
                  <i className="fas fa-filter mr-1"></i> Filter
                </button>
              </div>
            </div>
            {/* table content */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Kabupaten / Kota</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Luas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Jml Penduduk</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">UMR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pendapatan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Provinsi</th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y divide-gray-800"
                  onClick={(e) => {
                    const tr = e.target.closest('tr[data-index]');
                    if (!tr) return;

                    const index = parseInt(tr.dataset.index);
                    const selected = currentDaerahsData[index];

                    if (!selected?.area?.length) return;

                    setSelectedArea({
                      name: selected.nama,
                      coordinates: selected.area,
                    });

                    setFormData({ ...selected });

                    // Fokus ke area di map
                    if (leafletMap.current) {
                      leafletMap.current.fitBounds(selected.area);
                    }
                  }}
                >
                  {currentDaerahsData.map((daerah, index) => {
                    const hasArea =
                      Array.isArray(daerah.area) &&
                      daerah.area.length > 0 &&
                      Array.isArray(daerah.area[0]) &&
                      typeof daerah.area[0][0] === "number" &&
                      typeof daerah.area[0][1] === "number";

                    let luasFormatted = '-';
                    if (hasArea) {
                      const luasMeter = calculatePolygonArea(daerah.area);
                      const luasKm = luasMeter / 1_000_000;

                      luasFormatted = new Intl.NumberFormat('id-ID', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(luasKm) + ' km²';
                    }

                    return (
                      <tr className="table-row cursor-pointer"
                        key={index}
                        data-index={index}
                      >
                        <td className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{daerah.number}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{daerah.nama}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{luasFormatted}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{daerah.jmlPenduduk}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{daerah.umr}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{daerah.pendapatan}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                          <div className="text-sm">{daerah.provinsi}</div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {currentDaerahsData.length > 0 ? (
                  <>Showing {currentDaerahsData[0].number} to {currentDaerahsData[currentDaerahsData.length - 1].number} of {daerahs.length} daerahs</>
                ) : (
                  <>Showing 0 to 0 of {daerahs.length} daerahs</>
                )}
              </div>
              <div className="flex space-x-2">
                <Pagination
                  dataList={daerahs}
                  itemsPerPage={5}
                  setCurrentData={setCurrentDaerahsData}
                  numberingData={true}
                />
              </div>
            </div>
          </div>
        </div>
        {/* old testing  */}
        {/* <div className="card p-6 shadow rounded-lg border border-gray-200 bg-white">
          <CardLoadingOverlay isVisible={loading} />
          <h3 className="text-lg font-bold mb-4">Selected area :</h3>
          {selectedArea ? (
            <div className="text-sm space-y-2">
              <p><strong>Nama:</strong> {selectedArea.name}</p>
              <p className="text-xs text-gray-400 break-all">
                <strong>Koordinat:</strong> {JSON.stringify(selectedArea.coordinates)}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">Klik salah satu area di peta untuk melihat detailnya</p>
          )}
        </div> */}
        <div className="card p-6">
          <CardLoadingOverlay isVisible={loading} />
          <h3 className="text-lg font-bold mb-4">Area Information</h3>
          <form className="space-y-4" onSubmit={handleSubmitForm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nama Daerah</label>
                <input
                  type="text"
                  className="input-field w-full px-4 py-2 rounded-lg"
                  value={formData.nama || ''}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Kode Wilayah</label>
                <input
                  type="text"
                  className="input-field w-full px-4 py-2 rounded-lg"
                  value={formData.kode || ''}
                  onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Jumlah Penduduk</label>
                <input
                  type="text"
                  className="input-field w-full px-4 py-2 rounded-lg"
                  value={formData.jmlPenduduk || ''}
                  onChange={(e) => setFormData({ ...formData, jmlPenduduk: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Provinsi</label>
                <input
                  type="text"
                  className="input-field w-full px-4 py-2 rounded-lg"
                  value={formData.provinsi || ''}
                  onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">UMR</label>
                <input
                  type="text"
                  className="input-field w-full px-4 py-2 rounded-lg"
                  value={formData.umr || ''}
                  onChange={(e) => setFormData({ ...formData, umr: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Pendapatan Daerah</label>
                <input
                  type="text"
                  className="input-field w-full px-4 py-2 rounded-lg"
                  value={formData.pendapatan || ''}
                  onChange={(e) => setFormData({ ...formData, pendapatan: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Button
                  variant="neutral"
                  size="medium"
                  className="mb-2"
                  onClick={handleLihatLokasi}
                  disabled={!selectedArea}
                >
                  Lihat Lokasi
                </Button>

                <Button
                  type="button"
                  variant="neutral"
                  size="medium"
                  onClick={handleUbahCakupanArea}
                  disabled={!selectedArea}
                >
                  Ubah Cakupan Area
                </Button>
              </div>

              <div className="flex items-end justify-end gap-2">
                <Button
                  variant="danger"
                  size="medium"
                  icon="fas fa-trash"
                  disabled={!selectedArea}
                >
                  Hapus
                </Button>

                <Button
                  variant="neutral"
                  size="medium"
                  onClick={handleCancelForm}
                  disabled={!selectedArea}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  size="medium"
                  icon="fas fa-save"
                  type="submit"
                  disabled={!selectedArea}
                >
                  Save Changes
                </Button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MapMetadata;
