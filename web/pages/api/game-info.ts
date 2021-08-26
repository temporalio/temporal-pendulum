import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  time: number;
};

export default function handler(_req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ time: Date.now() });
}
