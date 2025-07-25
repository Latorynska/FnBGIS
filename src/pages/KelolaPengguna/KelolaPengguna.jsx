import { useEffect, useState } from 'react';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import Button from '../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import CardLoadingOverlay from '../../components/CardLoadingOverlay/CardLoadingOverlay';
import Pagination from '../../components/Pagination/Pagination';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import TextInput from '../../components/TextInput/TextInput';
import { fetchPengguna, savePengguna, softDeletePengguna } from '../../redux/thunks/penggunaThunks';

const defaultFormData = { id: '', username: '', email: '' };

const KelolaPengguna = () => {
    const dispatch = useDispatch();
    const { items: penggunaList, loading } = useSelector(state => state.pengguna);
    const [formData, setFormData] = useState(defaultFormData);
    const [currentData, setCurrentData] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        dispatch(fetchPengguna());
    }, [dispatch]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email) {
            return toast.error('Username dan email wajib diisi');
        }

        const payload = {
            ...formData,
            password: formData.id ? undefined : formData.email,
        };

        dispatch(savePengguna(payload))
            .unwrap()
            .then(() => {
                toast.success('Pengguna berhasil disimpan');
                setFormData(defaultFormData);
            })
            .catch((err) => toast.error('Gagal menyimpan: ' + err));
    };


    const handleDelete = () => {
        dispatch(softDeletePengguna(formData.id))
            .unwrap()
            .then(() => {
                toast.success('Pengguna dihapus (soft delete)');
                setShowDeleteConfirm(false);
            }).catch((err) => toast.error('Gagal hapus: ' + err));
    };

    const handleCancelForm = () => {
        setFormData(defaultFormData);
    };

    const handleEdit = (data) => {
        setFormData({ id: data.id, username: data.username, email: data.email });
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 relative z-10">
                <div className="card p-6 shadow rounded-lg border border-gray-200 bg-white">
                    <CardLoadingOverlay isVisible={loading} />
                    <div className="lg:col-span-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Data Pengguna</h3>
                            <Button variant="primary" size="small" icon="fas fa-plus" onClick={() => setFormData(defaultFormData)}>
                                Tambah Pengguna
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">No</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {currentData.map((user, index) => (
                                        user.status != 'deleted' &&
                                        <tr key={user.id} className="hover:bg-gray-800 cursor-pointer">
                                            <td className="px-4 py-3 text-sm text-gray-300">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm text-white">{user.username}</td>
                                            <td className="px-4 py-3 text-sm text-white">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <Button variant="neutral" size="small" onClick={() => handleEdit(user)}>
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <Pagination
                                dataList={penggunaList}
                                itemsPerPage={5}
                                setCurrentData={setCurrentData}
                                numberingData={false}
                            />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <CardLoadingOverlay isVisible={loading} />
                    <h3 className="text-lg font-bold mb-4">Form Pengguna</h3>
                    <form className="space-y-4" onSubmit={handleSubmitForm}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label='Username'
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                            <TextInput
                                label='Email'
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant="danger"
                                size="medium"
                                icon="fas fa-trash"
                                disabled={!formData.id}
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Hapus
                            </Button>
                            <Button
                                variant="neutral"
                                size="medium"
                                onClick={handleCancelForm}
                                disabled={!formData.username}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                size="medium"
                                icon="fas fa-save"
                                type="submit"
                                disabled={!formData.username}
                            >
                                Simpan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {showDeleteConfirm && (
                <Modal onClose={() => setShowDeleteConfirm(false)} title="Konfirmasi Hapus Pengguna">
                    <p className="text-sm text-gray-300 mb-4">
                        Apakah Anda yakin ingin menghapus pengguna <strong>{formData?.username}</strong>?
                    </p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="neutral" size='medium' onClick={() => setShowDeleteConfirm(false)}>Batal</Button>
                        <Button variant="danger" size='medium' icon="fas fa-trash" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default KelolaPengguna;
