import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const isVisible = useSelector((state) => state.usability.isSidebarVisible);

    if (!isVisible) return null;
    return ( 
        <>
        <div className="sidebar w-64 bg-gray-900 bg-opacity-80 flex-shrink-0 border-r border-gray-800 flex flex-col">
            <div className="p-4 flex items-center space-x-3 border-b border-gray-800">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-map-marked-alt text-white"></i>
                </div>
                <h1 className="text-xl font-bold">FnB GIS</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <Link to="/dashboard" className={`sidebar-item flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard') ? 'active-sidebar-item' : ''}`}>
                    <i className="fas fa-tachometer-alt w-5 text-center text-emerald-400"></i>
                    <span>Dashboard</span>
                </Link>
                {/* <Link to="manage-branch-area" className={`sidebar-item flex items-center space-x-3 p-3 rounded-lg ${isActive('/manage-branch-area') ? 'active-sidebar-item' : ''}`}>
                    <i className="fas fa-map-marked w-5 text-center text-yellow-400"></i>
                    <span>Area Cabang</span>
                </Link> */}
                <Link to="manage-branch-data" className={`sidebar-item flex items-center space-x-3 p-3 rounded-lg ${isActive('/manage-branch-data') ? 'active-sidebar-item' : ''}`}>
                    <i className="fas fa-store w-5 text-center text-blue-400"></i>
                    <span>Data Cabang</span>
                </Link>
                <Link to="manage-brand-information" className={`sidebar-item flex items-center space-x-3 p-3 rounded-lg ${isActive('/manage-brand-information') ? 'active-sidebar-item' : ''}`}>
                    {/* <i className="fas fa-users w-5 text-center text-pink-400"></i> */}
                    <i className="fas fa-trademark w-5 text-center text-red-400"></i>
                    <span>Brand Data</span>
                </Link>
                <Link to="manage-map-metadata" className={`sidebar-item flex items-center space-x-3 p-3 rounded-lg ${isActive('/manage-map-metadata') ? 'active-sidebar-item' : ''}`}>
                    {/* <i className="fas fa-users w-5 text-center text-pink-400"></i> */}
                    <i className="fas fa-landmark-flag w-5 text-center text-blue-400"></i>
                    <span>Map Metadata</span>
                </Link>
                {/* <Link to="#" className="sidebar-item flex items-center space-x-3 p-3 rounded-lg">
                    <i className="fas fa-chart-line w-5 text-center text-purple-400"></i>
                    <span>Performance</span>
                </Link>
                <Link to="#" className="sidebar-item flex items-center space-x-3 p-3 rounded-lg">
                    <i className="fas fa-map-marked w-5 text-center text-yellow-400"></i>
                    <span>Coverage Areas</span>
                </Link> */}
                <Link to="#" className="sidebar-item flex items-center space-x-3 p-3 rounded-lg">
                    <i className="fas fa-cog w-5 text-center text-gray-400"></i>
                    <span>Settings</span>
                </Link>
            </div>
            
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <i className="fas fa-user text-gray-300"></i>
                    </div>
                    <div>
                        <div className="font-medium">Admin User</div>
                        <div className="text-xs text-gray-400">admin@fnb.gis.com</div>
                    </div>
                </div>
                <button className="mt-4 w-full py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm flex items-center justify-center space-x-2">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
        </>
     );
}
 
export default Sidebar;