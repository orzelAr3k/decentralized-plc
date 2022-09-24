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