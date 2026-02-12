import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useIsCallerAdmin } from '../app-release/useIsCallerAdmin';
import { useUpdateLatestAppRelease } from '../app-release/useUpdateLatestAppRelease';
import { useLatestAppRelease } from '../app-release/useLatestAppRelease';
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Admin-only advanced section for managing app release metadata.
 * 
 * Features:
 * - Input fields for version and Play Store URL
 * - Submit button with loading state
 * - Success/error messaging
 * - Hidden/disabled for non-admin users
 * - Immediate UI update after successful submission
 */
export function AdminAppReleaseAdvancedSection() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: currentRelease } = useLatestAppRelease();
  const updateRelease = useUpdateLatestAppRelease();

  const [version, setVersion] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Don't render for non-admin users
  if (isAdminLoading || !isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    // Basic validation
    if (!version.trim() || !storeUrl.trim()) {
      return;
    }

    try {
      await updateRelease.mutateAsync({
        version: version.trim(),
        storeUrl: storeUrl.trim(),
        updatedAt: BigInt(Date.now() * 1_000_000), // Convert to nanoseconds
      });

      setShowSuccess(true);
      setVersion('');
      setStoreUrl('');

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update release:', error);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          App Release Management (Admin)
        </CardTitle>
        <CardDescription>
          Configure the latest app version and Play Store URL for update notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentRelease && (
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Current Release:</strong> Version {currentRelease.version}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="release-version">Latest Version</Label>
            <Input
              id="release-version"
              type="text"
              placeholder="e.g., 1.2.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use semantic versioning format (e.g., 1.2.0)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-url">Play Store URL</Label>
            <Input
              id="store-url"
              type="url"
              placeholder="https://play.google.com/store/apps/details?id=..."
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Full URL to your app on the Play Store
            </p>
          </div>

          {updateRelease.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to update release. {updateRelease.error instanceof Error ? updateRelease.error.message : 'Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {showSuccess && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-600 dark:text-green-400">
                Release updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={updateRelease.isPending || !version.trim() || !storeUrl.trim()}
            className="w-full"
          >
            {updateRelease.isPending ? 'Updating...' : 'Update Release'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
