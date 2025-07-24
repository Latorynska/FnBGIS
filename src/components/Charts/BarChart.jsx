import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { centerOfMass } from '@turf/turf';

import { point, polygon } from '@turf/helpers';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ category }) => {
  const { items: branches, loading: loadingBranch } = useSelector(state => state.branch);
  const { items: daerahs } = useSelector((state) => state.daerah);
  const colors = [
    'rgba(16, 185, 129, 0.7)',
    'rgba(59, 130, 246, 0.7)',
    'rgba(245, 158, 11, 0.7)',
    'rgba(239, 68, 68, 0.7)'
  ];
  const borderColors = [
    'rgba(16, 185, 129, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)'
  ];

  const getDaerahByContainment = (centroid, daerahList) => {
    const pt = point(centroid);

    for (const daerah of daerahList) {
      if (!daerah.area?.length) continue;

      const poly = polygon([daerah.area]);
      if (booleanPointInPolygon(pt, poly)) return daerah;
    }

    return null;
  };
  const getLatestPeriod = (penjualanObj = {}) => {
    const periods = Object.keys(penjualanObj);
    if (periods.length === 0) return null;
    return periods.sort().pop();
  };

  const calculateDataByCategory = () => {
    switch (category) {
      case "Penjualan Terakhir":
        return branches.map(branch => {
          const latestPeriod = getLatestPeriod(branch.penjualan);
          const latestData = latestPeriod ? branch.penjualan[latestPeriod] : null;
          return {
            name: branch.nama,
            value: Math.round((latestData?.totalPendapatan || 0) / 1_000_000)
          };
        });

      case "Peningkatan Penjualan":
        return branches.map(branch => {
          const periods = Object.keys(branch.penjualan || {}).sort();
          if (periods.length < 2) return { name: branch.nama, value: 0 };
          const last = branch.penjualan[periods[periods.length - 1]]?.totalPendapatan || 0;
          const prev = branch.penjualan[periods[periods.length - 2]]?.totalPendapatan || 0;
          return {
            name: branch.nama,
            value: Math.round((last - prev) / 1_000_000)
          };
        });

      case "Rata-rata Pendapatan Bulanan":
        return branches.map(branch => {
          const data = Object.values(branch.penjualan || {});
          const avg = data.length > 0
            ? data.reduce((acc, cur) => acc + cur.totalPendapatan, 0) / data.length
            : 0;
          return { name: branch.nama, value: Math.round(avg / 1_000_000) };
        });

      case "Total Transaksi Bulanan":
        return branches.map(branch => {
          const data = Object.values(branch.penjualan || {});
          const avg = data.length > 0
            ? data.reduce((acc, cur) => acc + cur.totalTransaksi, 0) / data.length
            : 0;
          return { name: branch.nama, value: Math.round(avg) };
        });

      case "Menu Terlaris per Cabang":
        return branches.map(branch => {
          const detailMenus = Object.values(branch.penjualan || {}).flatMap(p => Object.entries(p.detail || {}));
          const counter = {};
          detailMenus.forEach(([menuId, qty]) => {
            counter[menuId] = (counter[menuId] || 0) + qty;
          });
          const bestMenu = Object.entries(counter).sort((a, b) => b[1] - a[1])[0];
          return {
            name: branch.nama,
            value: bestMenu?.[1] || 0
          };
        });

      case "Kontribusi Cabang terhadap Brand":
        const totalAll = branches.reduce((acc, b) => {
          const data = Object.values(b.penjualan || {});
          return acc + data.reduce((sum, cur) => sum + cur.totalPendapatan, 0);
        }, 0);
        return branches.map(branch => {
          const totalBranch = Object.values(branch.penjualan || {}).reduce((sum, cur) => sum + cur.totalPendapatan, 0);
          const percent = totalAll > 0 ? (totalBranch / totalAll) * 100 : 0;
          return {
            name: branch.nama,
            value: Math.round(percent)
          };
        });
      case "Rating Maps":
        return branches.map(branch => ({
          name: branch.nama,
          value: branch.rating ?? 0 // gunakan 0 jika undefined atau null
        }));
      case "Overall Performance":
        const getMax = (arr, fn) => Math.max(...arr.map(fn));

        const maxLastSales = getMax(branches, b => {
          const latestPeriod = getLatestPeriod(b.penjualan);
          return latestPeriod ? b.penjualan[latestPeriod]?.totalPendapatan || 0 : 0;
        });

        const maxSalesGrowth = getMax(branches, b => {
          const periods = Object.keys(b.penjualan || {}).sort();
          if (periods.length < 2) return 0;
          const last = b.penjualan[periods[periods.length - 1]]?.totalPendapatan || 0;
          const prev = b.penjualan[periods[periods.length - 2]]?.totalPendapatan || 0;
          return last - prev;
        });

        const maxAvgRevenue = getMax(branches, b => {
          const data = Object.values(b.penjualan || {});
          return data.length > 0
            ? data.reduce((acc, cur) => acc + cur.totalPendapatan, 0) / data.length
            : 0;
        });

        const maxAvgTrans = getMax(branches, b => {
          const data = Object.values(b.penjualan || {});
          return data.length > 0
            ? data.reduce((acc, cur) => acc + cur.totalTransaksi, 0) / data.length
            : 0;
        });

        const maxRating = getMax(branches, b => b.rating ?? 0);

        return branches.map(branch => {
          const latestPeriod = getLatestPeriod(branch.penjualan);
          const latest = latestPeriod ? branch.penjualan[latestPeriod]?.totalPendapatan || 0 : 0;

          const periods = Object.keys(branch.penjualan || {}).sort();
          const last = periods.length > 1 ? branch.penjualan[periods[periods.length - 1]]?.totalPendapatan || 0 : 0;
          const prev = periods.length > 1 ? branch.penjualan[periods[periods.length - 2]]?.totalPendapatan || 0 : 0;
          const growth = last - prev;

          const avgRevenue = (() => {
            const data = Object.values(branch.penjualan || {});
            return data.length > 0
              ? data.reduce((acc, cur) => acc + cur.totalPendapatan, 0) / data.length
              : 0;
          })();

          const avgTrans = (() => {
            const data = Object.values(branch.penjualan || {});
            return data.length > 0
              ? data.reduce((acc, cur) => acc + cur.totalTransaksi, 0) / data.length
              : 0;
          })();

          const rating = branch.rating ?? 0;

          const score =
            (latest / maxLastSales) * 30 +
            (growth / maxSalesGrowth) * 25 +
            (avgRevenue / maxAvgRevenue) * 20 +
            (avgTrans / maxAvgTrans) * 15 +
            (rating / maxRating) * 10;

          return {
            name: branch.nama,
            value: Math.round(score)
          };
        });
      case "Serapan Potensi": {
        const getCentroid = (area) => {
          if (!Array.isArray(area) || area.length < 3) return [0, 0];

          try {
            const coords = area.map(([lat, lng]) => [lng, lat]);
            const isClosed = JSON.stringify(coords[0]) === JSON.stringify(coords[coords.length - 1]);
            const closedCoords = isClosed ? coords : [...coords, coords[0]];
            const poly = polygon([closedCoords]);
            const center = centerOfMass(poly);
            return center.geometry.coordinates.reverse(); // [lat, lng]
          } catch (error) {
            console.warn("Gagal hitung centroid untuk polygon:", error);
            return [0, 0];
          }
        };

        const getDaerahByContainment = (centroid, daerahList) => {
          const pt = point(centroid);

          for (const daerah of daerahList) {
            if (!Array.isArray(daerah.area) || daerah.area.length < 3) continue;

            try {
              const coords = daerah.area.map(([lat, lng]) => [lng, lat]);
              const isClosed = JSON.stringify(coords[0]) === JSON.stringify(coords[coords.length - 1]);
              const closedCoords = isClosed ? coords : [...coords, coords[0]];
              const poly = polygon([closedCoords]);

              if (booleanPointInPolygon(pt, poly)) {
                return daerah;
              }
            } catch (error) {
              console.warn(`Polygon error pada daerah ${daerah.nama}:`, error);
              continue;
            }
          }

          return null;
        };

        const getClosestRegion = (centroid, daerahList) => {
          const distance = (a, b) => {
            const dLat = a[0] - b[0];
            const dLng = a[1] - b[1];
            return Math.sqrt(dLat * dLat + dLng * dLng);
          };

          let closest = null;
          let minDist = Infinity;

          daerahList.forEach((daerah) => {
            const daerahCentroid = getCentroid(daerah.area);
            const dist = distance(centroid, daerahCentroid);
            if (dist < minDist) {
              minDist = dist;
              closest = daerah;
            }
          });

          return closest;
        };

        const clean = (val) =>
          parseFloat((val || "0").toString().replace(/[^\d]/g, '')) || 0;

        const allPeriods = branches.flatMap((branch) =>
          Object.keys(branch.penjualan || {})
        );
        const latestPeriod = allPeriods.sort().reverse()[0];

        return branches.map((branch) => {
          const centroid = getCentroid(branch.area);
          const daerahUtama =
            getDaerahByContainment(centroid, daerahs) ||
            getClosestRegion(centroid, daerahs);

          if (!daerahUtama) {
            console.warn(`Tidak ditemukan daerah untuk branch: ${branch.nama}`);
          }

          const umk = clean(daerahUtama?.umr);
          const penduduk = clean(daerahUtama?.jmlPenduduk);
          const persenTarget = 0.03; // persentase harapan pelanggan per daerah
          const rata2Belanja = umk * 0.1; // 10% dari UMR per orang per bulan

          const targetOrang = penduduk * persenTarget;
          const potensiDaerah = targetOrang * rata2Belanja;

          const data = branch.penjualan?.[latestPeriod];
          const totalPendapatan = data?.totalPendapatan || 0;

          const serapan = potensiDaerah > 0 ? (totalPendapatan / potensiDaerah) * 100 : 0;

          console.log(branch.penjualan);
          console.log(potensiDaerah + ' / ' + totalPendapatan);
          console.log(serapan);
          // console.log(
          //   `${branch.nama} => centroid: ${centroid} => daerah: ${daerahUtama?.nama} => serapan: ${serapan.toFixed(2)}%`
          // );

          return {
            name: branch.nama,
            value: parseFloat(serapan.toFixed(2)), // tampilkan hingga 2 desimal
          };
        });
      }

      default:
        return branches.map(branch => ({
          name: branch.nama,
          value: 0
        }));
    }
  };

  const chartData = useMemo(() => {
    const dataset = calculateDataByCategory();
    console.log(dataset);
    return {
      labels: dataset.map(d => d.name),
      datasets: [
        {
          label: category,
          data: dataset.map(d => d.value),
          backgroundColor: dataset.map((_, i) => colors[i % colors.length]),
          borderColor: dataset.map((_, i) => borderColors[i % borderColors.length]),
          borderWidth: 1,
          borderRadius: 6,
        }
      ]
    };
  }, [branches, category]);

  const options = {
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
          label: (context) => {
            const val = context.raw;
            switch (category) {
              case "Penjualan Terakhir":
              case "Peningkatan Penjualan":
              case "Rata-rata Pendapatan Bulanan":
                return `${category}: Rp ${val.toLocaleString()} jt`;
              case "Total Transaksi Bulanan":
              case "Menu Terlaris per Cabang":
                return `${category}: ${val.toLocaleString()} transaksi`;
              case "Kontribusi Cabang terhadap Brand":
                return `${category}: ${val}% dari total`;
              default:
                return `${category}: ${val}`;
            }
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
          callback: (value) => `${value.toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;