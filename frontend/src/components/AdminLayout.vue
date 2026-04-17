<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import BorrowService from '../services/borrow.service';

const route  = useRoute();
const router = useRouter();

const username  = computed(() => localStorage.getItem('username'));
const avatarURL = computed(() => localStorage.getItem('avatar'));

// ─── Pending borrow badge ─────────────────────────────────────────────────────
const borrowService = new BorrowService();
const pendingCount  = ref(0);
let countInterval   = null;

const fetchPendingCount = async () => {
  try {
    const borrows  = await borrowService.getAllBorrows();
    pendingCount.value = borrows.filter(
      b => b.status === 'pending' || b.status === 'return_pending'
    ).length;
  } catch { /* silent */ }
};

onMounted(() => {
  fetchPendingCount();
  countInterval = setInterval(fetchPendingCount, 15_000);
});
onUnmounted(() => { if (countInterval) clearInterval(countInterval); });

// ─── Logout ───────────────────────────────────────────────────────────────────
const handleLogout = () => {
  localStorage.clear();
  router.push('/');
};

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = computed(() => [
  {
    label: 'Thống Kê',
    to: '/admin',
    badge: 0,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`,
  },
  {
    label: 'Quản Lý Sách',
    to: '/books',
    badge: 0,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`,
  },
  {
    label: 'Đơn Mượn Sách',
    to: '/borrowpending',
    badge: pendingCount.value,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>`,
  },
  {
    label: 'Nhà Xuất Bản',
    to: '/publishers',
    badge: 0,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`,
  },
  {
    label: 'Người Dùng',
    to: '/users',
    badge: 0,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`,
  },
  {
    label: 'Nhân Viên',
    to: '/staffs',
    badge: 0,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>`,
  },
  {
    label: 'Phản Hồi',
    to: '/reviews',
    badge: 0,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.274 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>`,
  },
  {
    label: 'Quản Lý Liên Hệ',
    to: '/contact-management',
    badge: 0,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
  },
]);

const isActive = (to) => route.path === to;
</script>

<template>
  <div class="admin-shell">

    <!-- ── Sidebar ─────────────────────────────────────────────────────────── -->
    <aside class="admin-sidebar">

      <!-- Brand -->
      <RouterLink to="/admin" class="sidebar-brand">
        <div class="brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span class="brand-name">Ebookshelf</span>
        <span class="brand-badge">Admin</span>
      </RouterLink>

      <div class="sidebar-divider"></div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ 'nav-item--active': isActive(item.to) }"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge > 0" class="nav-badge">{{ item.badge }}</span>
        </RouterLink>
      </nav>

      <!-- Spacer -->
      <div class="sidebar-spacer"></div>

      <div class="sidebar-divider"></div>

      <!-- User footer -->
      <div class="sidebar-user">
        <RouterLink to="/staffprofile" class="user-info">
          <div class="user-avatar">
            <img v-if="avatarURL" :src="avatarURL" alt="avatar" class="user-avatar-img" />
            <span v-else class="user-avatar-fallback">{{ username?.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="user-details">
            <span class="user-name">{{ username }}</span>
            <span class="user-role">Nhân viên</span>
          </div>
        </RouterLink>
        <button @click="handleLogout" class="logout-btn" title="Đăng xuất">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

    </aside>

    <!-- ── Main content ────────────────────────────────────────────────────── -->
    <main class="admin-content">
      <slot />
    </main>

  </div>
</template>

<style scoped>
/* ── Shell layout ────────────────────────────────────────────────────────────── */
.admin-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f1f5f9;
}

/* ── Sidebar ─────────────────────────────────────────────────────────────────── */
.admin-sidebar {
  width: 252px;
  min-width: 252px;
  height: 100vh;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 40;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 16px;
  text-decoration: none;
  transition: opacity .2s;
}
.sidebar-brand:hover { opacity: .85; }
.brand-icon {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.brand-name {
  font-size: 1rem;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: .02em;
}
.brand-badge {
  font-size: .6rem;
  font-weight: 700;
  background: #6366f1;
  color: #fff;
  border-radius: 6px;
  padding: 2px 7px;
  margin-left: auto;
  letter-spacing: .05em;
  text-transform: uppercase;
}

/* Divider */
.sidebar-divider {
  height: 1px;
  background: rgba(255,255,255,.07);
  margin: 0 16px;
}

/* Nav */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 9px;
  text-decoration: none;
  color: #94a3b8;
  font-size: .85rem;
  font-weight: 500;
  transition: background .15s, color .15s;
  position: relative;
}
.nav-item:hover {
  background: rgba(255,255,255,.07);
  color: #e2e8f0;
}
.nav-item--active {
  background: rgba(99,102,241,.18);
  color: #a5b4fc;
}
.nav-item--active .nav-icon { color: #818cf8; }

.nav-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: #64748b;
  transition: color .15s;
}
.nav-item:hover .nav-icon { color: #cbd5e1; }

.nav-label { flex: 1; }

.nav-badge {
  font-size: .65rem;
  font-weight: 800;
  background: #ef4444;
  color: #fff;
  border-radius: 999px;
  padding: 1px 7px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: .7; }
}

/* Spacer */
.sidebar-spacer { flex: 1; }

/* User footer */
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 12px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  text-decoration: none;
  min-width: 0;
  border-radius: 9px;
  padding: 6px 8px;
  transition: background .15s;
}
.user-info:hover { background: rgba(255,255,255,.06); }

.user-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #6366f1;
  display: flex; align-items: center; justify-content: center;
}
.user-avatar-img  { width: 100%; height: 100%; object-fit: cover; }
.user-avatar-fallback { color: #fff; font-weight: 700; font-size: .85rem; }

.user-details  { display: flex; flex-direction: column; min-width: 0; }
.user-name     { font-size: .8rem; font-weight: 600; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role     { font-size: .68rem; color: #64748b; }

.logout-btn {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,.05);
  color: #64748b;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s;
  flex-shrink: 0;
}
.logout-btn:hover { background: rgba(239,68,68,.2); color: #f87171; }

/* ── Main content ─────────────────────────────────────────────────────────────── */
.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  min-width: 0;
}

/* ── Responsive: collapse sidebar on small screens ──── */
@media (max-width: 768px) {
  .admin-sidebar { width: 200px; min-width: 200px; }
  .admin-content { padding: 16px; }
}
@media (max-width: 600px) {
  .admin-shell { flex-direction: column; height: auto; }
  .admin-sidebar { width: 100%; height: auto; min-width: unset; flex-direction: row; flex-wrap: wrap; }
  .admin-content { height: auto; overflow-y: visible; }
}
</style>
