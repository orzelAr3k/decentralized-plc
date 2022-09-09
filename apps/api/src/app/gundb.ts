// eslint-disable-next-line @typescript-eslint/no-var-requires
const Gun = require('gun');
import Sea from 'gun/sea';

export const gun = Gun({ peers: ['http://localhost:8000/gun'] });
export const device = gun.user();
export const sea = Sea;


// dodanie peerow
export function addPeers(addr: string): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mesh = gun.back('opt.mesh'); // DAM
    // Ask local peer to connect to another peer.
    mesh.say({ dam: 'opt', opt: { peers: addr }});
  }
  
// usuniecie peerow
export function deletePeers(addr: string): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mesh = gun.back('opt.mesh'); // DAM
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const peers = gun.back('opt.peers');
    console.log(peers);
    const addrId = Object.keys(peers).find(id => peers[id] === addr);
    mesh.bye(addrId);
}

// generowanie certyfiaktu
async function generateCertificate(deviceFrom, devicesTo, expiryTime): Promise<string> {
  return await sea.certify(devicesTo, [], deviceFrom, null, {expiry: Gun.state()+(expiryTime)});
}