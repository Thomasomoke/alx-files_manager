import dbClient from '../utils/db';
import SHA1 from 'crypto-js/sha1'; // Use SHA1 hashing
import { ObjectId } from 'mongodb';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if email already exists in the DB
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = SHA1(password).toString();

    // Create new user object
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Insert the new user into the database
    const result = await dbClient.db.collection('users').insertOne(newUser);

    // Return the new user with only the email and id
    return res.status(201).json({
      id: result.insertedId.toString(),
      email: newUser.email,
    });
  }
}

export default UsersController;
