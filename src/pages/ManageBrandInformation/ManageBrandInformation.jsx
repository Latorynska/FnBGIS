import { act, useState } from 'react';
import './ManageBrandInformation.css';
import Select from '../../components/Select/Select';

const ManageBrandInformation = () => {
    const [activeTab, setactiveTab] = useState('all');
    return (
        <>
            {/* specialty list */}
            <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Brand Specialty</h3>
                    {/* <button id="addBrandBtn" className="text-xs bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-lg flex items-center">
                        <i className="fas fa-plus mr-1"></i> Add Brand
                    </button> */}
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
                    <h3 className="text-lg font-bold mb-4">Brand Information</h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Brand Name</label>
                                <input type="text" className="input-field w-full px-4 py-2 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Brand Code</label>
                                <input type="text" className="input-field w-full px-4 py-2 rounded-lg" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Brand Logo</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                    <img src="https://avatar.iran.liara.run/public" alt="Logo" className="w-full h-full object-cover" />
                                </div>
                                <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg">
                                    Change Logo
                                </button>
                            </div>
                        </div>

                        <div>
                            {/* <label className="block text-sm text-gray-400 mb-1">Category</label>
                            <select className="input-field w-full px-4 py-2 rounded-lg">
                                <option className="bg-gray-200 text-gray-900 hover:bg-gray-300">
                                    Coffee & Cafe
                                </option>
                                <option className="bg-gray-200 text-gray-900 hover:bg-gray-300">
                                    Fast Food
                                </option>
                                <option className="bg-gray-200 text-gray-900 hover:bg-gray-300">
                                    Restaurant
                                </option>
                                <option className="bg-gray-200 text-gray-900 hover:bg-gray-300">
                                    Desserts
                                </option>
                                <option className="bg-gray-200 text-gray-900 hover:bg-gray-300">
                                    Beverages
                                </option>

                            </select> */}
                            <Select
                                label={'category'}
                                value={''}
                                onChange={(e) => {}}
                                options={[
                                    { label: "Coffee & Cafe", value: "coffee" },
                                    { label: "Fast Food", value: "fastfood" },
                                    { label: "Restaurant", value: "restaurant" },
                                    { label: "Desserts", value: "desserts" },
                                    { label: "Beverages", value: "beverages" }]
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea className="input-field w-full px-4 py-2 rounded-lg" rows="3"></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Website</label>
                                <input type="url" className="input-field w-full px-4 py-2 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                                <input type="email" className="input-field w-full px-4 py-2 rounded-lg" />
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
                        <button id="addMenuItemBtn" className="text-xs bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-lg flex items-center">
                            <i className="fas fa-plus mr-1"></i> Add Item
                        </button>
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
        </>
    );
}

export default ManageBrandInformation;