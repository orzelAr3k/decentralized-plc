import { S7Endpoint, S7ItemGroup } from '@st-one-io/nodes7';
import { configDB, logDB, peersDB } from './mongodb';
import { device, sea } from './gundb';
import { pipe, map, entries, toarray } from 'powerseq';
require('gun/lib/load.js');
require('gun/lib/open.js');

// services
import {
  addPeer,
  addPeers,
  deletePeers,
  getPeers,
} from './services/peersServices';
import { getPorts, addPort, deletePort } from './services/portsServices';
import { generateCertificate } from './services/certificateServices';
import {
  createDeviceProfile,
  deleteDevices,
  getAllDevices,
  getDevice,
  authDevices,
} from './services/deviceServices';
import {
  putDataToDevice,
  sendDataToOtherDevice,
  putDataToDeviceFromDB,
} from './services/sendServices';

export async function App() {
  (async () => {
    global.configDevice = <ConfigDeviceDto>await configDB.findOne({});
    const peers = await peersDB.find({}).project({ _id: 0, host: 1 }).toArray();
    if (peers.length > 0) peers.forEach((peer) => addPeer(peer.host as string));
    if (global.configDevice) await authDevices();

    // gun.get('DEVICES').load(d => console.log(d));
    // gun.get('certificates').load(d => console.log(d));
  })();

  global.authEmmiter.on('auth', async () => {
    console.log('!!! Device working !!!');
    // device.get('fromDevices').get('ports').on(d => console.log(d));
    // gun.get('DEVICES').load(d => console.log(d));

    global.plc = await new S7Endpoint({
      host: global.configDevice.host,
      rack: global.configDevice.rack,
      slot: global.configDevice.slot,
    });
    global.itemGroup = new S7ItemGroup(global.plc);
    global.itemGroup.setTranslationCB((tag) => global.ports[tag]);
    global.itemGroup.addItems(Object.keys(global.ports));

    global.plc.on('error', (e) => {
      if (global.intervals) clearInterval(global.intervals);
      if (global.globalSocket) {
        global.globalSocket.emit('device:error', e);
        global.globalSocket.emit('device:connect', false);
      }
      // console.log('PLC Error!', e)
    });
    global.plc.on('disconnect', () => {
      if (global.globalSocket)
        global.globalSocket.emit('device:connect', false);
      clearInterval(global.intervals);
      console.log('PLC Disconnect');
    });
    global.plc.on('connect', () => {
      console.log('PLC Connect');

      global.intervals = setInterval(async () => {
        const items = await global.itemGroup.readAllItems();
        const encryptedItems = await sea.encrypt(items, process.env.SECRET);
        device.get('memory').put(encryptedItems);
        if (global.globalSocket) {
          global.globalSocket.emit(
            'device:readValue',
            pipe(
              entries(items),
              map((p: [string, string]) => ({ portName: p[0], value: p[1] })),
              toarray()
            )
          );
          global.globalSocket.emit('device:connect', true);
          global.globalSocket.emit('device:error', null);
        }
      }, global.configDevice.updateRate);

      putDataToDeviceFromDB();
      device
        .get('memory')
        .on(async (d) => console.log(await sea.decrypt(d, process.env.SECRET)));
    });
  });
}
