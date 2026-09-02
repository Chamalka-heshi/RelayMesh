import React from 'react';
import { Screen13_EmergencyResourcesDirectory } from './Screen13_EmergencyResourcesDirectory';

interface Props {
  onSelectResource?: (resourceId: string) => void;
  onViewMap?: () => void;
}

export const Screen13_EmergencyContacts: React.FC<Props> = (props) => (
  <Screen13_EmergencyResourcesDirectory {...props} />
);
