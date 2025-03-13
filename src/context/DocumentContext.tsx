
import React, { createContext, useState, useContext, useEffect } from 'react';

type Document = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type DocumentContextType = {
  documents: Document[];
  currentDocument: Document | null;
  setCurrentDocument: (doc: Document | null) => void;
  createDocument: (title: string, content: string) => void;
  updateDocument: (id: string, title: string, content: string) => void;
  deleteDocument: (id: string) => void;
  searchDocuments: (query: string) => Document[];
};

const initialDocument: Document = {
  id: '1',
  title: 'Welcome to DocuPaste',
  content: 'Paste your content here to analyze and search through it. Your documents will be saved automatically.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('docupaste-documents');
    return saved ? JSON.parse(saved) : [initialDocument];
  });
  
  const [currentDocument, setCurrentDocument] = useState<Document | null>(() => {
    const saved = localStorage.getItem('docupaste-current-document');
    return saved ? JSON.parse(saved) : documents[0];
  });

  useEffect(() => {
    localStorage.setItem('docupaste-documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    if (currentDocument) {
      localStorage.setItem('docupaste-current-document', JSON.stringify(currentDocument));
    }
  }, [currentDocument]);

  const createDocument = (title: string, content: string) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setDocuments(prev => [...prev, newDoc]);
    setCurrentDocument(newDoc);
  };

  const updateDocument = (id: string, title: string, content: string) => {
    const updatedDocs = documents.map(doc => 
      doc.id === id 
        ? { ...doc, title, content, updatedAt: new Date().toISOString() } 
        : doc
    );
    
    setDocuments(updatedDocs);
    
    if (currentDocument && currentDocument.id === id) {
      setCurrentDocument({
        ...currentDocument,
        title,
        content,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    
    if (currentDocument && currentDocument.id === id) {
      const remainingDocs = documents.filter(doc => doc.id !== id);
      setCurrentDocument(remainingDocs.length > 0 ? remainingDocs[0] : null);
    }
  };

  const searchDocuments = (query: string): Document[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return documents.filter(
      doc => 
        doc.title.toLowerCase().includes(searchTerm) || 
        doc.content.toLowerCase().includes(searchTerm)
    );
  };

  return (
    <DocumentContext.Provider 
      value={{ 
        documents, 
        currentDocument, 
        setCurrentDocument, 
        createDocument, 
        updateDocument, 
        deleteDocument,
        searchDocuments
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
