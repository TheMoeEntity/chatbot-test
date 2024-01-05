import axios from "axios";
import { NextResponse } from "next/server";
export async function POST(req: Request, res: Response) {
  const { message } = await req.json();

  try {
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer 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`,
    };
    const data = {
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `You are a highly trained AI chatbot who is to answer only web3 related questions. Any question asked that isn't web3 related reply that you are only trained to answer web3 related questions. ${message}`,
        },
      ],
    };
    await axios.post(url, data, { headers: headers }).then((response) => {
      console.log(response);
      return NextResponse.json(
        { message: response.data.choices[0].message.content },
        { status: 200 }
      );
    });
  } catch (error) {
    NextResponse.json(
      { error: "Something went wrong while creating user" + error },
      { status: 500 }
    );
  }
}
