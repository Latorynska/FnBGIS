import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import Chart from 'chart.js/auto';
import 'leaflet/dist/leaflet.css';
import RevenueChart from '../../charts/RevenueChart';
import TrafficChart from '../../charts/TrafficChart';
import './dashboard.css';
import StatisticCard from '../../components/StatisticCard/StatisticCard';
import Pill from '../../components/Pill/Pill';



const Dashboard = () => {
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
    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: branches.map(b => b.name),
                datasets: [
                    {
                        label: 'Revenue',
                        data: branches.map(b => b.revenue),
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(239, 68, 68, 0.7)'
                        ],
                        borderColor: [
                            'rgba(16, 185, 129, 1)',
                            'rgba(59, 130, 246, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(239, 68, 68, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return `Revenue: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [branches]);

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
                <div>
                    <div className="card p-4 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Top Performing Branches</h3>
                            <select className="input-field text-xs px-2 py-1 rounded-lg focus:outline-none">
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>This Quarter</option>
                            </select>
                        </div>
                        <div className="h-96">
                            <canvas id="performanceChart" ref={chartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>
            {/* branch list */}
            <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">All Branches</h3>
                    <div className="flex space-x-2">
                        <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg flex items-center">
                            <i className="fas fa-filter mr-1"></i> Filter
                        </button>
                        <button className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg flex items-center">
                            <i className="fas fa-download mr-1"></i> Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Branch</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customers</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            <tr className="table-row">
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
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-400">Showing 1 to 4 of 24 branches</div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm">
                            Previous
                        </button>
                        <button className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm">
                            1
                        </button>
                        <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm">
                            2
                        </button>
                        <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm">
                            3
                        </button>
                        <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
