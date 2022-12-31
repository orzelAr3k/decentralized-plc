import { toobject, pipe, map, entries, toarray, filter } from 'powerseq';
import { gun, device } from '../gundb';
import { configDB } from '../mongodb';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Gun = require('gun/gun');

export async function getDevice(
  cb: (res: any) => void
) {
  return cb(global.configDevice);
}

export async function getAllDevices(cb?: (res: string) => void) {
  gun.get('DEVICES').open((devices) => {
    global.globalSocket.emit(
      'allDevices',
      pipe(
        entries(devices),
        filter(([id, device]) =>
          !!device && global.configDevice ? id !== global.configDevice._id.toString() : false
        ),
        map(([id, device]) => ({ id: id, device: device })),
        toarray()
      )
    );
  });
  if (cb) return cb('Pobieranie listy urządzeń!');
}

export async function createDeviceProfile(
  deviceName: string,
  host: string,
  rack: number,
  slot: number,
  updateRate: number,
  cb?: (res: string | null) => void
) {
  await configDB.deleteMany({});
  await configDB.insertOne({
    host: host,
    rack: rack,
    slot: slot,
    name: deviceName,
    ports: [],
    updateRate: updateRate,
  });
  global.configDevice = <ConfigDeviceDto>await configDB.findOne({});
  global.ports = toobject(
    global.configDevice.ports,
    (p: PortDto) => p.portName,
    (p: PortDto) => p.port
  );

  device.create(
    global.configDevice._id.toString(),
    global.configDevice._id.toString(),
    (ack) => {
      if (ack.ok === 0) {
        gun.user(ack.pub).once(async (d) => {
          const gunDevice = await Gun().get(global.configDevice._id.toString()).put({
            pub: d.pub,
            epub: d.epub,
            host: host,
            rack: rack,
            slot: slot,
            name: deviceName,
            ports: null,
            updateRate: null,
          });
          await gun.get('DEVICES').set(gunDevice);
        });
      } else {
        console.log(ack.err);
      }
    }
  );
  global.authEmmiter.emit('auth');
  return cb('Device added!');
}

export async function authDevices() {
  global.ports = toobject(
    global.configDevice.ports,
    (p: PortDto) => p.portName,
    (p: PortDto) => p.port
  );
  device.auth(global.configDevice._id.toString(), global.configDevice._id.toString(), (d) => {
    console.log(d.sea);
    if (!d.err) global.authEmmiter.emit('auth');
  });
}

export async function deleteDevices(cb?: (res: string) => void) {
  // device.leave()
  // device.delete(configDevice._id.toString(), configDevice._id.toString(), ack => console.log(ack));
  clearInterval(global.intervals);
  global.ports = undefined;
  gun.get('DEVICES').get(global.configDevice._id.toString()).put(null);
  await configDB.deleteMany({});
  global.configDevice = undefined;
  if (global.plc) await global.plc.disconnect();
  global.itemGroup = undefined;
  return cb('Device deleted!');
}
