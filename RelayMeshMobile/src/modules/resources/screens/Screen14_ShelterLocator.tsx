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

export const Screen14_ShelterLocator: React.FC<Props> = (props) => (
  <Screen14_ResourceDetails {...props} />
);
