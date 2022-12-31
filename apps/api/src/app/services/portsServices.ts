import { ObjectId } from 'mongodb';
import { toobject, entries } from 'powerseq';
import { gun, device } from '../gundb';
import { configDB } from '../mongodb';

export async function getPorts(cb?: (res: any) => void) {
  return cb(
    toobject(
      entries(global.ports || []),
      (k) => k[0],
      (v) => ({ port: v[1], value: null })
    )
  );
}

export async function addPort(
  portName: string,
  port: string,
  cb?: (res: string) => void
) {
  global.ports[portName] = port;
  configDB.updateOne(
    { _id: new ObjectId(global.configDevice._id) },
    { $addToSet: { ports: { portName: portName, port: port } } }
  );
  gun.get('DEVICES').get(global.configDevice._id.toString()).get('ports').put(global.ports);
  global.itemGroup.addItems(portName);
  return cb('Dodano port!');
}

export async function deletePort(portName: string, cb?: (res: string) => void) {
  // rome-ignore lint/performance/noDelete: <explanation>
  delete global.ports[portName];
  configDB.updateOne(
    { _id: new ObjectId(global.configDevice._id) },
    { $pull: { ports: { portName: portName } } }
  );
  global.itemGroup.removeItems(portName);
  device.get('memory').get(portName).put(null);
  return cb('Usunięto port!');
}
