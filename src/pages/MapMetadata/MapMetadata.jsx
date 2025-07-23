import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import Button from '../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import CardLoadingOverlay from '../../components/CardLoadingOverlay/CardLoadingOverlay';
import { createDaerah, deleteDaerah, fetchDaerahs, updateDaerah } from '../../redux/thunks/daerahThunks';
import { calculatePolygonArea } from '../../utils/geoUtils';

// import geojsonData from './metadata-lokasi.json';
import Pagination from '../../components/Pagination/Pagination';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import TextInput from '../../components/TextInput/TextInput';

const defaultFormData = { nama: '', kode: '', jmlPenduduk: '', provinsi: '', umr: '', pendapatan: '', area: [] };

const MapMetadata = () => {
  const dispatch = useDispatch();

  if (L && L.GeometryUtil && L.GeometryUtil.readableArea) {
    L.GeometryUtil.readableArea = function (area, isMetric) {
      let areaStr;
      if (isMetric) {
        areaStr = area >= 1000000
          ? (area / 1000000).toFixed(2) + ' km²'
          : area.toFixed(2) + ' m²';
      } else {
        area *= 0.000247105; // acres
        areaStr = area >= 1
          ? area.toFixed(2) + ' acres'
          : (area * 43560).toFixed(2) + ' ft²';
      }
      return areaStr;
    };
  }

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const editLayerRef = useRef(null);
  const drawControlRef = useRef(null);
  const drawnItemsRef = useRef(new L.FeatureGroup());

  const [mapMode, setMapMode] = useState(null); // 'view' | 'edit'
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [currentDaerahsData, setCurrentDaerahsData] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState();

  const [formData, setFormData] = useState(defaultFormData);

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
      const isValidArea =
        Array.isArray(daerah.area) &&
        daerah.area.length > 0 &&
        Array.isArray(daerah.area[0]) &&
        typeof daerah.area[0][0] === 'number' &&
        typeof daerah.area[0][1] === 'number';

      if (!isValidArea) return;

      const polygonCoords = daerah.area.map(([lat, lng]) => [lat, lng]);

      const polygon = L.polygon(polygonCoords, {
        color: 'blue',
        weight: 2,
        fillColor: 'lightblue',
        fillOpacity: 0.5
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

  const handleLihatLokasi = () => {
    setMapMode('view');
    if (selectedArea?.coordinates?.length && leafletMap.current) {
      leafletMap.current.fitBounds(selectedArea.coordinates);
    }
  };

  const handleUbahCakupanArea = () => {
    if (!leafletMap.current) return;
    setMapMode('edit');

    // Hapus kontrol sebelumnya
    if (drawControlRef.current) {
      leafletMap.current.removeControl(drawControlRef.current);
      drawControlRef.current = null;
    }

    // Mode TAMBAH area jika belum ada
    if (!formData?.area?.length) {
      drawControlRef.current = new L.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: { color: 'red' }
          },
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: false,
      });

      leafletMap.current.addControl(drawControlRef.current);

      const onCreate = async (event) => {
        const layer = event.layer;
        const latlngs = layer.getLatLngs()[0];
        const coords = latlngs.map(p => [p.lat, p.lng]);

        layer.addTo(leafletMap.current);
        drawnItemsRef.current.addLayer(layer);
        editLayerRef.current = layer;

        setSelectedArea({ name: formData.nama, coordinates: coords });
        setFormData(prev => ({ ...prev, area: coords }));

        leafletMap.current.off('draw:created', onCreate);
        leafletMap.current.removeControl(drawControlRef.current);
        drawControlRef.current = null;
        setMapMode(null);
      };

      leafletMap.current.on('draw:created', onCreate);

      setTimeout(() => {
        document.querySelector('.leaflet-draw-draw-polygon')?.click();
      }, 250);

    } else {
      // Mode EDIT area yang sudah ada
      if (editLayerRef.current) {
        leafletMap.current.removeLayer(editLayerRef.current);
      }

      const polygon = L.polygon(formData.area, {
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
        setSelectedArea({ name: formData.nama, coordinates: latlngs });
        setFormData(prev => ({ ...prev, area: latlngs }));
      });
    }
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

    if (formData?.id) {
      dispatch(updateDaerah({ id: formData.id, data: formSubmit }))
        .unwrap()
        .then(() => {
          toast.success('Data berhasil diperbarui');
          handleLihatLokasi();
        })
        .catch((err) => toast.error('Gagal update: ' + err));
    } else {
      dispatch(createDaerah(formSubmit))
        .unwrap()
        .then(() => {
          toast.success('Data berhasil ditambahkan');
          handleLihatLokasi();
        })
        .catch((err) => toast.error('Gagal tambah: ' + err));
    }

    setMapMode(null);
  };

  const handleDelete = async () => {
    if (!formData?.id) {
      toast.error('Tidak ada data daerah yang dipilih.');
      return;
    }

    try {
      await dispatch(deleteDaerah(formData.id)).unwrap();
      toast.success(`Berhasil menghapus daerah "${formData.nama}"`);
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
      setSelectedArea(null);
      setShowDeleteConfirm(false);
      if (editLayerRef.current && leafletMap.current) {
        leafletMap.current.removeLayer(editLayerRef.current);
        editLayerRef.current = null;
      }

    } catch (err) {
      toast.error('Gagal menghapus daerah: ' + err);
    }
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
                <Button variant="primary" size="small" icon="fas fa-plus" onClick={() => setFormData(defaultFormData)}
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
        <div className="card p-6">
          <CardLoadingOverlay isVisible={loading} />
          <h3 className="text-lg font-bold mb-4">Area Information</h3>
          <form className="space-y-4" onSubmit={handleSubmitForm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextInput
                  label='Nama Daerah'
                  type="text"
                  value={formData.nama || ''}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                />
              </div>
              <div>
                <TextInput 
                  label='Kode Wilayah'
                  type="text"
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
                  disabled={formData.area?.length === 0}
                >
                  Lihat Lokasi
                </Button>

                <Button
                  type="button"
                  variant="neutral"
                  size="medium"
                  onClick={handleUbahCakupanArea}
                  disabled={formData.nama === ''}
                >
                  Ubah Cakupan Area
                </Button>
              </div>

              <div className="flex items-end justify-end gap-2">
                <Button
                  variant="danger"
                  size="medium"
                  icon="fas fa-trash"
                  disabled={!formData.id}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Hapus
                </Button>

                <Button
                  variant="neutral"
                  size="medium"
                  onClick={handleCancelForm}
                  disabled={formData.nama === ''}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  size="medium"
                  icon="fas fa-save"
                  type="submit"
                  disabled={formData.nama === ''}
                >
                  Save Changes
                </Button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)} title="Konfirmasi Hapus Menu">
          <p className="text-sm text-gray-300 mb-4">
            Apakah Anda yakin ingin menghapus data daerah <strong>{formData?.nama}</strong>?
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="neutral" size='medium' onClick={() => setShowDeleteConfirm(false)}>Batal</Button>
            <Button variant="danger" size='medium' icon="fas fa-trash" onClick={handleDelete}>
              Hapus
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MapMetadata;
