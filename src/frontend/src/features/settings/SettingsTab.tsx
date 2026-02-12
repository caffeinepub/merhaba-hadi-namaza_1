import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAppSettings } from './useAppSettings';
import { AdminAppReleaseAdvancedSection } from './AdminAppReleaseAdvancedSection';
import { Bell, Clock } from 'lucide-react';

export function SettingsTab() {
  const { settings, saveSettings, isSaving } = useAppSettings();
  const [offsetInput, setOffsetInput] = React.useState(settings.offsetMinutes.toString());
  const [notificationSettings, setNotificationSettings] = React.useState(settings.notificationLeadTimes);

  const handleSaveOffset = async () => {
    const newOffset = parseInt(offsetInput, 10) || 0;
    await saveSettings({
      ...settings,
      offsetMinutes: newOffset
    });
  };

  const handleNotificationChange = (prayer: string, value: string) => {
    const minutes = Math.max(1, Math.min(45, parseInt(value, 10) || 1));
    setNotificationSettings({
      ...notificationSettings,
      [prayer]: minutes
    });
  };

  const handleSaveNotifications = async () => {
    await saveSettings({
      ...settings,
      notificationLeadTimes: notificationSettings
    });
  };

  const prayers = [
    { key: 'fajr', label: 'İmsak' },
    { key: 'sunrise', label: 'Güneş' },
    { key: 'dhuhr', label: 'Öğle' },
    { key: 'asr', label: 'İkindi' },
    { key: 'maghrib', label: 'Akşam' },
    { key: 'isha', label: 'Yatsı' }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Saat Düzeltmesi
          </CardTitle>
          <CardDescription>
            Diyanet'e göre dakika farkı (+ veya -)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offset">Dakika Farkı</Label>
            <div className="flex gap-2">
              <Input
                id="offset"
                type="number"
                value={offsetInput}
                onChange={(e) => setOffsetInput(e.target.value)}
                placeholder="0"
                className="max-w-[120px]"
              />
              <Button
                onClick={handleSaveOffset}
                disabled={isSaving}
                size="sm"
              >
                Kaydet
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Şu anki düzeltme: {settings.offsetMinutes > 0 ? '+' : ''}{settings.offsetMinutes} dakika
            </p>
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
            Her vakit için kaç dakika önce bildirim almak istediğinizi ayarlayın (1-45 dakika)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {prayers.map((prayer) => (
            <div key={prayer.key} className="flex items-center justify-between gap-4">
              <Label htmlFor={`notification-${prayer.key}`} className="min-w-[80px]">
                {prayer.label}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`notification-${prayer.key}`}
                  type="number"
                  min="1"
                  max="45"
                  value={notificationSettings[prayer.key]}
                  onChange={(e) => handleNotificationChange(prayer.key, e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">dk önce</span>
              </div>
            </div>
          ))}
          <Button
            onClick={handleSaveNotifications}
            disabled={isSaving}
            className="w-full"
          >
            Bildirimleri Kaydet
          </Button>
        </CardContent>
      </Card>

      <AdminAppReleaseAdvancedSection />
    </div>
  );
}
