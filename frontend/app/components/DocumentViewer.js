import { X } from 'lucide-react';

export default function DocumentViewer({ document, onClose }) {
  const getFileExtension = (path) => {
    return path.split('.').pop().toLowerCase();
  };

  const renderDocument = () => {
    const extension = getFileExtension(document.file_path);
    
    switch (extension) {
      case 'pdf':
        return (
          <iframe
            src={document.file_path}
            className="w-full h-[80vh]"
            title={document.document_type}
          />
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <img
            src={document.file_path}
            alt={document.document_type}
            className="max-w-full max-h-[80vh] object-contain"
          />
        );
      default:
        return (
          <div className="text-center p-8">
            <p>Document type not supported for preview.</p>
            <a
              href={document.file_path}
              download
              className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Download Document
            </a>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {document.document_type}
            {document.reference_number && ` - ${document.reference_number}`}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {renderDocument()}
        </div>
      </div>
    </div>
  );
}