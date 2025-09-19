import { user } from "@workspace/db/schema/auth";
import db from "../client";

export const healthRepo = {
  async getHealth() {
    try {
    console.log('Getting health');
    const result = await Promise.race([db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
    }).from(user), new Promise((resolve) => setTimeout(resolve, 1000))]);
    console.log('Result', result);
    if (result instanceof Promise) {
      return {
        status: 'error',
        message: 'Timeout',
      };
    }
    if ((result as any).length === 0) {
      console.log('No users found');
      return {
        status: 'error',
        message: 'No users found',
      };
    }
    console.log('Users found');
    return {
      status: 'ok',
      message: 'Users found',
        data: (result as any).at(0),
      };
    } catch (error) {
      console.log('Error getting health', error);
      return {
        status: 'error',
        message: 'Error getting health',
      };
    }
  },
};
