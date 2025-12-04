import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import IntroScreen from './screens/IntroScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import Dashboard from './screens/Dashboard';
import FacultyScreen from './screens/FacultyScreen';
import StudentScreen from './screens/StudentScreen';
import CourseScreen from './screens/CourseScreen';
import Notifications from './screens/Notifications';
import AccountScreen from './screens/AccountScreen';
import BottomNav from './components/BottomNav';
import {
  initDatabase,
  createUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
  createSubject,
  getSubjectsByUserId,
  deleteSubject,
  createSchedule,
  getSchedulesBySubjectId,
  deleteSchedule,
  createConsultationRequest,
  getConsultationRequestsByFacultyId,
  updateConsultationRequestStatus,
  createEnrollment,
  getEnrollmentsByStudentId,
  deleteEnrollment,
  getSettingsByUserId,
  updateSettings,
  getUserWithSubjectsAndSchedules,
  getFacultyDataWithRequests,
  formatUser,
  formatSettings
} from './utils/database';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [screen, setScreen] = useState('dashboard');
  const [showSignup, setShowSignup] = useState(false);
  const [facultyData, setFacultyData] = useState(null);
  const [studentEnrollments, setStudentEnrollments] = useState({});
  const [accountSettings, setAccountSettings] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDatabase();
      setDbInitialized(true);
      await loadData();
    } catch (e) {
      console.error('Database initialization error:', e);
      alert('Failed to initialize database. Please restart the app.');
    }
  };

  const loadData = async () => {
    try {
      // Load all users
      const allUsers = await getAllUsers();
      const formattedUsers = allUsers.map(formatUser);
      setUsers(formattedUsers);

      // Try to load last logged in user (we'll use a simple approach - get first user for now)
      // In a real app, you'd store the current user ID separately
      if (formattedUsers.length > 0) {
        // For now, we'll require login each time
        // You can enhance this by storing currentUserId in AsyncStorage
      }

      // Load settings if user exists
      if (currentUser) {
        const settings = await getSettingsByUserId(currentUser.id);
        setAccountSettings(formatSettings(settings));
      }
    } catch (e) {
      console.error('Load error:', e);
    }
  };

  const loadUserData = async (userId) => {
    try {
      if (!userId) return;

      const user = formatUser(await getUserByEmail(userId));
      if (!user) return;

      // Load faculty data if user is faculty
      if (user.role === 'faculty') {
        const facultyDataWithRequests = await getFacultyDataWithRequests(userId);
        setFacultyData(facultyDataWithRequests);
      }

      // Load enrollments if user is student
      if (user.role === 'student') {
        const enrollments = await getEnrollmentsByStudentId(userId);
        const enrollmentsObj = {};
        enrollments.forEach(e => {
          enrollmentsObj[e.id] = {
            id: e.id,
            subject: e.subject,
            facultyEmail: e.facultyEmail,
            enrolledAt: e.enrolledAt
          };
        });
        setStudentEnrollments(enrollmentsObj);
      }

      // Load settings
      const settings = await getSettingsByUserId(userId);
      setAccountSettings(formatSettings(settings));
    } catch (e) {
      console.error('Load user data error:', e);
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const dbUser = await getUserByEmail(email);
      if (!dbUser || dbUser.password !== password) {
        alert('Invalid email or password');
        return;
      }

      const user = formatUser(dbUser);
      setCurrentUser(user);
      await loadUserData(user.id);
      setScreen('dashboard');
    } catch (e) {
      console.error('Login error:', e);
      alert('Login failed. Please try again.');
    }
  };

  const handleSignup = async ({ name, email, password, role, studentID }) => {
    try {
      const exists = await getUserByEmail(email);
      if (exists) {
        alert('Email already registered');
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role,
        studentID: role === 'student' ? studentID : undefined,
        status: role === 'faculty' ? 'available' : undefined
      };

      await createUser(newUser);
      const formattedUser = formatUser(newUser);
      setCurrentUser(formattedUser);
      
      // Reload users list
      const allUsers = await getAllUsers();
      setUsers(allUsers.map(formatUser));
      
      await loadUserData(formattedUser.id);
      setScreen('dashboard');
      setShowSignup(false);
    } catch (e) {
      console.error('Signup error:', e);
      alert('Signup failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    setCurrentUser(null);
    setFacultyData(null);
    setStudentEnrollments({});
    setAccountSettings({});
    setScreen('dashboard');
  };

  const handleUpdateProfile = async (updatedUser) => {
    try {
      await updateUser(updatedUser);
      setCurrentUser(updatedUser);
      
      // Reload users list
      const allUsers = await getAllUsers();
      setUsers(allUsers.map(formatUser));
    } catch (e) {
      console.error('Update profile error:', e);
      alert('Failed to update profile.');
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      if (!currentUser) return;
      
      const merged = { ...accountSettings, ...newSettings };
      await updateSettings({ ...merged, userId: currentUser.id });
      setAccountSettings(merged);
    } catch (e) {
      console.error('Update settings error:', e);
      alert('Failed to update settings.');
    }
  };

  const handleSaveFaculty = async (data) => {
    try {
      if (!currentUser) return;

      // Update user status
      if (data.status) {
        await updateUser({ ...currentUser, status: data.status });
        setCurrentUser({ ...currentUser, status: data.status });
      }

      // Handle subjects and schedules
      if (data.subjects) {
        // Get existing subjects from database
        const existingSubjects = await getSubjectsByUserId(currentUser.id);
        const existingSubjectIds = new Set(existingSubjects.map(s => s.id));

        // Process each subject
        for (const subject of data.subjects) {
          if (!existingSubjectIds.has(subject.id)) {
            // Create new subject
            await createSubject({
              id: subject.id,
              userId: currentUser.id,
              name: subject.name
            });
          }

          // Handle schedules for this subject
          if (subject.schedules) {
            const existingSchedules = await getSchedulesBySubjectId(subject.id);
            const existingScheduleIds = new Set(existingSchedules.map(s => s.id));

            for (const schedule of subject.schedules) {
              if (!existingScheduleIds.has(schedule.id)) {
                // Create new schedule
                await createSchedule({
                  id: schedule.id,
                  subjectId: subject.id,
                  title: schedule.title,
                  when: schedule.when
                });
              }
            }
          }
        }

        // Delete subjects that are no longer in data.subjects
        const newSubjectIds = new Set(data.subjects.map(s => s.id));
        for (const existingSubject of existingSubjects) {
          if (!newSubjectIds.has(existingSubject.id)) {
            await deleteSubject(existingSubject.id);
          }
        }
      }

      // Handle request status updates
      if (data.requests) {
        for (const request of data.requests) {
          await updateConsultationRequestStatus(request.id, request.status);
        }
      }

      // Reload faculty data
      const updatedFacultyData = await getFacultyDataWithRequests(currentUser.id);
      setFacultyData(updatedFacultyData);
    } catch (e) {
      console.error('Save faculty error:', e);
      alert('Failed to save faculty data.');
    }
  };

  const handleUpdateEnrollments = async (newEnrollments) => {
    try {
      if (!currentUser) return;

      // Get existing enrollments
      const existingEnrollments = await getEnrollmentsByStudentId(currentUser.id);
      const existingIds = new Set(existingEnrollments.map(e => e.id));

      // Create new enrollments
      for (const [id, enrollment] of Object.entries(newEnrollments)) {
        if (!existingIds.has(id)) {
          await createEnrollment({
            id: enrollment.id,
            studentId: currentUser.id,
            subject: enrollment.subject,
            facultyEmail: enrollment.facultyEmail
          });
        }
      }

      // Delete enrollments that are no longer in newEnrollments
      const newIds = new Set(Object.keys(newEnrollments));
      for (const existing of existingEnrollments) {
        if (!newIds.has(existing.id)) {
          await deleteEnrollment(existing.id);
        }
      }

      setStudentEnrollments(newEnrollments);
    } catch (e) {
      console.error('Update enrollments error:', e);
      alert('Failed to update enrollments.');
    }
  };

  const handleSendRequest = async ({ facultyId, datetime, message }) => {
    try {
      if (!currentUser) return;

      const request = {
        id: Date.now().toString(),
        facultyId,
        studentId: currentUser.id,
        studentName: currentUser.name,
        datetime,
        message: message || '',
        status: 'pending'
      };

      await createConsultationRequest(request);
      
      // Reload faculty data to get updated requests
      const updatedFacultyData = await getFacultyDataWithRequests(facultyId);
      setFacultyData(updatedFacultyData);
      
      alert('Request sent');
    } catch (e) {
      console.error('Send request error:', e);
      alert('Failed to send request.');
    }
  };

  if (!dbInitialized) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Initializing database...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (showIntro) {
    return <IntroScreen onFinish={() => setShowIntro(false)} />;
  }

  if (!currentUser) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          {showSignup ? (
            <SignupScreen onSignup={handleSignup} onGoToLogin={() => setShowSignup(false)} />
          ) : (
            <LoginScreen onLogin={handleLogin} onGoToSignup={() => setShowSignup(true)} />
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return (
          <Dashboard
            user={currentUser}
            users={users}
            onOpenFaculty={() => setScreen('faculty')}
            onOpenStudent={() => setScreen('student')}
            onOpenCourse={(course) => {
              setSelectedCourse(course);
              setScreen('course');
            }}
          onSignOut={handleSignOut}
            onSendRequest={handleSendRequest}
          />
        );
      case 'faculty':
        return (
          <FacultyScreen
            data={facultyData || currentUser}
            onSave={handleSaveFaculty}
            onBack={async () => {
              // Reload faculty data when going back
              if (currentUser && currentUser.role === 'faculty') {
                const updatedData = await getFacultyDataWithRequests(currentUser.id);
                setFacultyData(updatedData);
              }
              setScreen('dashboard');
            }}
          />
        );
      case 'student':
        return (
          <StudentScreen
            users={users}
            facultyData={facultyData}
            onSelectFaculty={(faculty) => {
              // Handle faculty selection if needed
            }}
            onBack={() => setScreen('dashboard')}
            studentEnrollments={studentEnrollments}
            onUpdateEnrollments={handleUpdateEnrollments}
          />
        );
      case 'course':
        return (
          <CourseScreen
            course={selectedCourse}
            onBack={() => {
              setSelectedCourse(null);
              setScreen('dashboard');
            }}
          />
        );
      case 'notifications':
        // Reload faculty data when notifications screen is shown
        if (currentUser && currentUser.role === 'faculty' && !facultyData) {
          getFacultyDataWithRequests(currentUser.id).then(setFacultyData);
        }
        return (
          <Notifications
            currentUser={currentUser}
            users={users}
            facultyData={facultyData}
          />
        );
      case 'account':
        return (
          <AccountScreen
            user={currentUser}
            onUpdateProfile={handleUpdateProfile}
            settings={accountSettings}
            onUpdateSettings={handleUpdateSettings}
            onLogout={handleSignOut}
            onBack={() => setScreen('dashboard')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: accountSettings.backgroundColor || '#fff' }]} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
        <BottomNav
          currentScreen={screen}
          onNavigate={(s) => { if (s === 'dashboard') setScreen('dashboard'); else if (s === 'faculty') setScreen('faculty'); else if (s === 'student') setScreen('student'); else if (s === 'course') setScreen('course'); else if (s === 'notifications') setScreen('notifications'); else if (s === 'account') setScreen('account'); }}
          userRole={currentUser.role}
          onSignOut={handleSignOut}
          backgroundColor={accountSettings.backgroundColor || '#fff'}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1
  }
});
