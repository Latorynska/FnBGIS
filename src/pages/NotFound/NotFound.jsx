import { Player } from '@lottiefiles/react-lottie-player';

const NotFound = () => {
    return (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center flex-col p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <Player
                    autoplay
                    loop
                    src="https://assets8.lottiefiles.com/packages/lf20_kcsr6fcp.json"
                    style={{ height: '300px', width: '300px', margin: '0 auto' }}
                />
                <h1 className="text-4xl font-bold text-white">Page Not Found</h1>
                <p className="text-gray-400 text-lg">Looks like you've wandered into the digital wilderness.</p>
                <div className="pt-6 space-x-3">
                    <a
                        href="/"
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white inline-flex items-center"
                    >
                        <i className="fas fa-home mr-2"></i> Take me home
                    </a>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white inline-flex items-center"
                    >
                        <i className="fas fa-arrow-left mr-2"></i> Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
