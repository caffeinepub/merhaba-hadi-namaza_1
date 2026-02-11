import type { Location } from '../location/types';
import type { NotificationLeadTimes } from './localSettingsStorage';

export interface AppSettingsModel {
  location: Location | null;
  offsetMinutes: number;
  notificationLeadTimes: NotificationLeadTimes;
  zikirmatikCount?: number;
  zikirmatikTarget?: number;
}
