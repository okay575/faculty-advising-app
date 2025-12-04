import * as SQLite from 'expo-sqlite';

let db = null;

// Initialize database
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('facultySchedule.db');
    
    // Create tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        studentID TEXT,
        status TEXT,
        profilePhoto TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        createdAt TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY,
        subjectId TEXT NOT NULL,
        title TEXT NOT NULL,
        scheduleTime TEXT NOT NULL,
        createdAt TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS consultation_requests (
        id TEXT PRIMARY KEY,
        facultyId TEXT NOT NULL,
        studentId TEXT NOT NULL,
        studentName TEXT NOT NULL,
        datetime TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'pending',
        createdAt TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (facultyId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        subject TEXT NOT NULL,
        facultyEmail TEXT NOT NULL,
        enrolledAt TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS settings (
        userId TEXT PRIMARY KEY,
        compactLayout INTEGER DEFAULT 0,
        notify INTEGER DEFAULT 0,
        backgroundColor TEXT DEFAULT 'white',
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_subjects_userId ON subjects(userId);
      CREATE INDEX IF NOT EXISTS idx_schedules_subjectId ON schedules(subjectId);
      CREATE INDEX IF NOT EXISTS idx_requests_facultyId ON consultation_requests(facultyId);
      CREATE INDEX IF NOT EXISTS idx_requests_studentId ON consultation_requests(studentId);
      CREATE INDEX IF NOT EXISTS idx_enrollments_studentId ON enrollments(studentId);
    `);

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

// ========== USER OPERATIONS ==========

export const createUser = async (user) => {
  const database = getDatabase();
  await database.runAsync(
    `INSERT INTO users (id, name, email, password, role, studentID, status, profilePhoto)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.studentID || null,
      user.status || null,
      user.profilePhoto || null
    ]
  );
  return user;
};

export const getUserByEmail = async (email) => {
  const database = getDatabase();
  const result = await database.getFirstAsync(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return result;
};

export const getUserById = async (id) => {
  const database = getDatabase();
  const result = await database.getFirstAsync(
    `SELECT * FROM users WHERE id = ?`,
    [id]
  );
  return result;
};

export const getAllUsers = async () => {
  const database = getDatabase();
  const result = await database.getAllAsync(`SELECT * FROM users`);
  return result;
};

export const updateUser = async (user) => {
  const database = getDatabase();
  await database.runAsync(
    `UPDATE users 
     SET name = ?, email = ?, studentID = ?, status = ?, profilePhoto = ?
     WHERE id = ?`,
    [
      user.name,
      user.email,
      user.studentID || null,
      user.status || null,
      user.profilePhoto || null,
      user.id
    ]
  );
  return user;
};

// ========== SUBJECT OPERATIONS ==========

export const createSubject = async (subject) => {
  const database = getDatabase();
  await database.runAsync(
    `INSERT INTO subjects (id, userId, name) VALUES (?, ?, ?)`,
    [subject.id, subject.userId, subject.name]
  );
  return subject;
};

export const getSubjectsByUserId = async (userId) => {
  const database = getDatabase();
  const result = await database.getAllAsync(
    `SELECT * FROM subjects WHERE userId = ? ORDER BY createdAt DESC`,
    [userId]
  );
  return result;
};

export const deleteSubject = async (subjectId) => {
  const database = getDatabase();
  await database.runAsync(`DELETE FROM subjects WHERE id = ?`, [subjectId]);
};

// ========== SCHEDULE OPERATIONS ==========

export const createSchedule = async (schedule) => {
  const database = getDatabase();
  await database.runAsync(
    `INSERT INTO schedules (id, subjectId, title, scheduleTime) VALUES (?, ?, ?, ?)`,
    [schedule.id, schedule.subjectId, schedule.title, schedule.when]
  );
  return schedule;
};

export const getSchedulesBySubjectId = async (subjectId) => {
  const database = getDatabase();
  const result = await database.getAllAsync(
    `SELECT * FROM schedules WHERE subjectId = ? ORDER BY createdAt DESC`,
    [subjectId]
  );
  return result;
};

export const deleteSchedule = async (scheduleId) => {
  const database = getDatabase();
  await database.runAsync(`DELETE FROM schedules WHERE id = ?`, [scheduleId]);
};

// ========== CONSULTATION REQUEST OPERATIONS ==========

export const createConsultationRequest = async (request) => {
  const database = getDatabase();
  await database.runAsync(
    `INSERT INTO consultation_requests (id, facultyId, studentId, studentName, datetime, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      request.id,
      request.facultyId,
      request.studentId,
      request.studentName,
      request.datetime,
      request.message || null,
      request.status || 'pending'
    ]
  );
  return request;
};

export const getConsultationRequestsByFacultyId = async (facultyId) => {
  const database = getDatabase();
  const result = await database.getAllAsync(
    `SELECT * FROM consultation_requests 
     WHERE facultyId = ? 
     ORDER BY createdAt DESC`,
    [facultyId]
  );
  return result;
};

export const updateConsultationRequestStatus = async (requestId, status) => {
  const database = getDatabase();
  await database.runAsync(
    `UPDATE consultation_requests SET status = ? WHERE id = ?`,
    [status, requestId]
  );
};

// ========== ENROLLMENT OPERATIONS ==========

export const createEnrollment = async (enrollment) => {
  const database = getDatabase();
  await database.runAsync(
    `INSERT INTO enrollments (id, studentId, subject, facultyEmail)
     VALUES (?, ?, ?, ?)`,
    [enrollment.id, enrollment.studentId, enrollment.subject, enrollment.facultyEmail]
  );
  return enrollment;
};

export const getEnrollmentsByStudentId = async (studentId) => {
  const database = getDatabase();
  const result = await database.getAllAsync(
    `SELECT * FROM enrollments WHERE studentId = ? ORDER BY enrolledAt DESC`,
    [studentId]
  );
  return result;
};

export const deleteEnrollment = async (enrollmentId) => {
  const database = getDatabase();
  await database.runAsync(`DELETE FROM enrollments WHERE id = ?`, [enrollmentId]);
};

// ========== SETTINGS OPERATIONS ==========

export const getSettingsByUserId = async (userId) => {
  const database = getDatabase();
  const result = await database.getFirstAsync(
    `SELECT * FROM settings WHERE userId = ?`,
    [userId]
  );
  return result || {
    userId,
    compactLayout: 0,
    notify: 0,
    backgroundColor: 'white'
  };
};

export const updateSettings = async (settings) => {
  const database = getDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO settings (userId, compactLayout, notify, backgroundColor)
     VALUES (?, ?, ?, ?)`,
    [
      settings.userId,
      settings.compactLayout ? 1 : 0,
      settings.notify ? 1 : 0,
      settings.backgroundColor || 'white'
    ]
  );
  return settings;
};

// ========== HELPER FUNCTIONS ==========

// Get complete user data with subjects and schedules
export const getUserWithSubjectsAndSchedules = async (userId) => {
  const user = await getUserById(userId);
  if (!user) return null;

  const subjects = await getSubjectsByUserId(userId);
  const subjectsWithSchedules = await Promise.all(
    subjects.map(async (subject) => {
      const schedules = await getSchedulesBySubjectId(subject.id);
      return {
        ...subject,
        schedules: schedules.map(s => ({
          id: s.id,
          title: s.title,
          when: s.scheduleTime
        }))
      };
    })
  );

  return {
    ...user,
    subjects: subjectsWithSchedules
  };
};

// Get faculty data with requests
export const getFacultyDataWithRequests = async (facultyId) => {
  const user = await getUserWithSubjectsAndSchedules(facultyId);
  if (!user) return null;

  const requests = await getConsultationRequestsByFacultyId(facultyId);
  const formattedRequests = requests.map(r => ({
    id: r.id,
    fromId: r.studentId,
    fromName: r.studentName,
    datetime: r.datetime,
    message: r.message,
    status: r.status
  }));

  return {
    ...user,
    requests: formattedRequests
  };
};

// Convert database user to app format
export const formatUser = (dbUser) => {
  if (!dbUser) return null;
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    password: dbUser.password,
    role: dbUser.role,
    studentID: dbUser.studentID,
    status: dbUser.status,
    profilePhoto: dbUser.profilePhoto
  };
};

// Convert database settings to app format
export const formatSettings = (dbSettings) => {
  if (!dbSettings) return {};
  return {
    compactLayout: Boolean(dbSettings.compactLayout),
    notify: Boolean(dbSettings.notify),
    backgroundColor: dbSettings.backgroundColor || 'white'
  };
};

