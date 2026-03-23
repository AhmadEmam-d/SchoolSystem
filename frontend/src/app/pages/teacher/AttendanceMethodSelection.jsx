import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, ClipboardCheck, QrCode, ListOrdered, CheckCircle2 } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { toast } from 'sonner';

export function AttendanceMethodSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { startSession } = useAttendance();
  
  const classId = searchParams.get('classId') || '0';
  const className = searchParams.get('className') || 'Mathematics';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [selectedMethod, setSelectedMethod] = useState(null); // ONLY ONE method
  
  // Specific states for the 'number' method
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [correctNumber, setCorrectNumber] = useState(null);

  const attendanceMethods = [
    {
      id: 'manual',
      title: 'Take Attendance Manually',
      description: 'Mark each student (Present / Absent)',
      icon: ClipboardCheck,
      color: 'bg-blue-500',
    },
    {
      id: 'qr',
      title: 'Generate QR Code',
      description: 'System generates unique QR for this session',
      icon: QrCode,
      color: 'bg-green-500',
    },
    {
      id: 'number',
      title: 'Number Selection',
      description: 'System generates 3 numbers, you select ONE correct number',
      icon: ListOrdered,
      color: 'bg-amber-500',
    }
  ];

  useEffect(() => {
    if (selectedMethod === 'number') {
      // Generate exactly 3 numbers
      const nums = [
        Math.floor(Math.random() * 90) + 10,
        Math.floor(Math.random() * 90) + 10,
        Math.floor(Math.random() * 90) + 10
      ];
      setGeneratedNumbers(nums);
      setCorrectNumber(null);
    }
  }, [selectedMethod]);

  const handleStartSession = () => {
    if (!selectedMethod) {
      toast.error('Please select a method');
      return;
    }

    if (selectedMethod === 'number' && correctNumber === null) {
      toast.error('Please select the correct number from the options');
      return;
    }

    // Start session with single method
    startSession(classId, selectedMethod, {
      correctNumber,
      numberOptions: generatedNumbers
    });
    
    toast.success('Attendance session started!');
    
    // Navigate based on selected method
    if (selectedMethod === 'manual') {
      navigate(`/teacher/attendance/manual?classId=${classId}`);
    } else if (selectedMethod === 'qr') {
      navigate(`/teacher/attendance/qrcode?classId=${classId}`);
    } else if (selectedMethod === 'number') {
      navigate(`/teacher/attendance/code?classId=${classId}`);
    } else {
      navigate('/teacher/dashboard');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/teacher/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Take Attendance</h1>
          <p className="text-muted-foreground mt-1">
            {className}
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
        <p className="mb-6 text-muted-foreground font-medium">
          Select an attendance method to start the session:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {attendanceMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            return (
              <Card
                key={method.id}
                className={`border-2 transition-all cursor-pointer transform hover:-translate-y-1 hover:shadow-md ${ 
                  isSelected ? 'border-primary bg-primary/5' : 'border-border shadow-sm'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <CardHeader className="relative">
                  {isSelected && (
                    <div className="absolute top-4 right-4 text-primary">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg text-card-foreground">{method.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-2">
                    {method.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {selectedMethod === 'number' && (
          <div className="mb-8 p-4 sm:p-6 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30">
            <h3 className="text-base sm:text-lg font-semibold text-amber-900 dark:text-amber-200 mb-4">
              Select the correct number for students:
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {generatedNumbers.map((num, idx) => (
                <button
                  key={idx}
                  onClick={() => setCorrectNumber(num)}
                  className={`py-3 sm:py-4 text-xl sm:text-2xl font-bold rounded-lg border-2 transition-all ${ 
                    correctNumber === num 
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md transform scale-105' 
                      : 'bg-card text-card-foreground border-border hover:border-amber-400 dark:hover:border-amber-500'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-border">
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8"
            onClick={handleStartSession}
            disabled={!selectedMethod}
          >
            Start Session
          </Button>
        </div>
      </div>
    </div>
  );
}