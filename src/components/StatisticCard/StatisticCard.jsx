const StatisticCard = ({ title, description, subDescription, subDescStatus, iconName }) => {
  const statusConfig = {
    up: {
      icon: "fa-arrow-up",
      className: "text-emerald-400"
    },
    down: {
      icon: "fa-arrow-down",
      className: "text-red-400"
    },
    stagnant: {
      icon: "fa-minus",
      className: "text-gray-400"
    }
  };
  const iconConfig = {
    branch: {
      displayColor: "bg-emerald-500/20",
      displayIcon: "fa-store text-emerald-400"
    },
    revenue: {
      displayColor: "bg-blue-500/20",
      displayIcon: "fa-dollar-sign text-blue-400"
    },
    customers: {
      displayColor: "bg-purple-500/20",
      displayIcon: "fa-users text-purple-400"
    },
    area: {
      displayColor: "bg-yellow-500/20",
      displayIcon: "fa-map-marked text-yellow-400"
    }
  }

  const { icon, className } = statusConfig[subDescStatus] || statusConfig.stagnant;
  const { displayColor, displayIcon } = iconConfig[iconName] || iconConfig.branch;

  return (
    <div className="card p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 text-white">{description}</h3>
          <p className={`text-xs mt-1 flex items-center ${className}`}>
            <i className={`fas ${icon} mr-1`}></i> {' ' + subDescription}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full ${displayColor} flex items-center justify-center`}>
          <i className={`fas ${displayIcon}`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
