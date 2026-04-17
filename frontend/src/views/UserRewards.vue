<template>
  <div class="min-h-screen flex flex-col bg-[#faf9f6]">
    <Header></Header>

    <main class="flex-grow pb-16">
      
      <div v-if="loading" class="flex justify-center my-32">
        <span class="loading loading-spinner text-primary loading-lg"></span>
      </div>

      <div v-else class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-black text-neutral uppercase tracking-widest mb-4">Tích Điểm & Ưu Đãi</h1>
          <p class="text-gray-500 italic">Thẻ thành viên điện tử và thông tin phạt nợ</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <!-- VIP CARD -->
          <div class="lg:col-span-5 flex flex-col items-center">
            
            <div class="w-full max-w-md bg-gradient-to-tr from-neutral to-gray-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <!-- Decorative elements -->
              <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
              <div class="absolute -left-16 -bottom-16 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>

              <div class="relative z-10 flex justify-between items-start mb-10">
                <div>
                  <h3 class="text-xl font-black italic tracking-wider">EBOOKSHELF</h3>
                  <p class="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Loyalty Member Card</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div class="relative z-10 space-y-1 mb-8">
                <p class="text-4xl font-black tracking-widest text-primary">{{ user.points || 0 }} <span class="text-xl text-white">PTS</span></p>
                <p class="text-sm font-bold opacity-80 mt-1 uppercase">Điểm quy đổi quà tặng tương lai</p>
              </div>

              <div class="relative z-10 flex justify-between items-end border-t border-white/20 pt-4">
                <div>
                  <p class="text-[10px] uppercase text-gray-400 mb-1">Họ tên thành viên</p>
                  <p class="font-bold sm:text-lg tracking-wider">{{ user.first_name }} {{ user.last_name }}</p>
                </div>
                <div>
                  <div class="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-sm border border-white/10">VIP {{ user.points > 100 ? 'GOLD' : 'MEMBER' }}</div>
                </div>
              </div>
            </div>

            <!-- Fines Section -->
            <div v-if="user.fines > 0" class="w-full max-w-md mt-8 bg-white border-2 border-red-100 p-6 rounded-3xl shadow-sm text-center">
              <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="text-red-600 font-bold text-lg mb-2">Thông báo nợ trả trễ</h4>
              <p class="text-gray-600 text-sm mb-4">Bạn đang có khoản nợ phạt phí trả trễ hạn. Việc này sẽ ngăn bạn mượn thêm sách mới.</p>
              <div class="text-3xl font-black text-red-600 mb-6">{{ user.fines.toLocaleString() }}đ</div>

              <button @click="payFines" class="btn btn-error w-full text-white font-bold rounded-xl outline outline-2 outline-offset-2 outline-error hover:scale-[1.02] transition-transform">
                Thanh Toán Phạt Tức Thì
              </button>
            </div>
          </div>

          <!-- Rules Section -->
          <div class="lg:col-span-7 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-base-200 h-fit">
            <h2 class="text-2xl font-black text-neutral mb-8 uppercase flex items-center gap-3">
              <span class="bg-primary/20 text-primary p-2 rounded-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
              </span>
              Thể Lệ Tích Điểm
            </h2>

            <ul class="space-y-8">
              <li class="flex gap-4 items-start border-b border-base-100 pb-6">
                <div class="bg-success text-white p-2 rounded-full mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-neutral mb-1">Trả sách đúng hạn (+5 Điểm)</h4>
                  <p class="text-gray-500 text-sm leading-relaxed">Mỗi lần bạn mượn sách và mang trả lại thư viện theo đúng thời hạn quy định (hoặc sớm hơn), bạn sẽ được hệ thống khen thưởng và cộng <strong>5 điểm</strong> tương ứng vào Thẻ thành viên VIP của bạn.</p>
                </div>
              </li>

              <li class="flex gap-4 items-start border-b border-base-100 pb-6">
                <div class="bg-warning text-white p-2 rounded-full mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-neutral mb-1">Hình phạt khi trễ hạn</h4>
                  <p class="text-gray-500 text-sm leading-relaxed">Nếu khi trả sách vượt quá thời gian đã cam kết ban đầu, hệ thống sẽ từ chối tích điểm (+0đ) và bạn sẽ bị bắt buộc đóng phạt tự động <strong>50.000 VNĐ</strong> đối với mỗi lượt vi phạm trả trễ đó.</p>
                </div>
              </li>
              
              <li class="flex gap-4 items-start">
                <div class="bg-error text-white p-2 rounded-full mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-neutral mb-1">Cấm mượn sách nếu có nợ</h4>
                  <p class="text-gray-500 text-sm leading-relaxed">Khi bạn chưa thanh toán xong số tiền phạt trong tài khoản của mình, mọi đặc quyền mượn sách mới sẽ bị <strong>tước tạm thời</strong> cho tới khi khoản phí được hoàn tất.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </main>

    <Footer></Footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import UserService from '../services/user.service';
import { useRouter } from 'vue-router';
import { push } from 'notivue';

const router = useRouter();
const userService = new UserService();
const user_id = computed(() => localStorage.getItem("id"));
const role = computed(() => localStorage.getItem("role"));
const user = ref({});
const loading = ref(true);

const fetchUserData = async () => {
  try {
    loading.value = true;
    const data = await userService.getUser(user_id.value);
    user.value = data;
  } catch (error) {
    console.error(error);
    push.error("Lỗi tải thông tin tích điểm.");
  } finally {
    loading.value = false;
  }
};

const payFines = async () => {
  if (confirm("Chấp nhận thanh toán bằng số dư ví Ebookshelf của bạn?")) {
    try {
      await userService.payFines(user_id.value);
      push.success("Đã thanh toán tiền phạt thành công!");
      fetchUserData(); // reload to show zero fines
    } catch (error) {
      console.error(error);
      push.error("Lỗi khi xử lý thanh toán phạt.");
    }
  }
};

onMounted(() => {
  if (!user_id.value || role.value === 'staff') {
    router.push('/');
    return;
  }
  fetchUserData();
});
</script>
