interface PortDto {
    portName: string;
    port: string;
}

interface ConfigDeviceDto {
    _id: ObjectId;
    host: string;
    rack: number;
    slot: number;
    name: string;
    ports: Array<PortDto>;
    updateRate: number;
}