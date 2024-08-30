import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const readMeasureResponseSchema = z.object({
  measureValue: z.number(),
  measureDate: z.string(),
});

type ReadMeasureResponse = z.infer<typeof readMeasureResponseSchema>;

export async function readMeasure(image: string): Promise<ReadMeasureResponse> {
  const prompt =
    `
     Take the amount to pay and the "Data Leit. Atual".
     The returned value needs to be of numeric type.
     Convert the current reading date so that it is in the YYYY-MM-DD format.
     Do not read the due date, installation date, or previous reading date.
     Return with the following structure: { measureValue: value, measureDate: date },
     without formatting for markdown and in a format suitable for conversion using JSON.parse.
    `;
  const imagePart = {
    data: image,
    mimeType: "image/jpeg",
  };

  const result = await model.generateContent([prompt, { inlineData: imagePart }]);
  const jsonResponse = JSON.parse(
    result.response.text().toString()
  ) as ReadMeasureResponse;
  const response = readMeasureResponseSchema.safeParse(jsonResponse);

  if (!response.success) {
    throw new Error("Error to get info from bill");
  }

  return response.data;
}
