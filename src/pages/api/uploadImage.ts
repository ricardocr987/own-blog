import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { Publish as publishStore } from 'aleph-sdk-ts/dist/messages/store';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { Fields, Files, File } from 'formidable';
import { readFileSync } from "fs";
import { parseForm } from "@/utils/parseForm";

interface FormData {
    fields: Fields
    files: Files
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    if (!process.env.MESSAGES_KEY) {
      return res.status(500).send('MESSAGES_KEY environment variable not found.');
    }
    try {
      const { files } = await parseForm(req);
      const file = files['featuredImage'] as File
      const buffer = readFileSync(file.filepath)
      const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)));
      const blob = new Blob([buffer], { type: 'image/jpeg' }); // replace 'image/jpeg' with the actual MIME type of the file
      const store = await publishStore({
          account,
          channel: 'own-blog',
          fileObject: blob,
          storageEngine: ItemType.storage,
          APIServer: 'https://api2.aleph.im',
      });
      
      return res.status(201).send(store.item_hash);
    } catch (error) {
      console.log('Publish error:', error);
      return res.status(500).send('Internal Server Error.');
    }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

