import * as express from 'express';
import { Server } from 'socket.io';
import Gun from 'gun'

const app = express();
const io = new Server(3000, {
  cors: { origin: "http://localhost:4200" }
});
const gun = Gun();
const user = gun.user();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('login', login);
  socket.on('signin', createAccount);
})

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);



async function createAccount(login: string, password: string, callback) {
  user.create(login, password, (ack) => {
    if ("ok" in ack && ack.ok === 0) return callback({ login: login, pub: ack.pub });
    else if("err" in ack) return callback({ error: ack.err});
  }); 
}

function login(login, password, callback) {
  user.auth(login, password, (at) => {
    if ("ack" in at) return callback({ login: login })
    else if ("err" in at) return callback({ error: at.err });
  });
} 

function logout(callback) {
  user.leave();
}

// function generateCertificate() {
  
// }




// konfiguracja sterownika
/*
zalogowanie lub utworzenie konta

utworzenie nowego profilu - zapiis do bazy danych

 */


// dodanie peerow

// function addPeers(addr: string) {

// }


// sterownik plc 

// let plc;
// const itemGroup = new S7ItemGroup(plc);
// const vars: Record<string, string> = {};

// const vars = {
//   TEST1: 'MR2', 			// Memory real at MD2
//   TEST2: 'M1.1', 		// Bit at M1.1
// }

// function createDeviceProfile(deviceName: string, host: string, rack: number, slot: number) {
//   plc = new S7Endpoint({ host: host, rack: rack, slot: slot });


//   // gun.user dodać dla usera konfiguracje
//   gun.get('USERS')

//   // gun.list wszystkich urządzeń w sieci
//   const device: Device = { name: deviceName, }
//   gun.get('DEVICES').set()

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