<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import { useAuth } from '../composables/useAuth';
import { ref, computed, onMounted } from "vue";
import UserService from '../services/user.service';
import { useRouter } from 'vue-router';

const router = useRouter();
const { logOut } = useAuth();
const userService = new UserService();
const user = ref({});
const user_id = computed(() => localStorage.getItem("id"));
const loading = ref(true);

const goToUserProfileEdit = async (user_id) => {
  router.push({ name: "userprofile.edit", params: { id: user_id } });
};

onMounted(async () => {
  loading.value = true;
  try {
    const user_data = await userService.getUser(user_id.value);
    user.value = user_data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});
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
        <div class="h-64 sm:h-80 w-full relative bg-neutral">
          <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2000" alt="Library Background" class="w-full h-full object-cover opacity-50" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#faf9f6] to-transparent opacity-90 h-1/2 bottom-0 top-auto"></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32">
          <div class="bg-white rounded-[2rem] shadow-xl border border-base-200 overflow-hidden flex flex-col md:flex-row">
            
            <!-- Sidebar / Avatar Section -->
            <div class="w-full md:w-1/3 p-8 flex flex-col items-center bg-white border-r border-base-100 z-10 relative">
              <div class="relative group cursor-pointer mb-6" @click="goToUserProfileEdit(user_id)">
                <div class="avatar online shadow-2xl rounded-full ring-4 ring-white bg-white">
                  <div class="w-40 h-40 rounded-full bg-base-200 flex items-center justify-center overflow-hidden">
                    <img v-if="user.avatar" :src="user.avatar" alt="User Avatar" class="object-cover w-full h-full" />
                    <span v-else class="text-6xl font-black text-gray-300 uppercase">{{ user.first_name?.charAt(0) || 'U' }}</span>
                  </div>
                </div>
                <div class="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span class="text-white text-xs font-bold uppercase tracking-wider">Cập Nhật Ảnh</span>
                </div>
              </div>
              
              <h1 class="text-3xl font-black text-neutral text-center capitalize">{{ user.first_name }} {{ user.last_name }}</h1>
              <div class="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <p class="font-bold tracking-wider text-xs uppercase">{{ user.username }}</p>
              </div>
              
              <div class="mt-8 w-full flex flex-col gap-3">
                <button @click="goToUserProfileEdit(user_id)" class="btn btn-primary rounded-xl text-white font-bold w-full shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform border-none">
                  Chỉnh sửa hồ sơ
                </button>
                <button @click="logOut" class="btn btn-outline btn-neutral rounded-xl w-full border-2 hover:-translate-y-1 transition-transform">
                  Đăng xuất
                </button>
              </div>
            </div>

            <!-- Information Details Section -->
            <div class="w-full md:w-2/3 p-8 md:p-12 bg-white">
              <h2 class="text-2xl font-black mb-8 pb-4 text-neutral flex items-center gap-3">
                <span class="bg-primary/20 p-2 rounded-lg text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </span>
                Chi tiết hồ sơ của bạn
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                <!-- Detail Item -->
                <div class="group">
                  <p class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-2">
                    Họ và tên
                  </p>
                  <p class="text-xl font-medium text-neutral">{{ user.first_name }} {{ user.last_name }}</p>
                </div>
                
                <div class="group">
                  <p class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-2">
                    Tên đăng nhập
                  </p>
                  <p class="text-xl font-medium text-neutral">{{ user.username }}</p>
                </div>

                <div class="group">
                  <p class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-2">
                    Ngày sinh (Nam/Nu)
                  </p>
                  <p class="text-xl font-medium text-neutral">
                    {{ user.birthday ? new Date(user.birthday).toLocaleDateString('vi-VN') : "Chưa cập nhật" }}
                  </p>
                </div>

                <div class="group">
                  <p class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-2">
                    Giới tính
                  </p>
                  <p class="text-xl font-medium text-neutral">
                    <span v-if="user.gender === true" class="badge badge-lg badge-info text-white font-bold">Nam</span>
                    <span v-else-if="user.gender === false" class="badge badge-lg badge-secondary text-white font-bold">Nữ</span>
                    <span v-else class="text-gray-400 italic">Chưa cập nhật</span>
                  </p>
                </div>

                <div class="group sm:col-span-2">
                  <p class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-2">
                    Số điện thoại liên lạc
                  </p>
                  <p class="text-xl font-medium text-neutral">
                    {{ user.phone || "Chưa cập nhật" }}
                  </p>
                </div>

                <div class="group sm:col-span-2 bg-[#f4f7fa] p-6 rounded-2xl border border-blue-50 relative overflow-hidden transition-all hover:bg-blue-50/50">
                  <div class="absolute right-0 top-0 opacity-5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <p class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 relative z-10">Địa chỉ giao/nhận sách</p>
                  <p class="text-lg font-medium text-neutral leading-relaxed relative z-10 w-4/5">
                    {{ user.address || "Vui lòng bấm 'Chỉnh sửa hồ sơ' để thêm địa chỉ giao/nhận sách." }}
                  </p>
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
/* Optional specific css for smooth transitions */
</style>