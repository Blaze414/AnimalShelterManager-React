import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('AnimalShelterManager');

  // Ensure the 'medical' collection exists
  const collectionName = 'medical';
  const collection = db.collection(collectionName);

  // Check if the collection exists and create it if it doesn't
  const collections = await db.listCollections({ name: collectionName }).toArray();
  if (collections.length === 0) {
    await db.createCollection(collectionName);
  }

  if (req.method === 'POST') {
    const data = req.body;
    const result = await collection.insertOne(data);
    res.json(result);
  } else if (req.method === 'GET') {
    const records = await collection.find({}).toArray(); // Retrieve all medical records
    res.json(records);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 