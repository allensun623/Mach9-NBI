import { extractFuncClass } from '../../utils/map';
import bridges from './rawBridges';

const bridgesPartials = (i) => {
  const bs = bridges.slice(0, i);
  return bs.map((b) => ({
    ...b,
    areaType: extractFuncClass(b.functionalClassificationCode),
  }));
};

export { bridges, bridgesPartials };
