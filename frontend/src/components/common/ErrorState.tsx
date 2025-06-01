import { Navbar } from './Navbar';

interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-500 text-center">{message}</p>
        </div>
      </main>
    </div>
  );
};
