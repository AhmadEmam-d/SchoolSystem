import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { api } from '../../lib/api';
import { useAttendance } from '../../context/AttendanceContext';
import { QRCodeSVG } from 'qrcode.react';
import { Users, QrCode, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function QRAttendance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { startSession, endSession, sessions } = useAttendance();

  const classOid = searchParams.get('classOid');
  const className = searchParams.get('className') || 'Class A1';

  const [students, setStudents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(50); // 5 Minutes
  
  // ✅ Ref to prevent duplicate end session calls and toasts
  const hasEndedRef = useRef(false);
  const session = sessions[classOid];

  // 1️⃣ Load Students Data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.students.getAll();
        const filtered = res.data.filter(s => s.classOid === classOid);
        setStudents(filtered);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };
    if (classOid) fetchStudents();
  }, [classOid]);

  // 2️⃣ Auto-start session on mount
  useEffect(() => {
    if (classOid && !session) {
      startSession(classOid, 'qr').catch(() => toast.error("Failed to start session"));
    }
  }, [classOid, session, startSession]);

  // 3️⃣ Handle End Session Logic (Safe from duplicates)
  const handleEnd = async () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    try {
      await endSession(classOid, students);
      toast.success("Session ended and attendance saved ✅");
      navigate('/teacher/dashboard');
    } catch (error) {
      console.error("End session error", error);
      navigate('/teacher/dashboard');
    }
  };

  // 4️⃣ Countdown Timer Logic
  useEffect(() => {
    let timer;
    
    if (session?.status === 'active' && timeLeft > 0 && !hasEndedRef.current) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } 
    else if (timeLeft === 0 && session?.status === 'active' && !hasEndedRef.current) {
      handleEnd();
    }

    return () => clearInterval(timer);
  }, [timeLeft, session?.status]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] min-h-screen" dir="ltr">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                <QrCode size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">QR Attendance</h1>
                <p className="text-slate-400 text-sm">{className}</p>
             </div>
        </div>
        
        <div className="flex items-center gap-3 bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
          <Clock className="text-indigo-400" size={20} />
          <span className="text-2xl font-mono font-bold text-indigo-700">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <p className="text-slate-500 text-sm mb-1 font-medium">Total Students</p>
            <h2 className="text-4xl font-black text-slate-800">{students.length}</h2>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl text-center">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm mb-1 font-medium">Attended</p>
            <h2 className="text-4xl font-black text-green-600">{session?.attendance?.length || 0}</h2>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl text-center">
          <CardContent className="p-6">
            <p className="text-slate-500 text-sm mb-1 font-medium">Status</p>
            <h2 className={`text-xl font-bold ${session?.status === 'active' ? 'text-indigo-600' : 'text-orange-500'}`}>
              {session?.status === 'active' ? 'Active Now' : 'Stopped'}
            </h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR BOX */}
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-emerald-500 text-white text-center py-4">
            <CardTitle className="text-lg font-bold">Scan to mark attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-12 min-h-[380px]">
            {session?.status === 'active' ? (
              <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-white border-2 border-slate-50 shadow-2xl rounded-[2.5rem]">
                    <QRCodeSVG value={session.sessionId} size={240} level="H" />
                </div>
                <p className="text-slate-400 font-medium animate-pulse">QR Code is ready for scanning</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <AlertCircle className="mx-auto text-slate-200" size={100} />
                <p className="text-slate-400 font-bold text-xl">Session Inactive</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LIST BOX */}
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden flex flex-col bg-white">
          <CardHeader className="border-b border-slate-50 py-6 px-8">
            <CardTitle className="flex items-center gap-3 text-slate-700">
              <Users className="text-indigo-500" size={24} />
              Real-time Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 max-h-[380px] overflow-y-auto">
            {students.length > 0 ? (
              students.map((s, i) => {
                const isPresent = session?.attendance?.includes(s.oid);
                return (
                  <div key={s.oid} className="flex items-center justify-between px-8 py-4 border-b border-slate-50 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${isPresent ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {s.fullName.charAt(0)}
                      </div>
                      <span className={`font-semibold ${isPresent ? 'text-green-700' : 'text-slate-600'}`}>{s.fullName}</span>
                    </div>
                    {isPresent && <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1.5 rounded-xl font-black tracking-wider uppercase">Present</span>}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-20 text-slate-300 italic">No students found</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pb-8">
        <button
          onClick={handleEnd}
          className="bg-red-500 hover:bg-red-600 text-white font-black py-4 px-20 rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95"
        >
          End Session & Save
        </button>
      </div>
    </div>
  );
}