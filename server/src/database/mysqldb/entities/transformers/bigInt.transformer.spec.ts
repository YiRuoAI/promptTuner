import { BigIntTransformer } from './bigInt.transformer';

describe('BigIntTransformer', () => {
  describe('from', () => {
    it('should return the stringified value', () => {
      const transformer = new BigIntTransformer();
      const result = transformer.from(1);
      expect(result).toEqual('1');
    });
  });
  describe('to', () => {
    it('should return the stringified value', () => {
      const transformer = new BigIntTransformer();
      const result = transformer.to('1');
      expect(result).toEqual('1');
    });
  });
});
