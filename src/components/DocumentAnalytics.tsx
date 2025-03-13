
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyzeDocument } from '@/utils/documentAnalytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DocumentAnalyticsProps {
  content: string;
}

const DocumentAnalytics: React.FC<DocumentAnalyticsProps> = ({ content }) => {
  const stats = useMemo(() => analyzeDocument(content), [content]);
  
  // Generate word frequency data
  const wordFrequency = useMemo(() => {
    if (!content) return [];
    
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }, [content]);

  // Calculate length of each paragraph for distribution
  const paragraphDistribution = useMemo(() => {
    if (!content) return [];
    
    const paragraphs = content
      .split(/\n+/)
      .filter(paragraph => paragraph.trim().length > 0);
    
    const lengths = paragraphs.map(p => p.length);
    
    // Group into ranges
    const ranges: Record<string, number> = {
      'Very Short (< 50)': 0,
      'Short (50-100)': 0,
      'Medium (100-200)': 0,
      'Long (200-400)': 0,
      'Very Long (> 400)': 0
    };
    
    lengths.forEach(length => {
      if (length < 50) ranges['Very Short (< 50)']++;
      else if (length < 100) ranges['Short (50-100)']++;
      else if (length < 200) ranges['Medium (100-200)']++;
      else if (length < 400) ranges['Long (200-400)']++;
      else ranges['Very Long (> 400)']++;
    });
    
    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }, [content]);

  if (!content) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Paste some content to see analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Document Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="words">Word Frequency</TabsTrigger>
            <TabsTrigger value="paragraphs">Paragraph Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-3xl font-semibold text-docblue-600">{stats.wordCount}</div>
                <div className="text-gray-500 text-sm">Words</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-3xl font-semibold text-docblue-600">{stats.charCount}</div>
                <div className="text-gray-500 text-sm">Characters</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-3xl font-semibold text-docblue-600">{stats.sentenceCount}</div>
                <div className="text-gray-500 text-sm">Sentences</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-3xl font-semibold text-docblue-600">{stats.paragraphCount}</div>
                <div className="text-gray-500 text-sm">Paragraphs</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-3xl font-semibold text-docblue-600">{stats.readingTimeMinutes}</div>
                <div className="text-gray-500 text-sm">Min. Reading Time</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-3xl font-semibold text-docblue-600">
                  {stats.wordCount ? Math.round(stats.charCount / stats.wordCount * 10) / 10 : 0}
                </div>
                <div className="text-gray-500 text-sm">Avg. Word Length</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="words" className="py-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={wordFrequency}>
                <XAxis dataKey="word" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Most Common Words:</h4>
              <div className="flex flex-wrap gap-2">
                {wordFrequency.map(({word, count}) => (
                  <div key={word} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {word} <span className="text-docblue-600 font-medium">({count})</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paragraphs" className="py-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={paragraphDistribution}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p>This chart shows the distribution of paragraph lengths in your document.</p>
              <p className="mt-2">
                Average paragraph length: {content ? Math.round(content.length / stats.paragraphCount) : 0} characters
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalytics;
