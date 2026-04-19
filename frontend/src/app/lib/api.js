
const API_BASE_URL = "https://localhost:7179/api";

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

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
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
    
    getByTeacher: (teacherOid) => {
      const token = localStorage.getItem('token');
      return fetch(`${API_BASE_URL}/Timetable/teacher/${teacherOid}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }).then(res => res.json());
    },

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

  // Attendance endpoints
 // Attendance endpoints
  attendance: {
    getToday: (classOid) =>
      fetch(`${API_BASE_URL}/Attendance/today${classOid ? `?classOid=${classOid}` : ''}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json()),
    
    getWeekly: (classOid, startDate) =>
      fetch(`${API_BASE_URL}/Attendance/weekly${classOid ? `?classOid=${classOid}` : ''}${startDate ? `&startDate=${startDate}` : ''}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json()),
    
    getMonthlyReport: (year, month, classOid) =>
      fetch(`${API_BASE_URL}/Attendance/monthly-report?year=${year}&month=${month}${classOid ? `&classOid=${classOid}` : ''}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json()),
    
    getAll: (classOid, date) =>
      fetch(`${API_BASE_URL}/Attendance${classOid ? `?classOid=${classOid}` : ''}${date ? `&date=${date}` : ''}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json()),
    
    create: (data) =>
      fetch(`${API_BASE_URL}/Attendance`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    update: (oid, data) =>
      fetch(`${API_BASE_URL}/Attendance/${oid}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    delete: (oid) =>
      fetch(`${API_BASE_URL}/Attendance/${oid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json())
  }
  ,
  // Exams endpoints
// Exams endpoints
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

  create: (data) =>
    fetch(`${API_BASE_URL}/Exams`, {
      method: 'POST',
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

  getResults: (examOid) =>
    fetch(`${API_BASE_URL}/Exams/${examOid}/results`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => data.success ? data.data : [])
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
messages: {
  getSummary: () =>
    fetch(`${API_BASE_URL}/Messages/summary`, {
      headers: getHeaders()
    }).then(r => r.json()),

  getInbox: (isRead) =>
    fetch(`${API_BASE_URL}/Messages/inbox${isRead !== undefined ? `?isRead=${isRead}` : ''}`, {
      headers: getHeaders()
    }).then(r => r.json()),

  getSent: () =>
    fetch(`${API_BASE_URL}/Messages/sent`, {
      headers: getHeaders()
    }).then(r => r.json()),

  getConversations: () =>
    fetch(`${API_BASE_URL}/Messages/conversations`, {
      headers: getHeaders()
    }).then(r => r.json()),

  getById: (id) =>
    fetch(`${API_BASE_URL}/Messages/${id}`, {
      headers: getHeaders()
    }).then(r => r.json()),

  send: (data) =>
    fetch(`${API_BASE_URL}/Messages`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  markAsRead: (id) =>
    fetch(`${API_BASE_URL}/Messages/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(r => r.json()),

  delete: (id) =>
    fetch(`${API_BASE_URL}/Messages/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(r => r.json())
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
  profile: {
    // GET: api/Profile
    get: () =>
      fetch(`${API_BASE_URL}/Profile`, {
        headers: getHeaders()
      }).then(res => res.json()),

    // PUT: api/Profile
    update: (data) =>
      fetch(`${API_BASE_URL}/Profile`, {
        method: 'PUT',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),

    // POST: api/Profile/change-password
    changePassword: (data) =>
      fetch(`${API_BASE_URL}/Profile/change-password`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),

    // GET: api/Profile/activity
    getActivity: () =>
      fetch(`${API_BASE_URL}/Profile/activity`, {
        headers: getHeaders()
      }).then(res => res.json()),

    // Upload Avatar (Optional - if you decide to uncomment it later)
    uploadAvatar: (formData) =>
      fetch(`${API_BASE_URL}/Profile/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Note: Don't set Content-Type, fetch will set it automatically for FormData
        },
        body: formData
      }).then(res => res.json())
  }
  ,
  settings: {

  getGeneral: () =>
    fetch(`${API_BASE_URL}/Settings/general`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),

  updateNotifications: (data) =>
    fetch(`${API_BASE_URL}/Settings/notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    }).then(async res => {
      const json = await res.json();
      if (!res.ok) throw json;
      return json;
    }),

  updateSecurity: (data) =>
    fetch(`${API_BASE_URL}/Settings/security`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    }).then(async res => {
      const json = await res.json();
      if (!res.ok) throw json;
      return json;
    }),
     getSchoolInfo: async () => {
      const res = await fetch(`${API_BASE_URL}/Settings/school-info`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      return data;
    },

    // ================= UPDATE =================
    updateSchoolInfo: async (payload) => {
      const res = await fetch(`${API_BASE_URL}/Settings/school-info`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw data;

      return data;
    },
  

}

};