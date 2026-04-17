<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import { useAuth } from '../composables/useAuth';
import { ref, computed, onMounted } from "vue";
import UserService from '../services/user.service';
import BorrowService from '../services/borrow.service';
import ReviewService from '../services/review.service';
import { useRouter } from 'vue-router';

const router = useRouter();
const { logOut } = useAuth();
const userService = new UserService();
const borrowService = new BorrowService();
const reviewService = new ReviewService();

const user = ref({});
const borrowings = ref([]);
const userReviews = ref([]);
const user_id = computed(() => localStorage.getItem("id"));
const loading = ref(true);
const activeTab = ref('info');

const goToUserProfileEdit = async (user_id) => {
  router.push({ name: "userprofile.edit", params: { id: user_id } });
};

const fetchData = async () => {
  loading.value = true;
  try {
    const user_data = await userService.getUser(user_id.value);
    user.value = user_data;
    
    // Fetch Borrowings
    borrowings.value = await borrowService.getAllBorrows({ user_id: user_id.value });
    
    // Fetch Reviews
    userReviews.value = await reviewService.getReviewsByUserId(user_id.value);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const handleRenew = async (borrowId) => {
  try {
    const response = await borrowService.updateBorrow(borrowId, { action: "renew" });
    // Reload borrowing history to reflect new dates
    await fetchData();
  } catch (error) {
    if (error.response?.data?.message) {
      alert("Lỗi: " + error.response.data.message);
    } else {
      alert("Không thể gia hạn sách này");
    }
  }
};

const isBookOverdue = (returnDateStr, status) => {
  return new Date() > new Date(returnDateStr) && status === 'borrowing';
};

const isUserSuspended = computed(() => {
  if (!user.value || !user.value.suspended_until) return false;
  return new Date(user.value.suspended_until) > new Date();
});

onMounted(fetchData);
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#faf9f6]">
    <Header></Header>

    <main class="flex-grow pb-16">
      
      <div v-if="loading" class="flex justify-center my-32">
        <span class="loading loading-spinner text-primary loading-lg"></span>
      </div>

      <div v-else>
        <!-- Profile Cover Banner -->
        <div class="h-48 sm:h-64 w-full relative bg-neutral">
          <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2000" alt="Library Background" class="w-full h-full object-cover opacity-50" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#faf9f6] to-transparent opacity-90 h-1/2 bottom-0 top-auto"></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24">
          <!-- Notification Banner for Suspension -->
          <div v-if="isUserSuspended" class="bg-error text-white font-bold p-4 rounded-xl shadow-lg mb-6 flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="text-lg mb-1">Tài khoản của bạn đang bị cấm mượn sách!</p>
              <p class="text-sm font-medium opacity-90">Lý do: Vi phạm trả sách trễ hạn. Bạn sẽ được mượn lại sau: {{ new Date(user.suspended_until).toLocaleString('vi-VN') }}</p>
            </div>
          </div>

          <div class="bg-white rounded-[2rem] shadow-xl border border-base-200 overflow-hidden flex flex-col">
            
            <!-- Profile Header Section -->
            <div class="flex flex-col md:flex-row items-center gap-8 p-8 border-b border-base-100 bg-white/50 backdrop-blur-sm">
                <div class="relative group cursor-pointer" @click="goToUserProfileEdit(user_id)">
                    <div class="avatar shadow-2xl rounded-full ring-4 ring-white bg-white">
                        <div class="w-32 h-32 rounded-full bg-base-200 flex items-center justify-center overflow-hidden">
                        <img v-if="user.avatar" :src="user.avatar" alt="User Avatar" class="object-cover w-full h-full" />
                        <span v-else class="text-5xl font-black text-gray-300 uppercase">{{ user.first_name?.charAt(0) || 'U' }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-center md:items-start text-center md:text-left flex-grow">
                    <h1 class="text-4xl font-black text-neutral capitalize leading-tight">{{ user.first_name }} {{ user.last_name }}</h1>
                    <div class="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                        <div class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-1.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                            </svg>
                            <span class="font-bold tracking-wider text-[10px] uppercase">{{ user.username }}</span>
                        </div>
                        <div class="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full">
                            <span class="font-bold tracking-wider text-[10px] uppercase">💎 {{ user.points || 0 }} Điểm thân thiết</span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button @click="goToUserProfileEdit(user_id)" class="btn btn-primary rounded-xl text-white font-bold shadow-lg shadow-primary/30 border-none">
                        Sửa hồ sơ
                    </button>
                    <button @click="logOut" class="btn btn-ghost bg-base-100 border-base-300 rounded-xl font-bold">
                        Đăng xuất
                    </button>
                </div>
            </div>

            <!-- Profile Content Section with Tabs -->
            <div class="flex flex-col">
                <div class="tabs tabs-boxed bg-base-100 p-2 m-4 rounded-2xl w-fit self-center md:self-start">
                    <a @click="activeTab = 'info'" class="tab tab-lg font-black transition-all" :class="{'tab-active !bg-primary !text-white !rounded-xl': activeTab === 'info'}">Thông tin</a>
                    <a @click="activeTab = 'history'" class="tab tab-lg font-black transition-all" :class="{'tab-active !bg-primary !text-white !rounded-xl': activeTab === 'history'}">Lịch sử mượn</a>
                    <a @click="activeTab = 'reviews'" class="tab tab-lg font-black transition-all" :class="{'tab-active !bg-primary !text-white !rounded-xl': activeTab === 'reviews'}">Đánh giá</a>
                </div>

                <div class="p-8 md:p-12">
                    <!-- Tab: Personal Info -->
                    <div v-if="activeTab === 'info'" class="animate-in fade-in duration-500">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                            <div class="group">
                                <p class="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Họ và tên</p>
                                <p class="text-xl font-bold text-neutral">{{ user.last_name }} {{ user.first_name }}</p>
                            </div>
                            <div class="group">
                                <p class="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Thông tin cá nhân</p>
                                <div class="flex items-center gap-3">
                                    <span class="badge badge-lg" :class="user.gender ? 'badge-info text-white' : 'badge-secondary text-white'">{{ user.gender ? 'Nam' : 'Nữ' }}</span>
                                    <span class="text-xl font-medium text-neutral">{{ user.birthday ? new Date(user.birthday).toLocaleDateString('vi-VN') : "---" }}</span>
                                </div>
                            </div>
                            <div class="group">
                                <p class="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Liên hệ</p>
                                <p class="text-xl font-bold text-neutral">{{ user.phone || "---" }}</p>
                            </div>
                            <div class="group">
                                <p class="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Địa chỉ hiện tại</p>
                                <p class="text-lg font-medium text-neutral leading-relaxed">{{ user.address || "---" }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Tab: Borrowing History -->
                    <div v-if="activeTab === 'history'" class="animate-in fade-in duration-500">
                        <div v-if="borrowings.length === 0" class="text-center py-20 opacity-30">
                            <p class="text-xl font-bold">Chưa có lịch sử mượn sách</p>
                        </div>
                        <div v-else class="overflow-x-auto">
                            <table class="table table-zebra w-full text-neutral">
                                <thead>
                                    <tr class="text-neutral uppercase text-[10px] tracking-widest border-b border-base-200">
                                        <th class="py-4">Sách</th>
                                        <th>Ngày mượn</th>
                                        <th>Hạn trả</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="borrow in borrowings" :key="borrow._id" class="hover:bg-base-100 transition-colors">
                                        <td class="py-4">
                                            <span class="font-black uppercase tracking-tighter">{{ borrow.book_id?.title || 'Sách đã bị xóa' }}</span>
                                        </td>
                                        <td>{{ new Date(borrow.borrow_date).toLocaleDateString('vi-VN') }}</td>
                                        <td>
                                            <span :class="{'text-error font-bold': new Date() > new Date(borrow.return_date) && borrow.status !== 'returned'}">
                                                {{ new Date(borrow.return_date).toLocaleDateString('vi-VN') }}
                                            </span>
                                        </td>
                                        <td>
                                            <div v-if="borrow.status === 'pending'" class="badge badge-warning badge-sm font-bold uppercase text-[8px]">Chờ duyệt</div>
                                            <div v-else-if="borrow.status === 'borrowing' && isBookOverdue(borrow.return_date, borrow.status)" class="badge badge-error badge-sm font-bold uppercase text-[8px] text-white animate-pulse mb-1">Quá hạn trả</div>
                                            <div v-else-if="borrow.status === 'borrowing'" class="badge badge-info badge-sm font-bold uppercase text-[8px] text-white">Đang mượn</div>
                                            <div v-else-if="borrow.status === 'returned'" class="badge badge-success badge-sm font-bold uppercase text-[8px] text-white">Đã trả</div>
                                            <div v-else-if="borrow.status === 'rejected'" class="badge badge-error badge-sm font-bold uppercase text-[8px] text-white">Từ chối</div>
                                            <div v-else-if="borrow.status === 'overdue'" class="badge badge-error badge-sm font-bold uppercase text-[8px] text-white animate-pulse">Quá hạn</div>
                                            <div v-else-if="borrow.status === 'return_pending'" class="badge badge-warning badge-sm font-bold uppercase text-[8px]">Chờ trả</div>
                                            
                                            <!-- Renew Button for active valid borrowing -->
                                            <button v-if="borrow.status === 'borrowing' && !isBookOverdue(borrow.return_date, borrow.status)" 
                                                    @click="handleRenew(borrow._id)" 
                                                    class="btn btn-xs btn-outline btn-primary ml-2 rounded text-[10px]">
                                                Gia hạn +7
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tab: User Reviews -->
                    <div v-if="activeTab === 'reviews'" class="animate-in fade-in duration-500">
                        <div v-if="userReviews.length === 0" class="text-center py-20 opacity-30">
                            <p class="text-xl font-bold">Bạn chưa có đánh giá nào</p>
                        </div>
                        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div v-for="review in userReviews" :key="review._id" class="card bg-[#f8fafc] p-6 border border-base-200 hover:shadow-md transition-shadow">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="flex flex-col">
                                        <span class="text-[10px] font-black uppercase text-secondary mb-1">Sách: {{ review.book_id?.title || 'Sách đã xóa' }}</span>
                                        <div class="flex">
                                            <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" 
                                                :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'" 
                                                class="h-3 w-3" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <span class="text-[8px] font-bold text-gray-400">{{ new Date(review.createdAt).toLocaleDateString('vi-VN') }}</span>
                                </div>
                                <p class="text-xs italic text-neutral leading-relaxed">"{{ review.comment }}"</p>
                                
                                <div v-if="review.reply" class="mt-4 p-3 bg-emerald-50 rounded-xl border-l-4 border-emerald-400">
                                    <span class="text-[8px] font-black uppercase text-emerald-600 block mb-1">Thư viện phản hồi</span>
                                    <p class="text-[10px] font-bold text-emerald-800">{{ review.reply }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

          </div>
        </div>

      </div>
    </main>

    <Footer></Footer>
  </div>
</template>

<style scoped>
.tab-active {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>

<style scoped>
/* Optional specific css for smooth transitions */
</style>