
const API_BASE_URL = "https://localhost:7179/api";


const getHeaders = (isForm = false) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // ❌ متحطش Content-Type مع FormData
  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const api = {
  

  // Auth endpoints
  auth: {
    getRoles: () => fetch(`${API_BASE_URL}/Auth/roles`).then(res => res.json()),
    
    login: (email, password, role) =>
      fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      }).then(res => res.json()),
    
    register: (userData) =>
      fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }).then(res => res.json()),
    
    logout: (email) =>
      fetch(`${API_BASE_URL}/Auth/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email })
      }).then(res => res.json())
  },
  
  // Teachers endpoints
  teachers: {
    getAll: () =>
      fetch(`${API_BASE_URL}/Teachers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : []),
    
    getById: (id) =>
      fetch(`${API_BASE_URL}/Teachers/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),
    
    create: (data) =>
      fetch(`${API_BASE_URL}/Teachers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    update: (id, data) =>
      fetch(`${API_BASE_URL}/Teachers/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
   delete: (id) =>
  fetch(`${API_BASE_URL}/Teachers/${id}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ oid: id }) // 👈 مهم جداً
  }).then(async res => {
    let data = null;

    try {
      data = await res.json();
    } catch {
      data = { success: res.ok };
    }

    console.log("DELETE RESPONSE:", data);

    return data;
  })
  },
  
  // Students endpoints
  students: {
      getByClass: async (classOid) => {
    const res = await fetch(`${API_BASE_URL}/Students/class/${classOid}`, {
      headers: getHeaders()
    });

    if (!res.ok) {
      console.error("❌ failed students");
      return { ok: false, data: [] };
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    return {
      ok: true,
      data: data?.data || []
    };
  },

    getAll: () =>{
      const token = localStorage.getItem('token');
console.log(token,'token');

          return fetch(`${API_BASE_URL}/Students`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).then(res => res.json());
  }
    ,
    
    getById: (id) =>
      fetch(`${API_BASE_URL}/Students/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),
    
    create: async (data) => {
    const token = localStorage.getItem('token');

    // 🔥 أهم Debug
    console.log("🚀 Sending Student:", data);

    const res = await fetch(`${API_BASE_URL}/Students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    console.log("📥 Response:", result);

    return {
      ok: res.ok,
      data: result
    };
  },
    
    update: (id, data) =>
      fetch(`${API_BASE_URL}/Students/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    delete: (id) =>
      fetch(`${API_BASE_URL}/Students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json())
  },
  
  // Parents endpoints
  parents: {
    getAll: () =>
      fetch(`${API_BASE_URL}/Parents`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : []),
    
    getById: (id) =>
      fetch(`${API_BASE_URL}/Parents/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),
    
    create: (data) =>
      fetch(`${API_BASE_URL}/Parents`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    update: (id, data) =>
      fetch(`${API_BASE_URL}/Parents/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    delete: (id) =>
  fetch(`${API_BASE_URL}/Parents/${id}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ id }) // 🔥 أهم سطر
  }).then(async (res) => {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  })
  },
  
  // Classes endpoints
  classes: {
  getAll: () =>
  fetch(`${API_BASE_URL}/Classes`, {
    headers: getHeaders()
  })
    .then(res => res.json())
    .then(data => data.success ? data.data : []),
    
    getById: (id) =>
      fetch(`${API_BASE_URL}/Classes/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),
    
    create: (data) =>
      fetch(`${API_BASE_URL}/Classes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    update: (id, data) =>
      fetch(`${API_BASE_URL}/Classes/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    delete: (id) =>
      fetch(`${API_BASE_URL}/Classes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json())
      ,
        getTeacherClasses: () =>
    fetch(`${API_BASE_URL}/Classes/teacher`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => res.json()),

  // 🔥 الجديد: stats لكل كلاس
  getStats: (id) =>
    fetch(`${API_BASE_URL}/Classes/${id}/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => res.json())
  },
  
  // Subjects endpoints
  subjects: {
    getAll: () =>
      fetch(`${API_BASE_URL}/Subjects`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : []),
    
    getById: (id) =>
      fetch(`${API_BASE_URL}/Subjects/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),
    
    create: (data) =>
      fetch(`${API_BASE_URL}/Subjects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    update: (id, data) =>
      fetch(`${API_BASE_URL}/Subjects/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    delete: (id) =>
      fetch(`${API_BASE_URL}/Subjects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json())
  },

  // TimeTables endpoints
  timetable: {
    getAll: () =>
      fetch(`${API_BASE_URL}/Timetable`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : []),
    
  getByTeacher: async (teacherOid) => {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/Timetable/teacher/${teacherOid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("📥 API RAW:", data); // 🔥 مهم

    return {   // ✅ أهم سطر
      ok: res.ok,
      data
    };
  }
   ,
    getByClass: (classOid) =>
      fetch(`${API_BASE_URL}/Timetable/class/${classOid}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),
    
    create: (data) =>
      fetch(`${API_BASE_URL}/Timetable`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    update: (oid, data) =>
      fetch(`${API_BASE_URL}/Timetable/${oid}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    delete: (oid) =>
      fetch(`${API_BASE_URL}/Timetable/${oid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json())
  },

//   // Attendance endpoints
//  // Attendance endpoints
//   // attendance: {
//   //   getToday: (classOid) =>
//   //     fetch(`${API_BASE_URL}/Attendance/today${classOid ? `?classOid=${classOid}` : ''}`, {
//   //       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//   //     }).then(res => res.json()),
    
//   //   getWeekly: (classOid, startDate) =>
//   //     fetch(`${API_BASE_URL}/Attendance/weekly${classOid ? `?classOid=${classOid}` : ''}${startDate ? `&startDate=${startDate}` : ''}`, {
//   //       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//   //     }).then(res => res.json()),
    
//   //   getMonthlyReport: (year, month, classOid) =>
//   //     fetch(`${API_BASE_URL}/Attendance/monthly-report?year=${year}&month=${month}${classOid ? `&classOid=${classOid}` : ''}`, {
//   //       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//   //     }).then(res => res.json()),
    
//   //   getAll: (classOid, date) =>
//   //     fetch(`${API_BASE_URL}/Attendance${classOid ? `?classOid=${classOid}` : ''}${date ? `&date=${date}` : ''}`, {
//   //       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//   //     }).then(res => res.json()),
    
//   //   create: (data) =>
//   //     fetch(`${API_BASE_URL}/Attendance`, {
//   //       method: 'POST',
//   //       headers: { 
//   //         'Content-Type': 'application/json',
//   //         'Authorization': `Bearer ${localStorage.getItem('token')}`
//   //       },
//   //       body: JSON.stringify(data)
//   //     }).then(res => res.json()),
    
//   //   update: (oid, data) =>
//   //     fetch(`${API_BASE_URL}/Attendance/${oid}`, {
//   //       method: 'PUT',
//   //       headers: { 
//   //         'Content-Type': 'application/json',
//   //         'Authorization': `Bearer ${localStorage.getItem('token')}`
//   //       },
//   //       body: JSON.stringify(data)
//   //     }).then(res => res.json()),
    
//   //   delete: (oid) =>
//   //     fetch(`${API_BASE_URL}/Attendance/${oid}`, {
//   //       method: 'DELETE',
//   //       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//   //     }).then(res => res.json())
//   // }
// //   attendance: {
// //     getToday: (classOid) =>
// //       fetch(`${API_BASE_URL}/Attendance/today${classOid ? `?classOid=${classOid}` : ''}`, {
// //         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
// //       }).then(res => res.json()),

// //     getWeekly: (classOid, startDate) =>
// //       fetch(`${API_BASE_URL}/Attendance/weekly${classOid ? `?classOid=${classOid}` : ''}${startDate ? `&startDate=${startDate}` : ''}`, {
// //         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
// //       }).then(res => res.json()),

// //     getMonthlyReport: (year, month, classOid) =>
// //       fetch(`${API_BASE_URL}/Attendance/monthly-report?year=${year}&month=${month}${classOid ? `&classOid=${classOid}` : ''}`, {
// //         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
// //       }).then(res => res.json()),

// //     getAll: (classOid, date) =>
// //       fetch(`${API_BASE_URL}/Attendance${classOid ? `?classOid=${classOid}` : ''}${date ? `&date=${date}` : ''}`, {
// //         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
// //       }).then(res => res.json()),

// //     create: (data) =>
// //       fetch(`${API_BASE_URL}/Attendance`, {
// //         method: 'POST',
// //         headers: { 
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${localStorage.getItem('token')}`
// //         },
// //         body: JSON.stringify(data)
// //       }).then(res => res.json()),

// //     update: (oid, data) =>
// //       fetch(`${API_BASE_URL}/Attendance/${oid}`, {
// //         method: 'PUT',
// //         headers: { 
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${localStorage.getItem('token')}`
// //         },
// //         body: JSON.stringify(data)
// //       }).then(res => res.json()),

// //     delete: (oid) =>
// //       fetch(`${API_BASE_URL}/Attendance/${oid}`, {
// //         method: 'DELETE',
// //         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
// //       }).then(res => res.json()),

// //     // ==================== الـ Endpoints الجديدة ====================

// //     /** بدء جلسة حضور جديدة */
// //     startSession: (dto) =>
// //       fetch(`${API_BASE_URL}/Attendance/start-session`, {
// //         method: 'POST',
// //         headers: { 
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${localStorage.getItem('token')}`
// //         },
// //         body: JSON.stringify(dto)
// //       }).then(res => res.json()),

// //     /** تسليم (submit) جلسة الحضور */
// //     submitSession: (dto) =>
// //       fetch(`${API_BASE_URL}/Attendance/submit-session`, {
// //         method: 'POST',
// //         headers: { 
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${localStorage.getItem('token')}`
// //         },
// //         body: JSON.stringify(dto)
// //       }).then(res => res.json()),

// //     // إضافة إحصائيات الفصل (موجودة بالفعل في الـ Controller)
// //     getClassStats: (classOid) =>
// //       fetch(`${API_BASE_URL}/Attendance/class-stats/${classOid}`, {
// //         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
// //       }).then(res => res.json()),
// // }
// // Attendance endpoints - بنفس ستايل باقي الـ APIs
attendance: {
  // ==================== Queries (GET) ====================
  
  getToday: (classOid) =>
    fetch(`${API_BASE_URL}/Attendance/today${classOid ? `?classOid=${classOid}` : ''}`, {
      headers: getHeaders()
    }).then(res => res.json()),

  getWeekly: (classOid, startDate) =>
    fetch(`${API_BASE_URL}/Attendance/weekly${classOid ? `?classOid=${classOid}` : ''}${startDate ? `&startDate=${startDate}` : ''}`, {
      headers: getHeaders()
    }).then(res => res.json()),

  getMonthlyReport: (year, month, classOid) =>
    fetch(`${API_BASE_URL}/Attendance/monthly-report?year=${year}&month=${month}${classOid ? `&classOid=${classOid}` : ''}`, {
      headers: getHeaders()
    }).then(res => res.json()),

  getAll: (classOid, date) =>
    fetch(`${API_BASE_URL}/Attendance${classOid ? `?classOid=${classOid}` : ''}${date ? `&date=${date}` : ''}`, {
      headers: getHeaders()
    }).then(res => res.json()),

  getClassStats: (classOid) =>
    fetch(`${API_BASE_URL}/Attendance/class-stats/${classOid}`, {
      headers: getHeaders()
    }).then(res => res.json()),

  // ==================== Commands (POST / PUT / DELETE) ====================

  create: (data) =>
    fetch(`${API_BASE_URL}/Attendance`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getHeaders()   // أفضل طريقة للتوكن
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  update: (oid, data) =>
    fetch(`${API_BASE_URL}/Attendance/${oid}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  delete: (oid) =>
    fetch(`${API_BASE_URL}/Attendance/${oid}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json()),

  // ==================== الـ Endpoints الجديدة (Session System) ====================

  /** بدء جلسة حضور جديدة */
   // ✅ start session
  startSession: async (dto) => {
    const res = await fetch(`${API_BASE_URL}/Attendance/start-session`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(dto)
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    return {
      ok: res.ok,
      data
    };
  },

  // ✅ end / submit session
  submitSession: async (dto) => {
    const res = await fetch(`${API_BASE_URL}/Attendance/submit-session`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(dto)
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    return {
      ok: res.ok,
      data
    };
  },

}
  ,
  homeworks: {
  // ==================== Queries (GET) ====================

  /** جلب جميع الواجبات الخاصة بالمعلم المسجل دخوله */
  getTeacherHomeworks: () =>
    fetch(`${API_BASE_URL}/Homeworks/teacher`, {
      headers: getHeaders()
    }).then(res => res.json()),

  /** جلب تفاصيل واجب معين عن طريق معرفه */
  getById: (id) =>
    fetch(`${API_BASE_URL}/Homeworks/${id}`, {
      headers: getHeaders()
    }).then(res => res.json()),

  /** جلب قائمة التسليمات الخاصة بواجب معين */
  getSubmissions: (id) =>
    fetch(`${API_BASE_URL}/Homeworks/${id}/submissions`, {
      headers: getHeaders()
    }).then(res => res.json()),

  /** جلب تقرير الدرجات الخاص بواجب معين */
  getGradeReport: (id) =>
    fetch(`${API_BASE_URL}/Homeworks/${id}/grade-report`, {
      headers: getHeaders()
    }).then(res => res.json()),

  // ==================== Commands (POST / PUT / DELETE) ====================

  /** إنشاء واجب جديد */
  create: async (dto) => {
    const res = await fetch(`${API_BASE_URL}/Homeworks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(dto)
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    return { ok: res.ok, data };
  },

  /** تحديث بيانات واجب موجود */
  update: async (id, dto) => {
    const res = await fetch(`${API_BASE_URL}/Homeworks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(dto)
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    return { ok: res.ok, data };
  },

  /** حذف واجب */
  delete: (id) =>
    fetch(`${API_BASE_URL}/Homeworks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json()),

  /** رصد درجة لتسليم معين */
  gradeSubmission: async (id, dto) => {
    const res = await fetch(`${API_BASE_URL}/Homeworks/${id}/grade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(dto)
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    return { ok: res.ok, data };
  },
},
  // Exams endpoints
// Exams endpoints
// exams: {
//   getAll: () =>
//     fetch(`${API_BASE_URL}/Exams`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//     .then(res => res.json())
//     .then(data => data.success ? data.data : []),

//   getSummary: () =>
//     fetch(`${API_BASE_URL}/Exams/summary`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//     .then(res => res.json())
//     .then(data => data.success ? data.data : null),

//   getById: (oid) =>
//     fetch(`${API_BASE_URL}/Exams/${oid}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//     .then(res => res.json())
//     .then(data => data.success ? data.data : null),

// create: async (data) => {
//     const response = await fetch(`${API_BASE_URL}/Exams`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(data)
//     });

//     // إذا كان السيرفر أرجع خطأ (مثل 500 أو 400)
//     if (!response.ok) {
//       const errorText = await response.text(); // قراءة الخطأ كنص وليس JSON
//       console.error("Server Error Details:", errorText);
      
//       // إرجاع كائن متوافق مع كود الـ UI لمنع انهيار التطبيق
//       return { 
//         success: false, 
//         messages: { AR: "حدث خطأ في الخادم، يرجى مراجعة البيانات المرسلة", EN: "Server error, please check sent data" } 
//       };
//     }

//     return response.json(); // إذا كان الرد ناجحاً، حوله لـ JSON
//   },

//   delete: (oid) =>
//     fetch(`${API_BASE_URL}/Exams/${oid}`, {
//       method: 'DELETE',
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     }).then(res => res.json()),

//   getResults: (examOid) =>
//     fetch(`${API_BASE_URL}/Exams/${examOid}/results`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//       .then(res => res.json())
//       .then(data => data.success ? data.data : []),
//       getTeacherExams: () =>
//     fetch(`${API_BASE_URL}/Exams/teacher`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//     .then(res => res.json())
//     .then(data => data.success ? data.data : []),
//     getGrades: async (examId) => {
//   try {
//     // جربنا results بدل grades لأنها غالباً المعرفة في الـ Controller عندك
//     const response = await fetch(`${API_BASE_URL}/Exams/${examId}/results`, { 
//       headers: { 
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) throw new Error('Failed to fetch grades');

//     const result = await response.json();
    
//     // هنا بنعمل Mapping للبيانات عشان تتماشى مع صفحة الـ UI اللي عملناها
//     // لو السيرفر بيرجع الـ results مباشرة، بنحطها في format الصفحة محتاجه
//     if (result.success) {
//         return {
//             exam: result.data.exam || {}, // تأكد أن السيرفر يرسل بيانات الامتحان
//             grades: result.data.results || result.data // تأكد من مسمى قائمة الدرجات
//         };
//     }
    
//     return result;
//   } catch (error) {
//     console.error("Grades fetch error:", error);
//     throw error;
//   }
// },

//   /** تحديث بيانات اختبار موجود */
//   update: (oid, data) =>
//     fetch(`${API_BASE_URL}/Exams/${oid}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(data)
//     }).then(res => res.json()),

//   // ==================== إدارة نتائج الطلاب (Exam Results) ====================

//   /** إضافة نتيجة طالب جديدة للاختبار */
//   addResult: (examOid, resultData) =>
//     fetch(`${API_BASE_URL}/Exams/${examOid}/results`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(resultData)
//     }).then(res => res.json()),

//   /** تحديث نتيجة طالب موجودة */
//   updateResult: (resultOid, resultData) =>
//     fetch(`${API_BASE_URL}/Exams/results/${resultOid}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(resultData)
//     }).then(res => res.json()),

//   /** حذف نتيجة طالب */
//   deleteResult: (resultOid) =>
//     fetch(`${API_BASE_URL}/Exams/results/${resultOid}`, {
//       method: 'DELETE',
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     }).then(res => res.json()),
// }
exams: {
  getAll: () =>
    fetch(`${API_BASE_URL}/Exams`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => data.success ? data.data : []),

  getSummary: () =>
    fetch(`${API_BASE_URL}/Exams/summary`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => data.success ? data.data : null),

  getById: (oid) =>
    fetch(`${API_BASE_URL}/Exams/${oid}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => data.success ? data.data : null),

  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/Exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server Error Details:", errorText);
      
      return { 
        success: false, 
        messages: { AR: "حدث خطأ في الخادم، يرجى مراجعة البيانات المرسلة", EN: "Server error, please check sent data" } 
      };
    }

    return response.json();
  },

  update: (oid, data) =>
    fetch(`${API_BASE_URL}/Exams/${oid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  delete: (oid) =>
    fetch(`${API_BASE_URL}/Exams/${oid}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),

  // GET: api/Exams/{oid}/results
  getResults: async (examOid) => {
    const response = await fetch(`${API_BASE_URL}/Exams/${examOid}/results`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    
    const data = await response.json();
    console.log(`📊 Results for exam ${examOid}:`, data);
    
    // Handle the response structure from ApiResponseFactory
    if (data.success && data.data) {
      return data.data; // Returns the results array
    }
    
    // If no success flag, return as is
    if (data.data) return data.data;
    
    // If it's already an array
    if (Array.isArray(data)) return data;
    
    // Fallback
    return [];
  },

  getTeacherExams: () =>
    fetch(`${API_BASE_URL}/Exams/teacher`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => data.success ? data.data : []),

  getGrades: async (examId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Exams/${examId}/results`, { 
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch grades');

      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          exam: result.data.exam || {},
          grades: result.data.results || result.data
        };
      }
      
      return result;
    } catch (error) {
      console.error("Grades fetch error:", error);
      throw error;
    }
  },

  addResult: (examOid, resultData) =>
    fetch(`${API_BASE_URL}/Exams/${examOid}/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(resultData)
    }).then(res => res.json()),

  updateResult: (resultOid, resultData) =>
    fetch(`${API_BASE_URL}/Exams/results/${resultOid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(resultData)
    }).then(res => res.json()),

  deleteResult: (resultOid) =>
    fetch(`${API_BASE_URL}/Exams/results/${resultOid}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
}
,
helpSupport: {

  // ✅ Create Ticket
 createTicket: async (data) => {
    const res = await fetch(`${API_BASE_URL}/HelpSupport/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getHeaders()
      },
      body: JSON.stringify(data)
    });

    const text = await res.text();
    const result = text ? JSON.parse(text) : null;

    return {
      ok: res.ok,
      data: result
    };
  },

  // ✅ Get My Tickets
  getMyTickets: () =>
    fetch(`${API_BASE_URL}/HelpSupport/my-tickets`, {
      headers: getHeaders()
    }).then(res => res.json()),

  // ✅ FAQs
  getFAQs: (category, search) =>
    fetch(`${API_BASE_URL}/HelpSupport/faqs?category=${category || ''}&search=${search || ''}`, {
      headers: getHeaders()
    }).then(res => res.json()),

  // ✅ Knowledge Base
  getKnowledgeBase: (category) =>
    fetch(`${API_BASE_URL}/HelpSupport/knowledge-base?category=${category || ''}`, {
      headers: getHeaders()
    }).then(res => res.json()),

  // ✅ Article Details
  getArticleById: (id) =>
    fetch(`${API_BASE_URL}/HelpSupport/knowledge-base/${id}`, {
      headers: getHeaders()
    }).then(res => res.json()),
}
// ,
// attendance: {

//   // ✅ Get today attendance
//   getToday: (classOid) =>
//     fetch(`${API_BASE_URL}/Attendance/today${classOid ? `?classOid=${classOid}` : ''}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//       .then(res => res.json())
//       .then(data => data.success ? data.data : []),

//   // ✅ Weekly
//   getWeekly: (classOid, startDate) =>
//     fetch(`${API_BASE_URL}/Attendance/weekly?${classOid ? `classOid=${classOid}` : ''}${startDate ? `&startDate=${startDate}` : ''}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//       .then(res => res.json())
//       .then(data => data.success ? data.data : []),

//   // ✅ Monthly report
//   getMonthlyReport: (year, month, classOid) =>
//     fetch(`${API_BASE_URL}/Attendance/monthly-report?year=${year}&month=${month}${classOid ? `&classOid=${classOid}` : ''}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//       .then(res => res.json())
//       .then(data => data.success ? data.data : null),

//   // ✅ Get all (filters)
//   getAll: (classOid, date) =>
//     fetch(`${API_BASE_URL}/Attendance${classOid ? `?classOid=${classOid}` : ''}${date ? `&date=${date}` : ''}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//       .then(res => res.json())
//       .then(data => data.success ? data.data : []),

//   // ✅ Get by ID
//   getById: (oid) =>
//     fetch(`${API_BASE_URL}/Attendance/${oid}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//     })
//       .then(res => res.json())
//       .then(data => data.success ? data.data : null),

//   // ✅ Create
//   create: (data) =>
//     fetch(`${API_BASE_URL}/Attendance`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(data)
//     }).then(res => res.json()),

//   // ✅ Update
//   update: (oid, data) =>
//     fetch(`${API_BASE_URL}/Attendance/${oid}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(data)
//     }).then(res => res.json()),

//   // ✅ Delete
//   delete: (oid) =>
//     fetch(`${API_BASE_URL}/Attendance/${oid}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     }).then(res => res.json()),

//   // ✅ Class Stats
//   getClassStats: (classOid) =>
//     fetch(`${API_BASE_URL}/Attendance/class-stats/${classOid}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => data.success ? data.data : null),

//   // 🔥🔥🔥 Start Session
//   startSession: (data) =>
//     fetch(`${API_BASE_URL}/Attendance/start-session`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(data)
//     }).then(res => res.json()),

//   // 🔥🔥🔥 Submit Session
//   submitSession: (data) =>
//     fetch(`${API_BASE_URL}/Attendance/submit-session`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(data)
//     }).then(res => res.json())
// }
,
// messages: {
//   getSummary: () =>
//     fetch(`${API_BASE_URL}/Messages/summary`, {
//       headers: getHeaders()
//     }).then(r => r.json()),

//   getInbox: (isRead) =>
//     fetch(`${API_BASE_URL}/Messages/inbox${isRead !== undefined ? `?isRead=${isRead}` : ''}`, {
//       headers: getHeaders()
//     }).then(r => r.json()),

//   getSent: () =>
//     fetch(`${API_BASE_URL}/Messages/sent`, {
//       headers: getHeaders()
//     }).then(r => r.json()),

//   getConversations: () =>
//     fetch(`${API_BASE_URL}/Messages/conversations`, {
//       headers: getHeaders()
//     }).then(r => r.json()),

//   getById: (id) =>
//     fetch(`${API_BASE_URL}/Messages/${id}`, {
//       headers: getHeaders()
//     }).then(r => r.json()),

//   send: (data) =>
//     fetch(`${API_BASE_URL}/Messages`, {
//       method: 'POST',
//       headers: {
//         ...getHeaders(),
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     }).then(r => r.json()),

//   markAsRead: (id) =>
//     fetch(`${API_BASE_URL}/Messages/${id}/read`, {
//       method: 'PUT',
//       headers: getHeaders()
//     }).then(r => r.json()),

//   delete: (id) =>
//     fetch(`${API_BASE_URL}/Messages/${id}`, {
//       method: 'DELETE',
//       headers: getHeaders()
//     }).then(r => r.json())
// }
messages: {
  // 1. Get summary (unread message count)
  getSummary: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Messages/summary`, { 
        headers: getHeaders() 
      });
      const data = await response.json();
      console.log("📊 Messages summary:", data);
      
      if (data.success && data.data) return data.data;
      if (data.data) return data.data;
      return { unreadCount: 0, totalMessages: 0 };
    } catch (error) {
      console.error("Error fetching messages summary:", error);
      return { unreadCount: 0, totalMessages: 0 };
    }
  },

  // 2. Get inbox messages (with optional status filter)
  getInbox: async (isRead) => {
    const url = `${API_BASE_URL}/Messages/inbox${isRead !== undefined ? `?isRead=${isRead}` : ''}`;
    const response = await fetch(url, { headers: getHeaders() });
    const data = await response.json();
    console.log("📥 Inbox messages:", data);
    
    if (data.success && data.data) return data.data;
    if (data.data) return data.data;
    return [];
  },

  // 3. Get sent messages
  getSent: async () => {
    const response = await fetch(`${API_BASE_URL}/Messages/sent`, { 
      headers: getHeaders() 
    });
    const data = await response.json();
    console.log("📤 Sent messages:", data);
    
    if (data.success && data.data) return data.data;
    if (data.data) return data.data;
    return [];
  },

  // 4. Get conversations list (shows people you've chatted with)
  getConversations: async () => {
    const response = await fetch(`${API_BASE_URL}/Messages/conversations`, { 
      headers: getHeaders() 
    });
    const data = await response.json();
    console.log("💬 Conversations:", data);
    
    if (data.success && data.data) return data.data;
    if (data.data) return data.data;
    return [];
  },

  // 5. Get single message by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Messages/${id}`, { 
      headers: getHeaders() 
    });
    const data = await response.json();
    console.log(`📄 Message ${id}:`, data);
    
    if (data.success && data.data) return data.data;
    if (data.data) return data.data;
    return null;
  },

  // 6. Send a new message
// In /app/lib/api.js - messages section
send: async (data) => {
  const response = await fetch(`${API_BASE_URL}/Messages`, {
    method: 'POST',
    headers: { 
      ...getHeaders(), 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  console.log("✉️ Send message API response:", result);
  
  // Handle ApiResponseFactory response format
  if (response.ok && result.success) {
    return { success: true, data: result.data, messages: result.messages };
  }
  
  return { 
    success: false, 
    message: result.message || 'Failed to send message',
    messages: result.messages 
  };
},

  // 7. Mark message as read
  markAsRead: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Messages/${id}/read`, { 
      method: 'PUT', 
      headers: getHeaders() 
    });
    const result = await response.json();
    console.log(`✅ Marked message ${id} as read:`, result);
    
    return result.success ? result.data : null;
  },

  // 8. Delete a message
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Messages/${id}`, { 
      method: 'DELETE', 
      headers: getHeaders() 
    });
    const result = await response.json();
    console.log(`🗑️ Deleted message ${id}:`, result);
    
    return result.success;
  },
},
smartTutor: {
    // إرسال رسالة للـ AI
    chat: (message) =>
        fetch(`${API_BASE_URL}/SmartTutor/chat`, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        }).then(r => r.json()),

    // (اختياري) جلب المحادثات
    getConversations: () =>
        fetch(`${API_BASE_URL}/SmartTutor/conversations`, {
            headers: getHeaders()
        }).then(r => r.json()),
},
users: {
    // هتحتاج دي عشان تجيب لستة الناس اللي المدرس ينفع يكلمهم
   // الفانكشن اللي كانت ناقصة وسببت الـ Error
    getAllByRole: async (role) => {
      try {
        // الـ Endpoint ده لازم يكون مطابق للـ Backend عندك
        // غالباً بيكون حاجة زي /users/role/student
        const response = await axiosInstance.get(`/users/role/${role}`);
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    // لو حابب تجيب كل المستخدمين مرة واحدة
    getAll: async () => {
       const response = await axiosInstance.get('/users');
       return { success: true, data: response.data };
    }
  }

,
announcements: {
  getSummary: () =>
    fetch(`${API_BASE_URL}/Announcements/summary`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),

  create: (data) =>
    fetch(`${API_BASE_URL}/Announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  getAll: () =>
    fetch(`${API_BASE_URL}/Announcements`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),


  delete: (oid) =>
    fetch(`${API_BASE_URL}/Announcements/${oid}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())

}
,
reports: {

  // 📊 Academic Performance
  getAcademicPerformance: async (classOid) => {
    const params = new URLSearchParams();
    if (classOid) params.append('classOid', classOid);

    const res = await fetch(`${API_BASE_URL}/Reports/academic-performance?${params}`, {
      headers: getHeaders()
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.success ? data.data : [];
  },

  // 📊 Attendance Distribution
  getAttendanceDistribution: async (classOid, fromDate, toDate) => {
    const params = new URLSearchParams();
    if (classOid) params.append('classOid', classOid);
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    const res = await fetch(`${API_BASE_URL}/Reports/attendance-distribution?${params}`, {
      headers: getHeaders()
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.success ? data.data : null;
  },

  // 📊 Grades Report
  getGrades: async (classOid, subjectOid) => {
    const params = new URLSearchParams();
    if (classOid) params.append('classOid', classOid);
    if (subjectOid) params.append('subjectOid', subjectOid);

    const res = await fetch(`${API_BASE_URL}/Reports/grades?${params}`, {
      headers: getHeaders()
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.success ? data.data : [];
  },

  // 📊 Students Summary
  getStudentsSummary: async (classOid, status) => {
    const params = new URLSearchParams();
    if (classOid) params.append('classOid', classOid);
    if (status) params.append('status', status);

    const res = await fetch(`${API_BASE_URL}/Reports/students-summary?${params}`, {
      headers: getHeaders()
    });

    if (!res.ok) {
      console.error('Students Summary API Error:', res.status);
      return null;
    }

    const data = await res.json();
    return data.success ? data.data : null;
  },

  // 💰 Financial Summary
  getFinancial: async (year) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);

    const res = await fetch(`${API_BASE_URL}/Reports/financial?${params}`, {
      headers: getHeaders()
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.success ? data.data : null;
  },

  // 👨‍🏫 Teacher Activity
  getTeacherActivity: async (teacherOid, fromDate, toDate) => {
    const params = new URLSearchParams();
    if (teacherOid) params.append('teacherOid', teacherOid);
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    const res = await fetch(`${API_BASE_URL}/Reports/teacher-activity?${params}`, {
      headers: getHeaders()
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.success ? data.data : [];
  },

  // 🧾 Generate Student Report
  generateStudent: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/Reports/student`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Generate student report failed');

    return await res.json();
  },

  // 👨‍🏫 Generate Teacher Report
  generateTeacher: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/Reports/teacher`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Generate teacher report failed');

    return await res.json();
  },

  // 💰 Generate Financial Report
  generateFinancial: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/Reports/financial`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Generate financial report failed');

    return await res.json();
  },

  // 📦 Archive Report
  archive: async (oid) => {
    const res = await fetch(`${API_BASE_URL}/Reports/archive/${oid}`, {
      method: 'PUT',
      headers: getHeaders()
    });

    if (!res.ok) throw new Error('Archive failed');

    return await res.json();
  },

  // ❌ Delete Report
  delete: async (oid) => {
    const res = await fetch(`${API_BASE_URL}/Reports/${oid}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!res.ok) throw new Error('Delete failed');

    return await res.json();
  }
}
,
 notifications : {

  // 🔔 Get Summary (total / unread / read)
  getSummary: () =>
    fetch(`${API_BASE_URL}/Notifications/summary`, {
      headers: getHeaders()
    })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),

  // 🔔 Get All Notifications
  getAll: (isRead, type, take) =>
    fetch(`${API_BASE_URL}/Notifications?${isRead !== undefined ? `isRead=${isRead}` : ''}${type ? `&type=${type}` : ''}${take ? `&take=${take}` : ''}`, {
      headers: getHeaders()
    })
      .then(res => res.json())
      .then(data => data.success ? data.data : []),

  // 🔔 Send Notification (Admin only)
  send: (body) =>
    fetch(`${API_BASE_URL}/Notifications`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()),

  // ✅ Mark one as read
  markAsRead: (oid) =>
    fetch(`${API_BASE_URL}/Notifications/${oid}/read`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(res => res.json()),

  // ✅ Mark all as read
  markAllAsRead: () =>
    fetch(`${API_BASE_URL}/Notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(res => res.json()),

  // ❌ Delete notification
  delete: (oid) =>
    fetch(`${API_BASE_URL}/Notifications/${oid}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json())
},
// Profile endpoints
  // profile: {
  //   // GET: api/Profile
  //   get: () =>
  //     fetch(`${API_BASE_URL}/Profile`, {
  //       headers: getHeaders()
  //     }).then(res => res.json()),

  //   // PUT: api/Profile
  //   update: (data) =>
  //     fetch(`${API_BASE_URL}/Profile`, {
  //       method: 'PUT',
  //       headers: {
  //         ...getHeaders(),
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     }).then(res => res.json()),

  //   // POST: api/Profile/change-password
  //   changePassword: (data) =>
  //     fetch(`${API_BASE_URL}/Profile/change-password`, {
  //       method: 'POST',
  //       headers: {
  //         ...getHeaders(),
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     }).then(res => res.json()),

  //   // GET: api/Profile/activity
  //   getActivity: () =>
  //     fetch(`${API_BASE_URL}/Profile/activity`, {
  //       headers: getHeaders()
  //     }).then(res => res.json()),

  //   // Upload Avatar (Optional - if you decide to uncomment it later)
  //   uploadAvatar: (formData) =>
  //     fetch(`${API_BASE_URL}/Profile/upload-avatar`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         // Note: Don't set Content-Type, fetch will set it automatically for FormData
  //       },
  //       body: formData
  //     }).then(res => res.json())
  // }
  profile: {
  // GET: api/Profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/Profile`, {
      headers: getHeaders()
    });
    const data = await response.json();
    console.log("👤 Profile data:", data);
    
    if (data.success && data.data) return data.data;
    if (data.data) return data.data;
    return null;
  },

  // PUT: api/Profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/Profile`, {
      method: 'PUT',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    console.log("📝 Update profile response:", data);
    
    return {
      success: data.success,
      message: data.messages?.EN || data.message,
      data: data.data
    };
  },

  // POST: api/Profile/change-password
  changePassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/Profile/change-password`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });
    const data = await response.json();
    console.log("🔐 Change password response:", data);
    
    return {
      success: data.success,
      message: data.messages?.EN || data.message,
      data: data.data
    };
  },

  // POST: api/Profile/upload-avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/Profile/upload-avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    const data = await response.json();
    console.log("🖼️ Upload avatar response:", data);
    
    if (data.success && data.data) return data.data;
    return { success: false, message: data.messages?.EN };
  },

  // GET: api/Profile/activity
  getRecentActivity: async () => {
    const response = await fetch(`${API_BASE_URL}/Profile/activity`, {
      headers: getHeaders()
    });
    const data = await response.json();
    console.log("📊 Activity data:", data);
    
    if (data.success && data.data) return data.data;
    if (data.data) return data.data;
    return [];
  }
}
  ,
settings: {

  // GET: api/Settings
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // GET: api/Settings/general
  getGeneral: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/general`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // GET: api/Settings/notifications
  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/notifications`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // GET: api/Settings/security
  getSecurity: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/security`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // GET: api/Settings/school-info
  getSchoolInfo: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/school-info`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // GET: api/Settings/language
  getLanguage: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/language`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // GET: api/Settings/appearance
  getAppearance: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/appearance`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // GET: api/Settings/system  [Admin, SystemAdministrator]
  getSystem: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/system`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // GET: api/Settings/email-config  [Admin, SystemAdministrator]
  getEmailConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/email-config`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // GET: api/Settings/backups  [Admin, SystemAdministrator]
  getBackups: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/backups`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return [];
  },

  // GET: api/Settings/system-health  [Admin, SystemAdministrator]
  getSystemHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/Settings/system-health`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // PUT: api/Settings  [Admin, SystemAdministrator]
  // payload: { general, schoolInfo, language, appearance, system }
  updateAll: async (settingsDto) => {
    const response = await fetch(`${API_BASE_URL}/Settings`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: settingsDto })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

  // PUT: api/Settings/notifications
  // payload: { emailNotifications, pushNotifications, attendanceReminders, gradeUpdates }
  updateNotifications: async (notificationSettingsDto) => {
    const response = await fetch(`${API_BASE_URL}/Settings/notifications`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationSettings: notificationSettingsDto })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

  // PUT: api/Settings/security
  // payload: { twoFactorAuthentication, sessionTimeoutMinutes }
  updateSecurity: async (securitySettingsDto) => {
    const response = await fetch(`${API_BASE_URL}/Settings/security`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ securitySettings: securitySettingsDto })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

  // PUT: api/Settings/school-info  [Admin, SystemAdministrator]
  // payload: { schoolName, schoolAddress, schoolPhone, schoolEmail, schoolLogo,
  //            principalName, establishedYear, website, registrationNumber,
  //            descriptionEn, descriptionAr, addressEn, addressAr }
  updateSchoolInfo: async (schoolInfoDto) => {
    const response = await fetch(`${API_BASE_URL}/Settings/school-info`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolInfo: schoolInfoDto })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

  // PUT: api/Settings/language  [Admin, SystemAdministrator]
  // payload: { defaultLanguage, dateFormat, timeFormat, timezone, supportedLanguages }
  updateLanguage: async (languageSettingsDto) => {
    const response = await fetch(`${API_BASE_URL}/Settings/language`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ languageSettings: languageSettingsDto })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

  // PUT: api/Settings/appearance
  // payload: { theme, primaryColor, secondaryColor, backgroundColor, surfaceColor, compactMode, rtlMode }
  updateAppearance: async (appearanceSettingsDto) => {
    const response = await fetch(`${API_BASE_URL}/Settings/appearance`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ appearanceSettings: appearanceSettingsDto })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

  // PUT: api/Settings/system  [SystemAdministrator]
  // payload: { backup, emailServer, cache, logging }
  updateSystem: async (systemSettingsDto) => {
    const response = await fetch(`${API_BASE_URL}/Settings/system`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemSettings: systemSettingsDto })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

  // PUT: api/Settings/email-config  [SystemAdministrator]
  // payload: { smtpServer, port, senderEmail, senderName, useSsl, isConfigured }
  updateEmailConfig: async (emailConfigDto) => {
    const response = await fetch(`${API_BASE_URL}/Settings/email-config`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailConfig: emailConfigDto })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

  // POST: api/Settings/change-password
  // payload: { currentPassword, newPassword, confirmPassword }
  changePassword: async (changePasswordDto) => {
    const response = await fetch(`${API_BASE_URL}/Settings/change-password`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ changePassword: changePasswordDto })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

  // POST: api/Settings/backups/create  [Admin, SystemAdministrator]
  // payload: { backupName } (optional)
  createBackup: async (backupName = null) => {
    const response = await fetch(`${API_BASE_URL}/Settings/backups/create`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ backupName })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message, data: data.data };
  },

  // POST: api/Settings/email-config/test  [Admin, SystemAdministrator]
  // payload: { emailConfig: { smtpServer, port, ... }, testEmail }
  testEmailConfig: async (emailConfigDto, testEmail) => {
    const response = await fetch(`${API_BASE_URL}/Settings/email-config/test`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailConfig: emailConfigDto, testEmail })
    });
    const data = await response.json();
    return { success: data.success, message: data.messages?.EN || data.message };
  },

}
,
lessons: {

  // ✅ Get All
  getAll: () =>
    fetch(`${API_BASE_URL}/Lessons/Get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify({
        request: {
          filters: [],
          sort: {
            sortBy: "date",
            sortDirection: "desc"
          },
          pagination: {
            getAll: true,
            pageNumber: 1,
            pageSize: 10
          },
          columns: []
        }
      })
    })
      .then(res => res.json())
      .then(data => data.success ? data.data : []),

  // ✅ Get By Id
  getById: (id) =>
    fetch(`${API_BASE_URL}/Lessons/${id}`, {
      headers: getHeaders()
    })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),

  // ✅ Create
  create: (data) =>
    fetch(`${API_BASE_URL}/Lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  // ✅ Update
  update: (id, data) =>
    fetch(`${API_BASE_URL}/Lessons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders()
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  // ✅ Delete
  delete: (id) =>
    fetch(`${API_BASE_URL}/Lessons/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json()),

  // ✅ Stats
  getStats: () =>
    fetch(`${API_BASE_URL}/Lessons/stats`, {
      headers: getHeaders()
    })
      .then(res => res.json())
      .then(data => data.success ? data.data : null)
},
// أضف هذا الجزء داخل كائن الـ api في ملف الـ lib/api.js

files: {
  // ✅ رفع ملف واحد
 // ================= FILE UPLOAD =================
uploadFile: async (file, entityType, entityId) => {
  const formData = new FormData();
  formData.append("File", file); // لازم F كابيتال

  const res = await fetch(
    `https://localhost:7179/api/Files/upload/${entityType}/${entityId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Upload failed");

  return res.json();
},
  // ✅ رفع ملفات متعددة
  uploadMultiple: (entityType, entityId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('Files', file); // 'Files' يجب أن يطابق اسم الخاصية في MultipleFilesUploadRequest
    });

    return fetch(`${API_BASE_URL}/Files/upload-multiple/${entityType}/${entityId}`, {
      method: 'POST',
      headers: {
        ...getHeaders(true)
      },
      body: formData
    }).then(res => res.json());
  },

  // ✅ الحصول على ملفات كائن معين (درس، امتحان، الخ)
  getEntityFiles: (entityType, entityId) =>
    fetch(`${API_BASE_URL}/Files/${entityType}/${entityId}`, {
      headers: getHeaders()
    }).then(res => res.json()),

  // ✅ حذف ملف عن طريق الرابط
  deleteFile: (fileUrl) =>
    fetch(`${API_BASE_URL}/Files/delete?fileUrl=${encodeURIComponent(fileUrl)}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json()),

  // ✅ حذف كل ملفات كائن معين
  deleteEntityFiles: (entityType, entityId) =>
    fetch(`${API_BASE_URL}/Files/delete/${entityType}/${entityId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json()),
},
helpSupport: {

  // GET: api/HelpSupport/faqs?category=&search=
  getFAQs: async (category = null, search = null) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/HelpSupport/faqs?${params.toString()}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return [];
  },

  // GET: api/HelpSupport/knowledge-base?category=
  getKnowledgeBase: async (category = null) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);

    const response = await fetch(`${API_BASE_URL}/HelpSupport/knowledge-base?${params.toString()}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return [];
  },

  // GET: api/HelpSupport/knowledge-base/:id
  getArticleById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/HelpSupport/knowledge-base/${id}`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return null;
  },

  // POST: api/HelpSupport/tickets
  // payload: { subject, category, message }
  createTicket: async (ticketDto) => {
    const response = await fetch(`${API_BASE_URL}/HelpSupport/tickets`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketDto)
    });
    const data = await response.json();
    return {
      success: data.success,
      message: data.messages?.EN || data.message,
      data: data.data  // returns the new ticket Guid
    };
  },

  // GET: api/HelpSupport/my-tickets
  getMyTickets: async () => {
    const response = await fetch(`${API_BASE_URL}/HelpSupport/my-tickets`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success && data.data) return data.data;
    return [];
  },

},

};