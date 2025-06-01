import Navbar from '../components/common/Navbar';
import BottleModal from '../components/common/BottleModal';
import { useDriftingBottles } from '../hooks/useDriftingBottles';

export default function Home() {
  const {
    bottles,
    isLoading,
    error,
    selectedBottle,
    setSelectedBottle,
    handleClaim,
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
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-12">
          {isLoading ? (
            <p className="text-white">読み込み中...</p>
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
            onClaim={handleClaim}
          />
        )}
      </main>
    </div>
  );
}
