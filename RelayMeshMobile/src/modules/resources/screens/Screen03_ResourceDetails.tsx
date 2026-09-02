import React from 'react';
import { Screen14_ResourceDetails } from './Screen14_ResourceDetails';
import { ResourceItem } from '../services/ResourceService';

interface Props {
  resourceId?: string;
  onBackPress?: () => void;
  onViewMap?: (resource: ResourceItem) => void;
  onContact?: (coordinator: string) => void;
  onBroadcast?: (resource: ResourceItem) => void;
}

/**
 * Screen03_ResourceDetails
 * Re-routes to Screen14_ResourceDetails to maintain backward compatibility
 * while exposing full capacity, amenities, offline timestamps, and mesh telemetry.
 */
export const Screen03_ResourceDetails: React.FC<Props> = (props) => {
  return <Screen14_ResourceDetails {...props} />;
};
