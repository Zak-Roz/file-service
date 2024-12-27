import { randomBytes } from 'crypto';
import { DateTime } from 'luxon';

export class MathHelper {
  /**
   * Generates a cryptographically secure random string of numbers.
   *
   * @param length - The length of the random string to generate. Must be between 1 and 1000 (inclusive).
   * @returns A random string of numbers.
   * @throws If the provided length is less than or equal to 0 or greater than 1000.
   */
  static generateRandomNumbers(length: number): string {
    if (length <= 0 || length > 1000) {
      throw new Error('Invalid length');
    }

    const randomNumbers = Array.from(randomBytes(Math.round(length)), (byte) =>
      byte?.toString(10),
    );

    return randomNumbers.join('').slice(0, length);
  }

  /**
   * Rounds a number to a specified precision.
   *
   * @param value - The number to round.
   * @param precision - The number of decimal places to round to (default is 0). Must be between 0 and 10 (inclusive).
   * @returns The rounded number.
   * @throws If the provided precision is less than 0 or greater than 10.
   */
  static round(value: number, precision = 0): number {
    if (precision < 0 || precision > 10) {
      throw new Error('Invalid precision');
    }

    const multiplier = Math.pow(10, precision || 0);

    return Math.round(value * multiplier) / multiplier;
  }

  /**
   * Calculates the age based on the provided date of birth.
   *
   * @param value - The date of birth in ISO 8601 format (e.g., "YYYY-MM-DD").
   * @returns The age calculated from the date of birth.
   */
  static getAge(dateOfBirth: string): number {
    return parseInt(`${-DateTime.fromISO(dateOfBirth).diffNow('years').years}`);
  }
}
