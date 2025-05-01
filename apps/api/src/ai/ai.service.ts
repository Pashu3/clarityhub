import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async queryFile(fileId: string, question: string, userId: string) {
    const rows = await this.prisma.csvRow.findMany({
      where: { fileId },
      take: 1000, 
    });

    const jsonData = rows.map((r) => r.data);

    const systemPrompt = `
You are a data analyst. The user will ask questions about their CSV file.
You will answer based on the given JSON data.

If you can't find the answer, say "I couldn't find that in the data."

Data Sample:
${JSON.stringify(jsonData.slice(0, 5), null, 2)} // showing just first 5 rows
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });

    const response = completion.choices[0].message?.content || '';

    await this.prisma.aIQuery.create({
      data: {
        fileId,
        userId, 
        question,
        response,
      },
    });

    return response;
  }

  async generateSummaryAndKPIs(previewRows: any[]): Promise<string> {
    const prompt = `Here are the first 10 rows of a CSV dataset:\n\n${JSON.stringify(
      previewRows,
      null,
      2
    )}\n\nSummarize the dataset and suggest 3 KPIs.`;

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
    });

    return completion.choices[0]?.message?.content || 'No summary available';
  }

  async generateKPIsAndCharts(rows: any[]): Promise<{ kpis: any; charts: any }> {
    const prompt = `Given this dataset (first 50 rows):\n\n${JSON.stringify(rows.slice(0, 50), null, 2)}\n\n
Suggest 3 KPIs with values, and 2 chart ideas (specify type and data structure).
Respond in JSON like:
{
  "kpis": [
    { "title": "Total Sales", "value": 12345 },
    { "title": "Top Country", "value": "USA" },
    ...
  ],
  "charts": [
    { "type": "bar", "title": "Sales by Country", "x": "Country", "y": "Sales" },
    ...
  ]
}`;

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
    });

    try {
      return JSON.parse(completion.choices[0].message?.content || '{}');
    } catch (err) {
      return { kpis: [], charts: [] };
    }
  }

  async getHistory(fileId: string, userId: string) {
    return this.prisma.aIQuery.findMany({
      where: { 
        fileId,
        userId 
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        question: true,
        response: true,
        createdAt: true,
      },
    });
  }

  async getHistoryPaginated(fileId: string, page = 1, limit = 10) {
    return this.prisma.aIQuery.findMany({
      where: { fileId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        question: true,
        response: true,
        createdAt: true,
      },
    });
  }
}