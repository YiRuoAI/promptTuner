import { DateTransformer } from './date.transformer';

describe('DateTransformer', () => {
  describe('from', () => {
    it('should return the stringified value', () => {
      const transformer = new DateTransformer();
      const result = transformer.from(new Date());
      expect(result).toEqual(expect.any(String));
    });
    it('should return the undefined value', () => {
      const transformer = new DateTransformer();
      const result = transformer.from('');
      expect(result).toEqual(undefined);
    });
    it('should return the undefined value', () => {
      const transformer = new DateTransformer();
      const result = transformer.from('fasdfadgew');
      expect(result).toEqual(undefined);
    });
  });
  describe('to', () => {
    it('should return the date value', () => {
      const transformer = new DateTransformer();
      const result = transformer.to(new Date());
      expect(result).toEqual(expect.any(Date));
    });
    it('should return the date value', () => {
      const transformer = new DateTransformer();
      const result = transformer.to('2021-01-01 00:00:00');
      expect(result).toEqual(expect.any(Date));
    });
    it('should return the undefined value', () => {
      const transformer = new DateTransformer();
      const result = transformer.to('');
      expect(result).toEqual(undefined);
    });
  });
});
