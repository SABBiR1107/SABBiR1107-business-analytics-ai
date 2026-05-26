import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { messages, dataset, model, semanticRules } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: 'OPENROUTER_API_KEY is not configured' },
        { status: 500 }
      );
    }

    let systemPrompt = '';
    
    if (dataset && dataset.data) {
      // Safely serialize up to 400 rows of the dataset to guarantee high-performance, cost-safety, and limit prevention
      const limitedData = dataset.data.slice(0, 400);
      const headers = dataset.columns.join(',');
      const rows = limitedData.map((row: any) => 
        dataset.columns.map((col: string) => {
          const val = row[col];
          if (val === undefined || val === null) return '';
          const strVal = String(val);
          if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
            return `"${strVal.replace(/"/g, '""')}"`;
          }
          return strVal;
        }).join(',')
      ).join('\n');
      
      const fullCsv = `${headers}\n${rows}`;

      let rulesContext = '';
      if (semanticRules && Array.isArray(semanticRules) && semanticRules.length > 0) {
        rulesContext = `\nCRITICAL: The user has established strict Semantic Glossary Rules for business calculations. You MUST calculate these metrics using ONLY the formulas defined below:\n` +
          semanticRules.map((rule: any) => `- **${rule.name}**: ${rule.formula}`).join('\n') + `\n`;
      }

      systemPrompt = `You are an elite business analytics expert. You have full access to the user's uploaded spreadsheet dataset.
You must perform exact calculations, aggregations, and data-driven analysis based on the complete dataset provided below.
${rulesContext}
Uploaded Dataset Details:
- Filename: ${dataset.filename || 'business-data.csv'}
- Total Row Count: ${dataset.rowCount} rows (Displaying first ${limitedData.length} rows for high-fidelity calculations)
- Columns: ${dataset.columns.join(', ')}

Here is the dataset in raw CSV format. Carefully parse, loop through, and analyze ALL rows to answer the user's query with 100% mathematical accuracy:
\`\`\`csv
${fullCsv}
\`\`\`

When analyzing data:
1. NEVER guess, generalize, or make up numbers. Use the provided CSV dataset to calculate precise sums, averages, counts, margins, or percentages.
2. Group data by categories, channels, or dates when analyzing sales, expenses, performance, or timelines.
3. Be highly analytical. If the user requests reports (1-day, 1-week, 15-day, monthly), extract exact metrics (e.g., total sales, top categories, profit margins, operational trends) and display them in clean formatted markdown tables.
4. Lead with exact, real-world data numbers rather than generic business texts. Format your responses clearly with sections for Summary, Key Insights, Trends, and Recommendations.
5. OPTIONAL INLINE CHARTS GENERATION:
   If the user asks for a chart, graph, or visual trend analysis of the data, you MUST include a custom JSON chart block wrapped inside standard markdown code blocks with the language 'json-chart'.
   The JSON block MUST follow this precise structure:
   \`\`\`json-chart
   {
     "type": "line" | "bar" | "area",
     "title": "A short descriptive title for the chart",
     "xAxisKey": "name",
     "yAxisKey": "value",
     "data": [
       {"name": "Category A", "value": 120},
       {"name": "Category B", "value": 180}
     ]
   }
   \`\`\`
   Keep the names short and the values numeric. Do NOT include any comments or other characters inside the code fences. You can place standard text explanations before or after this block.
6. At the ABSOLUTE END of your response, you MUST always suggest exactly 3 short, highly relevant follow-up questions that the user can ask next to explore this data deeper. Format these questions at the very end of your response using the special block tag [SUGGESTED_QUESTIONS] on a new line like this:

[SUGGESTED_QUESTIONS]
- First follow-up question here?
- Second follow-up question here?
- Third follow-up question here?

Do not wrap this suggested questions block in any code blocks or formatting rules. Keep the questions short, actionable, and specific to the spreadsheet data.`;
    } else {
      systemPrompt = `You are an elite business analytics expert. No dataset has been uploaded yet. Help the user by explaining how they can upload a spreadsheet to begin advanced data-driven analysis.`;
    }

    // Initialize OpenRouter client
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // Build messages array with system prompt
    const openaiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const isO1 = model && (model.startsWith('openai/o1-') || model.includes('/o1-'));

    // Create streaming chat completion with model-specific safety parameters
    const stream = await openai.chat.completions.create({
      model: model || 'openrouter/auto',
      messages: openaiMessages,
      stream: true,
      ...(isO1 ? {
        // o1 models do not support temperature parameters other than 1.0 or custom max_tokens limits
        max_completion_tokens: 4000
      } : {
        temperature: 0.7,
        max_tokens: 4000 // Expanded to 4000 tokens so large reports do not get cut off!
      })
    });

    // Create a readable stream in the format expected by useChat
    const encoder = new TextEncoder();
    
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              // Format for Vercel AI SDK useChat hook
              // Each chunk should be: 0:"content"\n
              const escaped = content
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
              
              controller.enqueue(encoder.encode(`0:"${escaped}"\n`));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}