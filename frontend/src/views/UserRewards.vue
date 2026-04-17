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
          <p class="text-gray-500 italic">Thẻ thành viên điện tử và Vòng quay may mắn</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <!-- LEFT SIDE: VIP CARD & FINES -->
          <div class="lg:col-span-5 flex flex-col items-center gap-8">
            
            <!-- VIP CARD -->
            <div class="w-full max-w-md bg-gradient-to-tr from-neutral to-gray-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
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
                <p class="text-sm font-bold opacity-80 mt-1 uppercase">Điểm quy đổi quà tặng hiện có</p>
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
            <div v-if="user.fines > 0" class="w-full max-w-md bg-white border-2 border-red-100 p-6 rounded-3xl shadow-sm text-center">
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

            <!-- MY REWARDS LIST -->
            <div class="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-base-200">
               <h3 class="text-xl font-black mb-6 flex items-center gap-2">
                 <span class="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                 </span>
                 Quà tặng của tôi
               </h3>
               
               <div v-if="!user.rewards || user.rewards.length === 0" class="text-center py-6">
                 <p class="text-gray-400 italic">Bạn chưa quay món quà nào. Thử xoay vòng quay nhé!</p>
               </div>
               
               <div v-else class="space-y-4">
                 <div v-for="(reward, index) in user.rewards" :key="index" class="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 group hover:border-primary/30 transition-colors">
                    <div class="bg-white p-2 rounded-lg shadow-sm">🎁</div>
                    <div class="flex-grow">
                      <p class="font-bold text-neutral">{{ reward }}</p>
                      <p class="text-[10px] text-gray-400 uppercase tracking-wider">Mã phần quà: EB-{{ 1000 + index }}</p>
                    </div>
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span class="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">CHƯA NHẬN</span>
                    </div>
                 </div>
                 <p class="text-[10px] text-gray-400 text-center mt-6">Vui lòng đưa màn hình này cho nhân viên thủ thư để nhận quà trực tiếp.</p>
               </div>
            </div>
          </div>

          <!-- RIGHT SIDE: LUCKY WHEEL -->
          <div class="lg:col-span-7 space-y-8">
            
            <!-- WHEEL CONTAINER -->
            <div class="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-base-200 text-center overflow-hidden">
               <h2 class="text-3xl font-black text-neutral mb-2 uppercase tracking-wide">Vòng Quay May Mắn</h2>
               <p class="text-gray-500 mb-12">Sử dụng 30 điểm cho 1 lượt xoay để nhận quà hấp dẫn</p>

               <div class="relative w-80 h-80 mx-auto mb-12 flex items-center justify-center">
                  <!-- Red Arraw/Pointer -->
                  <div class="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-10 bg-red-600 clip-path-arrow shadow-lg border-b-4 border-black/20"></div>

                  <!-- The Wheel -->
                  <div 
                    class="w-full h-full rounded-full border-8 border-neutral shadow-2xl relative overflow-hidden transition-transform duration-[4000ms] ease-out-quint"
                    :style="{ transform: `rotate(${rotation}deg)` }"
                  >
                    <!-- Background segments using radial gradient or multiple elements -->
                    <div class="absolute inset-0 conic-wheel"></div>
                    
                    <!-- Labels -->
                    <div v-for="(prize, i) in prizeList" :key="i" 
                         class="absolute top-1/2 left-1/2 w-1/2 h-8 -translate-y-1/2 origin-left text-[10px] font-black text-white text-right pr-6 uppercase leading-tight select-none"
                         :style="{ transform: `rotate(${i * (360 / prizeList.length)}deg)` }">
                      {{ prize }}
                    </div>
                  </div>

                  <!-- Center Pin -->
                  <div class="absolute z-30 w-12 h-12 bg-white rounded-full shadow-inner flex items-center justify-center border-4 border-neutral">
                     <div class="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                  </div>
               </div>

               <button 
                 @click="startSpin" 
                 :disabled="isSpinning || (user.points < 30)"
                 class="btn btn-primary btn-lg rounded-2xl px-12 text-white font-black shadow-xl border-none hover:-translate-y-1 transition-all disabled:bg-gray-200 disabled:text-gray-400"
               >
                 {{ isSpinning ? 'Đang xoay...' : 'Xoay Ngay (30 PTS)' }}
               </button>

               <div v-if="lastReward" class="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl animate-bounce-short">
                  <p class="text-sm font-bold text-yellow-700">🎉 Chúc mừng! Bạn trúng: <span class="text-lg uppercase">{{ lastReward }}</span></p>
               </div>
            </div>

            <!-- RULES LIST (MINIMIZED) -->
            <div class="bg-neutral p-8 rounded-[2rem] text-white">
              <h4 class="text-lg font-black mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                Thể lệ Vòng quay
              </h4>
              <ul class="text-xs space-y-3 opacity-80 font-medium">
                <li>• Mỗi lần xoay tiêu tốn đúng 30 điểm (PTS).</li>
                <li>• Quà tặng sẽ được lưu vào danh sách bên trái.</li>
                <li>• Người dùng mang mã quà tặng đến cửa hàng vật lý để đổi quà.</li>
                <li>• Không giới hạn số lượt quay một ngày.</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </main>

    <Footer></Footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
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

// SPINNING LOGIC
const isSpinning = ref(false);
const rotation = ref(0);
const lastReward = ref(null);
const prizeList = [
  "Móc khóa", 
  "Thẻ kẹp sách", 
  "Bút dạ quang", 
  "Sổ tay", 
  "Huy hiệu",
  "May mắn lần sau"
];

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
      fetchUserData();
    } catch (error) {
      console.error(error);
      push.error("Lỗi khi xử lý thanh toán phạt.");
    }
  }
};

const startSpin = async () => {
  if (isSpinning.value) return;
  
  try {
    const response = await userService.spinWheel(user_id.value);
    const winPrize = response.reward;
    
    isSpinning.value = true;
    lastReward.value = null;

    // Mapping prize string to index
    const prizeIndex = prizeList.findIndex(p => winPrize.includes(p));
    
    // Calculate rotation
    // One full spin is 360deg. We want 5-8 full spins + offset to the prize
    // Degrees per segment = 360 / 6 = 60
    // Segment 0: 0-60, etc. 
    // Wheel turns clockwise, but pointer is at top (offset 90deg or 270deg depends on CSS)
    // To land on index 'i', we rotate the wheel so segment 'i' is under the pointer.
    
    const segmentAngle = 360 / prizeList.length;
    const baseSpins = 5 * 360; 
    // The pointer is at 0 degrees (top). Segments are laid out i * 60.
    // To get prize i to the top, rotate by - (i * 60)
    const targetAngle = baseSpins + (rotation.value - (rotation.value % 360)) + (360 - (prizeIndex * segmentAngle));
    
    rotation.value = targetAngle;

    setTimeout(() => {
      isSpinning.value = false;
      lastReward.value = winPrize;
      if (winPrize !== "Chúc bạn may mắn lần sau") {
        push.success(`🎉 Tuyệt vời! Bạn nhận được ${winPrize}`);
      } else {
        push.info("Tiếc quá, chúc bạn may mắn lần sau nhé!");
      }
      fetchUserData(); // Refresh points and rewards list
    }, 4100);

  } catch (error) {
    if (error.response?.status === 400) {
      push.error("Bạn không đủ điểm xoay vòng!");
    } else {
      push.error("Lỗi hệ thống khi quay.");
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

<style scoped>
.clip-path-arrow {
  clip-path: polygon(50% 100%, 0 0, 100% 0);
}

.ease-out-quint {
  transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}

.conic-wheel {
  background: conic-gradient(
    #f87171 0deg 60deg, 
    #fbbf24 60deg 120deg, 
    #34d399 120deg 180deg, 
    #60a5fa 180deg 240deg, 
    #a78bfa 240deg 300deg, 
    #f472b6 300deg 360deg
  );
}

@keyframes bounce-short {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-short {
  animation: bounce-short 1s ease-in-out infinite;
}
</style>
