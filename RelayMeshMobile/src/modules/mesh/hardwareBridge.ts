import { BleManager, Device, BleError } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import { MeshNode } from './meshService';

// Initialize BleManager safely on native mobile platforms to prevent Web/Jest/Expo Go crashes
export const bleManager = (() => {
  if (Platform.OS === 'web') return null;
  try {
    return new BleManager();
  } catch {
    return null;
  }
})();

export const HardwareBridge = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  },

  async startPhysicalScan(
    onNodeDiscovered: (node: MeshNode) => void,
    onError?: (error: BleError) => void
  ) {
    // Web / Sandbox fallback
    if (Platform.OS === 'web' || !bleManager) {
      console.log('--- Web Environment Detected: Emulating Peer Discovery ---');
      setTimeout(() => {
        const mockWebNode: MeshNode = {
          id: `node_${Date.now()}`,
          name: `Simulated Peer #${Math.floor(100 + Math.random() * 900)}`,
          dist: '6 m away',
          role: 'Relay Enabled',
          rssi: `-${Math.floor(55 + Math.random() * 25)} dBm`,
          hops: 'Direct',
          type: 'rescue',
        };
        onNodeDiscovered(mockWebNode);
      }, 1000);
      return;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn('BLE permissions denied.');
      return;
    }

    try {
      bleManager.stopDeviceScan();
      console.log('--- Scanning Native BLE Radios ---');

      bleManager.startDeviceScan(
        null,
        { allowDuplicates: false },
        (error, device: Device | null) => {
          if (error) {
            console.warn('BLE Native Scan Warning:', error.message);
            if (onError) onError(error);
            return;
          }

          if (device) {
            const deviceName = device.name || device.localName || `BLE Peer (${device.id.slice(0, 5)})`;
            const rssiVal = device.rssi ?? -72;

            const node: MeshNode = {
              id: device.id,
              name: deviceName,
              dist: rssiVal > -65 ? '< 5m away' : '15m away',
              role: 'Hardware Peer',
              rssi: `${rssiVal} dBm`,
              hops: 'Direct',
              type: 'citizen',
            };

            onNodeDiscovered(node);
          }
        }
      );
    } catch (e) {
      console.warn('Native BLE unsupported in current environment.', e);
    }
  },

  stopPhysicalScan() {
    if (bleManager) {
      try {
        bleManager.stopDeviceScan();
      } catch {
        // Ignored
      }
    }
  },
};