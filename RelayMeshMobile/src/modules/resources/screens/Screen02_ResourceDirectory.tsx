import React from 'react';
import { Screen13_EmergencyResourcesDirectory } from './Screen13_EmergencyResourcesDirectory';

interface Props {
  onSelectResource?: (resource: any) => void;
  onViewMap?: () => void;
}

/**
 * Screen02_ResourceDirectory
 * Re-routes to Screen13_EmergencyResourcesDirectory to maintain backward compatibility
 * while exposing the complete categorized listing with availability and freshness.
 */
export const Screen02_ResourceDirectory: React.FC<Props> = ({
  onSelectResource,
  onViewMap,
}) => {
  return (
    <Screen13_EmergencyResourcesDirectory
      onSelectResource={onSelectResource}
      onViewMap={onViewMap}
    />
  );
};
