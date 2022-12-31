import { App } from './app/app';
import { EventEmitter } from 'node:events';
import io from '../src/app/socket';


// services
import { addPeer, addPeers, deletePeers, getPeers } from '../src/app/services/peersServices';
import { getPorts, addPort, deletePort } from '../src/app/services/portsServices';
import { generateCertificate } from '../src/app/services/certificateServices';
import {
  createDeviceProfile,
  deleteDevices,
  getAllDevices,
  getDevice,
  authDevices
} from '../src/app/services/deviceServices';
import {
  putDataToDevice,
  sendDataToOtherDevice,
  putDataToDeviceFromDB
} from '../src/app/services/sendServices';


/* emitter */
global.authEmmiter = new EventEmitter();

io.on('connection', (socket) => {
    global.globalSocket = socket;
    console.log(`Welcome: ${socket.id}`);
    socket.on('getPeers', getPeers);
    socket.on('addPeers', addPeers);
    socket.on('deletePeers', deletePeers);
    socket.on('device:get', getDevice);
    socket.on('device:create', createDeviceProfile);
    socket.on('ports:get', getPorts);
    socket.on('device:addPorts', addPort);
    socket.on('device:deletePorts', deletePort);
    socket.on('device:delete', deleteDevices);
    socket.on('portValue:put', putDataToDevice);
    socket.on('generateCertificate', generateCertificate);
    socket.on('allDevices:get', getAllDevices);
    socket.on('sendToOtherDevice', sendDataToOtherDevice);
  
    socket.on('disconnect', async () => {
      global.globalSocket = undefined;
      console.log(`Bye: ${socket.id}`);
    });
  });

App();