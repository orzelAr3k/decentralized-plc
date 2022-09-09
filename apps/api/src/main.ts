/* --- imports --- */
import { EventEmitter } from 'node:events';
import * as express from 'express';
import { S7Endpoint, S7ItemGroup } from '@st-one-io/nodes7';
import io from './app/socket';
import { configDB, logDB } from './app/mongodb';
import { gun, device, sea, addPeers, deletePeers } from './app/gundb';
import Gun from 'gun/gun';
/* ---------------*/

/* --- global variable --- */
let configDevice; 
let globalSocket;
let plc;


/* --- emiters --- */
const fetchDataDevices = new EventEmitter();

// fetchDataDevices.emit('getData');

// const app = express();
// app.get('/api', (req, res) => {
  //   res.send({ message: 'Welcome to api!' });
  // });
  
  // const PORT = process.env.PORT || 3333;
  // const server = app.listen(PORT, () => {
    //   console.log(`Listening at http://localhost:${PORT}/api`);
    // });
    // server.on('error', console.error);
    



io.on('connection', (socket) => {
  globalSocket = socket;
  socket.on('device:create', createDeviceProfile);
  socket.on('device:delete', deleteDevices);
});


async function createDeviceProfile(deviceName: string, host: string, rack: number, slot: number, cb?: () => void) {
  try {
    plc = await new S7Endpoint({ host: host, rack: rack, slot: slot });
  
    if (!configDevice) {
      await configDB.insertOne({ host: host, rack: rack, slot: slot, name: deviceName, ports: [], updateRate: undefined });
      configDevice = await configDB.findOne({});
    }

    device.create(configDevice._id.toString(), configDevice._id.toString()).then(ack => {
      if (ack.ok === 0) {
          gun.user(ack.pub).once(async (d) => {
            const gunDevice = await Gun().get(configDevice._id.toString()).put({ pub: d.pub, epub: d.epub, host: host, rack: rack, slot: slot, name: deviceName, ports: null, updateRate: null });
            await gun.get('DEVICES').set(gunDevice); 
          });
      } else {
          console.log(ack.err);
      }
    }); 
  } catch(error) {
    console.log(error);
  }
}

async function authDevices() {
  device.auth(configDevice._id.toString(), configDevice._id.toString());
}

async function deleteDevices(cb?: () => void) {
  device.delete(configDevice._id.toString(), configDevice._id.toString(), (d) => {
    console.log(d);
  });
}

// sterownik plc

//const PLC = createDeviceProfile()
// const itemGroup = new S7ItemGroup(plc);
// const vars: Record<string, string> = {};

// const vars = {
//   TEST1: 'MR2', 			// Memory real at MD2
//   TEST2: 'M1.1', 		// Bit at M1.1
// }

// function addNewVar(name: 'string', port: 'string'): void {
//   vars[name] = port;
// }

// function deleteVar(name): void {
//   delete vars[name];
// }

// plc.on('error', e => console.log('PLC Error!', e));
// plc.on('disconnect', () => console.log('PLC Disconnect'));
// plc.on('connect', async () => {
// 	console.log('Connected!');
// 	itemGroup.setTranslationCB(tag => vars[tag]); //translates a tag name to its address
// 	itemGroup.addItems(Object.keys(vars));

// 	console.log(await itemGroup.readAllItems());
// 	await itemGroup.writeItems('TEST1', 4);

// 	// await plc.disconnect(); 	//clean disconnection
// });



(async () => {
  configDevice = await configDB.findOne({}); //.then((config) => configDevice = config);
  if (configDevice) await authDevices();
  // await createDeviceProfile('PLC', '192.168.1.1', 1, 1);
  // await deleteDevices();
})();


gun.on('auth', () => {
  console.log("Urządzenie działa");






});