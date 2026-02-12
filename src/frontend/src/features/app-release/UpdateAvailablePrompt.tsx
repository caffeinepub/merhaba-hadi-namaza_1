import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Download, X } from 'lucide-react';
import { useLatestAppRelease } from './useLatestAppRelease';
import { CURRENT_APP_VERSION } from './currentAppVersion';
import { isNewerVersion } from './semverCompare';
import { getDismissedVersion, setDismissedVersion } from './updatePromptStorage';

/**
 * Prominent, dismissible update prompt component.
 * 
 * Displays when:
 * - Backend has a newer version configured
 * - User hasn't dismissed this specific version yet
 * 
 * Features:
 * - Opens Play Store URL in new tab/window
 * - Remembers dismissal per version
 * - Automatically reappears when backend version changes
 * - Renders nothing when not applicable
 */
export function UpdateAvailablePrompt() {
  const { data: release, isLoading } = useLatestAppRelease();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if this version was previously dismissed
  useEffect(() => {
    if (release?.version) {
      const dismissedVersion = getDismissedVersion();
      setIsDismissed(dismissedVersion === release.version);
    }
  }, [release?.version]);

  // Don't show if loading, no release, or dismissed
  if (isLoading || !release || isDismissed) {
    return null;
  }

  // Check if backend version is newer than current
  const updateAvailable = isNewerVersion(release.version, CURRENT_APP_VERSION);

  if (!updateAvailable) {
    return null;
  }

  const handleDismiss = () => {
    setDismissedVersion(release.version);
    setIsDismissed(true);
  };

  const handleUpdate = () => {
    window.open(release.storeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Alert className="mb-4 border-primary bg-primary/5">
      <Download className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        <span>New Version Available</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 -mr-2"
          onClick={handleDismiss}
          aria-label="Dismiss update notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm">
          Version <strong>{release.version}</strong> is now available. Update to get the latest features and improvements.
        </p>
        <Button
          onClick={handleUpdate}
          size="sm"
          className="w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          Update Now
        </Button>
      </AlertDescription>
    </Alert>
  );
}
