const MenuCard = ({ menu, onEdit, onDelete }) => {
    const getIcon = (kategori) => {
        switch (kategori) {
            case 'Beverage':
                return { bg: 'bg-blue-500/20', icon: 'fas fa-coffee', color: 'text-blue-400' };
            case 'Food':
                return { bg: 'bg-yellow-500/20', icon: 'fas fa-bread-slice', color: 'text-yellow-400' };
            case 'Dessert':
                return { bg: 'bg-pink-500/20', icon: 'fas fa-cookie', color: 'text-pink-400' };
            default:
                return { bg: 'bg-gray-500/20', icon: 'fas fa-question-circle', color: 'text-gray-400' };
        }
    };

    const { bg, icon, color } = getIcon(menu.kategori);
    const isAvailable = menu.status === 'Tersedia';

    return (
        <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
                        {
                            menu.gambarUrl ? (
                                <img
                                    src={menu.gambarUrl}
                                    alt={menu.nama}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <i className={`${icon} ${color}`}></i>
                            )
                        }
                    </div>
                    <div>
                        <div className="font-medium flex items-center gap-2">
                            {menu.nama}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                                ${isAvailable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {menu.status}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400">{menu.deskripsi}</div>
                        <div className="mt-1 text-sm text-emerald-400">Rp. {menu.harga}</div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(menu)} className="text-blue-400 hover:text-blue-300 p-1">
                        <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => onDelete(menu)} className="text-red-400 hover:text-red-300 p-1">
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
