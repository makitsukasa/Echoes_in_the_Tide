import Navbar from '../components/common/Navbar';
import { BottleList } from '../components/mybottles/BottleList';
import BottleModal from '../components/common/BottleModal';
import { useMyBottles } from '../hooks/useMyBottles';
import { ErrorState } from '../components/common/ErrorState';

export default function MyBottles() {
  const {
    isConnected,
    isLoading,
    error,
    bottles,
    selectedBottle,
    setSelectedBottle,
  } = useMyBottles();

  if (error) {
    return <ErrorState message={error.message} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">拾った小瓶</h1>
        <BottleList
          bottles={bottles}
          isConnected={isConnected}
          isLoading={isLoading}
          onBottleClick={setSelectedBottle}
        />
        {selectedBottle && (
          <BottleModal
            bottle={selectedBottle}
            onClose={() => setSelectedBottle(null)}
            showClaimButton={false}
          />
        )}
      </main>
    </div>
  );
}
