import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  ArrowLeft,
  Search,
  Download,
  Eye,
  FileText,
  FileVideo,
  FileImage,
  File,
  BookOpen,
  Calendar,
  User,
  Link
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentSubjectMaterials() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const subject = {
    id: id || 'sub1',
    name: 'Mathematics',
    teacher: 'John Nash',
  };

  const materials = [
    {
      id: 'm1',
      title: 'Chapter 1 - Introduction to Calculus',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2026-02-10',
      description: 'Complete notes on limits, derivatives and their applications.',
      category: 'notes',
    },
    {
      id: 'm2',
      title: 'Algebra Fundamentals Slides',
      type: 'PPT',
      size: '5.1 MB',
      uploadDate: '2026-02-15',
      description: 'Presentation slides covering algebraic structures and equations.',
      category: 'slides',
    },
    {
      id: 'm3',
      title: 'Trigonometry Video Lecture',
      type: 'VIDEO',
      size: '150 MB',
      uploadDate: '2026-02-20',
      description: 'Recorded video lecture explaining trigonometric identities.',
      category: 'video',
    },
    {
      id: 'm4',
      title: 'Practice Problems - Set A',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2026-02-25',
      description: 'Practice problems for exam preparation with solutions.',
      category: 'exercises',
    },
    {
      id: 'm5',
      title: 'Geometry Diagrams Reference',
      type: 'IMAGE',
      size: '3.8 MB',
      uploadDate: '2026-03-01',
      description: 'Visual reference for geometric shapes and their properties.',
      category: 'reference',
    },
    {
      id: 'm6',
      title: 'Statistics Worksheet',
      type: 'PDF',
      size: '0.9 MB',
      uploadDate: '2026-03-05',
      description: 'Worksheet on descriptive and inferential statistics.',
      category: 'exercises',
    },
    {
      id: 'm7',
      title: 'Khan Academy - Calculus Link',
      type: 'LINK',
      size: null,
      uploadDate: '2026-03-08',
      description: 'External resource for additional calculus practice.',
      category: 'reference',
    },
    {
      id: 'm8',
      title: 'Chapter 2 - Integration',
      type: 'PDF',
      size: '3.0 MB',
      uploadDate: '2026-03-12',
      description: 'Detailed notes on integration techniques and applications.',
      category: 'notes',
    },
  ];

  const filterCategories = [
    { key: 'all', label: 'All' },
    { key: 'notes', label: 'Notes' },
    { key: 'slides', label: 'Slides' },
    { key: 'video', label: 'Videos' },
    { key: 'exercises', label: 'Exercises' },
    { key: 'reference', label: 'References' },
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'VIDEO':
        return <FileVideo className="h-6 w-6 text-purple-500" />;
      case 'IMAGE':
        return <FileImage className="h-6 w-6 text-green-500" />;
      case 'PPT':
        return <FileText className="h-6 w-6 text-orange-500" />;
      case 'LINK':
        return <Link className="h-6 w-6 text-blue-500" />;
      case 'PDF':
      default:
        return <FileText className="h-6 w-6 text-red-500" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'VIDEO':
        return 'bg-purple-100 text-purple-800';
      case 'IMAGE':
        return 'bg-green-100 text-green-800';
      case 'PPT':
        return 'bg-orange-100 text-orange-800';
      case 'LINK':
        return 'bg-blue-100 text-blue-800';
      case 'PDF':
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' || material.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleView = (material) => {
    if (material.type === 'LINK') {
      toast.info('Opening external link...');
    } else {
      navigate(
        `/student/subjects/${id}/document-viewer?title=${encodeURIComponent(material.title)}&type=${material.type}&size=${material.size || ''}`
      );
    }
  };

  const handleDownload = (material) => {
    toast.success(`Downloading "${material.title}"...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(`/student/subjects/${id}`)}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subject
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-7 w-7 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                {subject.name} — Materials
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>{subject.teacher}</span>
              <span className="mx-2">•</span>
              <span>{materials.length} resources</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filterCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveFilter(cat.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === cat.key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center text-gray-500">
            <File className="h-12 w-12 mb-4 text-gray-300" />
            <p className="font-medium">No materials found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material) => (
            <Card
              key={material.id}
              className="hover:shadow-md transition-shadow flex flex-col"
            >
              <CardContent className="p-5 flex flex-col h-full gap-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getFileIcon(material.type)}
                  </div>
                  <Badge className={getTypeBadgeColor(material.type)}>
                    {material.type}
                  </Badge>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 leading-snug">
                    {material.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {material.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{material.uploadDate}</span>
                  </div>
                  {material.size && <span>• {material.size}</span>}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleView(material)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {material.type !== 'LINK' && (
                    <Button
                      size="sm"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleDownload(material)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        Showing {filteredMaterials.length} of {materials.length} materials
      </div>
    </div>
  );
}
