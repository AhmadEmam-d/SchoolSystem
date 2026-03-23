import React, { useState, useMemo } from 'react';
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
import { PARENTS, STUDENTS } from '../../lib/mockData';

export function AdminParents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const filteredParents = useMemo(() => {
    return PARENTS.filter(parent =>
      parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getChildrenNames = (childrenIds) => {
    return childrenIds.map(childId => {
      const student = STUDENTS.find(s => s.id === childId);
      return student ? student.name : t('unassigned');
    }).join(', ');
  };

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
            <CardTitle className="dark:text-white">{t('allParentsTitle')}</CardTitle>
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
                <TableHead className="dark:text-gray-400">{t('parentNameCol')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('contactInfoCol')}</TableHead>
                <TableHead className="dark:text-gray-400">{t('childrenCol')}</TableHead>
                <TableHead className={`${isRTL ? 'text-left' : 'text-right'} dark:text-gray-400`}>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.map((parent) => (
                <TableRow key={parent.id} className="dark:border-gray-700">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="dark:bg-gray-600 dark:text-white">{parent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-gray-900 dark:text-white">{parent.name}</div>
                    </div>
                  </TableCell>
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
                      <span className="text-sm text-gray-700 dark:text-gray-300">{getChildrenNames(parent.children)}</span>
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
                            {t('contactDetailsFor')} {selectedParent?.name}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedParent && (
                          <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4 mb-4">
                              <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                                  {selectedParent.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-bold text-lg dark:text-white">{selectedParent.name}</h3>
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
                              {selectedParent.children.map(childId => {
                                const student = STUDENTS.find(s => s.id === childId);
                                return student ? (
                                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs dark:bg-gray-600 dark:text-white">{student.name.substring(0, 2)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium text-sm dark:text-white">{student.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{student.grade}</p>
                                      </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300" onClick={() => navigate(`/admin/students/${student.id}`)}>
                                      {t('viewProfileBtn')}
                                    </Button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
