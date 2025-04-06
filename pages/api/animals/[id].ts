import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('AnimalShelterManager');

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const animal = await db.collection('animals').findOne({ _id: new ObjectId(id as string) });
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }
      res.json(animal);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching animal details' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 