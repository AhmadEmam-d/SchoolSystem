import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  ArrowLeft,
  ClipboardCheck,
  QrCode,
  ListOrdered,
  CheckCircle2
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { toast } from 'sonner';

export function AttendanceMethodSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { startSession } = useAttendance();

  // ✅ بدل classId → classOid
  const classOid = searchParams.get('classOid');
  const className = searchParams.get('className') || 'Class';
  const date =
    searchParams.get('date') ||
    new Date().toISOString().split('T')[0];

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [correctNumber, setCorrectNumber] = useState(null);

  const attendanceMethods = [
    {
      id: 'manual',
      title: 'Take Attendance Manually',
      description: 'Mark each student manually',
      icon: ClipboardCheck,
      color: 'bg-blue-500',
    },
    {
      id: 'qr',
      title: 'Generate QR Code',
      description: 'Students scan QR code',
      icon: QrCode,
      color: 'bg-green-500',
    },
    {
      id: 'number',
      title: 'Number Selection',
      description: 'Choose one number for attendance',
      icon: ListOrdered,
      color: 'bg-amber-500',
    }
  ];

  useEffect(() => {
    if (selectedMethod === 'number') {
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
    if (!classOid) {
      toast.error("Invalid class selected");
      return;
    }

    if (!selectedMethod) {
      toast.error("Please select a method");
      return;
    }

    if (selectedMethod === 'number' && correctNumber === null) {
      toast.error("Please select the correct number");
      return;
    }

    startSession(classOid, selectedMethod, {
      correctNumber,
      numberOptions: generatedNumbers
    });

    toast.success("Attendance session started!");

    // ✅ ابعت classOid للصفحات التالية
    if (selectedMethod === 'manual') {
      navigate(`/teacher/attendance/manual?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`);
    }

    else if (selectedMethod === 'qr') {
      navigate(`/teacher/attendance/qrcode?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`);
    }

    else if (selectedMethod === 'number') {
      navigate(`/teacher/attendance/code?classOid=${classOid}&className=${encodeURIComponent(className)}&date=${date}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/teacher/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Take Attendance
          </h1>
          <p className="text-muted-foreground mt-1">
            {className}
          </p>
        </div>
      </div>

      {/* METHODS */}
      <div className="bg-card p-6 rounded-xl shadow-sm border">

        <p className="mb-6 text-muted-foreground font-medium">
          Select attendance method:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {attendanceMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;

            return (
              <Card
                key={method.id}
                className={`border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
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

                  <CardTitle>{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* NUMBER METHOD */}
        {selectedMethod === 'number' && (
          <div className="mb-8 p-4 rounded-xl border bg-amber-50">
            <h3 className="font-semibold mb-4">
              Select correct number:
            </h3>

            <div className="grid grid-cols-3 gap-4">
              {generatedNumbers.map((num, idx) => (
                <button
                  key={idx}
                  onClick={() => setCorrectNumber(num)}
                  className={`py-4 rounded-lg border-2 text-xl font-bold ${
                    correctNumber === num
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t">
          <Button
            size="lg"
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