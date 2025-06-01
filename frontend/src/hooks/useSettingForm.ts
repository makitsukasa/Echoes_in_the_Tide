import { useState, useEffect } from 'react';
import { useBottleStore } from '../stores/useBottleStore';
import { toast } from 'sonner';
import { useAccount, useWalletClient } from 'wagmi';

export const useSettingForm = () => {
  const { filebaseConfig, loadConfig, saveConfig, clearConfig } = useBottleStore();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const loadStoredConfig = async () => {
      if (isConnected && walletClient?.account) {
        try {
          await loadConfig(walletClient, walletClient.account);
        } catch (error) {
          console.error(error);
          toast.error('設定の読み込みに失敗しました');
        }
      }
      setIsLoading(false);
    };
    loadStoredConfig();
  }, [isConnected, walletClient]);

  useEffect(() => {
    if (filebaseConfig?.apiKey) {
      setApiKey(filebaseConfig.apiKey);
    }
  }, [filebaseConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !walletClient?.account) {
      toast.error('ウォレットを接続してください');
      return;
    }
    if (!apiKey.trim()) {
      toast.error('APIキーを入力してください');
      return;
    }
    setIsSaving(true);
    try {
      await saveConfig(walletClient, walletClient.account, { apiKey: apiKey.trim() });
      toast.success('設定を保存しました');
    } catch (error) {
      console.error(error);
      toast.error('設定の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    if (!isConnected || !walletClient?.account) {
      toast.error('ウォレットを接続してください');
      return;
    }
    try {
      clearConfig();
      setApiKey('');
      toast.success('設定を削除しました');
    } catch (error) {
      console.error(error);
      toast.error('設定の削除に失敗しました');
    }
  };

  return {
    apiKey,
    isConnected,
    isLoading,
    isSaving,
    handleChange,
    handleSubmit,
    handleClear,
  };
};
