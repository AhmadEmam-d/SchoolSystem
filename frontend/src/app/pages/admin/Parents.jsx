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
  DialogTrigger,
} from "../../components/ui/dialog";
import { Search, Plus, MoreHorizontal, Mail, Phone, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from "sonner";
import { api } from '../../../app/lib/api';

export function AdminParents() {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // جلب البيانات من API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [parentsResponse, studentsResponse] = await Promise.all([
          api.parents.getAll(),
          api.students.getAll()
        ]);
        
        const parentsList = parentsResponse.success ? parentsResponse.data : (Array.isArray(parentsResponse) ? parentsResponse : []);
        const studentsList = studentsResponse.success ? studentsResponse.data : (Array.isArray(studentsResponse) ? studentsResponse : []);
        
        setParents(parentsList);
        setStudents(studentsList);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredParents = parents.filter(parent =>
    parent.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.motherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChildrenNames = (parentOid) => {
    const children = students.filter(student => student.parentOid === parentOid);
    return children.map(child => child.fullName).join(', ');
  };

  const getChildrenList = (parentOid) => {
    return students.filter(student => student.parentOid === parentOid);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('parentsPage')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('parentsPageDesc')}</p>
        </div>
        <Button onClick={() => navigate('/admin/parents/add')}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('addParentBtnLabel')}
        </Button>
      </div>

      <Card className="dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="dark:text-white">{t('allParentsTitle')} ({filteredParents.length})</CardTitle>
            <div className="relative w-64">
              <Search className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-gray-500`} />
              <Input
                placeholder={t('searchParentsPlaceholder')}
                className={`${isRTL ? 'pr-8' : 'pl-8'} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="dark:text-gray-400">{t('fatherName')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('motherName')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('contactInfoCol')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('childrenCol')}</TableHead>
                <TableHead className={`${isRTL ? 'text-left' : 'text-right'} dark:text-gray-400`}>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500 dark:text-gray-400">
                    {t('noParentsFound')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredParents.map((parent) => (
                  <TableRow key={parent.oid} className="dark:border-gray-700">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="dark:bg-gray-600 dark:text-white">
                            {parent.fatherName?.substring(0, 2).toUpperCase() || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-gray-900 dark:text-white">{parent.fatherName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{parent.motherName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {parent.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {parent.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {getChildrenNames(parent.oid)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedParent(parent)}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">{t('parentProfileTitle')}</DialogTitle>
                            <DialogDescription className="dark:text-gray-400">
                              {t('contactDetailsFor')} {selectedParent?.fatherName}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedParent && (
                            <div className="grid gap-4 py-4">
                              <div className="flex items-center gap-4 mb-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarFallback className="text-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                                    {selectedParent.fatherName?.substring(0, 2).toUpperCase() || 'P'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-bold text-lg dark:text-white">{selectedParent.fatherName}</h3>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {selectedParent.motherName && <div>Mother: {selectedParent.motherName}</div>}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <Phone className="h-4 w-4" />
                                    {selectedParent.phone}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail className="h-4 w-4" />
                                    {selectedParent.email}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('childrenCol')}</h4>
                                {getChildrenList(selectedParent.oid).length === 0 ? (
                                  <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    {t('noChildrenFound')}
                                  </div>
                                ) : (
                                  getChildrenList(selectedParent.oid).map((student) => (
                                    <div key={student.oid} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback className="text-xs dark:bg-gray-600 dark:text-white">
                                            {student.fullName?.substring(0, 2).toUpperCase() || 'S'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium text-sm dark:text-white">{student.fullName}</p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {student.class?.name || student.grade || 'N/A'}
                                          </p>
                                        </div>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="dark:border-gray-600 dark:text-gray-300" 
                                        onClick={() => navigate(`/admin/students/${student.oid}`)}
                                      >
                                        {t('viewProfileBtn')}
                                      </Button>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}