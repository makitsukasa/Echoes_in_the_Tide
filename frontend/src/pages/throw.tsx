import Navbar from '../components/Navbar';
import { ThrowForm } from '../features/throw/components/ThrowForm';

export default function Throw() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">小瓶を流す</h1>
          <ThrowForm />
        </div>
      </main>
    </div>
  );
}
