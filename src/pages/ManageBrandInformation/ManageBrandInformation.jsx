import { useEffect, useState } from 'react';
import './ManageBrandInformation.css';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMenu, fetchBrands, fetchMenus, saveBrand, saveMenu, updateBrand, updateMenu } from '../../redux/thunks/brandThunks';
import { FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CardLoadingOverlay from '../../components/CardLoadingOverlay/CardLoadingOverlay';
import MenuCard from '../../components/MenuCard/MenuCard';
import { resizeImage } from '../../utils/generalUtils';




const ManageBrandInformation = () => {
    const dispatch = useDispatch();
    const [activeTab, setactiveTab] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editMenuId, setEditMenuId] = useState(null);
    const [brand, setBrand] = useState({
        nama: '', kategori: '', kode: '', deskripsi: '', website: '', email: '', logoFile: null, iconUrl: ''
    });
    const [menuForm, setMenuForm] = useState({
        nama: '', kategori: 'Food', deskripsi: '', harga: '', status: '', imageFile: null, gambarUrl: '', status: 'Tersedia',
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState(null);

    const { loading } = useSelector(state => state.brand);
    const { items: menus, loading: menuLoading } = useSelector(state => state.menu);

    const tabToKategori = {
        beverages: 'Beverage',
        food: 'Food',
        dessert: 'Dessert'
    };
    const filteredMenus = menus.filter(menu =>
        activeTab === 'all' ? true : menu.kategori === tabToKategori[activeTab]
    );
    useEffect(() => {
        const fetchData = async () => {
            const action = await dispatch(fetchBrands());

            if (fetchBrands.fulfilled.match(action)) {
                const firstBrand = action.payload[0];
                if (firstBrand) {
                    setBrand(firstBrand);
                    dispatch(fetchMenus(firstBrand.id));
                }
            }
        };

        fetchData();
    }, [dispatch]);
    const handleSaveBrand = async (e) => {
        e.preventDefault();

        if (!brand.nama || !brand.kategori) {
            toast.error('Nama dan kategori brand wajib diisi.');
            return;
        }

        const brandData = {
            nama: brand.nama,
            kategori: brand.kategori,
            deskripsi: brand.deskripsi,
            website: brand.website,
            email: brand.email,
            logoFile: brand.logoFile || null,
            prevIconUrl: brand.iconUrl || null,
        };

        try {
            if (brand.id) {
                await dispatch(updateBrand({ id: brand.id, data: brandData })).unwrap();
                toast.success('Brand berhasil diperbarui');
            } else {
                await dispatch(saveBrand(brandData)).unwrap();
                toast.success('Brand berhasil disimpan');
            }

            setBrand({ ...brand, logoFile: null });
        } catch (error) {
            toast.error('Gagal menyimpan brand: ' + error);
        }
    };
    const handleSaveMenu = async (e) => {
        e.preventDefault();
        if (!brand.id) return;

        let resizedImage = null;
        if (menuForm.imageFile) {
            try {
                resizedImage = await resizeImage(menuForm.imageFile);
            } catch (err) {
                toast.error("Gagal resize gambar: " + err.message);
                return;
            }
        }

        const dataToSend = {
            ...menuForm,
            imageFile: resizedImage,
            gambarUrl: menuForm.gambarUrl || '',
        };

        if (editMenuId) {
            dispatch(updateMenu({ brandId: brand.id, id: editMenuId, data: dataToSend }))
                .unwrap()
                .then(() => toast.success("Menu berhasil diperbarui"))
                .catch((err) => toast.error("Gagal update: " + err));
        } else {
            dispatch(saveMenu({ brandId: brand.id, data: dataToSend }))
                .unwrap()
                .then(() => toast.success("Menu berhasil ditambahkan"))
                .catch((err) => toast.error("Gagal simpan: " + err));
        }

        setShowModal(false);
        setEditMenuId(null);
        setMenuForm({ nama: '', kategori: '', deskripsi: '', harga: '', status: '', imageFile: null, gambarUrl: '' });
    };

    const handleEditMenu = (menu) => {
        setEditMenuId(menu.id);
        setMenuForm({
            nama: menu.nama,
            kategori: menu.kategori,
            deskripsi: menu.deskripsi,
            harga: menu.harga,
            status: menu.status,
            imageFile: null,
            gambarUrl: menu.gambarUrl,
        });
        setShowModal(true);
    };
    const handleDeleteClick = (menu) => {
        setMenuToDelete(menu);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (!menuToDelete || !brand.id) return;

        dispatch(deleteMenu({ brandId: brand.id, id: menuToDelete.id, gambarUrl: menuToDelete.gambarUrl }))
            .unwrap()
            .then(() => {
                toast.success('Menu berhasil dihapus');
            })
            .catch((err) => {
                toast.error('Gagal menghapus menu: ' + err);
            });

        setShowDeleteConfirm(false);
        setMenuToDelete(null);
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
                            <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center">
                                <i className="fas fa-save mr-2"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
                {/* menu items */}
                <div className="card p-6">
                    <CardLoadingOverlay isVisible={menuLoading || loading} />
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Menu Items</h3>
                        <Button variant="primary" size="small" icon="fas fa-plus" onClick={() => {
                            setEditMenuId(null);
                            setMenuForm({ nama: '', kategori: '', deskripsi: '', harga: '', status: '', imageFile: null });
                            setShowModal(true);
                        }}>
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
                        <div className="space-y-3">
                            {filteredMenus.length === 0 ? (
                                <div className="text-sm text-gray-400 italic text-center py-8">
                                    Menu masih kosong
                                </div>
                            ) : (
                                filteredMenus.map(menu => (
                                    <MenuCard
                                        key={menu.id}
                                        menu={menu}
                                        onEdit={handleEditMenu}
                                        onDelete={handleDeleteClick}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <Modal onClose={() => setShowModal(false)} title={editMenuId ? "Edit Menu Item" : "New Menu Item"}>
                    <form className="space-y-4" onSubmit={handleSaveMenu}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    className="input-field w-full px-4 py-2 rounded-lg"
                                    value={menuForm.nama}
                                    onChange={(e) => setMenuForm({ ...menuForm, nama: e.target.value })}
                                />
                            </div>
                            <div>
                                <Select
                                    label={'category'}
                                    value={menuForm.kategori || "Food"}
                                    placeholder='Pilih Kategori'
                                    onChange={(e) => setMenuForm({ ...menuForm, kategori: e.target.value })}
                                    options={[
                                        { label: "Beverage", value: "Beverage" },
                                        { label: "Food", value: "Food" },
                                        { label: "Dessert", value: "Dessert" },
                                    ]}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                className="input-field w-full px-4 py-2 rounded-lg"
                                rows="2"
                                value={menuForm.deskripsi}
                                onChange={(e) => setMenuForm({ ...menuForm, deskripsi: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input-field w-full px-4 py-2 rounded-lg"
                                    value={menuForm.harga}
                                    onChange={(e) => setMenuForm({ ...menuForm, harga: e.target.value })}
                                />
                            </div>
                            <div>
                                <Select
                                    label={'Status'}
                                    value={menuForm.status || "Tersedia"}
                                    placeholder='Pilih status'
                                    onChange={(e) => setMenuForm({ ...menuForm, status: e.target.value })}
                                    options={[
                                        { label: "Tersedia", value: "Tersedia" },
                                        { label: "Tidak Tersedia", value: "Tidak Tersedia" },
                                    ]}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Item Image</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
                                    {menuForm.imageFile ? (
                                        <img
                                            src={URL.createObjectURL(menuForm.imageFile)}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded"
                                        />
                                    ) : menuForm.gambarUrl ? (
                                        <img
                                            src={menuForm.gambarUrl}
                                            alt="Current"
                                            className="w-full h-full object-cover rounded"
                                        />
                                    ) : (
                                        <i className="fas fa-image text-gray-400 text-xl"></i>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="menu-image-input"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) setMenuForm({ ...menuForm, imageFile: file });
                                    }}
                                />
                                <button
                                    type="button"
                                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg"
                                    onClick={() => document.getElementById('menu-image-input').click()}
                                >
                                    Upload Image
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="neutral" size="large" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" icon="fas fa-save mr-2" size="large" type="submit">
                                Save Item
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
            {showDeleteConfirm && (
                <Modal onClose={() => setShowDeleteConfirm(false)} title="Konfirmasi Hapus Menu">
                    <p className="text-sm text-gray-300 mb-4">
                        Apakah Anda yakin ingin menghapus menu <strong>{menuToDelete?.nama}</strong>?
                    </p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="neutral" size='medium' onClick={() => setShowDeleteConfirm(false)}>Batal</Button>
                        <Button variant="danger" size='medium' icon="fas fa-trash" onClick={handleConfirmDelete}>
                            Hapus
                        </Button>
                    </div>
                </Modal>
            )}

        </>
    );
}

export default ManageBrandInformation;