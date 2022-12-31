import { device, gun, sea } from '../gundb';

export async function generateCertificate(
  configDevice,
  sender: string,
  expiryTime: number,
  cb: (res: string) => void
) {
  const senderP = await gun.get('DEVICES').get(sender);
  const certificate = await sea.certify(
    senderP.epub,
    { '*': 'fromDevice' },
    device._.sea,
    null
  );
  gun
    .get('certificates')
    .get(configDevice._id.toString())
    .get(sender)
    .put(certificate);
  return cb('Wygenerowano certyfikat!');
}
