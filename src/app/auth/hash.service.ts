import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltOrRounds = 10;

  async hash(anyString: string): Promise<string> {
    const encryptedString = await bcrypt.hash(anyString, this.saltOrRounds);
    return encryptedString;
  }

  async compare(anyString: string, encryptedString: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(anyString, encryptedString);
    return isMatch;
  }
}
