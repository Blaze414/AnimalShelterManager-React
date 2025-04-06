import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('Animal Shelter Manager'); // Replace with your database name

  if (req.method === 'GET') {
    const users = await db.collection('users').find({}).toArray(); // Replace 'users' with your collection name
    res.json(users);
  } else if (req.method === 'POST') {
    const user = req.body;
    const result = await db.collection('users').insertOne(user); // Replace 'users' with your collection name
    res.json(result);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 