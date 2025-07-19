import { useEffect, useState } from 'react';
import './ManageBrandInformation.css';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands, saveBrand, updateBrand } from '../../redux/thunks/brandThunks';
import { FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CardLoadingOverlay from '../../components/CardLoadingOverlay/CardLoadingOverlay';




const ManageBrandInformation = () => {
    const dispatch = useDispatch();
    const [activeTab, setactiveTab] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [brand, setBrand] = useState({
        nama: '',
        kategori: '',
        kode: '',
        deskripsi: '',
        website: '',
        email: '',
        logoFile: null,
        iconUrl: '',
    });

    const { items: brands, loading, error } = useSelector(state => state.brand);
    const { uid } = useSelector(state => state.auth);


    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    useEffect(() => {
        if (brands.length > 0) {
            setBrand(brands[0]);
        }
    }, [brands]);

    const handleSaveBrand = (e) => {
        e.preventDefault();
        const brandData = {
            nama: brand.nama,
            kategori: brand.kategori,
            deskripsi: brand.deskripsi,
            website: brand.website,
            email: brand.email,
            logoFile: brand.logoFile || null,
            prevIconUrl: brand.iconUrl || null,
        };

        if (brand.id) {
            dispatch(updateBrand({ id: brand.id, data: brandData }));
        } else {
            dispatch(saveBrand(brandData));
        }

        setBrand({ ...brand, logoFile: null });
    };

    return (
        <>
            {/* specialty list */}
            <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Brand Specialty</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="brand-card cursor-pointer p-4 rounded-lg border border-gray-700 hover:border-emerald-500 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <i className="fas fa-coffee text-emerald-400"></i>
                            </div>
                            <div>
                                <div className="font-medium">Urban Brew</div>
                                <div className="text-xs text-gray-400">Coffee & Cafe</div>
                            </div>
                        </div>
                    </div>
                    <div className="brand-card cursor-pointer p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <i className="fas fa-hamburger text-blue-400"></i>
                            </div>
                            <div>
                                <div className="font-medium">Burger Junction</div>
                                <div className="text-xs text-gray-400">Fast Food</div>
                            </div>
                        </div>
                    </div>
                    <div className="brand-card cursor-pointer p-4 rounded-lg border border-gray-700 hover:border-red-500 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                <i className="fas fa-pizza-slice text-red-400"></i>
                            </div>
                            <div>
                                <div className="font-medium">Pizza Palace</div>
                                <div className="text-xs text-gray-400">Italian</div>
                            </div>
                        </div>
                    </div>
                    <div className="brand-card cursor-pointer p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                <i className="fas fa-ice-cream text-yellow-400"></i>
                            </div>
                            <div>
                                <div className="font-medium">Sweet Treats</div>
                                <div className="text-xs text-gray-400">Desserts</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* brand data information */}
                <div className="card p-6">
                    <CardLoadingOverlay isVisible={loading} />
                    <h3 className="text-lg font-bold mb-4">Brand Information</h3>
                    <form className="space-y-4" onSubmit={handleSaveBrand}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    className="input-field w-full px-4 py-2 rounded-lg"
                                    value={brand.nama || ''}
                                    onChange={(e) => setBrand({ ...brand, nama: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Brand Logo</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                    {brand.logoFile ? (
                                        <img src={URL.createObjectURL(brand.logoFile)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : brand?.iconUrl ? (
                                        <img src={brand.iconUrl} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaImage className="text-gray-400 text-3xl" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="brand-logo-input"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setBrand({ ...brand, logoFile: file });
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg"
                                    onClick={() => document.getElementById('brand-logo-input').click()}
                                >
                                    Change Logo
                                </button>
                            </div>
                        </div>

                        <div>
                            <Select
                                label={'category'}
                                value={brand.kategori}
                                onChange={(e) => { setBrand({ ...brand, kategori: e.target.value }) }}
                                options={[
                                    { label: "Coffee & Cafe", value: "cafe" },
                                    { label: "Fast Food", value: "fastfood" },
                                    { label: "Restaurant", value: "restaurant" }
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                className="input-field w-full px-4 py-2 rounded-lg"
                                rows="3"
                                value={brand.deskripsi || ''}
                                onChange={(e) => setBrand({ ...brand, deskripsi: e.target.value })}
                            >

                            </textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Website</label>
                                <input
                                    type="url"
                                    className="input-field w-full px-4 py-2 rounded-lg"
                                    value={brand.website || ''}
                                    onChange={(e) => setBrand({ ...brand, website: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    className="input-field w-full px-4 py-2 rounded-lg"
                                    value={brand.email || ''}
                                    onChange={(e) => setBrand({ ...brand, email: e.target.value })}
                                />
                            </div>
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
                {/* menu items */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Menu Items</h3>
                        <Button variant="primary" size="small" icon="fas fa-plus" onClick={() => setShowModal(true)}>
                            Add New Menu
                        </Button>
                    </div>

                    {/* category tab */}
                    <div className="flex border-b border-gray-700 mb-4">
                        <button className={`tab-button px-4 py-2 text-sm font-medium ${activeTab === 'all' && 'active'}`} onClick={() => setactiveTab('all')}>
                            <i className="fas fa-list mr-2"></i> All
                        </button>
                        <button className={`tab-button px-4 py-2 text-sm font-medium ${activeTab === 'beverages' && 'active'}`} onClick={() => setactiveTab('beverages')}>
                            <i className="fas fa-coffee mr-2"></i> Beverages
                        </button>
                        <button className={`tab-button px-4 py-2 text-sm font-medium ${activeTab === 'food' && 'active'}`} onClick={() => setactiveTab('food')}>
                            <i className="fas fa-utensils mr-2"></i> Food
                        </button>
                        <button className={`tab-button px-4 py-2 text-sm font-medium ${activeTab === 'dessert' && 'active'}`} onClick={() => setactiveTab('dessert')}>
                            <i className="fas fa-ice-cream mr-2"></i> Desserts
                        </button>
                    </div>

                    {/* menu item list */}
                    <div className="overflow-y-auto" style={{ maxHeight: "480px" }}>
                        {activeTab === 'all' && (
                            <div className="space-y-3">
                                {/* beverage */}
                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-coffee text-blue-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Espresso</div>
                                                <div className="text-xs text-gray-400">Strong black coffee</div>
                                                <div className="mt-1 text-sm text-emerald-400">$3.50</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-mug-hot text-blue-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Cappuccino</div>
                                                <div className="text-xs text-gray-400">Espresso with steamed milk</div>
                                                <div className="mt-1 text-sm text-emerald-400">$4.50</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-glass-whiskey text-blue-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Iced Latte</div>
                                                <div className="text-xs text-gray-400">Cold coffee with milk</div>
                                                <div className="mt-1 text-sm text-emerald-400">$4.75</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* food items */}
                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-bread-slice text-yellow-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Avocado Toast</div>
                                                <div className="text-xs text-gray-400">Sourdough with avocado and eggs</div>
                                                <div className="mt-1 text-sm text-emerald-400">$8.50</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-cheese text-yellow-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Breakfast Sandwich</div>
                                                <div className="text-xs text-gray-400">Egg, cheese and bacon on croissant</div>
                                                <div className="mt-1 text-sm text-emerald-400">$7.25</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* desert */}
                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-cookie text-pink-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Chocolate Croissant</div>
                                                <div className="text-xs text-gray-400">Buttery pastry with chocolate</div>
                                                <div className="mt-1 text-sm text-emerald-400">$3.75</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-ice-cream text-pink-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Tiramisu</div>
                                                <div className="text-xs text-gray-400">Coffee-flavored Italian dessert</div>
                                                <div className="mt-1 text-sm text-emerald-400">$5.50</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'beverages' && (
                            <div className="space-y-3">
                                {/* beverage */}
                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-coffee text-blue-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Espresso</div>
                                                <div className="text-xs text-gray-400">Strong black coffee</div>
                                                <div className="mt-1 text-sm text-emerald-400">$3.50</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-mug-hot text-blue-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Cappuccino</div>
                                                <div className="text-xs text-gray-400">Espresso with steamed milk</div>
                                                <div className="mt-1 text-sm text-emerald-400">$4.50</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-glass-whiskey text-blue-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Iced Latte</div>
                                                <div className="text-xs text-gray-400">Cold coffee with milk</div>
                                                <div className="mt-1 text-sm text-emerald-400">$4.75</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'food' && (
                            <div className="space-y-3">
                                {/* food items */}
                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-bread-slice text-yellow-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Avocado Toast</div>
                                                <div className="text-xs text-gray-400">Sourdough with avocado and eggs</div>
                                                <div className="mt-1 text-sm text-emerald-400">$8.50</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-cheese text-yellow-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Breakfast Sandwich</div>
                                                <div className="text-xs text-gray-400">Egg, cheese and bacon on croissant</div>
                                                <div className="mt-1 text-sm text-emerald-400">$7.25</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'dessert' && (
                            <div className="space-y-3">
                                {/* desert */}
                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-cookie text-pink-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Chocolate Croissant</div>
                                                <div className="text-xs text-gray-400">Buttery pastry with chocolate</div>
                                                <div className="mt-1 text-sm text-emerald-400">$3.75</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-ice-cream text-pink-400"></i>
                                            </div>
                                            <div>
                                                <div className="font-medium">Tiramisu</div>
                                                <div className="text-xs text-gray-400">Coffee-flavored Italian dessert</div>
                                                <div className="mt-1 text-sm text-emerald-400">$5.50</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300 p-1">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300 p-1">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showModal && (
                <Modal onClose={() => setShowModal(false)} title="New Menu Item">
                    <div className="space-y-4">
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Item Name</label>
                                    <input type="text" className="input-field w-full px-4 py-2 rounded-lg" placeholder="e.g. Espresso" />
                                </div>
                                <div>
                                    <Select
                                        label={'category'}
                                        value={''}
                                        onChange={(e) => { }}
                                        options={[
                                            { label: "Coffee & Cafe", value: "coffee" },
                                            { label: "Fast Food", value: "fastfood" },
                                            { label: "Restaurant", value: "restaurant" },
                                            { label: "Desserts", value: "desserts" },
                                            { label: "Beverages", value: "beverages" }]
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea className="input-field w-full px-4 py-2 rounded-lg" rows="2" placeholder="Brief description of the item"></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                                    <input type="number" step="0.01" className="input-field w-full px-4 py-2 rounded-lg" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Preparation Time</label>
                                    <input type="number" className="input-field w-full px-4 py-2 rounded-lg" placeholder="Minutes" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Calories</label>
                                    <input type="number" className="input-field w-full px-4 py-2 rounded-lg" placeholder="kcal" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Item Image</label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center">
                                        <i className="fas fa-image text-gray-400"></i>
                                    </div>
                                    <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg">
                                        Upload Image
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button variant="neutral" size="large" onClick={() => setShowModal(prev => !prev)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" icon="fas fa-save mr-2" size="large" onClick={() => setShowModal(prev => !prev)}>
                                    Save Item
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default ManageBrandInformation;