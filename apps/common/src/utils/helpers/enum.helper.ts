import { CollectionDto } from '../../models/enum-collection.dto';

export class EnumHelper {
  static toDescription(enumObject: any, label = 'Supported values'): string {
    let description = `${label}: `;
    for (const enumMember in enumObject) {
      const isValue = Number(enumMember) >= 0;
      if (!isValue) {
        break;
      }
      description = `${description}<br/>&emsp;${enumObject[enumMember]} - ${enumMember}`;
    }
    return description;
  }

  static toCollection(enumObject: any, clientValues?: any): CollectionDto[] {
    const resultArray = [];
    for (const enumMember in enumObject) {
      const isValue = Number(enumMember) >= 0;
      if (!isValue) {
        break;
      }
      resultArray.push(
        new CollectionDto(
          clientValues ? clientValues[enumMember] : enumObject[enumMember],
          parseInt(enumMember),
        ),
      );
    }

    return resultArray;
  }

  static toOrderByKeys(
    enumObject: any,
    orderType: 'desc' | 'asc' = 'desc',
  ): CollectionDto[] {
    let collection = EnumHelper.toCollection(enumObject);

    collection = collection.sort((obj1, obj2) =>
      obj1.key.localeCompare(obj2.key),
    );

    return orderType === 'desc' ? collection : collection.reverse();
  }

  static objToDescription(enumObject: any, label = 'Supported values'): string {
    const row = (key: string, value: number | string) =>
      `<br/>&emsp;${key} - ${value}`;

    return `${label}: ${Object.keys(enumObject)
      .map((key) => row(key, enumObject[key]))
      .join()}`;
  }

  static getEnumKeyByEnumValue(
    myEnum: any,
    enumValue: number | string,
  ): string {
    const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : '';
  }

  static getKeyByValue(enumObject: any, value: number | string): string {
    return Object.keys(enumObject).find((key) => enumObject[key] === value);
  }
}
