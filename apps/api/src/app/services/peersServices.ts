import { gun } from '../gundb';
import { peersDB } from '../mongodb';

// dodanie peera
export function addPeer(addr: string): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const mesh = gun.back('opt.mesh'); // DAM
  // Ask local peer to connect to another peer.
  mesh.say({ dam: 'opt', opt: { peers: addr } });
}

// usuniecie peera
export function deletePeer(addr: string): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const mesh = gun.back('opt.mesh'); // DAM
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const peers = gun.back('opt.peers');

  const addrId = Object.keys(peers).find((id) => peers[id] === addr);
  mesh.bye(addrId);
}

export async function getPeers(cb: (res: string[]) => void) {
  return cb(await peersDB.find().toArray());
}

export async function addPeers(addr: string, cb?: (res: string) => void) {
  addPeer(addr);
  peersDB.updateMany(
    { host: addr },
    { $setOnInsert: { host: addr } },
    { upsert: true }
  );
  return cb('Peer added!');
}

export async function deletePeers(addr: string, cb?: (res: string) => void) {
  deletePeer(addr);
  // peersDB.deleteOne({ host: addr });
  return cb('Peer deleted!');
}
