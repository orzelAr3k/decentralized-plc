interface PortDto {
    portName: string;
    port: string;
}

interface ConfigDeviceDto {
    _id: ObjectId;
    host: string;
    rack: number | null;
    slot: number | null;
    name: string;
    ports: Array<PortDto>;
    updateRate: number | null;
}   

interface Device {
    id: string;
    device: {
      name: string;
      host: string;
      updateRate: number;
      rack: number;
      slot: number;
      ports: { [key: string]: string };
      pub: string;
      epub: string;
    }
}
  
interface Ports {
    [key: string]: { port: string, value: any };
}