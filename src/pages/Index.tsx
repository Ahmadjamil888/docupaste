
import React, { useState } from 'react';
import { DocumentProvider } from '@/context/DocumentContext';
import DocumentSidebar from '@/components/DocumentSidebar';
import DocumentEditor from '@/components/DocumentEditor';
import DocumentAnalytics from '@/components/DocumentAnalytics';
import SearchResults from '@/components/SearchResults';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDocuments } from '@/context/DocumentContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const DocumentApp = () => {
  const { currentDocument } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSearchResults(true);
    }
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchTerm('');
  };

  return (
    <div className="h-screen">
      <header className="h-16 bg-white border-b flex items-center px-4 shadow-sm">
        <h1 className="text-xl font-bold text-docblue-600">DocuPaste</h1>
        <div className="ml-auto flex items-center">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search across documents..."
              className="w-64 pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              className="absolute right-1 top-1 h-7 w-7 p-0" 
              disabled={!searchTerm.trim()}
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-64 h-full">
          <DocumentSidebar />
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          {currentDocument ? (
            <Tabs defaultValue="editor">
              <TabsList className="mb-4">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="pt-2">
                <DocumentEditor />
              </TabsContent>
              
              <TabsContent value="analytics" className="pt-2">
                <DocumentAnalytics content={currentDocument.content} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Document Selected</h2>
                <p className="text-gray-500">Select a document from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showSearchResults && (
        <SearchResults 
          searchTerm={searchTerm}
          onClose={closeSearchResults}
        />
      )}
    </div>
  );
};

const Index = () => (
  <DocumentProvider>
    <DocumentApp />
  </DocumentProvider>
);

export default Index;
