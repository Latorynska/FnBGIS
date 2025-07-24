import { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Pagination from "../../components/Pagination/Pagination";
import BarChart from "../../components/Charts/BarChart";
import GooglePlaceAutocomplete from "../../components/GooglePlaceAutocomplete/GooglePlaceAutocomplete";
import Select from "../../components/Select/Select";
import TextInput from "../../components/TextInput/TextInput";
import CardLoadingOverlay from "../../components/CardLoadingOverlay/CardLoadingOverlay";

import { fetchBranches, saveBranch, savePenjualan, updateBranch, updateBranchMenus } from "../../redux/thunks/branchThunks";
import toast from "react-hot-toast";
import { fetchDaerahs } from "../../redux/thunks/daerahThunks";
import { fetchBrands, fetchMenus } from "../../redux/thunks/brandThunks";
import { fetchPlaceRatingById } from "../../helper/gMapsReviewHelper";
import { updateBranchRating } from "../../redux/slices/branchSlices";
import StatisticCard from "../../components/StatisticCard/StatisticCard";

const defaultBranchForm = { nama: '', kode: '', afiliasi: '', telp: '', email: '', placeId: '', area: [], lokasi: null, manajer: '', telpManajer: '', emailManajer: '', establishedDate: '', tanggalOpening: '', tanggalValiditas: '', detailAlamat: '', menuCabang: [], penjualan: [], rating: '', totalReview: '' };
const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
const defaultPenjualan = { periode: '', catatan: '', totalTransaksi: '', pendapatan: '' };

const Dashboard = () => {
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
    // const markerRef = useRef(null);
    const leafletMap = useRef(null);
    const editLayerRef = useRef(null);
    const drawControlRef = useRef(null);
    const drawnLayerRef = useRef(null);
    const drawnItemsRef = useRef(new L.FeatureGroup());
    const areaLayerGroupRef = useRef(null);

    const [branchForm, setBranchForm] = useState(defaultBranchForm);
    const [penjualan, setPenjualan] = useState(defaultPenjualan);
    const [detailPenjualan, setDetailPenjualan] = useState({});

    const [mapMode, setMapMode] = useState(null); // 'view' | 'edit'
    const [showModalMenu, setShowModalMenu] = useState(false);
    const [showModalPenjualan, setShowModalPenjualan] = useState(false);
    const [currentBranchesData, setCurrentBranchesData] = useState([]);
    const [activeForm, setActiveForm] = useState('details');
    const [selectedArea, setSelectedArea] = useState(null);
    const [showAreaLayer, setShowAreaLayer] = useState(true);
    const [enableDaerahPopup, setEnableDaerahPopup] = useState(true);
    const [currentMenus, setCurrentMenus] = useState([]);
    const [currentFilteredMenus, setCurrentFilteredMenus] = useState([]);
    const [selectedPeriode, setSelectedPeriode] = useState({ bulan: '', tahun: '2021' });
    const [chartCategory, setChartCategory] = useState("Penjualan Terakhir");

    const { items: daerahs, loading: loadingDaerahs, errorDaerahs } = useSelector((state) => state.daerah);
    const { items: Brands, loading: loadingBrand, errorBrand } = useSelector((state) => state.brand);
    const { items: branches, loading: loadingBranch, error } = useSelector(state => state.branch);
    const { items: menus, loading: loadingMenu, errorMenu } = useSelector(state => state.menu);

    const filteredMenus = useMemo(() => {
        return (branchForm?.menuCabang || [])
            .map(ref => typeof ref === 'string' ? ref : ref?.id)
            .filter(Boolean)
            .map(menuId => menus.find(m => m.id === menuId))
            .filter(Boolean);
    }, [branchForm?.menuCabang, menus]);

    const renderBranchesToMap = () => {
        if (!leafletMap.current) return;

        // Hapus semua polygon & marker
        leafletMap.current.eachLayer(layer => {
            if (layer instanceof L.Polygon || layer instanceof L.Marker) {
                leafletMap.current.removeLayer(layer);
            }
        });

        branches.forEach(branch => {
            // --- Render Polygon ---
            if (Array.isArray(branch.area) && branch.area.length) {
                const polygon = L.polygon(branch.area, {
                    color: 'blue',
                    weight: 2,
                    fillColor: 'lightblue',
                    fillOpacity: 0.5,
                    interactive: mapMode !== 'setLocation' // Disable interaksi saat ubah titik lokasi
                }).addTo(leafletMap.current);

                polygon.bindPopup(`<b>${branch.nama}</b>`);
                polygon.on('click', () => {
                    setSelectedArea({ name: branch.nama, coordinates: branch.area });
                    setBranchForm({ ...branch });
                });
            }

            // --- Render Marker---
            if (Array.isArray(branch.lokasi) && branch.lokasi.length === 2) {
                const marker = L.marker(branch.lokasi).addTo(leafletMap.current);
                marker.bindPopup(`<b>${branch.nama}</b><br/>Lokasi Cabang`);
                marker.on('click', () => {
                    setBranchForm({ ...branch });
                    setSelectedArea({ name: branch.nama, coordinates: branch.area || [] });
                });
            }
        });
    };
    const renderDaerahLayer = (daerahList = daerahs) => {
        if (!leafletMap.current || !Array.isArray(daerahList)) return;
        if (areaLayerGroupRef.current) {
            leafletMap.current.removeLayer(areaLayerGroupRef.current);
        }
        if (!showAreaLayer) return;

        const group = L.layerGroup();

        daerahList.forEach((item) => {
            if (Array.isArray(item.area) && item.area.length) {
                const polygon = L.polygon(item.area, {
                    color: '#666',
                    weight: 1,
                    fillColor: '#ccc',
                    fillOpacity: 0.3,
                    interactive: true
                });

                if (enableDaerahPopup) {
                    const popupContent = `
                    <b>${item.nama}</b><br/>
                    Penduduk: ${item.jmlPenduduk?.toLocaleString?.() || '-'}<br/>
                    UMR: Rp ${item.umr?.toLocaleString?.() || '-'}<br/>
                    Pendapatan: Rp ${item.pendapatan?.toLocaleString?.() || '-'}
                `;
                    polygon.bindPopup(popupContent);
                }

                group.addLayer(polygon);
            }
        });

        group.addTo(leafletMap.current);
        areaLayerGroupRef.current = group;
    };
    useEffect(() => {
        dispatch(fetchBranches())
            .unwrap()
            .then(async (branches) => {
                await Promise.all(branches.map(async (branch) => {
                    if (branch.placeId) {
                        try {
                            const { rating, totalReview } = await fetchPlaceRatingById(branch.placeId);
                            dispatch(updateBranchRating({
                                branchId: branch.id,
                                rating,
                                totalReview
                            }));
                        } catch (err) {
                            console.warn(`Gagal ambil rating untuk ${branch.nama}:`, err);
                        }
                    }
                }));
            })
            .catch((err) => toast.error('Gagal fetch cabang: ' + err));
        dispatch(fetchDaerahs())
            .unwrap()
            .then(() => {
                renderDaerahLayer();
            })
            .catch(err => toast.error('Gagal fetch daerah: ' + err));

        dispatch(fetchBrands()).unwrap().then((brands) => {
            if (brands.length > 0) {
                dispatch(fetchMenus(brands[0].id));
            }
        }).catch((err) => toast.error('Gagal fetch brand: ' + err));
    }, [dispatch]);
    // render daerah data
    useEffect(() => {
        if (leafletMap.current && daerahs.length > 0) {
            renderDaerahLayer();
        }
    }, [leafletMap.current, daerahs, showAreaLayer, enableDaerahPopup]);
    useEffect(() => {
        if (!leafletMap.current && mapRef.current) {
            leafletMap.current = L.map(mapRef.current).setView([-6.9, 107.6], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(leafletMap.current);

            leafletMap.current.addLayer(drawnItemsRef.current);
        }

        renderBranchesToMap();

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }
        };
    }, [branches]);
    useEffect(() => {
        renderBranchesToMap();
    }, [mapMode]);
    useEffect(() => {
        if (showModalPenjualan && branchForm?.penjualan) {
            const bulanIndex = [
                "JAN", "FEB", "MAR", "APR", "MEI", "JUN",
                "JUL", "AGU", "SEP", "OKT", "NOV", "DES"
            ].indexOf(selectedPeriode.bulan);

            if (bulanIndex !== -1) {
                const periodeId = `${selectedPeriode.tahun}-${String(bulanIndex + 1).padStart(2, '0')}`;
                const penjualanData = branchForm.penjualan[periodeId];

                if (penjualanData) {
                    setPenjualan({
                        totalTransaksi: penjualanData.totalTransaksi || '',
                        pendapatan: penjualanData.totalPendapatan || '',
                        catatan: penjualanData.catatan || ''
                    });

                    setDetailPenjualan(penjualanData.detail || {});
                } else {
                    // Kosongkan jika tidak ada data
                    setPenjualan(defaultPenjualan);
                    setDetailPenjualan({});
                }
            }
        }
    }, [showModalPenjualan, selectedPeriode, branchForm]);
    const handleLihatLokasi = () => {
        setMapMode('view');
        if (branchForm.area?.length && leafletMap.current) {
            leafletMap.current.fitBounds(branchForm.area);
        }
    };
    const handleEditLokasi = () => {
        if (!leafletMap.current) return;

        setMapMode('setLocation');

        leafletMap.current.getContainer().style.cursor = 'crosshair';

        if (branchForm.area?.length > 0) {
            leafletMap.current.fitBounds(branchForm.area);
        } else if (branchForm.lokasi?.length === 2) {
            leafletMap.current.setView(branchForm.lokasi, 16);
        }
        const onMapClick = async (e) => {
            const { lat, lng } = e.latlng;

            const updated = {
                ...branchForm,
                lokasi: [lat, lng],
            };
            setBranchForm(updated);
            try {
                await dispatch(updateBranch({ id: updated.id, data: updated })).unwrap();
                toast.success("Titik lokasi berhasil diperbarui");
            } catch (err) {
                toast.error("Gagal update lokasi: " + err);
            }

            leafletMap.current.getContainer().style.cursor = '';
            leafletMap.current.off('click', onMapClick);
            setMapMode(null);
        };

        leafletMap.current.on('click', onMapClick);
    };
    const handleUbahCakupanArea = () => {
        if (!leafletMap.current) return;
        setMapMode('edit');

        if (drawControlRef.current) {
            leafletMap.current.removeControl(drawControlRef.current);
            drawControlRef.current = null;
        }

        if (!branchForm.area?.length) {
            // MODE: DRAW NEW
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

                layer.addTo(drawnItemsRef.current);
                drawnItemsRef.current.addLayer(layer);

                setSelectedArea({ coordinates: coords });
                setBranchForm(prev => ({ ...prev, area: coords }));

                try {
                    const updated = { ...branchForm, area: coords };
                    await dispatch(updateBranch({ id: updated.id, data: updated })).unwrap();
                    toast.success("Area cabang berhasil diperbarui");
                } catch (err) {
                    toast.error("Gagal update area cabang: " + err);
                }

                leafletMap.current.off('draw:created', onCreate);
                leafletMap.current.removeControl(drawControlRef.current);
                drawControlRef.current = null;
                setMapMode(null);
            };


            leafletMap.current.on('draw:created', onCreate);

            // Auto trigger polygon draw button
            setTimeout(() => {
                document.querySelector('.leaflet-draw-draw-polygon')?.click();
            }, 250);

        } else {
            // MODE: EDIT EXISTING ala MapMetadata
            if (editLayerRef.current) {
                leafletMap.current.removeLayer(editLayerRef.current);
            }

            const polygon = L.polygon(branchForm.area, {
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
                setSelectedArea({ coordinates: latlngs });
            });
        }
    };
    const handleSimpanArea = async () => {
        if (!selectedArea || !selectedArea.coordinates?.length) return;

        const updated = { ...branchForm, area: selectedArea.coordinates };
        setBranchForm(updated);
        setMapMode(null);

        if (editLayerRef.current) {
            leafletMap.current.removeLayer(editLayerRef.current);
            editLayerRef.current = null;
        }

        if (drawControlRef.current) {
            leafletMap.current.removeControl(drawControlRef.current);
            drawControlRef.current = null;
        }

        try {
            await dispatch(updateBranch({ id: updated.id, data: updated })).unwrap();
            toast.success("Area cabang berhasil diperbarui");
        } catch (err) {
            toast.error("Gagal simpan area: " + err);
        }
    };
    const handleSimpanPenjualan = async () => {
        try {
            const periodeId = `${selectedPeriode.tahun}-${String(
                ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"]
                    .indexOf(selectedPeriode.bulan) + 1
            ).padStart(2, "0")}`;

            await dispatch(savePenjualan({
                branchId: branchForm.id,
                periode: selectedPeriode,
                summary: {
                    totalTransaksi: penjualan.totalTransaksi,
                    totalPendapatan: penjualan.pendapatan,
                    catatan: penjualan.catatan || ''
                },
                detail: detailPenjualan,
            }))
                .unwrap()
                .then(() => {
                    setBranchForm(prev => ({
                        ...prev,
                        penjualan: {
                            ...(prev.penjualan || {}),
                            [periodeId]: {
                                totalTransaksi: penjualan.totalTransaksi,
                                totalPendapatan: penjualan.pendapatan,
                                catatan: penjualan.catatan || '',
                                detail: { ...detailPenjualan }
                            }
                        }
                    }));

                    toast.success("Penjualan berhasil disimpan");
                    setShowModalPenjualan(false);
                })
                .catch((err) => toast.error("Gagal simpan penjualan: " + err));
        } catch (err) {
            toast.error("Gagal simpan penjualan: " + err);
        }
    };

    const handleBatalEdit = () => {
        if (!leafletMap.current) return;

        setMapMode(null);
        leafletMap.current.getContainer().style.cursor = '';

        leafletMap.current.off('click'); // remove all map click listeners

        if (editLayerRef.current) {
            leafletMap.current.removeLayer(editLayerRef.current);
            editLayerRef.current = null;
        }

        if (drawnLayerRef.current) {
            leafletMap.current.removeLayer(drawnLayerRef.current);
            drawnLayerRef.current = null;
        }

        if (drawControlRef.current) {
            leafletMap.current.removeControl(drawControlRef.current);
            drawControlRef.current = null;
        }
    };
    const handleSaveBranch = async (e) => {
        e.preventDefault();
        if (!branchForm.nama || !branchForm.kode) {
            toast.error("Nama dan kode wajib diisi");
            return;
        }

        const action = branchForm.id
            ? updateBranch({ id: branchForm.id, data: branchForm })
            : saveBranch(branchForm);

        dispatch(action)
            .unwrap()
            .then(() => {
                toast.success(`Cabang berhasil ${branchForm.id ? 'diperbarui' : 'ditambahkan'}`);
                setBranchForm(defaultBranchForm);
                dispatch(fetchBranches());
            })
            .catch((err) => toast.error("Gagal simpan: " + err));
    };
    const handleRowClick = (e) => {
        const row = e.target.closest("tr[data-branch-index]");
        if (!row) return;

        const index = row.getAttribute("data-branch-index");
        if (index === null) return;

        const selected = currentBranchesData[Number(index)];
        if (!selected) return;

        setBranchForm(selected);
        setActiveForm("details");
    };
    const handleToggleMenu = (menuId, isChecked) => {
        const current = branchForm.menuCabang || [];

        const updated = isChecked
            ? [...current, menuId]
            : current.filter((idOrRef) => {
                const id = typeof idOrRef === 'string' ? idOrRef : idOrRef.id;
                return id !== menuId;
            });

        const branchId = branchForm.id;
        if (!branchId) return;
        setBranchForm((prev) => ({
            ...prev,
            menuCabang: updated,
        }));
        dispatch(updateBranchMenus({ branchId, menuCabang: updated }))
            .unwrap()
            .then(() => toast.success('Menu cabang berhasil diperbarui'))
            .catch((err) => toast.error('Gagal update menu cabang: ' + err));
    };
    return (
        <>
            {/* stats card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticCard
                    description="24"
                    iconName="branch"
                    subDescStatus="up"
                    subDescription="12% from last month"
                    title="Total Branches"
                />
                <StatisticCard
                    description="$128,450"
                    iconName="revenue"
                    subDescStatus="up"
                    subDescription="8% from last month"
                    title="Total Revenue"
                />
                <StatisticCard
                    description="342"
                    iconName="customers"
                    subDescStatus="down"
                    subDescription="3% from last month"
                    title="Avg. Daily Customers"
                />
                <StatisticCard
                    description="5.2 km²"
                    iconName="area"
                    subDescStatus="up"
                    subDescription="2 new areas"
                    title="Coverage Area"
                />
            </div>
            {/* map */}
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
                {/* map ui */}
                <div className="lg:col-span-5">
                    <div className="card p-4 h-full">
                        <CardLoadingOverlay isVisible={loadingBranch || loadingDaerahs} />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                            <h3 className="font-medium">Branch Locations</h3>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={showAreaLayer}
                                        onChange={(e) => setShowAreaLayer(e.target.checked)}
                                    />
                                    Tampilkan Wilayah Daerah
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={enableDaerahPopup}
                                        onChange={(e) => setEnableDaerahPopup(e.target.checked)}
                                    />
                                    Aktifkan Popup Daerah
                                </label>
                            </div>
                        </div>
                        <div className="h-96 relative">
                            <div
                                ref={mapRef}
                                style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 0 }}
                                id="map"
                            />
                        </div>

                        {/* hanya aktif ketika sedang edit area */}
                        {mapMode === 'edit' && (
                            <div className="flex justify-end gap-2 mt-2">
                                <Button variant='neutral' onClick={handleBatalEdit}>Batal</Button>
                                <Button variant='primary' onClick={handleSimpanArea}>Simpan</Button>
                            </div>
                        )}
                        {mapMode === 'setLocation' && (
                            <div className="flex justify-end gap-2 mt-2">
                                <Button variant='neutral' onClick={handleBatalEdit}>Batal</Button>
                            </div>
                        )}
                    </div>
                </div>
                {/* chart */}
                <div className="lg:col-span-3 flex flex-col">
                    <div className="card p-4 flex flex-col flex-1">
                        <CardLoadingOverlay isVisible={loadingBranch} />
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Overview Performa</h3>
                            <Select
                                label="Kategori Performa"
                                variant="plain"
                                options={[
                                    "Penjualan Terakhir",
                                    "Peningkatan Penjualan",
                                    "Rata-rata Pendapatan Bulanan",
                                    "Total Transaksi Bulanan",
                                    "Menu Terlaris per Cabang",
                                    "Rating Maps",
                                    "Kontribusi Cabang terhadap Brand",
                                    "Overall Performance",
                                    "Serapan Potensi"
                                ]}
                                placeholder="Pilih Kategori Performa"
                                value={chartCategory}
                                onChange={(e) => setChartCategory(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 min-h-0">
                            <BarChart category={chartCategory} />
                        </div>
                    </div>
                </div>
            </div>
            {/* table data list cabang */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* datalist table */}
                <div className="lg:col-span-1">
                    <div className="card p-4">
                        <CardLoadingOverlay isVisible={loadingBranch} />
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">All Branches</h3>
                            <div className="flex space-x-2"><Button
                                variant="primary"
                                size="small"
                                icon="fas fa-plus"
                                onClick={() => {
                                    setBranchForm(defaultBranchForm);
                                    setActiveForm("details");
                                }}
                            >
                                Tambah Cabang Baru
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
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nama Cabang</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Lokasi</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Penjualan</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating Lokasi</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Afiliasi</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Show</th>
                                    </tr>
                                </thead>
                                <tbody
                                    className="divide-y divide-gray-800"
                                    onClick={handleRowClick}
                                >
                                    {
                                        branches.length === 0 ? (
                                            <tr className="table-row">
                                                <td className="whitespace-nowrap" colSpan={6}>
                                                    <div className="text-sm text-gray-400 italic text-center py-2">
                                                        branch masih kosong
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                            :
                                            currentBranchesData.map((branch, index) => {

                                                const hasCoordinates = typeof branch.lat === "number" && typeof branch.lng === "number";
                                                const hasArea = Array.isArray(branch.area) && branch.area.length > 0 && Array.isArray(branch.area[0]) && typeof branch.area[0][0] === "number" && typeof branch.area[0][1] === "number";

                                                return (
                                                    <tr
                                                        className={`table-row cursor-pointer ${branchForm.id === branch.id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                                                        key={branch.id || index}
                                                        data-branch-index={index}
                                                    >
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <div className="text-sm">{branch.nama}</div>
                                                            <div className="text-xs text-gray-400">{branch.kode}</div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <div className="text-sm">Main Street</div>
                                                            <div className="text-xs text-gray-400">1.2km radius</div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <div className="text-sm">$</div>
                                                            <div className="text-xs text-emerald-400">
                                                                <i className="fas fa-arrow-up mr-1"></i> 12%
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <div className="text-sm">{branch.customers}</div>
                                                            <div className="text-xs text-emerald-400">
                                                                <i className="fas fa-arrow-up mr-1"></i> 8%
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            {branch.afiliasi}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                                                            <div className="flex justify-around">
                                                                {/* <div className="space-y-1">
                                                                    <button className="text-blue-400 hover:text-blue-300 mr-3">
                                                                        <i className="fas fa-edit"></i>
                                                                    </button>
                                                                    <button className="text-gray-400 hover:text-gray-300 mr-3">
                                                                        <i className="fas fa-chart-line"></i>
                                                                    </button>
                                                                    <button className="text-red-400 hover:text-red-300">
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </div> */}
                                                                <input
                                                                    type="checkbox"
                                                                />
                                                            </div>
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
                                {currentBranchesData.length > 0 ? (
                                    <>Showing {currentBranchesData[0].number} to {currentBranchesData[currentBranchesData.length - 1].number} of {branches.length} branches</>
                                ) : (
                                    <>Showing 0 to 0 of {branches.length} branches</>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <Pagination
                                    dataList={branches}
                                    itemsPerPage={8}
                                    setCurrentData={setCurrentBranchesData}
                                    numberingData={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
