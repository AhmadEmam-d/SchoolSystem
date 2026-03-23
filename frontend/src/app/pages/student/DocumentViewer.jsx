import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft, 
  Download,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Share2,
  Calendar,
  User
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentDocumentViewer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Get document info from URL params
  const docTitle = searchParams.get('title') || 'Document';
  const docType = searchParams.get('type') || 'PDF';
  const docSize = searchParams.get('size') || 'Unknown';

  // Mock document data
  const document = {
    id: id || 'd1',
    title: docTitle,
    type: docType,
    size: docSize,
    uploadDate: '2026-03-01',
    description: 'Complete notes on derivatives and their applications',
    subject: 'Mathematics',
    teacher: 'John Nash',
    pages: 15,
    version: '1.0'
  };

  const handleDownload = () => {
    toast.success(`Downloading ${document.title}...`);
  };

  const handlePrint = () => {
    toast.info('Opening print dialog...');
    window.print();
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
  };

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(prev => prev + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(prev => prev - 25);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      toast.success('Entered fullscreen mode');
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Materials
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
              <Badge variant="outline">{document.type}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{document.subject}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{document.teacher}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{document.uploadDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Viewer Controls */}
      <Card className="border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {zoomLevel}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>{document.pages} pages</span>
              <span>•</span>
              <span>{document.size}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Viewer */}
      <Card className="border-none shadow-md">
        <CardContent className="p-0">
          <div 
            className="bg-gray-100 min-h-[800px] flex items-center justify-center overflow-auto"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Mock Document Display */}
            <div className="bg-white shadow-2xl max-w-4xl w-full mx-4 my-8 p-12 space-y-6">
              <div className="text-center border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{document.title}</h2>
                <p className="text-gray-600">{document.subject} Course Material</p>
              </div>

              {/* Mock Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Introduction</h3>
                <p className="text-gray-700 leading-relaxed">
                  This document provides comprehensive coverage of the topic with detailed explanations,
                  examples, and practice problems. Students are encouraged to review all sections carefully
                  and complete the exercises provided.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">Key Concepts</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Understanding fundamental principles and theorems</li>
                  <li>Applying concepts to solve practical problems</li>
                  <li>Analyzing complex scenarios and deriving solutions</li>
                  <li>Connecting theory with real-world applications</li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                  <p className="text-sm text-blue-900 font-medium">
                    📝 Note: Make sure to practice the examples provided throughout this material.
                    Understanding these concepts is crucial for your upcoming assessments.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">Practice Problems</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">Problem 1:</p>
                    <p className="text-gray-700">
                      Solve the following equation and show all steps in your solution...
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">Problem 2:</p>
                    <p className="text-gray-700">
                      Apply the theorem to determine the correct approach...
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">Summary</h3>
                <p className="text-gray-700 leading-relaxed">
                  This material has covered the essential aspects of the topic. Students should review
                  all sections and attempt the practice problems before the next class session.
                </p>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
                  <p className="text-sm text-green-900 font-medium">
                    ✅ Remember: Regular practice and review are key to mastering these concepts.
                  </p>
                </div>
              </div>

              {/* Page Footer */}
              <div className="text-center border-t pt-6 text-sm text-gray-500">
                <p>Page 1 of {document.pages}</p>
                <p className="mt-2">{document.teacher} • {document.subject}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Info Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{document.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Type</span>
              <Badge variant="outline">{document.type}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Size</span>
              <span className="font-medium text-gray-900">{document.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pages</span>
              <span className="font-medium text-gray-900">{document.pages}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Version</span>
              <span className="font-medium text-gray-900">{document.version}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uploaded</span>
              <span className="font-medium text-gray-900">{document.uploadDate}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
