import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Search,
  Plus,
  Calendar,
  Filter,
  X,
  Loader2,
  ChevronRight,
  Clock,
  Trash2 // ✅ مهم
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../../components/ui/dropdown-menu";
import { toast } from "sonner";

const API = "https://localhost:7179/api";

export function TeacherHomework() {
  const navigate = useNavigate();

  const [homework, setHomework] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);

    try {
      const [hwRes, clsRes] = await Promise.all([
        fetch(`${API}/Homeworks/teacher`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/Classes`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!hwRes.ok) throw new Error("Homework API Error");
      if (!clsRes.ok) throw new Error("Classes API Error");

      const hwData = await hwRes.json();
      const clsData = await clsRes.json();

      setHomework(hwData.data || []);
      setClasses(clsData.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusOptions = ["Active", "Grading", "Completed"];

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!id) return;

    if (!window.confirm("Delete this homework?")) return;

    try {
      const res = await fetch(`${API}/Homeworks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Deleted ✅");

      // تحديث مباشر
      setHomework((prev) =>
        prev.filter((h) => (h.oid || h.id) !== id)
      );
    } catch (err) {
      console.error(err);
      toast.error("Delete failed ❌");
    }
  };

  // ================= FILTER =================
  const filteredHomework = homework.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.className?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      !selectedClass ||
      item.className?.toLowerCase() === selectedClass.toLowerCase();

    const matchesStatus =
      !selectedStatus || item.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // ================= UI =================
  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Homework</h1>
          <p className="text-gray-500">Manage assignments</p>
        </div>

        <Button
          onClick={() => navigate("/teacher/homework/add")}
          className="bg-indigo-600 text-white"
        >
          <Plus className="mr-2" />
          Create
        </Button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 flex-wrap bg-white p-4 rounded-xl">

        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CLASS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2" />
              {selectedClass || "All Classes"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedClass(null)}>
              <X className="mr-2" /> All
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {classes.map((c) => (
              <DropdownMenuItem
                key={c.oid}
                onClick={() => setSelectedClass(c.name)}
              >
                {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* STATUS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Clock className="mr-2" />
              {selectedStatus || "All Status"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
              <X className="mr-2" /> All
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {statusOptions.map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => setSelectedStatus(s)}
              >
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : filteredHomework.length === 0 ? (
        <p className="text-center text-gray-400">No Homework</p>
      ) : (
        <div className="grid gap-4">
          {filteredHomework.map((item) => {
            const id = item.oid || item.id;

            return (
              <Card key={id || `${item.title}-${item.dueDate}`}>
                <CardContent className="p-5 flex justify-between items-center">

                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>

                    <div className="flex gap-3 text-sm text-gray-500 mt-1">
                      <span>{item.className}</span>
                      <span>
                        <Calendar className="inline w-4 mr-1" />
                        {new Date(item.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">

                    <Badge>{item.status}</Badge>

                    {/* VIEW */}
                    <Button
                      variant="ghost"
                      onClick={() =>
                        navigate(`/teacher/homework/${id}`)
                      }
                    >
                      <ChevronRight />
                    </Button>

                    {/* DELETE */}
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}