import type { NextApiRequest } from "next";
import formidable from "formidable";

export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    const form = new formidable.IncomingForm()
    return new Promise(async (resolve, reject) => {
        form.parse(req, function (err, fields, files) {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};
