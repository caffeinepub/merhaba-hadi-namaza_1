import type { Location } from '../location/types';
import type { NotificationLeadTimes } from './localSettingsStorage';

export interface AppSettingsModel {
  location: Location | null;
  offsetMinutes: number;
  notificationLeadTimes: NotificationLeadTimes;
  zikirmatikCount?: number;
  zikirmatikTarget?: number;
  hatimLastReadPage?: number;
  adhkarMorningCompleted?: Record<string, boolean>;
  adhkarEveningCompleted?: Record<string, boolean>;
  fastingVoluntaryDates?: string[];
  fastingMakeUpDates?: string[];
  fastingMakeUpTargetCount?: number;
  ramadanCompletedDays?: boolean[];
}
