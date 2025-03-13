
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
import { Search, FileText, PlusCircle } from 'lucide-react';

const DocumentApp = () => {
  const { currentDocument, createDocument } = useDocuments();
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

  const handleCreateNew = () => {
    createDocument('Untitled Document', '');
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-6 shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-docblue-500 to-docblue-700 bg-clip-text text-transparent">
          DocuPaste
        </h1>
        <div className="ml-auto flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search across documents..."
              className="w-64 pl-9 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus-visible:ring-docblue-500"
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
          
          <Button 
            onClick={handleCreateNew}
            className="bg-docblue-600 hover:bg-docblue-700 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 h-full border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <DocumentSidebar />
        </div>
        
        <div className="flex-1 p-6 overflow-auto">
          {currentDocument ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="w-full justify-start p-2 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <TabsTrigger value="editor" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">Editor</TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="p-0 m-0">
                  <DocumentEditor />
                </TabsContent>
                
                <TabsContent value="analytics" className="p-4 m-0">
                  <DocumentAnalytics content={currentDocument.content} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <FileText className="h-16 w-16 mx-auto mb-4 text-docblue-500 opacity-75" />
                <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-docblue-500 to-docblue-700 bg-clip-text text-transparent">No Document Selected</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Select a document from the sidebar or create a new one to get started.
                </p>
                <Button 
                  onClick={handleCreateNew} 
                  className="bg-docblue-600 hover:bg-docblue-700 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Document
                </Button>
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
