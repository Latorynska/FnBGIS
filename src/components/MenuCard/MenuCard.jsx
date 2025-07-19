// MenuCard.jsx
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

    return (
        <div className="menu-item-card p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
                        <i className={`${icon} ${color}`}></i>
                    </div>
                    <div>
                        <div className="font-medium">{menu.nama}</div>
                        <div className="text-xs text-gray-400">{menu.deskripsi}</div>
                        <div className="mt-1 text-sm text-emerald-400">${menu.harga}</div>
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
