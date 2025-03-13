
import React, { useState } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  FileText, 
  Clock, 
  Trash2,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DocumentSidebar: React.FC = () => {
  const { documents, currentDocument, setCurrentDocument, createDocument, deleteDocument, searchDocuments } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      setSearchResults(searchDocuments(value));
    } else {
      setSearchResults([]);
    }
  };

  const handleCreateDocument = () => {
    createDocument('Untitled Document', '');
  };

  const confirmDelete = (id: string) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const displayDocuments = searchTerm ? searchResults : documents;

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleCreateDocument}
          className="w-full mt-2 bg-docblue-500 hover:bg-docblue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {displayDocuments.length > 0 ? (
            displayDocuments.map((doc) => (
              <div 
                key={doc.id}
                className={`p-2 rounded-md mb-1 cursor-pointer ${
                  currentDocument?.id === doc.id 
                    ? 'bg-docblue-50 border-l-2 border-docblue-500'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setCurrentDocument(doc)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-docblue-500" />
                    <span className="font-medium truncate">{doc.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(doc.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </Button>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No documents match your search' : 'No documents yet'}
            </div>
          )}
        </div>
      </ScrollArea>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This document will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentSidebar;
