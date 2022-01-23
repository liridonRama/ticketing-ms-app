import bcrypt from 'bcrypt';

export class Password {
  static async toHash(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(plainPassword, salt);
  }

  static async compare(plainPassword: string, storedPassword: string,): Promise<boolean> {
    return bcrypt.compare(plainPassword, storedPassword);
  }
}