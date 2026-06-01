import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000/api";
// const AUTH_TOKEN = localStorage.getItem("token"); // adjust to your auth storage

const api = {
  headers: {
    "Content-Type": "application/json",
    // "Authorization": AUTH_TOKEN ? `Bearer ${AUTH_TOKEN}` : undefined,
  },
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`, { headers: this.headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST", headers: this.headers, body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async patch(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PATCH", headers: this.headers, body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async delete(path) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "DELETE", headers: this.headers,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204 ? null : res.json();
  },
};

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  
  { icon: "",     label: "Profile",     id: "profile" },
  { icon: "ti-messages",    label: "Discussions", id: "discussions"},
  
];

const FILTERS = ["All", "Announcements", "Questions", "Ideas", "Events"];

// Map your backend category names → frontend display names (adjust to match your DB)
const CATEGORY_MAP = {
  Announcements: { bg: "#E6F1FB", text: "#185FA5" },
  Questions:     { bg: "#E1F5EE", text: "#0F6E56" },
  Ideas:         { bg: "#FBEAF0", text: "#993556" },
  Events:        { bg: "#FAEEDA", text: "#854F0B" },
};

const REACT_TYPES = ["Like", "Love", "Haha", "Sad", "Angry"];
const REACT_EMOJIS = { Like: "👍", Love: "❤️", Haha: "😂", Sad: "😢", Angry: "😡" };

// ─── HELPERS ───────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}
function stringToColor(str = "") {
  const colors = ["#185FA5","#0F6E56","#993556","#854F0B","#378ADD","#6B4FA5"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function Avatar({ name = "", size = 38 }) {
  const color = stringToColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "22", border: `2px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.34, fontWeight: 600, color, flexShrink: 0,
      fontFamily: "'Sora', sans-serif",
    }}>
      {getInitials(name)}
    </div>
  );
}

function CategoryBadge() {
  const c = CATEGORY_MAP["Announcements", "Questions", "Ideas", "Events"][cat] 
  || { bg: "#F1EFE8", text: "#5F5E5A" };
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
      background: c.bg, color: c.text, padding: "3px 10px",
      borderRadius: 100, textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{cat}</span>
  );
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: type === "error" ? "#E24B4A" : "#1D9E75",
      color: "#fff", padding: "12px 20px", borderRadius: 12,
      fontSize: 14, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      animation: "slideIn 0.3s ease",
    }}>
      <i className={`ti ${type === "error" ? "ti-alert-circle" : "ti-check"}`} style={{ marginRight: 8 }} />
      {message}
    </div>
  );
}

function ReactionPicker({ onPick }) {
  return (
    <div style={{
      position: "absolute", bottom: "calc(100% + 8px)", left: 0,
      background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12,
      padding: "8px 12px", display: "flex", gap: 6, zIndex: 100,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}>
      {REACT_TYPES.map(rt => (
        <button key={rt} onClick={() => onPick(rt)} title={rt} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 20, transition: "transform 0.15s", padding: "2px 4px",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.3)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {REACT_EMOJIS[rt]}
        </button>
      ))}
    </div>
  );
}

// ─── EDIT MODAL ────────────────────────────────────────────────────────────────
function EditModal({ post, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    description: post.description,
    category: post.category,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await api.patch(`/publications/${post.id}/`, {
        description: form.description,
        category: form.category,
      });
      onSave(updated);
    } catch {
      // parent handles errors
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "2rem",
        width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: "#0D1B2A" }}>
            Edit Post
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#94A3B8" }}>
            <i className="ti ti-x" />
          </button>
        </div>

        <label className="form-label">Category</label>
        <select
          className="form-input form-select"
          style={{ marginBottom: 12 }}
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
        >
          {categories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
        </select>

        <label className="form-label">Content</label>
        <textarea
          className="form-input form-textarea"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          style={{ marginBottom: 16 }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #E2E8F0",
            background: "#fff", cursor: "pointer", fontSize: 14, color: "#64748B",
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: "11px", borderRadius: 10, border: "none",
            background: "#185FA5", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600,
          }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── POST CARD ─────────────────────────────────────────────────────────────────
function PostCard({ post, currentUserId, categories, onReact, onDelete, onUpdate, index }) {
  const [showPicker, setShowPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const authorName = post.is_anonyme ? "Anonymous" : (post.user_name || `User #${post.user}`);
  const isOwner = post.user === currentUserId;
  const myReaction = post.my_reaction;
  const categoryName = post.category_name || post.category;

  return (
    <>
      <div className="post-card" style={{ animationDelay: `${index * 0.06}s`, position: "relative" }}>
        {/* Header */}
        <div className="post-header">
          <Avatar name={authorName} size={40} />
          <div className="post-meta">
            <div className="post-author">{authorName}</div>
            <div className="post-sub">{timeAgo(post.pub_date)}</div>
          </div>
          <CategoryBadge cat={categoryName} />

          {/* 3-dot menu (owner only) */}
          {isOwner && (
            <div style={{ position: "relative", marginLeft: 8 }}>
              <button className="post-action" onClick={() => setMenuOpen(m => !m)}>
                <i className="ti ti-dots-vertical" />
              </button>
              {menuOpen && (
                <div style={{
                  position: "absolute", top: "100%", right: 0, zIndex: 50,
                  background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12,
                  padding: "6px", minWidth: 130, boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}>
                  <button onClick={() => { setEditing(true); setMenuOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "8px 12px", background: "none", border: "none",
                    borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#1E293B",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <i className="ti ti-pencil" style={{ color: "#185FA5" }} /> Edit
                  </button>
                  <button onClick={() => { onDelete(post.id); setMenuOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "8px 12px", background: "none", border: "none",
                    borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#E24B4A",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <i className="ti ti-trash" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="post-body" style={{ marginTop: 4 }}>{post.description}</div>

        {/* Footer */}
        <div className="post-footer">
          {/* React button */}
          <div style={{ position: "relative" }}>
            <button
              className={`post-action ${myReaction ? "liked" : ""}`}
              onClick={() => setShowPicker(v => !v)}
              style={{ color: myReaction ? "#E24B4A" : undefined }}
            >
              <span style={{ fontSize: 16 }}>
                {myReaction ? REACT_EMOJIS[myReaction] : "🤍"}
              </span>
              {post.reaction_count ?? 0}
            </button>
            {showPicker && (
              <ReactionPicker onPick={rt => { onReact(post.id, rt, !!myReaction); setShowPicker(false); }} />
            )}
          </div>

          <button className="post-action">
            <i className="ti ti-message-circle" />
            {post.comment_count ?? 0}
          </button>

          <button className="post-action" style={{ marginLeft: "auto" }}>
            <i className="ti ti-share" /> Share
          </button>
          <button className="post-action">
            <i className="ti ti-bookmark" />
          </button>
        </div>
      </div>

      {editing && (
        <EditModal
          post={post}
          categories={categories}
          onSave={updated => { onUpdate(updated); setEditing(false); }}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [active, setActive]       = useState("home");
  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");
  const [posts, setPosts]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [form, setForm]           = useState({ description: "", category: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Replace with your actual auth context / JWT decode
  const currentUserId = parseInt(localStorage.getItem("user_id") || "0");

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Fetch categories ──
  useEffect(() => {
    api.get("/categories/")
      .then(data => {
        setCategories(data.results ?? data);
        setForm(f => ({ ...f, category: (data.results ?? data)[0]?.id ?? "" }));
      })
      .catch(() => showToast("Failed to load categories", "error"));
  }, []);

  // ── Fetch posts ──
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter !== "All") {
        const cat = categories.find(c => c.category_name === filter);
        if (cat) params.set("category", cat.id);
      }
      const data = await api.get(`/publications/?${params}`);
      setPosts(data.results ?? data);
    } catch {
      showToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filter, categories]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ── Create post ──
  async function handleSubmit() {
    if (!form.description.trim()) {
      setFormError("Content is required.");
      return;
    }
    if (!form.category) {
      setFormError("Please select a category.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const newPost = await api.post("/publications/", {
        description: form.description,
        category: form.category,
      });
      setPosts(ps => [newPost, ...ps]);
      setForm(f => ({ ...f, description: "" }));
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
      showToast("Post published!");
    } catch (e) {
      showToast("Failed to publish post", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete post ──
  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/publications/${id}/`);
      setPosts(ps => ps.filter(p => p.id !== id));
      showToast("Post deleted.");
    } catch {
      showToast("Failed to delete post", "error");
    }
  }

  // ── Update post (after edit) ──
  function handleUpdate(updated) {
    setPosts(ps => ps.map(p => p.id === updated.id ? { ...p, ...updated } : p));
    showToast("Post updated!");
  }

  // ── React ──
  async function handleReact(postId, reactType, alreadyReacted) {
    try {
      if (alreadyReacted) {
        await api.delete(`/publications/${postId}/unreact/`);
        setPosts(ps => ps.map(p => p.id === postId
          ? { ...p, my_reaction: null, reaction_count: (p.reaction_count ?? 1) - 1 }
          : p
        ));
      } else {
        const reaction = await api.post(`/publications/${postId}/react/`, { react_type: reactType });
        setPosts(ps => ps.map(p => p.id === postId
          ? { ...p, my_reaction: reaction.react_type, reaction_count: (p.reaction_count ?? 0) + 1 }
          : p
        ));
      }
    } catch {
      showToast("Failed to react", "error");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #EDF2F7; }
        .dash-root { display: flex; min-height: 100vh; font-family: 'DM Sans', sans-serif; background: #EDF2F7; }
        .sidebar { width: 240px; min-height: 100vh; background: #0D1B2A; display: flex; flex-direction: column; padding: 2rem 1rem; position: fixed; top: 0; left: 0; z-index: 10; }
        .sidebar-logo { font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 700; color: #fff; padding: 0 0.75rem 2rem; display: flex; align-items: center; gap: 10px; }
        .sidebar-logo-dot { width: 10px; height: 10px; border-radius: 50%; background: #378ADD; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px; cursor: pointer; color: #8899AA; font-size: 14px; font-weight: 500; transition: all 0.18s; margin-bottom: 2px; text-decoration: none; border: none; background: none; width: 100%; text-align: left; }
        .nav-item:hover { background: rgba(55,138,221,0.10); color: #B5D4F4; }
        .nav-item.active { background: #185FA5; color: #fff; }
        .nav-item i { font-size: 18px; width: 20px; text-align: center; }
        .nav-badge { margin-left: auto; background: #378ADD; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }
        .sidebar-bottom { margin-top: auto; }
        .user-chip { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 12px; background: rgba(255,255,255,0.06); }
        .user-chip-info { flex: 1; }
        .user-chip-name { font-size: 13px; font-weight: 600; color: #fff; }
        .user-chip-role { font-size: 11px; color: #667788; }
        .logout-btn { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; cursor: pointer; color: #667788; font-size: 13px; margin-top: 8px; background: none; border: none; width: 100%; transition: all 0.18s; }
        .logout-btn:hover { color: #E24B4A; background: rgba(226,75,74,0.08); }
        .main-wrap { margin-left: 240px; flex: 1; display: flex; min-height: 100vh; }
        .center-col { flex: 1; padding: 2rem 1.5rem; max-width: 680px; }
        .right-col { width: 320px; padding: 2rem 1.5rem 2rem 0; }
        .topbar { display: flex; align-items: center; gap: 12px; margin-bottom: 1.75rem; }
        .search-wrap { flex: 1; display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 12px; padding: 10px 14px; border: 1.5px solid #E2E8F0; transition: border 0.18s; }
        .search-wrap:focus-within { border-color: #378ADD; }
        .search-wrap i { color: #94A3B8; font-size: 18px; }
        .search-wrap input { border: none; outline: none; background: none; font-size: 14px; color: #1E293B; flex: 1; font-family: 'DM Sans', sans-serif; }
        .search-wrap input::placeholder { color: #94A3B8; }
        .icon-btn { width: 42px; height: 42px; border-radius: 12px; background: #fff; border: 1.5px solid #E2E8F0; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; font-size: 18px; transition: all 0.18s; position: relative; }
        .icon-btn:hover { border-color: #378ADD; color: #185FA5; background: #EAF3FB; }
        .icon-btn .notif-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 50%; background: #E24B4A; border: 2px solid #fff; }
        .filter-row { display: flex; gap: 8px; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .filter-pill { padding: 7px 16px; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1.5px solid #E2E8F0; background: #fff; color: #64748B; transition: all 0.16s; }
        .filter-pill:hover { border-color: #378ADD; color: #185FA5; }
        .filter-pill.active { background: #185FA5; color: #fff; border-color: #185FA5; }
        .post-card { background: #fff; border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; border: 1.5px solid #E2E8F0; transition: box-shadow 0.18s, transform 0.18s; animation: slideIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .post-card:hover { box-shadow: 0 4px 24px rgba(24,95,165,0.09); transform: translateY(-2px); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .post-meta { flex: 1; }
        .post-author { font-size: 14px; font-weight: 600; color: #1E293B; }
        .post-sub { font-size: 12px; color: #94A3B8; }
        .post-body { font-size: 13.5px; color: #475569; line-height: 1.65; }
        .post-footer { display: flex; align-items: center; gap: 16px; margin-top: 14px; padding-top: 12px; border-top: 1px solid #F1F5F9; }
        .post-action { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #94A3B8; cursor: pointer; background: none; border: none; transition: color 0.16s; }
        .post-action:hover { color: #185FA5; }
        .post-action.liked { color: #E24B4A; }
        .post-action i { font-size: 16px; }
        .skeleton { background: linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .empty-state { text-align: center; padding: 3rem 1rem; color: #94A3B8; }
        .empty-state i { font-size: 48px; margin-bottom: 12px; display: block; }
        .panel-card { background: #fff; border-radius: 16px; padding: 1.5rem; border: 1.5px solid #E2E8F0; margin-bottom: 1rem; }
        .panel-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #0D1B2A; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
        .panel-title i { color: #378ADD; font-size: 18px; }
        .form-field { margin-bottom: 12px; }
        .form-label { font-size: 12px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; display: block; }
        .form-input { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1.5px solid #E2E8F0; font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #1E293B; outline: none; transition: border 0.18s; background: #F8FAFC; }
        .form-input:focus { border-color: #378ADD; background: #fff; }
        .form-textarea { resize: vertical; min-height: 90px; }
        .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
        .submit-btn { width: 100%; padding: 12px; border-radius: 10px; background: #185FA5; color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.18s, transform 0.12s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .submit-btn:hover:not(:disabled) { background: #0C447C; }
        .submit-btn:active { transform: scale(0.98); }
        .submit-btn.success { background: #1D9E75; }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .form-error { font-size: 12px; color: #E24B4A; margin-top: -6px; margin-bottom: 8px; }
        .disc-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #F1F5F9; cursor: pointer; transition: all 0.16s; }
        .disc-item:last-child { border-bottom: none; }
        .disc-item:hover .disc-name { color: #185FA5; }
        .disc-icon { width: 36px; height: 36px; border-radius: 10px; background: #EAF3FB; display: flex; align-items: center; justify-content: center; color: #185FA5; font-size: 16px; flex-shrink: 0; }
        .disc-name { font-size: 13px; font-weight: 500; color: #1E293B; }
        .disc-sub { font-size: 11px; color: #94A3B8; }
        .disc-badge { margin-left: auto; background: #EAF3FB; color: #185FA5; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 100px; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="dash-root">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-dot" /> L'Agora
          </div>
          <nav style={{ flex: 1 }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
                <i className={`ti ${item.icon}`} />
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="user-chip">
              <Avatar name="Sana Mejri" size={34} />
              <div className="user-chip-info">
                <div className="user-chip-name">Sana Mejri</div>
                <div className="user-chip-role">Community Manager</div>
              </div>
            </div>
            <button className="logout-btn"><i className="ti ti-logout" /> Logout</button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main-wrap">
          <div className="center-col">
            {/* Topbar */}
            <div className="topbar">
              <div className="search-wrap">
                <i className="ti ti-search" />
                <input
                  type="text" placeholder="Search posts..."
                  value={search} onChange={e => setSearch(e.target.value)}
                />
                {search && <i className="ti ti-x" style={{ cursor: "pointer", color: "#94A3B8", fontSize: 15 }} onClick={() => setSearch("")} />}
              </div>
              <div className="icon-btn" title="Notifications"><i className="ti ti-bell" /><span className="notif-dot" /></div>
              <div className="icon-btn" title="Discussions"><i className="ti ti-message-2" /></div>
              <div className="icon-btn" title="Settings"><i className="ti ti-settings" /></div>
            </div>

            {/* Filters */}
            <div className="filter-row">
              {FILTERS.map(f => (
                <button key={f} className={`filter-pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>

            {/* Posts */}
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="post-card">
                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <div className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 13, width: "40%", marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 11, width: "25%" }} />
                    </div>
                  </div>
                  <div className="skeleton" style={{ height: 13, marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 13, width: "80%" }} />
                </div>
              ))
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <i className="ti ti-mood-empty" />
                <p style={{ fontWeight: 600, color: "#475569" }}>No posts found</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Try a different filter or be the first to post!</p>
              </div>
            ) : (
              posts.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={i}
                  currentUserId={currentUserId}
                  categories={categories}
                  onReact={handleReact}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))
            )}
          </div>

          {/* ── Right column ── */}
          <div className="right-col">
            {/* New post form */}
            <div className="panel-card">
              <div className="panel-title"><i className="ti ti-pencil-plus" /> New Post</div>

              <div className="form-field">
                <label className="form-label">Category</label>
                <select className="form-input form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Content</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="What's on your mind?"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              {formError && <p className="form-error">{formError}</p>}

              <button className={`submit-btn ${submitted ? "success" : ""}`} onClick={handleSubmit} disabled={submitting}>
                <i className={`ti ${submitted ? "ti-check" : submitting ? "ti-loader-2" : "ti-send"}`} />
                {submitted ? "Posted!" : submitting ? "Publishing…" : "Publish Post"}
              </button>
            </div>

            {/* Discussions */}
            <div className="panel-card">
              <div className="panel-title"><i className="ti ti-messages" /> Intern Discussions</div>
              {[
                { name: "General",       sub: "Open to all members",    count: 12, icon: "ti-world" },
                { name: "Announcements", sub: "Staff only",             count: 2,  icon: "ti-speakerphone" },
                { name: "Ideas Lab",     sub: "Brainstorm together",    count: 5,  icon: "ti-bulb" },
                { name: "Events",        sub: "Upcoming activities",    count: 0,  icon: "ti-calendar-event" },
              ].map(d => (
                <div className="disc-item" key={d.name}>
                  <div className="disc-icon"><i className={`ti ${d.icon}`} /></div>
                  <div>
                    <div className="disc-name">{d.name}</div>
                    <div className="disc-sub">{d.sub}</div>
                  </div>
                  {d.count > 0 && <span className="disc-badge">{d.count}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}