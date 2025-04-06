import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('AnimalShelterManager');

  // Ensure the 'animals' collection exists
  const collectionName = 'animals';
  const collection = db.collection(collectionName);

  // Check if the collection exists and create it if it doesn't
  const collections = await db.listCollections({ name: collectionName }).toArray();
  if (collections.length === 0) {
    await db.createCollection(collectionName);
  }

  if (req.method === 'POST') {
    const data = req.body;
    try {
      const result = await collection.insertOne(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error inserting animal' });
    }
  } else if (req.method === 'GET') {
    try {
      const records = await collection.find({}).toArray(); // Retrieve all animal records
      res.status(200).json(records);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching animals' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 