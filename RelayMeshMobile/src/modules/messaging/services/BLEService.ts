import { BleManager, Device } from 'react-native-ble-plx';
import { meshRouter } from './MeshRouter';

class BLEService {
  private manager: BleManager | null = null;
  // A specific service UUID unique to RelayMesh so we only connect to our own app
  public static RELAYMESH_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; 

  constructor() {
    try {
      // This will fail in Expo Go, but succeed in a real native build
      this.manager = new BleManager();
    } catch (error) {
      console.warn('BLE is not supported inside Expo Go. Hardware scanning disabled.');
    }
  }

  // 1. Start scanning for nearby RelayMesh devices
  public startScanning() {
    if (!this.manager) {
      console.log('Simulating BLE scan in Expo Go...');
      return;
    }

    console.log('Starting real BLE scan...');
    
    this.manager.startDeviceScan(
      [BLEService.RELAYMESH_SERVICE_UUID], 
      null, 
      (error, device) => {
        if (error) {
          console.warn('BLE Scan Error:', error.message);
          return;
        }

        if (device) {
          console.log(`Discovered Peer: ${device.id} (${device.name})`);
          // Tell our Mesh Router about the new neighbor
          meshRouter.registerPeer(device.id);
          
          this.connectToPeer(device);
        }
    });
  }

  // 2. Connect to a discovered peer
  private async connectToPeer(device: Device) {
    try {
      const connectedDevice = await device.connect();
      console.log(`Connected to ${connectedDevice.id}!`);

      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      // TODO: Listen for incoming packets and pass them to meshRouter.processPacket()

    } catch (error) {
      console.error(`Failed to connect to ${device.id}`, error);
      meshRouter.removePeer(device.id);
    }
  }

  public stopScanning() {
    this.manager?.stopDeviceScan();
  }
}

export const bleService = new BLEService();