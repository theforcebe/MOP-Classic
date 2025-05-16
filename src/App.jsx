import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { getSheet, appendToSheet, updateSheet, deleteFromSheet } from './utils/sheetsApi'

const NAV_ITEMS = [
  'Home',
  'Raid Schedule',
  'Progression',
  'Signups',
  'Blog',
  'Events',
];

const ROLES = [
  { name: 'Tank', count: 2 },
  { name: 'Healer', count: 5 },
  { name: 'DPS', count: 18 },
];

const CLASSES = [
  'Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Death Knight',
  'Shaman', 'Mage', 'Warlock', 'Monk', 'Druid'
];

const CLASS_COLORS = {
  'Warrior': '#C79C6E',
  'Paladin': '#F58CBA',
  'Hunter': '#ABD473',
  'Rogue': '#FFF569',
  'Priest': '#FFFFFF',
  'Death Knight': '#C41F3B',
  'Shaman': '#0070DE',
  'Mage': '#69CCF0',
  'Warlock': '#9482C9',
  'Monk': '#00FF96',
  'Druid': '#FF7D0A',
};

const MOP_RAIDS = [
  {
    name: 'Siege of Orgrimmar',
    bosses: [
      'Immerseus', 'Fallen Protectors', 'Norushen', 'Sha of Pride',
      'Galakras', 'Iron Juggernaut', 'Dark Shaman', 'Nazgrim',
      'Malkorok', 'Spoils of Pandaria', 'Thok', 'Siegecrafter',
      'Paragons', 'Garrosh Hellscream'
    ]
  },
  {
    name: 'Throne of Thunder',
    bosses: [
      "Jin'rokh", 'Horridon', 'Council of Elders', 'Tortos',
      'Megaera', 'Ji-Kun', 'Durumu', 'Primordius',
      'Dark Animus', 'Iron Qon', 'Twin Consorts', 'Lei Shen'
    ]
  },
  {
    name: 'Heart of Fear',
    bosses: [
      "Imperial Vizier Zor'lok", "Blade Lord Ta'yak", 'Garalon',
      "Wind Lord Mel'jarak", "Amber-Shaper Un'sok", "Grand Empress Shek'zeer"
    ]
  },
  {
    name: "Mogu'shan Vaults",
    bosses: [
      'Stone Guard', 'Feng', "Gara'jal", 'Spirit Kings', 'Elegon', 'Will of the Emperor'
    ]
  },
  {
    name: 'Terrace of Endless Spring',
    bosses: [
      'Protectors of the Endless', 'Tsulong', 'Lei Shi', 'Sha of Fear'
    ]
  },
];

function PandaRaidChart({ roster }) {
  // Assign slots by role
  const slots = [];
  let tankIdx = 0, healerIdx = 0, dpsIdx = 0;
  const tanks = roster.filter(r => r.role === 'Tank');
  const healers = roster.filter(r => r.role === 'Healer');
  const dps = roster.filter(r => r.role === 'DPS');
  // Tanks
  for (let i = 0; i < 2; i++) {
    slots.push({ role: 'Tank', player: tanks[i] || null });
  }
  // Healers
  for (let i = 0; i < 5; i++) {
    slots.push({ role: 'Healer', player: healers[i] || null });
  }
  // DPS
  for (let i = 0; i < 18; i++) {
    slots.push({ role: 'DPS', player: dps[i] || null });
  }
  // SVG Panda with segmented slots
  return (
    <div className="flex flex-col items-center my-6">
      <svg width="260" height="320" viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Panda body */}
        <ellipse cx="130" cy="200" rx="90" ry="100" fill="#fff" stroke="#222" strokeWidth="4" />
        {/* Head */}
        <ellipse cx="130" cy="90" rx="60" ry="60" fill="#fff" stroke="#222" strokeWidth="4" />
        {/* Ears */}
        <ellipse cx="70" cy="40" rx="22" ry="18" fill="#222" />
        <ellipse cx="190" cy="40" rx="22" ry="18" fill="#222" />
        {/* Eyes */}
        <ellipse cx="105" cy="90" rx="14" ry="18" fill="#222" />
        <ellipse cx="155" cy="90" rx="14" ry="18" fill="#222" />
        <ellipse cx="105" cy="90" rx="7" ry="9" fill="#fff" />
        <ellipse cx="155" cy="90" rx="7" ry="9" fill="#fff" />
        {/* Nose */}
        <ellipse cx="130" cy="110" rx="8" ry="5" fill="#222" />
        {/* Smile */}
        <path d="M120 125 Q130 135 140 125" stroke="#222" strokeWidth="3" fill="none" />
        {/* Tank slots (head/shoulders) */}
        {slots.slice(0,2).map((slot, i) => (
          <g key={i}>
            <title>{slot.player ? `${slot.player.name} (${slot.player.class1})\n${slot.player.professions}` : 'Tank slot'}</title>
            <circle cx={90 + i*80} cy={50} r={16} fill={slot.player ? CLASS_COLORS[slot.player.class1] || roleColor(slot.role) : '#e5e7eb'} stroke="#222" strokeWidth="2" />
            {slot.player && <text x={90 + i*80} y={55} textAnchor="middle" fontSize="10" fill="#222">{slot.player.class1[0]}</text>}
          </g>
        ))}
        {/* Healer slots (arms/belly) */}
        {slots.slice(2,7).map((slot, i) => (
          <g key={i}>
            <title>{slot.player ? `${slot.player.name} (${slot.player.class1})\n${slot.player.professions}` : 'Healer slot'}</title>
            <circle cx={60 + i*35} cy={170} r={16} fill={slot.player ? CLASS_COLORS[slot.player.class1] || roleColor(slot.role) : '#e0f2fe'} stroke="#222" strokeWidth="2" />
            {slot.player && <text x={60 + i*35} y={175} textAnchor="middle" fontSize="10" fill="#222">{slot.player.class1[0]}</text>}
          </g>
        ))}
        {/* DPS slots (legs/feet) */}
        {slots.slice(7).map((slot, i) => (
          <g key={i}>
            <title>{slot.player ? `${slot.player.name} (${slot.player.class1})\n${slot.player.professions}` : 'DPS slot'}</title>
            <circle cx={30 + (i%6)*36} cy={260 + Math.floor(i/6)*28} r={14} fill={slot.player ? CLASS_COLORS[slot.player.class1] || roleColor(slot.role) : '#f3f4f6'} stroke="#222" strokeWidth="1.5" />
            {slot.player && <text x={30 + (i%6)*36} y={265 + Math.floor(i/6)*28} textAnchor="middle" fontSize="9" fill="#222">{slot.player.class1[0]}</text>}
          </g>
        ))}
      </svg>
      <div className="flex gap-4 mt-2">
        <span className="flex items-center"><span className="inline-block w-4 h-4 bg-blue-400 rounded-full mr-1"></span>Tank</span>
        <span className="flex items-center"><span className="inline-block w-4 h-4 bg-green-400 rounded-full mr-1"></span>Healer</span>
        <span className="flex items-center"><span className="inline-block w-4 h-4 bg-rose-400 rounded-full mr-1"></span>DPS</span>
      </div>
    </div>
  );
}

function roleColor(role) {
  if (role === 'Tank') return '#60a5fa'; // blue
  if (role === 'Healer') return '#4ade80'; // green
  if (role === 'DPS') return '#fb7185'; // rose
  return '#e5e7eb';
}

function getNextEvent(events) {
  const now = new Date();
  return events
    .map(ev => ({
      ...ev,
      eventDate: new Date(ev.date + 'T' + (ev.time || '00:00'))
    }))
    .filter(ev => ev.eventDate > now)
    .sort((a, b) => a.eventDate - b.eventDate)[0];
}

function App() {
  const [page, setPage] = useState('Home')
  const [roster, setRoster] = useState([]);
  const [form, setForm] = useState({ name: '', role: 'DPS', class1: '', class2: '', class3: '', professions: '' });

  // Raid Schedule state
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ raid: '', date: '', time: '', notes: '' });

  // Progression state
  const [progression, setProgression] = useState({});

  // Blog state
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ title: '', content: '' });
  const [commentForms, setCommentForms] = useState({});

  // Notification state
  const [subscribed, setSubscribed] = useState(false);
  const nextEvent = getNextEvent(events);

  // Edit state
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventForm, setEditEventForm] = useState({});
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Signups CRUD ---
  const [editingSignupId, setEditingSignupId] = useState(null);
  const [editSignupForm, setEditSignupForm] = useState({});
  const [showDeleteSignupId, setShowDeleteSignupId] = useState(null);

  // --- Progression CRUD ---
  const [progressionEdit, setProgressionEdit] = useState(null); // { raid, bossIdx }
  const [showResetRaid, setShowResetRaid] = useState(null);

  // --- Blog CRUD ---
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostForm, setEditPostForm] = useState({});
  const [showDeletePostId, setShowDeletePostId] = useState(null);

  // --- Load all data from Google Sheets on mount ---
  useEffect(() => {
    // Signups
    getSheet('Signups').then(data => {
      if (Array.isArray(data) && data.length > 1) {
        const headers = data[0];
        const rows = data.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] || ''])));
        setRoster(rows);
        localStorage.setItem('signups', JSON.stringify(rows));
      } else {
        // fallback to localStorage
        const local = localStorage.getItem('signups');
        if (local) setRoster(JSON.parse(local));
      }
    }).catch(() => {
      const local = localStorage.getItem('signups');
      if (local) setRoster(JSON.parse(local));
    });
    // Events
    getSheet('Events').then(data => {
      if (Array.isArray(data) && data.length > 1) {
        const headers = data[0];
        const rows = data.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] || ''])));
        setEvents(rows);
        localStorage.setItem('events', JSON.stringify(rows));
      } else {
        const local = localStorage.getItem('events');
        if (local) setEvents(JSON.parse(local));
      }
    }).catch(() => {
      const local = localStorage.getItem('events');
      if (local) setEvents(JSON.parse(local));
    });
    // Progression
    getSheet('Progression').then(data => {
      if (Array.isArray(data) && data.length > 1) {
        const headers = data[0];
        const rows = data.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] || ''])));
        // Convert to { [raid]: [bool, ...] }
        const prog = {};
        rows.forEach(row => {
          if (!prog[row.Raid]) prog[row.Raid] = [];
          prog[row.Raid].push(row.Defeated === 'TRUE' || row.Defeated === '1' || row.Defeated === true);
        });
        setProgression(prog);
        localStorage.setItem('progression', JSON.stringify(prog));
      } else {
        const local = localStorage.getItem('progression');
        if (local) setProgression(JSON.parse(local));
      }
    }).catch(() => {
      const local = localStorage.getItem('progression');
      if (local) setProgression(JSON.parse(local));
    });
    // Blog
    getSheet('Blog').then(data => {
      if (Array.isArray(data) && data.length > 1) {
        const headers = data[0];
        const rows = data.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] || ''])));
        setPosts(rows);
        localStorage.setItem('blog', JSON.stringify(rows));
      } else {
        const local = localStorage.getItem('blog');
        if (local) setPosts(JSON.parse(local));
      }
    }).catch(() => {
      const local = localStorage.getItem('blog');
      if (local) setPosts(JSON.parse(local));
    });
  }, []);

  // Demo notification logic
  useEffect(() => {
    if (!subscribed || !nextEvent) return;
    // Calculate ms until 1 minute before event
    const now = new Date();
    const eventDate = new Date(nextEvent.date + 'T' + (nextEvent.time || '00:00'));
    const msUntil = eventDate - now - 60000;
    if (msUntil > 0) {
      const timeout = setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Raid Event Reminder', {
            body: `Upcoming: ${nextEvent.raid} at ${nextEvent.time} on ${nextEvent.date}`
          });
        }
      }, msUntil);
      return () => clearTimeout(timeout);
    }
  }, [subscribed, nextEvent]);

  const handleSubscribe = () => {
    if (Notification.permission === 'granted') {
      setSubscribed(true);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') setSubscribed(true);
      });
    }
  };

  // --- Add new signup ---
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.class1) return;
    setRoster([...roster, { ...form }]);
    localStorage.setItem('signups', JSON.stringify([...roster, { ...form }]));
    try {
      await appendToSheet('Signups', [form.name, form.role, form.class1, form.class2, form.class3, form.professions]);
    } catch {}
    setForm({ name: '', role: 'DPS', class1: '', class2: '', class3: '', professions: '' });
  };

  // --- Add new event ---
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.raid || !eventForm.date || !eventForm.time) return;
    const newEvent = { ...eventForm, id: Date.now().toString() };
    setLoading(true);
    setEvents([...events, newEvent]);
    localStorage.setItem('events', JSON.stringify([...events, newEvent]));
    try {
      await appendToSheet('Events', [newEvent.id, newEvent.raid, newEvent.date, newEvent.time, newEvent.notes]);
      setToast({ type: 'success', msg: 'Event added!' });
    } catch {
      setToast({ type: 'error', msg: 'Failed to add event.' });
    }
    setLoading(false);
    setEventForm({ raid: '', date: '', time: '', notes: '' });
  };

  // --- Edit event ---
  const startEditEvent = (ev) => {
    setEditingEventId(ev.id);
    setEditEventForm({ ...ev });
  };
  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEditEventForm({});
  };
  const saveEditEvent = async () => {
    setLoading(true);
    setEvents(events.map(ev => ev.id === editingEventId ? { ...editEventForm } : ev));
    localStorage.setItem('events', JSON.stringify(events.map(ev => ev.id === editingEventId ? { ...editEventForm } : ev)));
    try {
      await updateSheet('Events', editEventForm);
      setToast({ type: 'success', msg: 'Event updated!' });
    } catch {
      setToast({ type: 'error', msg: 'Failed to update event.' });
    }
    setLoading(false);
    setEditingEventId(null);
    setEditEventForm({});
  };

  // --- Delete event ---
  const confirmDeleteEvent = (id) => setShowDeleteId(id);
  const cancelDeleteEvent = () => setShowDeleteId(null);
  const doDeleteEvent = async (id) => {
    setLoading(true);
    const prevEvents = events;
    setEvents(events.filter(ev => ev.id !== id));
    localStorage.setItem('events', JSON.stringify(events.filter(ev => ev.id !== id)));
    try {
      await deleteFromSheet('Events', id);
      setToast({ type: 'success', msg: 'Event deleted!'});
    } catch {
      setEvents(prevEvents); // undo
      setToast({ type: 'error', msg: 'Failed to delete event.' });
    }
    setLoading(false);
    setShowDeleteId(null);
  };

  // --- Toast auto-hide ---
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // --- Toggle boss kill in progression ---
  const toggleBoss = (raidName, bossIdx) => {
    setProgression(prev => {
      const updated = {
        ...prev,
        [raidName]: prev[raidName].map((killed, i) => i === bossIdx ? !killed : killed)
      };
      localStorage.setItem('progression', JSON.stringify(updated));
      // NOTE: To persist progression to Google Sheets, you need to implement an update endpoint in your Apps Script.
      return updated;
    });
  };

  // --- Add new blog post ---
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) return;
    const newPost = { id: Date.now().toString(), title: postForm.title, content: postForm.content, timestamp: new Date().toISOString(), comments: '' };
    setPosts([newPost, ...posts]);
    localStorage.setItem('blog', JSON.stringify([newPost, ...posts]));
    try {
      await appendToSheet('Blog', [newPost.id, newPost.title, newPost.content, newPost.timestamp, newPost.comments]);
    } catch {}
    setPostForm({ title: '', content: '' });
  };

  // --- Add new comment to blog post ---
  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    const comment = commentForms[postId];
    if (!comment) return;
    setPosts(posts => posts.map(p =>
      p.id === postId ? { ...p, comments: (p.comments ? p.comments + '\n' : '') + comment } : p
    ));
    localStorage.setItem('blog', JSON.stringify(posts.map(p =>
      p.id === postId ? { ...p, comments: (p.comments ? p.comments + '\n' : '') + comment } : p
    )));
    // NOTE: To persist comments to Google Sheets, you need to implement an update endpoint in your Apps Script.
    setCommentForms(forms => ({ ...forms, [postId]: '' }));
  };

  // --- Signups: Edit/Save/Cancel/Delete ---
  const startEditSignup = (signup, idx) => {
    setEditingSignupId(idx);
    setEditSignupForm({ ...signup });
  };
  const cancelEditSignup = () => {
    setEditingSignupId(null);
    setEditSignupForm({});
  };
  const saveEditSignup = async (idx) => {
    setLoading(true);
    const updated = [...roster];
    updated[idx] = { ...editSignupForm };
    setRoster(updated);
    localStorage.setItem('signups', JSON.stringify(updated));
    try {
      await updateSheet('Signups', { ID: editSignupForm.ID, ...editSignupForm });
      setToast({ type: 'success', msg: 'Signup updated!' });
    } catch {
      setToast({ type: 'error', msg: 'Failed to update signup.' });
    }
    setLoading(false);
    setEditingSignupId(null);
    setEditSignupForm({});
  };
  const confirmDeleteSignup = (idx) => setShowDeleteSignupId(idx);
  const cancelDeleteSignup = () => setShowDeleteSignupId(null);
  const doDeleteSignup = async (idx) => {
    setLoading(true);
    const signup = roster[idx];
    const prev = roster;
    setRoster(roster.filter((_, i) => i !== idx));
    localStorage.setItem('signups', JSON.stringify(roster.filter((_, i) => i !== idx)));
    try {
      await deleteFromSheet('Signups', signup.ID);
      setToast({ type: 'success', msg: 'Signup deleted!' });
    } catch {
      setRoster(prev);
      setToast({ type: 'error', msg: 'Failed to delete signup.' });
    }
    setLoading(false);
    setShowDeleteSignupId(null);
  };

  // --- Progression: Reset/Undo ---
  const resetRaidProgression = (raidName) => {
    setShowResetRaid(raidName);
  };
  const doResetRaidProgression = () => {
    if (!showResetRaid) return;
    setProgression(prev => {
      const updated = { ...prev, [showResetRaid]: prev[showResetRaid].map(() => false) };
      localStorage.setItem('progression', JSON.stringify(updated));
      // NOTE: To persist to Google Sheets, call updateSheet for each boss.
      setToast({ type: 'success', msg: 'Progression reset!' });
      return updated;
    });
    setShowResetRaid(null);
  };

  const audioRef = useRef(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current && !musicStarted) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setMusicStarted(true))
          .catch(() => {
            // Auto-play was blocked, show play button
            setMusicStarted(false);
          });
      }
    }
  }, [musicStarted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Background music player */}
      <audio
        ref={audioRef}
        id="mop-music"
        src="/wow_main_theme.mp3"
        loop
        controls
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          background: 'rgba(255,255,255,0.8)',
          borderRadius: 8
        }}
      >
        Your browser does not support the audio element.
      </audio>
      <div style={{ position: 'fixed', bottom: 70, right: 16, zIndex: 1001, background: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span role="img" aria-label="volume">🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          style={{ width: 80 }}
        />
      </div>
      {!musicStarted && (
        <button
          onClick={() => {
            audioRef.current.play();
            setMusicStarted(true);
          }}
          style={{
            position: 'fixed',
            bottom: 120,
            right: 16,
            zIndex: 1002,
            background: '#4F46E5',
            color: 'white',
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          ▶️ Play Music
        </button>
      )}
      <nav className="bg-gradient-to-r from-indigo-700 to-indigo-500 shadow text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-wide flex items-center gap-2">
            <span role="img" aria-label="panda">🐼</span> MoP Classic Raid Planner
          </div>
          <div className="flex gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                className={`px-3 py-1 rounded hover:bg-indigo-800 transition font-medium ${page === item ? 'bg-indigo-900' : ''}`}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-lg shadow min-h-[60vh]">
        {page === 'Home' && <div><h2 className="text-xl font-bold mb-2">Welcome to the MoP Classic Raid Planner!</h2><p className="mb-4">Use the navigation above to manage your raid team, schedule events, track progression, and more.</p></div>}
        {page === 'Raid Schedule' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Raid Schedule</h2>
            <form className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddEvent}>
              <input className="border p-2 rounded" placeholder="Raid Name" value={eventForm.raid} onChange={e => setEventForm(f => ({ ...f, raid: e.target.value }))} required />
              <input className="border p-2 rounded" type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} required />
              <input className="border p-2 rounded" type="time" value={eventForm.time} onChange={e => setEventForm(f => ({ ...f, time: e.target.value }))} required />
              <input className="border p-2 rounded md:col-span-2" placeholder="Notes (optional)" value={eventForm.notes} onChange={e => setEventForm(f => ({ ...f, notes: e.target.value }))} />
              <button className="col-span-1 md:col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition" type="submit" disabled={loading}>Add Raid Event</button>
            </form>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Raid</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Time</th>
                    <th className="p-2 border">Notes</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 && (
                    <tr><td colSpan={5} className="p-2 border text-center text-gray-400">No events scheduled yet.</td></tr>
                  )}
                  {events.map(ev => (
                    <tr key={ev.id} className={ev === nextEvent ? 'bg-indigo-100 font-semibold' : 'odd:bg-gray-50'}>
                      {editingEventId === ev.id ? (
                        <>
                          <td className="p-2 border"><input className="border p-1 rounded w-full" value={editEventForm.raid} onChange={e => setEditEventForm(f => ({ ...f, raid: e.target.value }))} /></td>
                          <td className="p-2 border"><input className="border p-1 rounded w-full" type="date" value={editEventForm.date} onChange={e => setEditEventForm(f => ({ ...f, date: e.target.value }))} /></td>
                          <td className="p-2 border"><input className="border p-1 rounded w-full" type="time" value={editEventForm.time} onChange={e => setEditEventForm(f => ({ ...f, time: e.target.value }))} /></td>
                          <td className="p-2 border"><input className="border p-1 rounded w-full" value={editEventForm.notes} onChange={e => setEditEventForm(f => ({ ...f, notes: e.target.value }))} /></td>
                          <td className="p-2 border flex gap-2">
                            <button className="bg-green-500 text-white px-2 rounded" onClick={saveEditEvent} disabled={loading}>Save</button>
                            <button className="bg-gray-300 px-2 rounded" onClick={cancelEditEvent} disabled={loading}>Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 border">{ev.raid}</td>
                          <td className="p-2 border">{ev.date}</td>
                          <td className="p-2 border">{ev.time}</td>
                          <td className="p-2 border">{ev.notes}</td>
                          <td className="p-2 border flex gap-2">
                            <button className="text-indigo-600 hover:underline" onClick={() => startEditEvent(ev)} disabled={loading}>✏️ Edit</button>
                            <button className="text-red-500 hover:underline" onClick={() => confirmDeleteEvent(ev.id)} disabled={loading}>🗑️ Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {page === 'Progression' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Progression Tracker</h2>
            {toast && (
              <div className={`mb-4 px-4 py-2 rounded ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{toast.msg}</div>
            )}
            {loading && <div className="mb-2 text-indigo-600">Loading...</div>}
            <div className="space-y-6">
              {MOP_RAIDS.map(raid => (
                <div key={raid.name} className="mb-4">
                  <div className="flex items-center gap-4 mb-1">
                    <h3 className="font-semibold text-lg">{raid.name}</h3>
                    <button className="text-red-500 hover:underline text-sm" onClick={() => resetRaidProgression(raid.name)} disabled={loading}>Reset</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {raid.bosses.map((boss, i) => (
                      <label key={boss} className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer border ${progression[raid.name] && progression[raid.name][i] ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-gray-200'}`}>
                        <input
                          type="checkbox"
                          checked={progression[raid.name] && progression[raid.name][i]}
                          onChange={() => toggleBoss(raid.name, i)}
                          className="accent-green-500"
                          disabled={loading}
                        />
                        <span className={progression[raid.name] && progression[raid.name][i] ? 'line-through text-green-700' : ''}>{boss}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {showResetRaid && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <div className="mb-4">Reset all boss kills for {showResetRaid}?</div>
                  <div className="flex gap-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={doResetRaidProgression} disabled={loading}>Reset</button>
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={cancelResetRaid} disabled={loading}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {page === 'Signups' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Raid Signups</h2>
            {toast && (
              <div className={`mb-4 px-4 py-2 rounded ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{toast.msg}</div>
            )}
            {loading && <div className="mb-2 text-indigo-600">Loading...</div>}
            <PandaRaidChart roster={roster} />
            <form className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSignup}>
              <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <select className="border p-2 rounded" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
              <select className="border p-2 rounded" value={form.class1} onChange={e => setForm(f => ({ ...f, class1: e.target.value }))} required>
                <option value="">Top Class Choice</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="border p-2 rounded" value={form.class2} onChange={e => setForm(f => ({ ...f, class2: e.target.value }))}>
                <option value="">Second Class Choice</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="border p-2 rounded" value={form.class3} onChange={e => setForm(f => ({ ...f, class3: e.target.value }))}>
                <option value="">Third Class Choice</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="border p-2 rounded" placeholder="Professions (e.g. Alch/Herb)" value={form.professions} onChange={e => setForm(f => ({ ...f, professions: e.target.value }))} />
              <button className="col-span-1 md:col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition" type="submit" disabled={loading}>Sign Up</button>
            </form>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Role</th>
                    <th className="p-2 border">Class Choices</th>
                    <th className="p-2 border">Professions</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.length === 0 && (
                    <tr><td colSpan={5} className="p-2 border text-center text-gray-400">No signups yet.</td></tr>
                  )}
                  {roster.map((r, idx) => (
                    <tr key={r.ID || idx} className="odd:bg-gray-50">
                      {editingSignupId === idx ? (
                        <>
                          <td className="p-2 border"><input className="border p-1 rounded w-full" value={editSignupForm.name} onChange={e => setEditSignupForm(f => ({ ...f, name: e.target.value }))} /></td>
                          <td className="p-2 border"><select className="border p-1 rounded w-full" value={editSignupForm.role} onChange={e => setEditSignupForm(f => ({ ...f, role: e.target.value }))}>{ROLES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select></td>
                          <td className="p-2 border"><input className="border p-1 rounded w-full" value={[editSignupForm.class1, editSignupForm.class2, editSignupForm.class3].filter(Boolean).join(', ')} readOnly /></td>
                          <td className="p-2 border"><input className="border p-1 rounded w-full" value={editSignupForm.professions} onChange={e => setEditSignupForm(f => ({ ...f, professions: e.target.value }))} /></td>
                          <td className="p-2 border flex gap-2">
                            <button className="bg-green-500 text-white px-2 rounded" onClick={() => saveEditSignup(idx)} disabled={loading}>Save</button>
                            <button className="bg-gray-300 px-2 rounded" onClick={cancelEditSignup} disabled={loading}>Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 border">{r.name}</td>
                          <td className="p-2 border">{r.role}</td>
                          <td className="p-2 border">{[r.class1, r.class2, r.class3].filter(Boolean).join(', ')}</td>
                          <td className="p-2 border">{r.professions}</td>
                          <td className="p-2 border flex gap-2">
                            <button className="text-indigo-600 hover:underline" onClick={() => startEditSignup(r, idx)} disabled={loading}>✏️ Edit</button>
                            <button className="text-red-500 hover:underline" onClick={() => confirmDeleteSignup(idx)} disabled={loading}>🗑️ Delete</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showDeleteSignupId !== null && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <div className="mb-4">Are you sure you want to delete this signup?</div>
                  <div className="flex gap-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => doDeleteSignup(showDeleteSignupId)} disabled={loading}>Delete</button>
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={cancelDeleteSignup} disabled={loading}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {page === 'Blog' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Raid Blog</h2>
            {toast && (
              <div className={`mb-4 px-4 py-2 rounded ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{toast.msg}</div>
            )}
            {loading && <div className="mb-2 text-indigo-600">Loading...</div>}
            <a
              href="https://discord.com/channels/1346205094550700072/1367365387523588126"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4 px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition font-semibold"
            >
              💬 Discuss on Discord
            </a>
            <form className="mb-6 grid grid-cols-1 gap-2" onSubmit={handleAddPost}>
              <input className="border p-2 rounded" placeholder="Post Title" value={postForm.title} onChange={e => setPostForm(f => ({ ...f, title: e.target.value }))} required />
              <textarea className="border p-2 rounded" placeholder="Write your post..." value={postForm.content} onChange={e => setPostForm(f => ({ ...f, content: e.target.value }))} rows={3} required />
              <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition" type="submit" disabled={loading}>New Post</button>
            </form>
            <div className="space-y-6">
              {posts.length === 0 && <div className="text-gray-400">No posts yet.</div>}
              {posts.map(post => (
                <div key={post.id} className="border rounded-lg p-4 bg-gray-50">
                  {editingPostId === post.id ? (
                    <>
                      <input className="border p-1 rounded w-full mb-2" value={editPostForm.title} onChange={e => setEditPostForm(f => ({ ...f, title: e.target.value }))} />
                      <textarea className="border p-1 rounded w-full mb-2" value={editPostForm.content} onChange={e => setEditPostForm(f => ({ ...f, content: e.target.value }))} rows={3} />
                      <div className="flex gap-2">
                        <button className="bg-green-500 text-white px-2 rounded" onClick={saveEditPost} disabled={loading}>Save</button>
                        <button className="bg-gray-300 px-2 rounded" onClick={cancelEditPost} disabled={loading}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                      <div className="mb-2 whitespace-pre-line">{post.content}</div>
                      <div className="mt-4 flex gap-2">
                        <button className="text-indigo-600 hover:underline" onClick={() => startEditPost(post)} disabled={loading}>✏️ Edit</button>
                        <button className="text-red-500 hover:underline" onClick={() => confirmDeletePost(post.id)} disabled={loading}>🗑️ Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {showDeletePostId && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <div className="mb-4">Are you sure you want to delete this post?</div>
                  <div className="flex gap-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => doDeletePost(showDeletePostId)} disabled={loading}>Delete</button>
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={cancelDeletePost} disabled={loading}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {page === 'Events' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Event Notifications</h2>
            {toast && (
              <div className={`mb-4 px-4 py-2 rounded ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{toast.msg}</div>
            )}
            {loading && <div className="mb-2 text-indigo-600">Loading...</div>}
            {nextEvent ? (
              <div className="mb-4 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                <div className="font-semibold">Next Event:</div>
                <div className="text-lg">{nextEvent.raid}</div>
                <div>{nextEvent.date} at {nextEvent.time}</div>
                {nextEvent.notes && <div className="text-gray-600">{nextEvent.notes}</div>}
              </div>
            ) : (
              <div className="mb-4 text-gray-400">No upcoming events.</div>
            )}
            <button
              className={`mb-6 px-4 py-2 rounded font-semibold shadow ${subscribed ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 transition'}`}
              onClick={handleSubscribe}
              disabled={subscribed}
            >
              {subscribed ? 'Subscribed to Notifications' : 'Subscribe to Notifications'}
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Raid</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Time</th>
                    <th className="p-2 border">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 && (
                    <tr><td colSpan={4} className="p-2 border text-center text-gray-400">No events scheduled yet.</td></tr>
                  )}
                  {events
                    .map(ev => ({
                      ...ev,
                      eventDate: new Date(ev.date + 'T' + (ev.time || '00:00'))
                    }))
                    .sort((a, b) => a.eventDate - b.eventDate)
                    .map(ev => (
                      <tr key={ev.id} className={ev === nextEvent ? 'bg-indigo-100 font-semibold' : 'odd:bg-gray-50'}>
                        <td className="p-2 border">{ev.raid}</td>
                        <td className="p-2 border">{ev.date}</td>
                        <td className="p-2 border">{ev.time}</td>
                        <td className="p-2 border">{ev.notes}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center text-gray-500 py-6">&copy; {new Date().getFullYear()} MoP Classic Raid Planner</footer>
    </div>
  )
}

export default App
