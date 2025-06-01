import Navbar from '../components/common/Navbar';
import SettingForm from '../components/setting/SettingForm';
import AppInfo from '../components/setting/AppInfo';

export default function Setting() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">設定</h1>
          <SettingForm />
          <AppInfo />
        </div>
      </main>
    </div>
  );
}
