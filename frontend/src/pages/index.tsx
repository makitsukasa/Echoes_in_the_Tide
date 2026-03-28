import Navbar from '../components/common/Navbar';
import BottleModal from '../components/common/BottleModal';
import { useDriftingBottles } from '../hooks/useDriftingBottles';

export default function Home() {
  const {
    bottles,
    isLoading,
    isConnected,
    error,
    selectedBottle,
    setSelectedBottle,
    handleClaim,
    reload,
  } = useDriftingBottles();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-red-500">エラーが発生しました: {error.message}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="relative h-[calc(100vh-4rem)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${basePath}/ocean.webp)` }}
        />

        <button
          onClick={reload}
          disabled={isLoading}
          className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/70 text-gray-700 text-sm rounded hover:bg-white/90 disabled:opacity-50"
        >
          読み込み直す
        </button>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-12">
          {isLoading ? (
            <p className="text-white drop-shadow">読み込み中...</p>
          ) : bottles.length === 0 ? (
            <p className="text-white drop-shadow">今は流れ着いている小瓶がありません</p>
          ) : (
            bottles.map((bottle, index) => (
              <div
                key={bottle.id}
                onClick={() => setSelectedBottle(bottle)}
                style={{ transform: `rotate(${index * 15 - 15}deg)` }}
                className="cursor-pointer transform hover:scale-110 transition-transform"
              >
                <img
                  src={`${basePath}/bottle.webp`}
                  alt="小瓶"
                  className="w-32 h-32 object-contain drop-shadow-lg"
                />
              </div>
            ))
          )}
        </div>

        {selectedBottle && (
          <BottleModal
            bottle={{
              ...selectedBottle,
              tokenId: selectedBottle.id,
              tokenURI: selectedBottle.tokenURI || '',
              image: selectedBottle.image || `${basePath}/bottle.webp`,
              status: '漂流中',
              timestamp: new Date().toLocaleString('ja-JP'),
              date: selectedBottle.date || new Date().toLocaleDateString('ja-JP'),
            }}
            onClose={() => setSelectedBottle(null)}
            showClaimButton={true}
            isConnected={isConnected}
            onClaim={handleClaim}
          />
        )}
      </main>
    </div>
  );
}
