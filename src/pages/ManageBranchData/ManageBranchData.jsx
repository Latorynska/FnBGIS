import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import Button from "../../components/Button/Button";
import Pill from "../../components/Pill/Pill";
import Modal from "../../components/Modal/Modal";
import Pagination from "../../components/Pagination/Pagination";
import './ManageBranch.css';
import BarChart from "../../components/Charts/BarChart";
import GooglePlaceAutocomplete from "../../components/GooglePlaceAutocomplete/GooglePlaceAutocomplete";
import Select from "../../components/Select/Select";
import TextInput from "../../components/TextInput/TextInput";
import CardLoadingOverlay from "../../components/CardLoadingOverlay/CardLoadingOverlay";

import { fetchBranches, saveBranch, updateBranch } from "../../redux/thunks/branchThunks";
import toast from "react-hot-toast";

const ManageBranchData = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');

    const [currentBranchesData, setCurrentBranchesData] = useState([]);
    const [branchForm, setBranchForm] = useState({ nama: '', kode: '', afiliasi: '', telp: '', email: '', placeId: '', area: [], manajer: '', telpManajer: '', emailManajer: '', establishedDate: '', tanggalValiditas: '', detailAlamat: '', tanggalOpening: '', tanggalValiditas: '', });
    const [activeForm, setActiveForm] = useState('details');
    const [selectedPlace, setSelectedPlace] = useState(null);

    const [newPolygon, setNewPolygon] = useState(null);
    const mapRef = useRef(null);
    const drawControlRef = useRef(null);
    const drawnItemsRef = useRef(new L.FeatureGroup());

    const { items: branches, loading: loadingBranch, error } = useSelector(state => state.branch);

    useEffect(() => {
        dispatch(fetchBranches());
    }, [dispatch]);
    useEffect(() => {
        if (!mapRef.current || mapRef.current._leaflet_map_instance) return;

        const map = L.map(mapRef.current).setView([-6.9175, 107.6191], 12);
        mapRef.current._leaflet_map_instance = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        map.addLayer(drawnItemsRef.current);

        drawControlRef.current = new L.Control.Draw({
            draw: {
                polygon: true,
                polyline: false,
                rectangle: false,
                circle: false,
                marker: false,
                circlemarker: false,
            },
            edit: false,
        });

        branches.forEach((branch) => {
            const hasCoordinates =
                typeof branch.lat === 'number' && typeof branch.lng === 'number';
            const hasArea =
                Array.isArray(branch.area) &&
                branch.area.length > 0 &&
                Array.isArray(branch.area[0]) &&
                typeof branch.area[0][0] === 'number' &&
                typeof branch.area[0][1] === 'number';
            if (!hasCoordinates) return;

            const color =
                branch.status === 'active'
                    ? '#10B981'
                    : branch.status === 'warning'
                        ? '#F59E0B'
                        : '#EF4444';

            const popupContent = `
        <div>
          <h3 class="font-bold mb-1">${branch.name}</h3>
          <div class="text-sm">Revenue: $${branch.revenue?.toLocaleString?.() || 0}</div>
          <div class="text-sm">Customers: ${branch.customers ?? 0}</div>
        </div>
      `;
            const marker = L.marker([branch.lat, branch.lng], {
                icon: L.divIcon({
                    html: `<div style="color: ${color}; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>`,
                    className: 'map-marker-icon',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                }),
            }).addTo(map);
            marker.bindPopup(popupContent);

            if (hasArea) {
                const polygon = L.polygon(branch.area, {
                    color,
                    fillColor: color,
                    fillOpacity: 0.2,
                    weight: 2,
                }).addTo(map);

                polygon.bindPopup(popupContent);
                polygon.on('mouseover', () =>
                    polygon.setStyle({ weight: 4, fillOpacity: 0.3 })
                );
                polygon.on('mouseout', () =>
                    polygon.setStyle({ weight: 2, fillOpacity: 0.2 })
                );
            }
        });


        map.on('draw:created', function (event) {
            const layer = event.layer;
            const latlngs = layer.getLatLngs()[0];
            setNewPolygon({
                layer,
                latlngs: latlngs.map(coord => [coord.lat, coord.lng]),
            });
            setShowModal(true);
            map.removeControl(drawControlRef.current);
        });
    }, [branches]);
    const handleSaveBranch = async (e) => {
        e.preventDefault();

        if (!branchForm.nama || !branchForm.kode) {
            toast.error("Nama dan kode cabang wajib diisi");
            return;
        }

        const dataToSend = {
            ...branchForm,
        };

        const isUpdate = !!branchForm.id;

        const action = isUpdate
            ? updateBranch({ id: branchForm.id, data: dataToSend })
            : saveBranch(dataToSend);

        dispatch(action)
            .unwrap()
            .then(() => {
                toast.success(`Cabang berhasil ${isUpdate ? "diperbarui" : "ditambahkan"}`);
                setBranchForm({
                    nama: '',
                    kode: '',
                    afiliasi: '',
                    telp: '',
                    email: '',
                    placeId: '',
                    area: [],
                    manajer: '',
                    telpManajer: '',
                    emailManajer: '',
                    establishedDate: '',
                    tanggalOpening: '',
                    tanggalValiditas: '',
                    detailAlamat: '',
                });
                setSelectedPlace(null);
            })
            .catch((err) => {
                toast.error(`Gagal ${isUpdate ? "update" : "simpan"}: ${err}`);
            });
    };
    const handleRowClick = (e) => {
        const row = e.target.closest("tr[data-branch-index]");
        if (!row) return; // Bukan klik pada row yang valid

        const index = row.getAttribute("data-branch-index");
        if (index === null) return;

        const selected = currentBranchesData[Number(index)];
        if (!selected) return;

        setBranchForm(selected);
        setActiveForm("details");
        setSelectedPlace(null);
    };


    return (
        <>
            {/* map */}
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
                {/* map ui */}
                <div className="lg:col-span-5">
                    <div className="card p-4 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Branch Locations</h3>
                        </div>
                        <div className="h-96 relative">
                            <div
                                ref={mapRef}
                                style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 0 }}
                                id="map"
                            />
                        </div>
                    </div>
                </div>
                {/* chart */}
                <div className="lg:col-span-3 flex flex-col">
                    <div className="card p-4 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Top Performing Branches</h3>
                            <select className="bg-gray-800 text-sm px-3 py-1 rounded">
                                <option>This Month</option>
                            </select>
                        </div>
                        <div className="flex-1 min-h-0"> {/* 👈 penting untuk mencegah overflow */}
                            <BarChart branches={branches} />
                        </div>
                    </div>
                </div>
            </div>

            {/* table data list cabang */}
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
                {/* datalist table */}
                <div className="lg:col-span-5">
                    <div className="card p-4">
                        <CardLoadingOverlay isVisible={loadingBranch} />
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">All Branches</h3>
                            <div className="flex space-x-2">
                                <Button variant="primary" size="small" icon="fas fa-plus" onClick={() => setShowModal(prev => !prev)}
                                >
                                    Tambah Area Cabang
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
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
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
                                                                <div className="space-y-1">
                                                                    <button className="text-blue-400 hover:text-blue-300 mr-3">
                                                                        <i className="fas fa-edit"></i>
                                                                    </button>
                                                                    <button className="text-gray-400 hover:text-gray-300 mr-3">
                                                                        <i className="fas fa-chart-line"></i>
                                                                    </button>
                                                                    <button className="text-red-400 hover:text-red-300">
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </div>
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
                {/* form area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex border-b border-gray-700">
                        <button className={`tab-button px-4 py-2 text-sm font-medium ${activeForm === 'details' ? 'active' : ''}`} data-tab="details" onClick={() => setActiveForm('details')}>
                            <i className="fas fa-info-circle mr-2"></i> Branch Details
                        </button>
                        <button className={`tab-button px-4 py-2 text-sm font-medium ${activeForm === 'sales' ? 'active' : ''}`} data-tab="sales" onClick={() => setActiveForm('sales')}>
                            <i className="fas fa-chart-line mr-2"></i> Sales Data
                        </button>
                        <button className={`tab-button px-4 py-2 text-sm font-medium ${activeForm === 'menu' ? 'active' : ''}`} data-tab="menu" onClick={() => setActiveForm('menu')}>
                            <i className="fas fa-utensils mr-2"></i> Menu Items
                        </button>
                    </div>
                    {activeForm === 'details' && (
                        <div id="details-tab" className="tab-content card p-6">
                            <CardLoadingOverlay isVisible={loadingBranch} />
                            <h3 className="text-lg font-bold mb-4">Branch Information</h3>
                            <form className="space-y-4" onSubmit={handleSaveBranch}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <TextInput
                                            name={'branchName'}
                                            value={branchForm.nama}
                                            onChange={(e) => setBranchForm({ ...branchForm, nama: e.target.value })}
                                            label={'Nama Cabang'}
                                            placeholder="Nama Cabang"
                                        />
                                    </div>
                                    <div>
                                        <TextInput
                                            name={'branchCode'}
                                            value={branchForm.kode}
                                            onChange={(e) => setBranchForm({ ...branchForm, kode: e.target.value })}
                                            label={'Kode Cabang'}
                                            placeholder="Kode Cabang"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Select
                                        label={'Afiliasi Cabang'}
                                        value={branchForm.afiliasi}
                                        placeholder='Pilih status'
                                        onChange={(e) => setBranchForm({ ...branchForm, afiliasi: e.target.value })}
                                        options={[
                                            { label: "Owned", value: "Owned" },
                                            { label: "Mitra", value: "Mitra" },
                                        ]}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <TextInput
                                            name={'branchPhone'}
                                            value={branchForm.telp}
                                            onChange={(e) => setBranchForm({ ...branchForm, telp: e.target.value })}
                                            label={'No. Telp Cabang'}
                                            placeholder="+628xxxxxxxxxx"
                                            type="tel"
                                        />
                                    </div>
                                    <div>
                                        <TextInput
                                            name={'branchEmail'}
                                            value={branchForm.email}
                                            onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                                            label={'Email Cabang'}
                                            placeholder="@"
                                            type="email"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <TextInput
                                            name={'manajer'}
                                            value={branchForm.manajer}
                                            onChange={(e) => setBranchForm({ ...branchForm, manajer: e.target.value })}
                                            label={'Nama Manajer'}
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <TextInput
                                            name={'manajerPhone'}
                                            value={branchForm.telpManajer}
                                            onChange={(e) => setBranchForm({ ...branchForm, telpManajer: e.target.value })}
                                            label={'No. Telp Manajer'}
                                            placeholder="+628xxxxxxxxxx"
                                            type="tel"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Detail Alamat</label>
                                    <textarea
                                        className="input-field w-full px-4 py-2 rounded-lg"
                                        rows="3"
                                        value={branchForm.detailAlamat}
                                        onChange={(e) =>
                                            setBranchForm({ ...branchForm, detailAlamat: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <TextInput
                                            name={'openingDate'}
                                            value={branchForm.tanggalOpening}
                                            onChange={(e) => setBranchForm({ ...branchForm, tanggalOpening: e.target.value })}
                                            label={'Tanggal Opening Cabang'}
                                            type="date"
                                        />
                                    </div>
                                    <div>
                                        <TextInput
                                            name={'validityDate'}
                                            value={branchForm.tanggalValiditas}
                                            onChange={(e) => setBranchForm({ ...branchForm, tanggalValiditas: e.target.value })}
                                            label={'Tanggal Validitas Cabang'}
                                            type="date"
                                            hint="digunakan untuk menandakan batas tanggal kontrak mitra ataupun kontrak lokasi tempat cabang"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Pilih Lokasi Cabang</label>
                                    <GooglePlaceAutocomplete
                                        onPlaceSelected={(place) => {
                                            setSelectedPlace(place);
                                            setBranchForm(prev => ({
                                                ...prev,
                                                placeId: place.place_id,
                                            }));
                                        }}
                                        initialText={branchForm.placeId ? `Place ID: ${branchForm.placeId}` : ''}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <Button
                                            variant="neutral"
                                            size="medium"
                                            className="mb-2"
                                        // onClick={handleLihatLokasi}
                                        // disabled={!selectedArea}
                                        >
                                            Lihat Lokasi
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="neutral"
                                            size="medium"
                                        // onClick={handleUbahCakupanArea}
                                        // disabled={!selectedArea}
                                        >
                                            Ubah Cakupan Area
                                        </Button>
                                    </div>

                                    <div className="flex items-end justify-end gap-2">
                                        <Button
                                            variant="danger"
                                            size="medium"
                                        // disabled={!selectedArea}
                                        >
                                            Hapus
                                        </Button>

                                        <Button
                                            variant="neutral"
                                            size="medium"
                                        // onClick={handleCancelForm}
                                        // disabled={!selectedArea}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            variant="primary"
                                            size="medium"
                                            type="submit"
                                        // disabled={!selectedArea}

                                        >
                                            Save
                                        </Button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    )}
                    {activeForm === 'sales' && (
                        <div id="sales-tab" className="tab-content card p-6">
                            <h3 className="text-lg font-bold mb-4">Sales Data for Downtown Cafe</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="card p-4">
                                    <h4 className="font-medium mb-3">Sales Summary</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Today's Revenue</span>
                                            <span className="font-medium">$3,245</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Weekly Revenue</span>
                                            <span className="font-medium">$18,760</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Monthly Revenue</span>
                                            <span className="font-medium">$72,450</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Avg. Daily Customers</span>
                                            <span className="font-medium">342</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card p-4">
                                    <h4 className="font-medium mb-3">Top Selling Items</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">1. Signature Burger</span>
                                            <span className="font-medium">428 sold</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">2. Margherita Pizza</span>
                                            <span className="font-medium">387 sold</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">3. Caesar Salad</span>
                                            <span className="font-medium">298 sold</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">4. Iced Coffee</span>
                                            <span className="font-medium">245 sold</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card p-4 mb-6">
                                <h4 className="font-medium mb-3">Sales Trend (Last 30 Days)</h4>
                                <div className="sales-chart-container">
                                    <canvas id="salesChart"></canvas>
                                </div>
                            </div>
                            <h4 className="font-medium mb-3">Add Sales Record</h4>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Date</label>
                                        <input type="date" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Total Revenue</label>
                                        <input type="number" step="0.01" placeholder="0.00" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Customer Count</label>
                                        <input type="number" placeholder="0" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Notes</label>
                                    <textarea className="input-field w-full px-4 py-2 rounded-lg" rows="2" placeholder="Any special events or notes about this day"></textarea>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center">
                                        <i className="fas fa-plus mr-2"></i> Add Record
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeForm === 'menu' && (
                        <div id="menu-tab" className="tab-content card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Menu Items</h3>
                                <button className="text-xs bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-lg flex items-center">
                                    <i className="fas fa-plus mr-1"></i> Add Item
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Item</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        <tr className="table-row">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                        <i className="fas fa-hamburger text-yellow-400"></i>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium">Signature Burger</div>
                                                        <div className="text-xs text-gray-400">Beef patty with special sauce</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm">Main Course</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm">$12.99</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Pill status={'active'} text={'Available'} />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                                <button className="text-blue-400 hover:text-blue-300 mr-3">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-red-400 hover:text-red-300">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="table-row">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
                                                        <i className="fas fa-pizza-slice text-red-400"></i>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium">Margherita Pizza</div>
                                                        <div className="text-xs text-gray-400">Classic tomato and mozzarella</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm">Main Course</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm">$14.99</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Pill status={'active'} text={'Available'} />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                                <button className="text-blue-400 hover:text-blue-300 mr-3">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-red-400 hover:text-red-300">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="table-row">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                                        <i className="fas fa-leaf text-green-400"></i>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium">Caesar Salad</div>
                                                        <div className="text-xs text-gray-400">Romaine, croutons, parmesan</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm">Salad</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm">$9.99</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Pill status={'active'} text={'Available'} />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                                <button className="text-blue-400 hover:text-blue-300 mr-3">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-red-400 hover:text-red-300">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="table-row">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                        <i className="fas fa-coffee text-blue-400"></i>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium">Iced Coffee</div>
                                                        <div className="text-xs text-gray-400">Cold brew with milk</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm">Beverage</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm">$4.50</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Pill status={'critical'} text={'Out of Stock'} />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                                <button className="text-blue-400 hover:text-blue-300 mr-3">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-red-400 hover:text-red-300">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)} title="Nama Cabang Baru">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nama Cabang"
                            className="w-full px-4 py-2 border rounded"
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                        />
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Simpan Cabang
                        </button>
                    </div>
                </Modal>
            )}
            {/* {showModal && (
                <Modal onClose={() => setShowModal(false)} title="Nama Cabang Baru">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nama Cabang"
                            className="w-full px-4 py-2 border rounded"
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                        />
                        <button
                            onClick={handleSaveBranch}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Simpan Cabang
                        </button>
                    </div>
                </Modal>
            )} */}
        </>
    );
}

export default ManageBranchData;