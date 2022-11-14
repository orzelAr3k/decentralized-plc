// eslint-disable-next-line @typescript-eslint/no-var-requires
const Gun = require('gun');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sea = require('gun/sea');
import { peersDB, logDB } from './mongodb';

export const gun = Gun({ peers: ['http://localhost:5634/gun'] });
export const device = gun.user();
export const sea = Sea;

// const mesh = gun.back();
// /** set database default path  */
// mesh._.opt.file = '../radata';


// dodanie peerow
export function addPeer(addr: any): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mesh = gun.back('opt.mesh'); // DAM
    // Ask local peer to connect to another peer.
    mesh.say({ dam: 'opt', opt: { peers: addr }});
  }
  
// usuniecie peerow
export function deletePeer(addr: any): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mesh = gun.back('opt.mesh'); // DAM
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const peers = gun.back('opt.peers');
    
    const addrId = Object.keys(peers).find(id => peers[id] === addr);
    mesh.bye(addrId);
}

// generowanie certyfiaktu
async function generateCertificate(deviceFrom, devicesTo, expiryTime): Promise<string> {
  return await sea.certify(devicesTo, [], deviceFrom, null, { expiry: Gun.state()+(expiryTime) });
}