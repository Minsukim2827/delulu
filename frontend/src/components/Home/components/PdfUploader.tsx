import React from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface PDFUploaderProps {
  onUpload: (file: File) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onUpload }) => {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    onUpload(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors w-96"
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
      <p>Drag-and-drop a PDF or click here</p>
    </div>
  );
};

export default PDFUploader;
