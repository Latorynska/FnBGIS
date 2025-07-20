import { useRef, useState, useEffect } from "react";

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

const initialBranches = [
    {
        name: "Downtown Cafe",
        lat: -6.9175,
        lng: 107.6191,
        revenue: 15230,
        customers: 428,
        status: "active",
        area: [
            [-6.9160, 107.6180],
            [-6.9170, 107.6205],
            [-6.9185, 107.6198],
            [-6.9180, 107.6175],
            [-6.9170, 107.6170]
        ]
    },
    {
        name: "Riverside Bistro",
        lat: -6.9005,
        lng: 106.7980,
        revenue: 12450,
        customers: 387,
        status: "active",
        area: [
            [-6.8990, 106.7970],
            [-6.9000, 106.7995],
            [-6.9015, 106.7988],
            [-6.9010, 106.7965],
            [-6.9000, 106.7960]
        ]
    },
    {
        name: "Hillside Restaurant",
        lat: -6.8726,
        lng: 106.8230,
        revenue: 9870,
        customers: 298,
        status: "warning",
        area: [
            [-6.8711, 106.8220],
            [-6.8721, 106.8245],
            [-6.8736, 106.8238],
            [-6.8731, 106.8215],
            [-6.8721, 106.8210]
        ]
    },
    {
        name: "Northside Diner",
        lat: -7.2504,
        lng: 108.5696,
        revenue: 7650,
        customers: 245,
        status: "critical",
        area: [
            [-7.2489, 108.5686],
            [-7.2499, 108.5711],
            [-7.2514, 108.5704],
            [-7.2509, 108.5681],
            [-7.2499, 108.5676]
        ]
    },
    {
        name: "Coastal Grill",
        lat: -6.9744,
        lng: 108.6902,
        revenue: 13250,
        customers: 540,
        status: "active",
        area: [
            [-6.9729, 108.6892],
            [-6.9739, 108.6917],
            [-6.9754, 108.6910],
            [-6.9749, 108.6887],
            [-6.9739, 108.6882]
        ]
    },
    {
        name: "Mountain View Eatery",
        lat: -7.0917,
        lng: 107.9483,
        revenue: 11340,
        customers: 410,
        status: "active",
        area: [
            [-7.0902, 107.9473],
            [-7.0912, 107.9498],
            [-7.0927, 107.9491],
            [-7.0922, 107.9468],
            [-7.0912, 107.9463]
        ]
    },
    {
        name: "City Lights Cafe",
        lat: -6.9082,
        lng: 107.6037,
        revenue: 10720,
        customers: 315,
        status: "warning",
        area: [
            [-6.9067, 107.6027],
            [-6.9077, 107.6052],
            [-6.9092, 107.6045],
            [-6.9087, 107.6022],
            [-6.9077, 107.6017]
        ]
    },
    {
        name: "Lakeside Bistro",
        lat: -7.2089,
        lng: 108.2183,
        revenue: 8760,
        customers: 220,
        status: "critical",
        area: [
            [-7.2074, 108.2173],
            [-7.2084, 108.2198],
            [-7.2099, 108.2191],
            [-7.2094, 108.2168],
            [-7.2084, 108.2163]
        ]
    },
    {
        name: "Sunset Bar & Grill",
        lat: -6.7953,
        lng: 106.9287,
        revenue: 14230,
        customers: 520,
        status: "active",
        area: [
            [-6.7938, 106.9277],
            [-6.7948, 106.9302],
            [-6.7963, 106.9295],
            [-6.7958, 106.9272],
            [-6.7948, 106.9267]
        ]
    },
    {
        name: "Riverbend Cafe",
        lat: -6.9267,
        lng: 107.0153,
        revenue: 15780,
        customers: 460,
        status: "active",
        area: [
            [-6.9252, 107.0143],
            [-6.9262, 107.0168],
            [-6.9277, 107.0161],
            [-6.9272, 107.0138],
            [-6.9262, 107.0133]
        ]
    },
    {
        name: "Ngopi Cafe",
        revenue: 15780,
        customers: 460,
        status: "active",
    }
];

const ManageBranchData = () => {
    const [showModal, setShowModal] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');

    const [branches, setBranches] = useState(initialBranches);
    const [currentBranchesData, setCurrentBranchesData] = useState([]);
    const [branchForm, setbranchForm] = useState({});
    const [activeForm, setActiveForm] = useState('details');
    const [selectedPlace, setSelectedPlace] = useState(null);

    const [newPolygon, setNewPolygon] = useState(null);
    const mapRef = useRef(null);
    const drawControlRef = useRef(null);
    const drawnItemsRef = useRef(new L.FeatureGroup());
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

    const handleAddBranch = () => {
        const map = mapRef.current._leaflet_map_instance;
        if (drawControlRef.current) {
            map.addControl(drawControlRef.current);
            new L.Draw.Polygon(map, drawControlRef.current.options.draw.polygon).enable();
        }
    };

    const handleSaveBranch = () => {
        if (!newPolygon) return;
        const lat = newPolygon.latlngs[0][0];
        const lng = newPolygon.latlngs[0][1];
        const newBranch = {
            id: Date.now(),
            name: newBranchName || 'Cabang Baru',
            lat,
            lng,
            revenue: 0,
            customers: 0,
            status: 'active',
            area: newPolygon.latlngs,
        };
        setBranches(prev => [...prev, newBranch]);
        drawnItemsRef.current.addLayer(newPolygon.layer);
        setNewPolygon(null);
        setNewBranchName('');
        setShowModal(false);
    };

    const handleAddPoint = (branch) => {
        // Aktifkan draw marker mode khusus untuk branch ini
    };

    const handleEditPoint = (branch) => {
        // Biarkan user geser marker dan simpan posisi baru
    };

    const handleDeletePoint = (branch) => {
        // Hapus lat/lng dari branch ini
    };

    const handleAddArea = (branch) => {
        // Aktifkan draw polygon mode untuk branch ini
    };

    const handleEditArea = (branch) => {
        // Aktifkan edit polygon mode
    };

    const handleDeleteArea = (branch) => {
        // Kosongkan area dari branch ini
    };
    const getStatusText = (status) => {
        return status === 'active' ? 'Active' : status === 'warning' ? 'Needs Attention' : 'Critical';
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
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {currentBranchesData.map((branch) => {

                                        const hasCoordinates = typeof branch.lat === "number" && typeof branch.lng === "number";
                                        const hasArea = Array.isArray(branch.area) && branch.area.length > 0 && Array.isArray(branch.area[0]) && typeof branch.area[0][0] === "number" && typeof branch.area[0][1] === "number";

                                        return (
                                            <tr className="table-row" key={branch.name}>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                                            <i className="fas fa-store text-emerald-400"></i>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium">{branch.name}</div>
                                                            <div className="text-xs text-gray-400">{branch.address}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm">Main Street</div>
                                                    <div className="text-xs text-gray-400">1.2km radius</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm">${branch.revenue.toLocaleString()}</div>
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
                                                    <Pill status={branch.status} />
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
                                    {/* <tr className="table-row">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-store text-emerald-400"></i>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium">Downtown Cafe</div>
                                                    <div className="text-xs text-gray-400">#BR-001</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">Main Street</div>
                                            <div className="text-xs text-gray-400">1.2km radius</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">$15,230</div>
                                            <div className="text-xs text-emerald-400"><i className="fas fa-arrow-up mr-1"></i> 12%</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">428</div>
                                            <div className="text-xs text-emerald-400"><i className="fas fa-arrow-up mr-1"></i> 8%</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <Pill status="active" />
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
                                                    <i className="fas fa-store text-blue-400"></i>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium">Riverside Bistro</div>
                                                    <div className="text-xs text-gray-400">#BR-002</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">River Road</div>
                                            <div className="text-xs text-gray-400">0.8km radius</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">$12,450</div>
                                            <div className="text-xs text-emerald-400"><i className="fas fa-arrow-up mr-1"></i> 5%</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">387</div>
                                            <div className="text-xs text-emerald-400"><i className="fas fa-arrow-up mr-1"></i> 3%</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <Pill status="active" />
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
                                                <div className="flex-shrink-0 h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-store text-purple-400"></i>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium">Hillside Restaurant</div>
                                                    <div className="text-xs text-gray-400">#BR-003</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">Hilltop Avenue</div>
                                            <div className="text-xs text-gray-400">1.5km radius</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">$9,870</div>
                                            <div className="text-xs text-red-400"><i className="fas fa-arrow-down mr-1"></i> 2%</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">298</div>
                                            <div className="text-xs text-red-400"><i className="fas fa-arrow-down mr-1"></i> 5%</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <Pill status="warning" />
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
                                                    <i className="fas fa-store text-red-400"></i>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium">Northside Diner</div>
                                                    <div className="text-xs text-gray-400">#BR-004</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">North Boulevard</div>
                                            <div className="text-xs text-gray-400">1.0km radius</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">$7,650</div>
                                            <div className="text-xs text-red-400"><i className="fas fa-arrow-down mr-1"></i> 8%</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm">245</div>
                                            <div className="text-xs text-red-400"><i className="fas fa-arrow-down mr-1"></i> 12%</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <Pill status="critical" />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                            <button className="text-blue-400 hover:text-blue-300 mr-3">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr> */}
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
                            <h3 className="text-lg font-bold mb-4">Branch Information</h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Branch Name</label>
                                        <input type="text" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Branch Code</label>
                                        <input type="text" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Address</label>
                                    <input type="text" className="input-field w-full px-4 py-2 rounded-lg" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">City</label>
                                        <input type="text" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">State</label>
                                        <input type="text" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Zip Code</label>
                                        <input type="text" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                                        <input type="tel" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                                        <input type="email" className="input-field w-full px-4 py-2 rounded-lg" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Manager</label>
                                        <select className="input-field w-full px-4 py-2 rounded-lg" readOnly>
                                            <option>John Smith</option>
                                            <option>Sarah Johnson</option>
                                            <option>Michael Brown</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Status</label>
                                        <select className="input-field w-full px-4 py-2 rounded-lg">
                                            <option>Active</option>
                                            <option>Inactive</option>
                                            <option>Under Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea className="input-field w-full px-4 py-2 rounded-lg" rows="3"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Pilih Lokasi Cabang</label>
                                    <GooglePlaceAutocomplete
                                        onPlaceSelected={(place) => {
                                            setSelectedPlace(place);
                                            setbranchForm(prev => ({
                                                ...prev,
                                                placeId: place.place_id,
                                                placeName: place.name,
                                                placeAddress: place.formatted_address,
                                                lat: place.geometry?.location?.lat(),
                                                lng: place.geometry?.location?.lng()
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button type="button" className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center">
                                        <i className="fas fa-save mr-2"></i> Save Changes
                                    </button>
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