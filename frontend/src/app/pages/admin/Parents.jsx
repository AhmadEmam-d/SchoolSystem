import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  User,
  Info
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { toast } from "sonner";
import { api } from '../../../app/lib/api';

export function AdminParents() {
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // ================= جلب البيانات من الـ API =================
  const fetchParents = async () => {
    setLoading(true);
    try {
      // بناءً على ملف api.js الخاص بك، البيانات تعود مباشرة من التابع
      const data = await api.parents.getAll();
      setParents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(t('errorFetchingData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  // ================= منطق الحذف =================
  const handleDeleteClick = async (parent) => {
    if (window.confirm(t('confirmDeleteParent'))) {
      try {
        const response = await api.parents.delete(parent.oid);
        if (response.success) {
          toast.success(t('parentDeletedSuccess'));
          fetchParents(); // تحديث القائمة بعد الحذف
        } else {
          toast.error(response.message || t('deleteFailed'));
        }
      } catch (error) {
        toast.error(t('errorDuringDelete'));
      }
    }
  };

  // ================= منطق العرض (Details) =================
  const handleOpenDetails = (parent) => {
    setSelectedParent(parent);
    setIsDetailsOpen(true);
  };

  // ================= منطق البحث =================
  const filteredParents = parents.filter(parent => {
    const search = searchTerm.toLowerCase();
    return (
      parent.fatherName?.toLowerCase().includes(search) ||
      parent.motherName?.toLowerCase().includes(search) ||
      parent.email?.toLowerCase().includes(search) ||
      parent.phone?.includes(search)
    );
  });

  const getChildrenNames = (parent) => {
    if (!parent?.students || parent.students.length === 0) return t('noChildren');
    return parent.students.map(s => s.fullName).join(', ');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* الهيدر */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('parentsPage')}</h1>
          <p className="text-muted-foreground">{t('parentsPageDesc')}</p>
        </div>

        <Button onClick={() => navigate('/admin/parents/add')} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('addParentBtnLabel')}
        </Button>
      </div>

      {/* الجدول والبحث */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('allParentsTitle')} ({filteredParents.length})
            </CardTitle>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchParentsPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>{t('fatherName')}</TableHead>
                  <TableHead>{t('motherName')}</TableHead>
                  <TableHead>{t('contactInfoCol')}</TableHead>
                  <TableHead>{t('childrenCol')}</TableHead>
                  <TableHead className="text-center w-[150px]">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredParents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {t('noParentsFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParents.map((parent) => (
                    <TableRow key={parent.oid} className="hover:bg-muted/30 transition-colors">
                      {/* الأب */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {parent.fatherName?.slice(0, 2).toUpperCase() || <User size={14}/>}
                            </AvatarFallback>
                          </Avatar>
                          {parent.fatherName}
                        </div>
                      </TableCell>

                      {/* الأم */}
                      <TableCell>{parent.motherName || '—'}</TableCell>

                      {/* بيانات الاتصال */}
                      <TableCell>
                        <div className="flex flex-col text-xs gap-1">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Mail size={12}/> {parent.email}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Phone size={12}/> {parent.phone}
                          </span>
                        </div>
                      </TableCell>

                      {/* الأبناء */}
                      <TableCell>
                        <div className="max-w-[150px] truncate text-sm" title={getChildrenNames(parent)}>
                          {getChildrenNames(parent)}
                        </div>
                      </TableCell>

                      {/* أزرار العمليات (Actions) */}
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <button 
                            onClick={() => handleOpenDetails(parent)} 
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                            title={t('view')}
                          >
                            <Eye size={18} />
                          </button>

                          <button 
                            onClick={() => navigate(`/admin/parents/edit/${parent.oid}`)} 
                            className="p-2 hover:bg-orange-50 text-orange-600 rounded transition-colors"
                            title={t('edit')}
                          >
                            <Edit size={18} />
                          </button>

                          <button 
                            onClick={() => handleDeleteClick(parent)} 
                            className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                            title={t('delete')}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* مودال التفاصيل (Details Dialog) */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              {t('parentProfileTitle')}
            </DialogTitle>
            <DialogDescription>
              {selectedParent?.fatherName} & {selectedParent?.motherName}
            </DialogDescription>
          </DialogHeader>

          {selectedParent && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
                <div>
                  <p className="text-muted-foreground">{t('email')}</p>
                  <p className="font-medium break-all">{selectedParent.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('phone')}</p>
                  <p className="font-medium">{selectedParent.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" /> {t('childrenCol')}
                </h4>
                <div className="space-y-2">
                  {selectedParent.students?.length > 0 ? (
                    selectedParent.students.map((student) => (
                      <div key={student.oid} className="p-3 border rounded-md flex justify-between items-center bg-card">
                        <span className="text-sm">{student.fullName}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/admin/students/${student.oid}`)}
                        >
                          {t('viewProfile')}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">{t('noChildrenAssigned')}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}