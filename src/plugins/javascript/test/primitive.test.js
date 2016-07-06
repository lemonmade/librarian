import {getFirstMatch} from './utilities';
import {PrimitiveType} from '../entities';

describe('primitive', () => {
  async function getFirstPrimitive(source) {
    return await getFirstMatch({source, type: PrimitiveType});
  }

  it('creates a string value', async () => {
    const primitive = await getFirstPrimitive('export default "bar";');

    expect(primitive)
      .to.be.an.entityOfType(PrimitiveType)
      .with.properties({value: 'bar'});
  });

  it('creates a boolean primitive', async () => {
    const primitive = await getFirstPrimitive('export default false;');

    expect(primitive)
      .to.be.an.entityOfType(PrimitiveType)
      .with.properties({value: false});
  });

  it('creates a numeric primitive', async () => {
    const primitive = await getFirstPrimitive('export default 1.23;');

    expect(primitive)
      .to.be.an.entityOfType(PrimitiveType)
      .with.properties({value: 1.23});
  });

  it('creates a null primitive', async () => {
    const primitive = await getFirstPrimitive('export default null;');

    expect(primitive)
      .to.be.an.entityOfType(PrimitiveType)
      .with.properties({value: null});
  });
});
