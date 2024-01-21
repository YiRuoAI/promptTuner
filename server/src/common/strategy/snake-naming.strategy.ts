import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    const combinedPropertyName = embeddedPrefixes
      .concat(propertyName)
      .join('_');
    return customName ? customName : snakeCase(combinedPropertyName);
  }
}
