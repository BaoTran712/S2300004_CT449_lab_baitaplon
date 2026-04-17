<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import contactService from '../services/contact.service';
import { push } from 'notivue';
import { useRouter } from 'vue-router';

const router = useRouter();
const messages = ref([]);
const loading = ref(true);
const role = computed(() => localStorage.getItem("role"));

const fetchMessages = async () => {
  loading.value = true;
  try {
    messages.value = await contactService.findAll();
  } catch (error) {
    console.error(error);
    push.error('Lỗi khi tải danh sách tin nhắn');
  } finally {
    loading.value = false;
  }
};

const deleteMessage = async (id) => {
  if (confirm('Xác nhận xóa tin nhắn này?')) {
    try {
      await contactService.delete(id);
      push.success('Đã xóa tin nhắn');
      fetchMessages();
    } catch (error) {
      push.error('Lỗi khi xóa tin nhắn');
    }
  }
};

const updateStatus = async (id, status) => {
  try {
    await contactService.updateStatus(id, { status });
    push.success('Đã cập nhật trạng thái');
    fetchMessages();
  } catch (error) {
    push.error('Lỗi khi cập nhật trạng thái');
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

onMounted(() => {
  if (role.value !== 'staff') {
    router.push('/');
    return;
  }
  fetchMessages();
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#faf9f6]">
    <Header />
    
    <main class="flex-grow container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-black text-neutral font-serif">Quản Lý Liên Hệ</h1>
          <p class="text-gray-500">Xem và quản lý các lời nhắn từ khách hàng</p>
        </div>
        <button @click="fetchMessages" class="btn btn-ghost btn-sm bg-white shadow-sm border border-base-200">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
           </svg>
           Làm mới
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="messages.length === 0" class="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-base-300">
        <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.274 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
           </svg>
        </div>
        <p class="text-xl font-bold text-gray-400">Chưa có tin nhắn liên hệ nào</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
        <div v-for="msg in messages" :key="msg._id" 
             class="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-base-200 hover:shadow-md transition-shadow group relative">
          
          <div class="flex flex-col md:flex-row justify-between gap-6">
            <div class="flex-grow">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span :class="msg.status === 'pending' ? 'badge-warning' : 'badge-success'" 
                      class="badge badge-sm font-bold uppercase text-[10px]">
                  {{ msg.status === 'pending' ? 'Chờ xử lý' : 'Đã phản hồi' }}
                </span>
                <h3 class="text-xl font-black text-neutral">{{ msg.subject }}</h3>
              </div>
              
              <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400 mb-4 font-mono">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {{ msg.name }}
                </span>
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {{ msg.email }}
                </span>
                <span v-if="msg.phone" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {{ msg.phone }}
                </span>
                <span class="flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   {{ formatDate(msg.createdAt) }}
                </span>
              </div>

              <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 text-neutral whitespace-pre-line italic">
                {{ msg.message }}
              </div>
            </div>

            <div class="flex flex-row md:flex-col gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <button v-if="msg.status === 'pending'" @click="updateStatus(msg._id, 'responded')" 
                      class="btn btn-sm btn-success text-white rounded-xl">Đánh dấu đã phản hồi</button>
              <button v-else @click="updateStatus(msg._id, 'pending')" 
                      class="btn btn-sm btn-outline btn-warning rounded-xl">Chờ xử lý lại</button>
              <button @click="deleteMessage(msg._id)" class="btn btn-sm btn-error btn-ghost rounded-xl">Xóa vĩnh viễn</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
