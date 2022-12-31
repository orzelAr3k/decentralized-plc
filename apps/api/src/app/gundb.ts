// eslint-disable-next-line @typescript-eslint/no-var-requires
const Gun = require('gun');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sea = require('gun/sea');

export const gun = Gun({ peers: ['http://localhost:5634/gun'] });
export const device = gun.user();
export const sea = Sea;
