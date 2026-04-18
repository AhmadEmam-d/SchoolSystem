import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Plus, Trash2, Search, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { api } from '../../../app/lib/api';

export function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // ✅ تحميل المدرسين
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const data = await api.teachers.getAll();
        setTeachers(data || []);
      } catch (error) {
        console.error(error);
        toast.error("فشل تحميل المدرسين");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // ✅ فلترة
  const filteredTeachers = teachers.filter(t =>
    t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ DELETE (المهم)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("متأكد عايز تمسح المدرس؟");
    if (!confirmDelete) return;

    try {
      console.log("Deleting:", id);

      const result = await api.teachers.delete(id);

      console.log("Response:", result);

      if (result.success) {
        // حذف من UI
        setTeachers(prev => prev.filter(t => t.oid !== id));
        toast.success("تم حذف المدرس بنجاح");
      } else {
        toast.error(result.errors?.[0] || "فشل الحذف");
      }

    } catch (error) {
      console.error(error);
      toast.error("خطأ في الحذف");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-gray-500">Manage all teachers</p>
        </div>

        <Button onClick={() => navigate('/admin/teachers/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-2.5 h-4 w-4 text-gray-400`} />
        <Input
          placeholder="Search..."
          className={`${isRTL ? 'pr-8' : 'pl-8'}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No teachers found
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.oid}>
                  <TableCell>{teacher.fullName}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone || "-"}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">

                      <Button size="icon" variant="ghost"
                        onClick={() => navigate(`/admin/teachers/${teacher.oid}`)}>
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>

                      <Button size="icon" variant="ghost"
                        onClick={() => navigate(`/admin/teachers/edit/${teacher.oid}`)}>
                        <Edit className="h-4 w-4 text-yellow-500" />
                      </Button>

                      <Button size="icon" variant="ghost"
                        onClick={() => handleDelete(teacher.oid)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}