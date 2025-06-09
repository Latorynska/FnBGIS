import { useEffect, useState } from 'react';
import { toggleSidebar } from '../../redux/slices/usabilitySlices';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const routeTitles = {
        '/dashboard': 'Dashboard',
        '/manage-branch-data': 'Data Cabang',
        '/manage-brand-information': 'Brand Data',
        '/manage-map-metadata': 'Metadata Lokasi'
    };
    const pageTitle = routeTitles[location.pathname] || 'Halaman';
    const dispatch = useDispatch();
    return (
        <header className="bg-gray-900 bg-opacity-80 border-b border-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button className="sidebar-toggle p-2 rounded-lg hover:bg-gray-800" onClick={() => dispatch(toggleSidebar())}>
                    <i className="fas fa-bars"></i>
                </button>
                <h2 className="text-xl font-bold">{pageTitle}</h2>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input type="text" placeholder="Search..." className="input-field pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-400 text-sm" />
                    <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-800 relative">
                    <i className="fas fa-bell"></i>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
