import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import Chart from 'chart.js/auto';
import 'leaflet/dist/leaflet.css';
import Button from '../../components/Button/Button';
const ManageBranch = () => {
    const branches = [
        {
            name: "Downtown Cafe",
            lat: -6.9175, // Bandung
            lng: 107.6191,
            revenue: 15230,
            customers: 428,
            status: "active",
            radius: 1200
        },
        {
            name: "Riverside Bistro",
            lat: -6.9005, // Bogor
            lng: 106.7980,
            revenue: 12450,
            customers: 387,
            status: "active",
            radius: 800
        },
        {
            name: "Hillside Restaurant",
            lat: -6.8726, // Depok
            lng: 106.8230,
            revenue: 9870,
            customers: 298,
            status: "warning",
            radius: 1500
        },
        {
            name: "Northside Diner",
            lat: -7.2504, // Cirebon
            lng: 108.5696,
            revenue: 7650,
            customers: 245,
            status: "critical",
            radius: 1000
        },
        {
            name: "Coastal Grill",
            lat: -6.9744, // Pangandaran
            lng: 108.6902,
            revenue: 13250,
            customers: 540,
            status: "active",
            radius: 1500
        },
        {
            name: "Mountain View Eatery",
            lat: -7.0917, // Garut
            lng: 107.9483,
            revenue: 11340,
            customers: 410,
            status: "active",
            radius: 1100
        },
        {
            name: "City Lights Cafe",
            lat: -6.9082, // Cimahi
            lng: 107.6037,
            revenue: 10720,
            customers: 315,
            status: "warning",
            radius: 900
        },
        {
            name: "Lakeside Bistro",
            lat: -7.2089, // Tasikmalaya
            lng: 108.2183,
            revenue: 8760,
            customers: 220,
            status: "critical",
            radius: 1300
        },
        {
            name: "Sunset Bar & Grill",
            lat: -6.7953, // Sukabumi
            lng: 106.9287,
            revenue: 14230,
            customers: 520,
            status: "active",
            radius: 1400
        },
        {
            name: "Riverbend Cafe",
            lat: -6.9267, // Bekasi
            lng: 107.0153,
            revenue: 15780,
            customers: 460,
            status: "active",
            radius: 1100
        }
    ];
    const mapRef = useRef(null);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    // mapping data kedalam map leaflet
    useEffect(() => {
        if (mapRef.current && !mapRef.current._leaflet_map_instance) {
            const map = L.map(mapRef.current).setView([-6.9175, 107.6191], 12);
            mapRef.current._leaflet_map_instance = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            branches.forEach(branch => {
                // Determine marker color based on status
                let markerColor;
                if (branch.status === "active") markerColor = "#10B981";
                else if (branch.status === "warning") markerColor = "#F59E0B";
                else markerColor = "#EF4444";

                // Create marker with custom icon
                const marker = L.marker([branch.lat, branch.lng], {
                    icon: L.divIcon({
                        html: `<div style="color: ${markerColor}; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>`,
                        className: 'map-marker-icon',
                        iconSize: [24, 24],
                        iconAnchor: [12, 24]
                    })
                }).addTo(map);

                // Add circle for coverage area
                L.circle([branch.lat, branch.lng], {
                    color: markerColor,
                    fillColor: markerColor,
                    fillOpacity: 0.2,
                    radius: branch.radius
                }).addTo(map);

                // Add popup with branch info
                marker.bindPopup(`
                <div class="text-white">
                    <h3 class="font-bold mb-1">${branch.name}</h3>
                    <div class="text-sm mb-2">Revenue: $${branch.revenue.toLocaleString()}</div>
                    <div class="text-sm mb-2">Customers: ${branch.customers}</div>
                    <div class="text-xs ${branch.status === "active" ? "text-emerald-400" : branch.status === "warning" ? "text-yellow-400" : "text-red-400"}">
                        ${branch.status === "active" ? "Active" : branch.status === "warning" ? "Needs Attention" : "Critical"}
                    </div>
                </div>
            `);
            });
        }

    }, []);
    // mapping data ke chart performa cabang
    // useEffect(() => {
    //     const ctx = chartRef.current.getContext('2d');
    //     if (chartInstanceRef.current) {
    //         chartInstanceRef.current.destroy();
    //     }

    //     chartInstanceRef.current = new Chart(ctx, {
    //         type: 'bar',
    //         data: {
    //             labels: branches.map(b => b.name),
    //             datasets: [
    //                 {
    //                     label: 'Revenue',
    //                     data: branches.map(b => b.revenue),
    //                     backgroundColor: [
    //                         'rgba(16, 185, 129, 0.7)',
    //                         'rgba(59, 130, 246, 0.7)',
    //                         'rgba(245, 158, 11, 0.7)',
    //                         'rgba(239, 68, 68, 0.7)'
    //                     ],
    //                     borderColor: [
    //                         'rgba(16, 185, 129, 1)',
    //                         'rgba(59, 130, 246, 1)',
    //                         'rgba(245, 158, 11, 1)',
    //                         'rgba(239, 68, 68, 1)'
    //                     ],
    //                     borderWidth: 1
    //                 }
    //             ]
    //         },
    //         options: {
    //             responsive: true,
    //             maintainAspectRatio: false,
    //             plugins: {
    //                 legend: {
    //                     display: false
    //                 },
    //                 tooltip: {
    //                     backgroundColor: 'rgba(17, 24, 39, 0.9)',
    //                     titleColor: '#fff',
    //                     bodyColor: '#fff',
    //                     borderColor: 'rgba(255, 255, 255, 0.1)',
    //                     borderWidth: 1,
    //                     displayColors: false,
    //                     callbacks: {
    //                         label: function (context) {
    //                             return `Revenue: $${context.raw.toLocaleString()}`;
    //                         }
    //                     }
    //                 }
    //             },
    //             scales: {
    //                 x: {
    //                     grid: {
    //                         display: false,
    //                         drawBorder: false
    //                     },
    //                     ticks: {
    //                         color: 'rgba(255, 255, 255, 0.7)'
    //                     }
    //                 },
    //                 y: {
    //                     grid: {
    //                         color: 'rgba(255, 255, 255, 0.1)',
    //                         drawBorder: false
    //                     },
    //                     ticks: {
    //                         color: 'rgba(255, 255, 255, 0.7)',
    //                         callback: function (value) {
    //                             return '$' + value.toLocaleString();
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     });
    //     return () => {
    //         if (chartInstanceRef.current) {
    //             chartInstanceRef.current.destroy();
    //         }
    //     };
    // }, [branches]);
    return (
        <>
            {/* map and chart section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="card p-4 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Branch Locations</h3>
                            <div className="flex space-x-2">
                                <button className="text-xs bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-lg flex items-center">
                                    <i className="fas fa-plus mr-1"></i> Add Branch
                                </button>
                                <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg flex items-center">
                                    <i className="fas fa-layer-group mr-1"></i> Layers
                                </button>
                            </div>
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
                {/* branch list */}
                <div>
                    <div className="card p-4 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">List Cabang</h3>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="primary" size="small" icon="fas fa-plus" onClick={() => console.log('Add Branch')}>
                                Tambah Area Cabang
                            </Button>
                            <Button variant="warning" size='small' icon="fas fa-edit">
                                Ubah Area Cabang
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageBranch;