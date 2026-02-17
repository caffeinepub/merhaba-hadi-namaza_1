import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAppSettings } from './useAppSettings';
import { Settings, Bell, Clock } from 'lucide-react';

export function SettingsTab() {
  const { settings, saveSettings, isSaving } = useAppSettings();
  const [offsetMinutes, setOffsetMinutes] = useState(settings.offsetMinutes.toString());
  const [notificationLeadTimes, setNotificationLeadTimes] = useState(settings.notificationLeadTimes);

  const handleSaveOffset = async () => {
    const minutes = parseInt(offsetMinutes, 10);
    if (isNaN(minutes)) {
      alert('Lütfen geçerli bir sayı girin');
      return;
    }
    try {
      await saveSettings({ offsetMinutes: minutes });
      alert('Ayarlar kaydedildi');
    } catch (error) {
      console.error('Failed to save offset:', error);
      alert('Ayarlar kaydedilemedi');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await saveSettings({ notificationLeadTimes });
      alert('Bildirim ayarları kaydedildi');
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      alert('Bildirim ayarları kaydedilemedi');
    }
  };

  const handleNotificationTimeChange = (prayer: keyof typeof notificationLeadTimes, value: string) => {
    const minutes = parseInt(value, 10);
    if (!isNaN(minutes) && minutes >= 0) {
      setNotificationLeadTimes(prev => ({
        ...prev,
        [prayer]: minutes
      }));
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Genel Ayarlar
          </CardTitle>
          <CardDescription>
            Uygulama ayarlarınızı buradan yönetebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offset">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Namaz Vakti Düzeltmesi (dakika)
                </div>
              </Label>
              <p className="text-sm text-muted-foreground">
                Pozitif değer vakitleri ileri, negatif değer geri alır
              </p>
              <div className="flex gap-2">
                <Input
                  id="offset"
                  type="number"
                  value={offsetMinutes}
                  onChange={(e) => setOffsetMinutes(e.target.value)}
                  placeholder="0"
                  className="max-w-xs"
                />
                <Button onClick={handleSaveOffset} disabled={isSaving}>
                  {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Bildirim Ayarları
          </CardTitle>
          <CardDescription>
            Her namaz vakti için bildirim zamanını ayarlayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {Object.entries(notificationLeadTimes).map(([prayer, minutes]) => (
              <div key={prayer} className="flex items-center justify-between gap-4">
                <Label htmlFor={`notification-${prayer}`} className="capitalize min-w-[100px]">
                  {prayer === 'fajr' && 'İmsak'}
                  {prayer === 'sunrise' && 'Güneş'}
                  {prayer === 'dhuhr' && 'Öğle'}
                  {prayer === 'asr' && 'İkindi'}
                  {prayer === 'maghrib' && 'Akşam'}
                  {prayer === 'isha' && 'Yatsı'}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`notification-${prayer}`}
                    type="number"
                    min="0"
                    value={minutes}
                    onChange={(e) => handleNotificationTimeChange(prayer as keyof typeof notificationLeadTimes, e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">dk önce</span>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleSaveNotifications} disabled={isSaving} className="w-full">
            {isSaving ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
