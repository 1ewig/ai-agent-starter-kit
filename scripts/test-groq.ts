import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { wrapModelWithThinking } from '../src/agent/providers/models';
import { getAgentTools } from '../src/agent/tools';
import { STERLING_INSTRUCTIONS } from '../src/agent/instructions';

async function testGptOss120bAgent() {
  const modelName = 'openai/gpt-oss-120b';
  console.log(`\n======================================================`);
  console.log(`🧪 Testing Full Agent Run on Groq: ${modelName}`);
  console.log(`======================================================\n`);

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
  const model = wrapModelWithThinking(groq(modelName));
  const tools = getAgentTools();
  const system = STERLING_INSTRUCTIONS;

  const start = Date.now();

  try {
    const stream = streamText({
      model,
      prompt: 'hey, who are you?',
      system,
      tools,
      maxOutputTokens: 1000,
      providerOptions: {
        groq: {
          reasoningEffort: 'low',
        },
      },
    });

    let textOut = '';
    let reasoningOut = '';

    for await (const part of stream.fullStream) {
      if (part.type === 'reasoning-delta') {
        reasoningOut += part.text;
      } else if (part.type === 'text-delta') {
        textOut += part.text;
      }
    }

    const usage = await stream.totalUsage;
    console.log(`✅ Success in ${Date.now() - start}ms!`);
    console.log(`• Output Tokens: ${usage.outputTokens} (Reasoning: ${usage.outputTokenDetails?.reasoningTokens ?? 0})`);
    console.log(`• Total Tokens: ${usage.totalTokens}`);
    console.log(`• Response: "${textOut.trim().slice(0, 150)}..."`);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.log(`❌ Error: ${errorMsg}`);
  }
}

testGptOss120bAgent();
