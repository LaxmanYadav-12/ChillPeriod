'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MobileNav from '@/components/MobileNav';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Form State
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formTags, setFormTags] = useState('');

  // Custom Date Picker State
  const todayDate = new Date();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(todayDate.getMonth());
  const [calendarYear, setCalendarYear] = useState(todayDate.getFullYear());
  const [stepPicker, setStepPicker] = useState('date'); // 'date' or 'time'

  // Dashboard Dataimer state
  const [timerMode, setTimerMode] = useState('work'); // 'work' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTasks();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  let timerInterval;
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      if (timerMode === 'work') {
         // Automatically switch to break
         setTimerMode('break');
         setTimeLeft(5 * 60);
         // You could trigger a notification here
         if (Notification.permission === 'granted') {
             new Notification('Focus session complete! Time for a 5-minute ChillPeriod.');
         }
      } else {
         setTimerMode('work');
         setTimeLeft(25 * 60);
         if (Notification.permission === 'granted') {
             new Notification('Break over! Ready to focus?');
         }
      }
    }
    return () => clearInterval(timerInterval);
  }, [timerActive, timeLeft, timerMode]);

  // Request notification permissions for pomodoro
  useEffect(() => {
     if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
     }
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(timerMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const setWorkMode = () => {
     setTimerMode('work');
     setTimerActive(false);
     setTimeLeft(25 * 60);
  };

  const setBreakMode = () => {
     setTimerMode('break');
     setTimerActive(false);
     setTimeLeft(5 * 60);
  };


  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    
    setIsSubmitting(true);
    try {
      // split tags comma separated
      const tagsArray = formTags.split(',').map(t => t.trim()).filter(t => t);
      
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          priority: formPriority,
          dueDate: formDueDate || null,
          tags: tagsArray
        })
      });

      if (!res.ok) throw new Error('Failed to create task');
      
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
      
      // Reset form
      setShowTaskForm(false);
      setFormTitle('');
      setFormDescription('');
      setFormPriority('Medium');
      setFormDueDate('');
      setFormTags('');
    } catch (err) {
      console.error(err);
      alert('Error creating task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      // Optimistic UI update
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed: !currentStatus } : t));
      
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
    } catch (err) {
      console.error(err);
      // Revert on failure
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, completed: currentStatus } : t));
    }
  };

  const deleteTask = (taskId) => {
    setTaskToDelete(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      const res = await fetch(`/api/tasks/${taskToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t._id !== taskToDelete));
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    } finally {
      setTaskToDelete(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #8b5cf6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <MobileNav currentPage="tasks" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '80px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px', textAlign: 'center' }}>You need to sign in to access Tasks</h1>
        <a href="/login" style={{ padding: '12px 24px', background: '#8b5cf6', color: 'white', borderRadius: '12px', fontWeight: 500, textDecoration: 'none' }}>Log In</a>
        <MobileNav currentPage="tasks" />
      </div>
    );
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <MobileNav currentPage="tasks" />

      {/* Main Content */}
      <div style={{ paddingTop: '80px', paddingBottom: '48px', maxWidth: '1100px', margin: '0 auto', padding: '80px 24px 48px' }}>
        
        {/* Header & Stats Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    ✅ <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Tasks</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your assignments, study goals, and projects.</p>
            </div>
            
            {/* Analytics Widget */}
            <div style={{ 
                background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', 
                padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', 
                maxWidth: '400px', margin: '0 auto', width: '100%'
            }}>
                <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                        <path style={{ color: 'var(--border-color)' }} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path style={{ color: '#8b5cf6', transition: 'all 1s ease-out' }} strokeDasharray={`${progressPercent}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span style={{ position: 'absolute', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{progressPercent}%</span>
                </div>
                <div>
                   <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: '4px', marginTop: 0 }}>Productivity</h3>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>{completedCount} of {totalCount} completed</p>
                </div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Left Column: Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: '1 / -1' }}>
                <style jsx>{`
                  @media (min-width: 1024px) {
                    .layout-grid {
                      display: grid;
                      grid-template-columns: 2fr 1fr;
                      gap: 24px;
                    }
                  }
                  @media (max-width: 1023px) {
                    .layout-grid {
                      display: flex;
                      flex-direction: column;
                      gap: 24px;
                    }
                  }
                `}</style>
                <div className="layout-grid">
                  <div>
                    {/* Actions & Filters */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'inline-flex' }}>
                            {['all', 'active', 'completed'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s', border: 'none', cursor: 'pointer',
                                        background: filter === f ? 'var(--bg-primary)' : 'transparent',
                                        color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        boxShadow: filter === f ? 'var(--shadow-sm)' : 'none'
                                    }}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                        
                        <button 
                            onClick={() => setShowTaskForm(true)}
                            style={{ background: '#8b5cf6', color: 'white', padding: '10px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <span>➕</span> Add Task
                        </button>
                    </div>

                    {/* Form Modal/Dropdown Equivalent */}
                    {showTaskForm && (
                         <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-md)' }}>
                             <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px', marginTop: 0 }}>Create New Task</h3>
                             <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                 <div>
                                     <input 
                                         type="text" 
                                         placeholder="What needs to be done?" 
                                         required
                                         value={formTitle}
                                         onChange={(e)=>setFormTitle(e.target.value)}
                                         style={{ width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none' }}
                                     />
                                 </div>
                                 
                                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                                     <div style={{ position: 'relative' }}>
                                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', paddingLeft: '4px' }}>Due Date</label>
                                        <div 
                                            onClick={() => { setStepPicker('date'); setShowDatePicker(true); }}
                                            style={{ width: '100%', background: 'var(--bg-primary)', color: formDueDate ? 'var(--text-primary)' : 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px 16px', fontSize: '14px', outline: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                        >
                                            <span>
                                                {formDueDate ? new Date(formDueDate).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Select Date & Time'}
                                            </span>
                                            <span style={{ fontSize: '16px' }}>📅</span>
                                        </div>
                                     </div>
                                     <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', paddingLeft: '4px' }}>Priority</label>
                                        <select 
                                            value={formPriority}
                                            onChange={(e)=>setFormPriority(e.target.value)}
                                            style={{ width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px 16px', fontSize: '14px', outline: 'none' }}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High Priority</option>
                                        </select>
                                     </div>
                                 </div>

                                 <div>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', paddingLeft: '4px' }}>Tags (comma separated)</label>
                                    <input 
                                         type="text" 
                                         placeholder="e.g. Assignment, dbms, urgent" 
                                         value={formTags}
                                         onChange={(e)=>setFormTags(e.target.value)}
                                         style={{ width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px 16px', fontSize: '14px', outline: 'none' }}
                                     />
                                 </div>

                                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                                     <button 
                                         type="button" 
                                         onClick={()=>setShowTaskForm(false)}
                                         style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                                     >
                                         Cancel
                                     </button>
                                     <button 
                                         type="submit" 
                                         disabled={isSubmitting}
                                         style={{ padding: '8px 24px', background: '#8b5cf6', color: 'white', fontSize: '14px', fontWeight: 500, borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: isSubmitting ? 0.5 : 1 }}
                                     >
                                         {isSubmitting ? 'Saving...' : 'Save Task'}
                                     </button>
                                 </div>
                             </form>
                         </div>
                    )}

                    {/* The List of Tasks */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredTasks.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--card-bg)', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
                                <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>✅</span>
                                <h3 style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '4px', marginTop: 0 }}>All caught up!</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>You have no {filter !== 'all' ? filter : ''} tasks.</p>
                            </div>
                        ) : (
                            filteredTasks.map(task => (
                                <div 
                                    key={task._id} 
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)',
                                        background: task.completed ? 'var(--bg-tertiary)' : 'var(--card-bg)',
                                        opacity: task.completed ? 0.7 : 1, transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleTaskCompletion(task._id, task.completed)}
                                        style={{
                                            marginTop: '2px', width: '20px', height: '20px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            border: task.completed ? '1px solid #10b981' : '1px solid var(--text-secondary)',
                                            background: task.completed ? '#10b981' : 'transparent',
                                            color: task.completed ? 'white' : 'transparent',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <svg viewBox="0 0 14 14" fill="none" style={{ width: '14px', height: '14px', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                                            <polyline points="2.5 7 6 10.5 11.5 3"></polyline>
                                        </svg>
                                    </button>
                                    
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                                            <h4 style={{
                                                fontWeight: 600, fontSize: '15px', color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                textDecoration: task.completed ? 'line-through' : 'none', wordBreak: 'break-word', margin: 0
                                            }}>
                                                {task.title}
                                            </h4>
                                            
                                            {/* Priority Indicator */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                {!task.completed && task.priority === 'High' && (
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} title="High Priority"></span>
                                                )}
                                                {!task.completed && task.priority === 'Medium' && (
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} title="Medium Priority"></span>
                                                )}
                                                
                                                <button 
                                                    onClick={() => deleteTask(task._id)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                                                    title="Delete task"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Sub-info: Due Date & Tags */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                            {task.dueDate && (
                                                <span style={{
                                                    fontSize: '11px', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)',
                                                    background: new Date(task.dueDate) < new Date() && !task.completed ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-primary)',
                                                    color: new Date(task.dueDate) < new Date() && !task.completed ? '#ef4444' : 'var(--text-secondary)',
                                                    borderColor: new Date(task.dueDate) < new Date() && !task.completed ? 'rgba(239, 68, 68, 0.2)' : 'var(--border-color)'
                                                }}>
                                                    ⏱️ {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                            
                                            {task.tags?.map((tag, idx) => (
                                                <span key={idx} style={{
                                                    fontSize: '10px', fontWeight: 500, padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase',
                                                    background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.2)'
                                                }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                  </div>

                  {/* Right Column: Pomodoro Tracker */}
                  <div>
                      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', position: 'sticky', top: '96px', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                              <h3 style={{ fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                  <span>🍅</span> Focus Timer
                              </h3>
                              {/* Mode toggles */}
                              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px' }}>
                                  <button 
                                      onClick={setWorkMode}
                                      style={{
                                          fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                          background: timerMode === 'work' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                                          color: timerMode === 'work' ? '#ef4444' : 'var(--text-secondary)'
                                      }}
                                  >
                                      Work
                                  </button>
                                  <button 
                                      onClick={setBreakMode}
                                      style={{
                                          fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                          background: timerMode === 'break' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                          color: timerMode === 'break' ? '#10b981' : 'var(--text-secondary)'
                                      }}
                                  >
                                      Chill
                                  </button>
                              </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ fontSize: '64px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '-2px', color: 'var(--text-primary)', marginBottom: '24px' }}>
                                  {formatTime(timeLeft)}
                              </div>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                                  <button 
                                      onClick={toggleTimer}
                                      style={{
                                          flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', color: 'white',
                                          background: timerActive ? 'var(--text-muted)' : (timerMode === 'work' ? '#ef4444' : '#10b981')
                                      }}
                                  >
                                      {timerActive ? 'Pause' : 'Start Focus'}
                                  </button>
                                  <button 
                                      onClick={resetTimer}
                                      style={{ padding: '14px 20px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: '12px', fontWeight: 600, border: '1px solid var(--border-color)', cursor: 'pointer' }}
                                  >
                                      ↻
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
            </div>
        </div>

      </div>

      {/* Custom Date Picker Modal */}
      {showDatePicker && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setShowDatePicker(false)}>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', 
            padding: '24px', maxWidth: '350px', width: '100%',
            transform: 'scale(1)', animation: 'popIn 0.2s ease-out'
          }} onClick={e => e.stopPropagation()}>
            
            {stepPicker === 'date' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <button type="button" onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); } else { setCalendarMonth(m => m - 1); } }} 
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}>←</button>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{monthNames[calendarMonth]} {calendarYear}</span>
                  <button type="button" onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); } else { setCalendarMonth(m => m + 1); } }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}>→</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', padding: '4px' }}>{d}</div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                  {getCalendarDays(calendarYear, calendarMonth).map((day, i) => {
                    if (day === null) return <div key={i} />;
                    const isToday = day === todayDate.getDate() && calendarMonth === todayDate.getMonth() && calendarYear === todayDate.getFullYear();
                    
                    return (
                      <div 
                        key={i} 
                        onClick={() => { 
                          const pickedDate = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          if(formDueDate) {
                            const timePart = formDueDate.split('T')[1] || '23:59';
                            setFormDueDate(`${pickedDate}T${timePart}`);
                          } else {
                            setFormDueDate(`${pickedDate}T23:59`);
                          }
                          setStepPicker('time');
                        }}
                        style={{ 
                          aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '8px', fontSize: '13px', color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)',
                          background: 'transparent', border: isToday ? '2px solid #8b5cf6' : '1px solid transparent', fontWeight: isToday ? 600 : 400,
                          cursor: 'pointer', transition: 'all 0.1s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'; e.currentTarget.style.color = '#a78bfa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isToday ? 'var(--text-primary)' : 'var(--text-secondary)'; }}
                      >{day}</div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px', marginTop: 0 }}>Select Time</h3>
                
                <style jsx>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
                {(() => {
                   const currentTime = formDueDate ? (formDueDate.split('T')[1] || '23:59').substring(0,5) : '23:59';
                   const [hourStr, minStr] = currentTime.split(':');
                   const datePart = formDueDate ? formDueDate.split('T')[0] : '';
                   
                   return (
                     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                       <div className="hide-scroll" style={{ height: '180px', width: '80px', overflowY: 'auto', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '16px', scrollbarWidth: 'none' }}>
                         {Array.from({length: 24}).map((_, i) => {
                            const h = String(i).padStart(2, '0');
                            const isSelected = h === hourStr;
                            return (
                              <div 
                                key={h} 
                                onClick={() => setFormDueDate(`${datePart}T${h}:${minStr}`)}
                                style={{ padding: '12px 0', cursor: 'pointer', background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'transparent', color: isSelected ? '#a78bfa' : 'var(--text-secondary)', fontWeight: isSelected ? 'bold' : 500, fontSize: '20px', transition: 'all 0.1s' }}
                              >
                                {h}
                              </div>
                            )
                         })}
                       </div>
                       <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)' }}>:</div>
                       <div className="hide-scroll" style={{ height: '180px', width: '80px', overflowY: 'auto', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '16px', scrollbarWidth: 'none' }}>
                         {Array.from({length: 60}).map((_, i) => {
                            const m = String(i).padStart(2, '0');
                            const isSelected = m === minStr;
                            return (
                              <div 
                                key={m} 
                                onClick={() => setFormDueDate(`${datePart}T${hourStr}:${m}`)}
                                style={{ padding: '12px 0', cursor: 'pointer', background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'transparent', color: isSelected ? '#a78bfa' : 'var(--text-secondary)', fontWeight: isSelected ? 'bold' : 500, fontSize: '20px', transition: 'all 0.1s' }}
                              >
                                {m}
                              </div>
                            )
                         })}
                       </div>
                     </div>
                   );
                })()}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setStepPicker('date')} style={{ flex: 1, padding: '10px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 }}>Back</button>
                  <button type="button" onClick={() => setShowDatePicker(false)} style={{ flex: 1, padding: '10px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 }}>Confirm</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setTaskToDelete(null)}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%', boxShadow: 'var(--shadow-md)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px', marginTop: 0 }}>Delete Task</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setTaskToDelete(null)}
                style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteTask}
                style={{ padding: '8px 24px', background: '#ef4444', color: 'white', fontSize: '14px', fontWeight: 500, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bottom (for mobile) */}
      <MobileNav currentPage="tasks" />
    </div>
  );
}
