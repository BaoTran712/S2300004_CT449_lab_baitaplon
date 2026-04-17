<script setup>
import { ref, onMounted, computed } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import BookService from '../services/book.service';
import UserService from '../services/user.service';
import StaffService from '../services/staff.service';
import PublisherService from '../services/publisher.service';
import BorrowService from '../services/borrow.service';
import ReviewService from '../services/review.service';
import ContactService from '../services/contact.service';

const bookService = new BookService();
const userService = new UserService();
const staffService = new StaffService();
const publisherService = new PublisherService();
const borrowService = new BorrowService();
const reviewService = new ReviewService();
const contactService = ContactService;

const stats = ref({
    books: 0,
    users: 0,
    staff: 0,
    publishers: 0,
    borrows: {
        total: 0,
        pending: 0,
        borrowing: 0,
        overdue: 0,
        returned: 0
    },
    reviews: 0,
    contacts: 0
});

const recentActivity = ref([]);
const topRatedBooks = ref([]);
const categoryData = ref([]);
const loading = ref(true);

const fetchStats = async () => {
    loading.value = true;
    try {
        const [books, users, staff, publishers, borrows, reviews, contacts] = await Promise.all([
            bookService.getAllBooks(),
            userService.getAllUsers(),
            staffService.getAllStaffs(),
            publisherService.getAllPublishers(),
            borrowService.getAllBorrows(),
            reviewService.getAllReviews(),
            contactService.findAll()
        ]);

        // Basic Counts
        stats.value.books = books.length;
        stats.value.users = users.length;
        stats.value.staff = staff.length;
        stats.value.publishers = publishers.length;
        stats.value.reviews = reviews.length;
        stats.value.contacts = contacts.length;

        stats.value.borrows.total = borrows.length;
        stats.value.borrows.pending = borrows.filter(b => b.status === 'pending' || b.status === 'return_pending').length;
        stats.value.borrows.borrowing = borrows.filter(b => b.status === 'borrowing').length;
        stats.value.borrows.overdue = borrows.filter(b => b.status === 'overdue').length;
        stats.value.borrows.returned = borrows.filter(b => b.status === 'returned').length;

        // Recent Activity (latest 5 borrows)
        recentActivity.value = (borrows || [])
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || a.borrow_date || 0);
                const dateB = new Date(b.createdAt || b.borrow_date || 0);
                return dateB - dateA;
            })
            .slice(0, 5);

        // Calculate Average Ratings
        const bookRatings = {};
        (reviews || []).forEach(r => {
            if (!r.book_id) return;
            const bId = r.book_id._id || r.book_id;
            const bTitle = r.book_id.title || 'Sách đã xóa';
            if (!bookRatings[bId]) {
                bookRatings[bId] = { total: 0, count: 0, title: bTitle };
            }
            bookRatings[bId].total += (r.rating || 0);
            bookRatings[bId].count += 1;
        });

        topRatedBooks.value = Object.keys(bookRatings)
            .map(id => ({
                id,
                title: bookRatings[id].title,
                avg: (bookRatings[id].total / bookRatings[id].count).toFixed(1),
                count: bookRatings[id].count
            }))
            .sort((a, b) => b.avg - a.avg || b.count - a.count)
            .slice(0, 5);

        // Group by Publisher (as category proxy)
        const pubGroups = {};
        (books || []).forEach(b => {
            const pubName = b.publisher_id?.name || 'Công ty sách';
            pubGroups[pubName] = (pubGroups[pubName] || 0) + 1;
        });
        categoryData.value = Object.keys(pubGroups)
            .map(name => ({ name, count: pubGroups[name] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

    } catch (error) {
        console.error("Error fetching stats:", error);
    } finally {
        loading.value = false;
    }
};

const getStatusClass = (status) => {
    const classes = {
        'pending': 'bg-yellow-100 text-yellow-700',
        'return_pending': 'bg-orange-100 text-orange-700',
        'borrowing': 'bg-blue-100 text-blue-700',
        'overdue': 'bg-red-100 text-red-700',
        'returned': 'bg-green-100 text-green-700',
        'rejected': 'bg-gray-100 text-gray-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
};

const getStatusLabel = (status) => {
    const labels = {
        'pending': 'Chờ duyệt',
        'return_pending': 'Chờ trả',
        'borrowing': 'Đang mượn',
        'overdue': 'Quá hạn',
        'returned': 'Đã trả',
        'rejected': 'Từ chối'
    };
    return labels[status] || status;
};

onMounted(fetchStats);
</script>

<template>
    <AdminLayout>
        <div class="dashboard-page">
            <header class="page-header">
                <div>
                    <h1 class="page-title text-neutral">Thống Kê Tổng Quan</h1>
                    <p class="page-subtitle text-gray-400">Dữ liệu cập nhật thời gian thực từ hệ thống</p>
                </div>
                <button @click="fetchStats" class="refresh-btn group" :class="{ 'anim-spin': loading }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </header>

            <div v-if="loading" class="loading-overlay">
                <div class="flex flex-col items-center gap-4">
                    <span class="loading loading-ring loading-lg text-primary"></span>
                    <p class="text-sm font-bold text-gray-400 animate-pulse">Đang phân tích dữ liệu...</p>
                </div>
            </div>

            <div v-else class="dashboard-content space-y-10">
                <!-- Row 1: Key Metrics -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="stat-card group hover:shadow-xl transition-all duration-300">
                        <div class="stat-icon bg-indigo-50 text-indigo-500 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">{{ stats.books }}</span>
                            <span class="stat-label">Đầu sách</span>
                        </div>
                    </div>

                    <div class="stat-card group hover:shadow-xl transition-all duration-300">
                        <div class="stat-icon bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">{{ stats.users }}</span>
                            <span class="stat-label">Độc giả</span>
                        </div>
                    </div>

                    <div class="stat-card group hover:shadow-xl transition-all duration-300">
                        <div class="stat-icon bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">{{ stats.borrows.total }}</span>
                            <span class="stat-label">Lượt mượn</span>
                        </div>
                    </div>

                    <div class="stat-card group hover:shadow-xl transition-all duration-300">
                        <div class="stat-icon bg-rose-50 text-rose-500 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">{{ stats.reviews }}</span>
                            <span class="stat-label">Đánh giá</span>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Charts & Top Rated -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Borrow Status Visual -->
                    <div class="card-glass p-8">
                        <h3 class="box-title mb-6">Trạng thái mượn trả</h3>
                        <div class="flex flex-col sm:flex-row items-center gap-10">
                            <div class="relative w-40 h-40">
                                <div class="absolute inset-0 rounded-full border-[12px] border-gray-100"></div>
                                <div class="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent animate-slow-spin"></div>
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <span class="text-3xl font-black text-neutral">{{ (stats.borrows.borrowing / stats.borrows.total * 100 || 0).toFixed(0) }}%</span>
                                    <span class="text-[10px] text-gray-400 font-bold uppercase">Đang lưu hành</span>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 flex-1 w-full">
                                <div class="p-4 rounded-2xl bg-yellow-50/50 border border-yellow-100">
                                    <p class="text-xs font-bold text-yellow-600 mb-1">Chờ duyệt</p>
                                    <p class="text-xl font-black text-yellow-700">{{ stats.borrows.pending }}</p>
                                </div>
                                <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                                    <p class="text-xs font-bold text-blue-600 mb-1">Đang mượn</p>
                                    <p class="text-xl font-black text-blue-700">{{ stats.borrows.borrowing }}</p>
                                </div>
                                <div class="p-4 rounded-2xl bg-red-50/50 border border-red-100">
                                    <p class="text-xs font-bold text-red-600 mb-1">Quá hạn</p>
                                    <p class="text-xl font-black text-red-700">{{ stats.borrows.overdue }}</p>
                                </div>
                                <div class="p-4 rounded-2xl bg-green-50/50 border border-green-100">
                                    <p class="text-xs font-bold text-green-600 mb-1">Đã trả</p>
                                    <p class="text-xl font-black text-green-700">{{ stats.borrows.returned }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top Rated Books -->
                    <div class="card-glass p-8">
                        <h3 class="box-title mb-6">Sách được đánh giá cao</h3>
                        <div class="space-y-4">
                            <div v-for="(book, idx) in topRatedBooks" :key="book.id" class="flex items-center gap-4 group">
                                <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                    {{ idx + 1 }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-bold text-neutral truncate">{{ book.title }}</p>
                                    <p class="text-xs text-gray-400">{{ book.count }} lượt đánh giá</p>
                                </div>
                                <div class="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                    <span class="text-sm font-black text-yellow-700">{{ book.avg }}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                                        <path d="M10.836 2.26a1.002 1.002 0 00-1.672 0l-2.02 3.109-3.664.532a1 1 0 00-.554 1.705l2.651 2.585-.626 3.648a1 1 0 001.451 1.054L10 13.166l3.278 1.722a1 1 0 001.451-1.054l-.626-3.648 2.651-2.585a1 1 0 00-.554-1.705l-3.664-.532-2.02-3.109z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Row 3: Recent Activity -->
                <div class="card-glass p-8">
                    <div class="flex items-center justify-between mb-8">
                        <h3 class="box-title">Hoạt động mượn sách gần đây</h3>
                        <RouterLink to="/borrowpending" class="text-xs font-bold text-primary hover:underline">Tất cả đơn mượn</RouterLink>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="table table-zebra">
                            <thead>
                                <tr class="text-gray-400 border-b border-gray-100">
                                    <th class="font-bold uppercase text-[10px]">Người mượn</th>
                                    <th class="font-bold uppercase text-[10px]">Cuốn sách</th>
                                    <th class="font-bold uppercase text-[10px]">Ngày mượn</th>
                                    <th class="font-bold uppercase text-[10px]">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="act in recentActivity" :key="act._id" class="hover:bg-gray-50/50 transition-colors">
                                    <td>
                                        <div class="font-bold text-neutral">{{ act.user_id?.first_name }} {{ act.user_id?.last_name }}</div>
                                        <div class="text-[10px] text-gray-400 opacity-70">{{ act.user_id?.phone }}</div>
                                    </td>
                                    <td class="max-w-xs truncate font-medium text-gray-600">{{ act.book_id?.title }}</td>
                                    <td class="text-xs text-gray-500 font-mono">{{ new Date(act.borrow_date).toLocaleDateString('vi-VN') }}</td>
                                    <td>
                                        <span :class="getStatusClass(act.status)" class="badge badge-sm font-black border-none px-3 py-2 rounded-lg">
                                            {{ getStatusLabel(act.status) }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Row 4: Category distribution & Team -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Distribution Chart (Simple Bar) -->
                    <div class="card-glass p-8 lg:col-span-2">
                        <h3 class="box-title mb-6">Phân bổ theo Nhà xuất bản</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                            <div v-for="pub in categoryData" :key="pub.name" class="flex flex-col gap-2">
                                <div class="flex justify-between items-end">
                                    <span class="text-sm font-bold text-neutral truncate max-w-[150px]">{{ pub.name }}</span>
                                    <span class="text-xs font-black text-primary">{{ pub.count }} sách</span>
                                </div>
                                <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-primary transition-all duration-1000" :style="{ width: (pub.count / stats.books * 100) + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Team & Support Quick Info -->
                    <div class="flex flex-col gap-8">
                        <div class="info-box-premium p-6 flex-1 flex flex-col justify-between">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-xs font-bold text-white/70 uppercase mb-1">Tin nhắn mới</p>
                                    <p class="text-4xl font-black text-white">{{ stats.contacts }}</p>
                                </div>
                                <div class="p-3 bg-white/20 rounded-2xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <RouterLink to="/contact-management" class="mt-4 py-2 bg-white text-indigo-600 rounded-xl text-center text-xs font-black hover:bg-white/90 transition-colors shadow-lg shadow-indigo-500/20">Xử lý ngay</RouterLink>
                        </div>

                        <div class="card-glass p-6">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="avatar-group -space-x-4 rtl:space-x-reverse">
                                    <div class="avatar placeholder">
                                        <div class="bg-indigo-100 text-indigo-500 w-8 rounded-full font-bold text-[10px]">AD</div>
                                    </div>
                                    <div class="avatar placeholder">
                                        <div class="bg-emerald-100 text-emerald-500 w-8 rounded-full font-bold text-[10px]">ST</div>
                                    </div>
                                    <div class="avatar placeholder">
                                        <div class="bg-rose-100 text-rose-500 w-8 rounded-full font-bold text-[10px]">PB</div>
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-black text-neutral">{{ stats.staff }} Nhân viên</p>
                                    <p class="text-[10px] text-gray-400">Đang trực tuyến</p>
                                </div>
                                <RouterLink to="/staffs" class="btn btn-ghost btn-circle btn-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
.dashboard-page {
    animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 900;
    letter-spacing: -0.05em;
}

.refresh-btn {
    width: 48px; height: 48px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #94a3b8;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
}
.refresh-btn:hover { background: #fff; color: #1e293b; transform: scale(1.1); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
.refresh-btn:active { transform: scale(0.9); }

.anim-spin { animation: spin 0.8s ease-in-out; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.loading-overlay { height: 60vh; display: flex; align-items: center; justify-content: center; }

.stat-card {
    background: #fff;
    padding: 24px;
    border-radius: 28px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
    display: flex;
    align-items: center;
    gap: 20px;
    border: 1px solid #f1f5f9;
}

.stat-icon {
    width: 60px; height: 60px;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}

.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 1.75rem; font-weight: 900; color: #1e293b; line-height: 1; }
.stat-label { font-size: 0.8rem; color: #94a3b8; margin-top: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

.card-glass {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border-radius: 32px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
}

.info-box-premium {
    background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
    border-radius: 32px;
    box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.2);
}

.box-title { font-size: 1.1rem; font-weight: 900; color: #1e293b; }

.animate-slow-spin { animation: spin 3s linear infinite; }

@media (max-width: 640px) {
    .page-title { font-size: 1.75rem; }
    .stat-card { padding: 16px; }
}
</style>
