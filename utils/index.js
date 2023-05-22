// import required modules
import endent from 'endent'; // string indentation library
import { createParser } from 'eventsource-parser'; // eventsource parser for parsing stream data

// define a function that creates a prompt message based on the input and output language and input code
const createPrompt = (inputLanguage, outputLanguage, inputCode) => {
  // if input language is natural language
  if (inputLanguage === 'Natural Language') {
    // return a prompt message asking to translate natural language to output language code
    return endent`
      You are an expert programmer in all programming languages. Translate the natural language to "${outputLanguage}" code. Do not include \`\`\`.
      Example translating from natural language to JavaScript:
      Natural language:
      Print the numbers 0 to 9.
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
      Natural language:
      ${inputCode}
      ${outputLanguage} code (no \`\`\`):
    `;
  // if output language is natural language
  } else if (outputLanguage === 'Natural Language') {
    // return a prompt message asking to translate input language code to natural language
    return endent`
      You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to natural language in plain English that the average adult could understand. Respond as bullet points starting with -.
      Example translating from JavaScript to natural language:
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
      Natural language:
      Print the numbers 0 to 9.
      ${inputLanguage} code:
      ${inputCode}
      Natural language:
    `;
  // otherwise, output language is a programming language
  } else {
    // return a prompt message asking to translate input language code to output language code
    return endent`
      You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to "${outputLanguage}" code. Do not include \`\`\`.
      Example translating from JavaScript to Python:
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
      Python code:
      for i in range(10):
        print(i)
      ${inputLanguage} code:
      ${inputCode}
      ${outputLanguage} code (no \`\`\`):
    `;
  }
};

// define a function that sends a request to the OpenAI GPT-3 API with the prompt message and returns the response as a stream
export const OpenAIStream = async (inputLanguage, outputLanguage, inputCode) => {
  // create the prompt message using the createPrompt function
  const prompt = createPrompt(inputLanguage, outputLanguage, inputCode);

  // define the system message as an object with a role and content
  const system = { role: 'system', content: prompt };

  // send a POST request to the OpenAI GPT-3 API with the system message and stream parameters
  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer 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`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [system],
      temperature: 0,
      stream:true,
    }),
  });
}
