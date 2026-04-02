const API_BASE_URL = 'http://localhost:5073/api';

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
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json())
  },
  
  // Students endpoints
  students: {
    getAll: () =>
      fetch(`${API_BASE_URL}/Students`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : []),
    
    getById: (id) =>
      fetch(`${API_BASE_URL}/Students/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),
    
    create: (data) =>
      fetch(`${API_BASE_URL}/Students`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
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
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json())
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
    
    getByTeacher: (teacherOid) =>
      fetch(`${API_BASE_URL}/Timetable/teacher/${teacherOid}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => data.success ? data.data : null),
    
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
};