/* --- imports --- */
import { EventEmitter } from 'node:events';
import * as express from 'express';
import { S7Endpoint, S7ItemGroup, S7Connection } from '@st-one-io/nodes7';
import io from './app/socket';
import { configDB, logDB } from './app/mongodb';
import { gun, device, sea, addPeers, deletePeers } from './app/gundb';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Gun = require('gun/gun');
import { ObjectId } from 'mongodb';
import { toobject, pipe, map, entries, toarray } from 'powerseq'
import { clearInterval } from 'node:timers';
/* ---------------*/

/* --- global variable --- */
let configDevice: ConfigDeviceDto; 
let ports;
let globalSocket;
let plc;
let itemGroup;
let intervals;

/** --- event --- */
const authEmmiter = new EventEmitter();

const endpoints = {
  'Dodanie urządzenia': 'SOCKET - "device:create": ARGS[deviceName, host, rack, slot]',
  'Usunięcie urządzenia': 'SOCKET - "device:delete": ARGS[]',
  'Dodanie portów': 'SOCKET - "device:addPorts": ARGS[items]',
  'Usunięcie portów': 'SOCKET - "device:deletePorts": ARGS[items]',
  'Odczytanie wartości': 'SOCKET - "device:readValue', 
};
const app = express();
app.get('/api', (req, res) => {
    res.send(endpoints);
  });
  
const PORT = process.env.PORT || 3333;
const server = app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/api`);
  });
server.on('error', console.error);
    

io.on('connection', (socket) => {
  globalSocket = socket;
  console.log('Welcome: ' + socket.id);
  socket.on('addPeers', addPeers);
  socket.on('deletePeers', deletePeers);
  socket.on('device:get', getDevice);
  socket.on('device:status', getDeviceStatus);
  socket.on('device:create', createDeviceProfile);
  socket.on('ports:get', getPorts);
  socket.on('device:addPorts', addPort);
  socket.on('device:deletePorts', deletePort);
  socket.on('device:delete', deleteDevices);

  socket.on("disconnect", async () => {
    globalSocket = undefined;
    console.log('Bye: ' + socket.id);
  });
});


async function getDevice(cb?: (res: ConfigDeviceDto) => void) {
  return cb(configDevice);
}

async function getDeviceStatus(socket) {
}

async function createDeviceProfile(deviceName: string, host: string, rack: number, slot: number, updateRate: number, cb?: (res: string | null) => void) {

  await configDB.deleteMany({});
  await configDB.insertOne({ host: host, rack: rack, slot: slot, name: deviceName, ports: [], updateRate: updateRate });
  configDevice = <ConfigDeviceDto> await configDB.findOne({});
  ports = toobject(configDevice.ports, p => p.portName, p => p.port);

  device.create(configDevice._id.toString(), configDevice._id.toString(), ack => {
    if (ack.ok === 0) {
      gun.user(ack.pub).once(async (d) => {
        const gunDevice = await Gun().get(configDevice._id.toString()).put({ pub: d.pub, epub: d.epub, host: host, rack: rack, slot: slot, name: deviceName, ports: null, updateRate: null });
        await gun.get('DEVICES').set(gunDevice); 
      });
    } else {
      console.log(ack.err);
    }
  }); 



  authEmmiter.emit('auth');
  return cb('Device added!');
}

async function authDevices() {
  ports = toobject(configDevice.ports, p => p.portName, p => p.port);
  device.auth(configDevice._id.toString(), configDevice._id.toString(), d => {
    console.log(d.sea);
    if (!d.err) authEmmiter.emit('auth');
  });
}

async function deleteDevices(cb?: (res: string) => void) {
  // device.leave()
  // device.delete(configDevice._id.toString(), configDevice._id.toString(), ack => console.log(ack));
  clearInterval(intervals);
  gun.get('DEVICES').get(configDevice._id.toString()).put(null);
  await configDB.deleteMany({});
  configDevice = undefined;
  await plc.disconnect();
  return cb('Device deleted!');
}

// sterownik plc

// błąd działania
// async function startInterval(name: string, updateRate: number, intervals) {
//   intervals = setInterval(async () => {
//     const items = await itemGroup.readAllItems();
//     device.get('memory').put(items);
//     if (globalSocket) globalSocket.emit('device:readValue', items);
//   }, updateRate);
// }

async function getPorts(cb?: (res: any) => void) {
  return cb(pipe(entries(ports), map(p => ({ portName: p[0], port: p[1], value: null })), toarray()));
}

async function addPort(portName: string, port: string,  cb?: (res: string) => void) {
  ports[portName] = port;
  configDB.updateOne({ _id: new ObjectId(configDevice._id)}, { $addToSet: { ports: { portName: portName, port: port } } });
	itemGroup.addItems(portName);
  return cb('Dodano port!');
}

async function deletePort(portName: string, cb?: (res: string) => void) {
  configDB.updateOne({ _id: new ObjectId(configDevice._id)}, { $pull: { ports: { $elemMatch: { portName: portName }}}});
  itemGroup.removeItems(portName);
  return cb('Usunięto port!');
}

async function getDataFromDevice(cb: (res: any[]) => void) {

  // return cb(res);
}

async function putDataToDevice(items: string[], values: any[]) {
  itemGroup.writeItems(items, values);
}

async function putDataToDeviceFromDB(deviceId: string) {

}

async function getDataFromDeviceToDB(deviceId: string) {

}

async function sendDataToOtherDevice() {

}

async function readDataFromOtherDevice() {

}

async function generateCertificate(sender: string, expiryTime: number, cb: (res: any) => void) {
  const senderP = await gun.get('DEVICES').get(sender).once();
  const certificate = sea.certify([senderP.pub], {}, device, null, { expiry: expiryTime });
  gun.get('certificates').get(configDevice._id).get(senderP.key).put(certificate);
  return cb(certificate);
}


(async () => {
  configDevice = <ConfigDeviceDto> await configDB.findOne({});
  if (configDevice) await authDevices();
  
})();


authEmmiter.on('auth', async () => {
  console.log("!!! Device working !!!");

  gun.get('DEVICES').once(d => console.log(d));

  plc = await new S7Endpoint({ host: configDevice.host, rack: configDevice.rack, slot: configDevice.slot });
  itemGroup = new S7ItemGroup(plc);
  itemGroup.setTranslationCB(tag => ports[tag]);
  itemGroup.addItems(Object.keys(ports));

  plc.on('error', e => {
    if (globalSocket) globalSocket.emit('device:error', e);
    console.log('PLC Error!', e)
  });
  plc.on('disconnect', () => {
    if (globalSocket) globalSocket.emit('device:connect', false);
    console.log('PLC Disconnect');
  });
  plc.on('connect', () => {
    if (globalSocket) globalSocket.emit('device:connect', true);
    console.log('PLC Connect')

    intervals = setInterval(async () => {
      const items = await itemGroup.readAllItems();
      device.get('memory').put(items);
      if (globalSocket) globalSocket.emit('device:readValue', pipe(entries(items), map((p: [string, string]) => ({ portName: p[0], port: p[1] })), toarray()));
    }, configDevice.updateRate);


    // startInterval(configDevice.name, configDevice.updateRate, intervals);
    // device.get('memory').on(d => console.log(d));
  });
});

