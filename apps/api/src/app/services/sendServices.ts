import { gun, sea, device } from '../gundb';

export async function putDataToDevice(
  item: string,
  value: any,
  cb?: (res: string) => void
) {
  global.itemGroup.writeItems(item, value);
  return cb('Przesłano wartość');
}

export async function putDataToDeviceFromDB() {
  device
    .get('fromDevices')
    .get('ports')
    .load((items) => console.log(items));
}

export async function sendDataToOtherDevice(
  deviceId: string,
  portName: string,
  port: string
) {
  const certificate = await gun
    .get('certificates')
    .get(deviceId)
    .get(global.configDevice._id.toString())
    .then();
  if (certificate)
    device.get('memory').on(async (d) => {
      const devicePub = await gun
        .get('DEVICES')
        .get(deviceId)
        .get('pub')
        .then();
      const items = await sea.decrypt(d, process.env.SECRET);
      try {
        gun
          .user(devicePub)
          .get('fromDevice')
          .get('ports')
          .put({ portName: items[portName] }, null, {
            opt: { cert: certificate },
          });
      } catch (err) {
        console.log(err);
      }
    });
  // else throw Error('Certificate not found');
}
