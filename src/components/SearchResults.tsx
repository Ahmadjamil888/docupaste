
import React from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { highlightSearchResults } from '@/utils/documentAnalytics';

interface SearchResultsProps {
  searchTerm: string;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm, onClose }) => {
  const { searchDocuments, setCurrentDocument } = useDocuments();
  const results = searchDocuments(searchTerm);

  const handleResultClick = (doc: any) => {
    setCurrentDocument(doc);
    onClose();
  };

  if (!searchTerm || !results.length) return null;

  return (
    <Card className="fixed top-20 right-4 w-96 shadow-lg z-50">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-sm">
          Search Results: {results.length} {results.length === 1 ? 'match' : 'matches'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-96">
          {results.map((doc) => {
            // Find the context around the match
            const content = doc.content;
            const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
            const start = Math.max(0, index - 40);
            const end = Math.min(content.length, index + searchTerm.length + 40);
            let snippet = content.slice(start, end);
            
            if (start > 0) snippet = '...' + snippet;
            if (end < content.length) snippet = snippet + '...';
            
            return (
              <div
                key={doc.id}
                className="p-3 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => handleResultClick(doc)}
              >
                <div className="flex items-center mb-1">
                  <FileText className="h-4 w-4 mr-2 text-docblue-500" />
                  <span className="font-medium">{doc.title}</span>
                </div>
                <div className="text-sm text-gray-700 pl-6">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: highlightSearchResults(snippet, searchTerm) 
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SearchResults;
