import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

interface Chart {
  type: string;
  title: string;
  x: string;
  y: string;
}

interface KPI {
  title: string;
  value: string | number;
}

@Injectable()
export class AiService {
  private openai: OpenAI;
  private useOpenAI: boolean;

  constructor(private prisma: PrismaService) {
    // Check if OpenAI API key exists
    const apiKey = process.env.OPENAI_API_KEY;
    this.useOpenAI = !!apiKey;
    
    if (this.useOpenAI) {
      this.openai = new OpenAI({
        apiKey,
      });
    }
  }

  async queryFile(fileId: string, question: string, userId: string) {
    try {
      const rows = await this.prisma.csvRow.findMany({
        where: { fileId },
        take: 1000, 
      });

      const jsonData = rows.map((r) => r.data);

      let response: string;
      
      if (this.useOpenAI) {
        try {
          const systemPrompt = `
You are a data analyst. The user will ask questions about their CSV file.
You will answer based on the given JSON data.

If you can't find the answer, say "I couldn't find that in the data."

Data Sample:
${JSON.stringify(jsonData.slice(0, 5), null, 2)} // showing just first 5 rows
`;

          const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Use 3.5 for all to avoid quota issues
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: question },
            ],
          });

          response = completion.choices[0].message?.content || '';
        } catch (error) {
          console.error('OpenAI API error:', error);
          // Fallback response
          response = `I couldn't analyze your data due to a service limitation. Here are some basic insights based on your question: "${question}"\n\n- The data appears to contain information that might answer your query\n- Consider exploring the data manually using filters and sorting\n- For specific metrics, you may want to export the data to a spreadsheet program`;
        }
      } else {
        // Mock response when API key is not available
        response = `API service is currently unavailable. Your question was: "${question}"\n\nPlease try again later or explore the data manually.`;
      }

      // Still record the interaction regardless of source
      await this.prisma.aIQuery.create({
        data: {
          fileId,
          userId, 
          question,
          response,
        },
      });

      return response;
    } catch (error) {
      console.error('Error in queryFile:', error);
      return "Sorry, there was an error processing your request. Please try again later.";
    }
  }

  async getHistory(fileId: string, userId: string) {
    try {
      // Get conversation history for this file and user
      const history = await this.prisma.aIQuery.findMany({
        where: {
          fileId,
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          question: true,
          response: true,
          createdAt: true,
        },
      });
      
      return history;
    } catch (error) {
      console.error('Error retrieving AI query history:', error);
      return [];
    }
  }

  async generateSummaryAndKPIs(previewRows: any[]): Promise<string> {
    try {
      if (!this.useOpenAI) {
        return this.getMockSummary(previewRows);
      }
      
      const prompt = `Here are the first 10 rows of a CSV dataset:\n\n${JSON.stringify(
        previewRows,
        null,
        2
      )}\n\nSummarize the dataset and suggest 3 KPIs.`;

      try {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-3.5-turbo',
        });

        return completion.choices[0]?.message?.content || 'No summary available';
      } catch (error) {
        console.error('OpenAI API error in generateSummaryAndKPIs:', error);
        return this.getMockSummary(previewRows);
      }
    } catch (error) {
      console.error('Error in generateSummaryAndKPIs:', error);
      return 'Unable to generate summary due to a service error.';
    }
  }

  async generateKPIsAndCharts(rows: any[]): Promise<{ kpis: KPI[]; charts: Chart[] }> {
    try {
      if (!this.useOpenAI) {
        return this.getMockKPIsAndCharts(rows);
      }
      
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

      try {
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-3.5-turbo', // Use 3.5 instead of gpt-4
        });

        try {
          const parsedResponse = JSON.parse(completion.choices[0].message?.content || '{}');
          return {
            kpis: parsedResponse.kpis || [],
            charts: parsedResponse.charts || []
          };
        } catch (err) {
          return this.getMockKPIsAndCharts(rows);
        }
      } catch (error) {
        console.error('OpenAI API error in generateKPIsAndCharts:', error);
        return this.getMockKPIsAndCharts(rows);
      }
    } catch (error) {
      console.error('Error in generateKPIsAndCharts:', error);
      return { kpis: [], charts: [] };
    }
  }
  
  // Helper methods for generating mock responses
  private getMockSummary(rows: any[]): string {
    try {
      const columnNames = rows.length > 0 ? Object.keys(rows[0].data) : [];
      const rowCount = rows.length;
      
      return `This dataset contains ${rowCount} records with ${columnNames.length} columns including: ${columnNames.slice(0, 5).join(', ')}${columnNames.length > 5 ? '...' : ''}.
      
Key metrics to consider:
1. Total number of records: ${rowCount}
2. Data completeness (check for missing values)
3. Distribution of key numeric fields

Explore the data using filtering and sorting features to discover patterns and insights.`;
    } catch (error) {
      return 'This appears to be a CSV dataset. AI analysis is currently unavailable, but you can explore the data manually.';
    }
  }
  
  private getMockKPIsAndCharts(rows: any[]): { kpis: KPI[]; charts: Chart[] } {
    try {
      const columnNames = rows.length > 0 ? Object.keys(rows[0].data) : [];
      const numericColumns = columnNames.filter(col => {
        return rows.some(row => typeof row.data[col] === 'number');
      });
      const textColumns = columnNames.filter(col => {
        return rows.some(row => typeof row.data[col] === 'string');
      });
      
      const kpis: KPI[] = [
        { title: "Total Records", value: rows.length },
        { title: "Fields Available", value: columnNames.length }
      ];
      
      const charts: Chart[] = [];
      if (numericColumns.length > 0 && textColumns.length > 0) {
        charts.push({
          type: "bar",
          title: `${textColumns[0]} by ${numericColumns[0]}`,
          x: textColumns[0],
          y: numericColumns[0]
        });
      }
      
      if (numericColumns.length >= 2) {
        charts.push({
          type: "line",
          title: `${numericColumns[0]} vs ${numericColumns[1]}`,
          x: numericColumns[0],
          y: numericColumns[1]
        });
      }
      
      return { kpis, charts };
    } catch (error) {
      return {
        kpis: [
          { title: "Data Overview", value: "Available" },
          { title: "Records", value: rows.length }
        ],
        charts: [
          { type: "bar", title: "Data Distribution", x: "Category", y: "Value" }
        ]
      };
    }
  }
}