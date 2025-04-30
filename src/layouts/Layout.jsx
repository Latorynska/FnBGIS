import { Outlet } from 'react-router-dom';
import { useEffect } from "react";
import Header from "../components/Header/Header";
import './Layout.css';
import Sidebar from "../components/Sidebar/Sidebar";

const Layout = () => {
    return (
        <>
            <div className="bg-pattern"></div>
            <div className="text-white relative z-10">
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <div className="flex-1 overflow-auto">
                        <Header />
                        <main className="p-6 space-y-6">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Layout;