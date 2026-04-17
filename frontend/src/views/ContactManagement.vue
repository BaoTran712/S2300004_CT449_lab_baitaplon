<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import AdminLayout from '../components/AdminLayout.vue';

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

const replyingTo = ref(null);
const responseText = ref('');
const isSubmitting = ref(false);

const startReply = (msg) => {
  replyingTo.value = msg._id;
  responseText.value = msg.response || '';
};

const sendReply = async (id) => {
  if (!responseText.value.trim()) return;
  isSubmitting.value = true;
  try {
    await contactService.updateStatus(id, { 
      status: 'responded',
      response: responseText.value 
    });
    push.success('Đã gửi phản hồi');
    replyingTo.value = null;
    fetchMessages();
  } catch (error) {
    push.error('Lỗi khi gửi phản hồi');
  } finally {
    isSubmitting.value = false;
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
  <AdminLayout>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-neutral">Quản Lý Liên Hệ</h1>
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

    <div v-else class="overflow-x-auto bg-white rounded-[2.5rem] shadow-xl border border-base-200 pb-10">
      <table class="table table-zebra w-full text-neutral">
        <thead class="bg-base-200/50">
          <tr class="text-neutral uppercase text-[10px] tracking-widest border-b border-base-300">
            <th class="py-5 pl-8">Chủ đề & Ngày gửi</th>
            <th>Người gửi</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th class="text-right pr-8">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="msg in messages" :key="msg._id" class="hover:bg-base-100 transition-colors group">
            <td class="py-4 pl-8">
              <div class="flex flex-col">
                <span class="font-black text-neutral uppercase tracking-tighter line-clamp-1">{{ msg.subject }}</span>
                <span class="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-wider">{{ formatDate(msg.createdAt) }}</span>
              </div>
            </td>
            <td>
              <div class="flex flex-col text-xs">
                <span class="font-bold">{{ msg.name }}</span>
                <span class="opacity-60">{{ msg.email }}</span>
                <span v-if="msg.phone" class="text-indigo-500 font-mono text-[10px]">{{ msg.phone }}</span>
              </div>
            </td>
            <td>
              <div class="max-w-[300px]">
                <p class="text-xs italic line-clamp-2">"{{ msg.message }}"</p>
                <div v-if="msg.response" class="mt-2 pl-2 border-l-2 border-primary">
                  <p class="text-[10px] text-primary font-bold opacity-70">Phản hồi: <span class="font-medium italic">{{ msg.response }}</span></p>
                </div>
              </div>
            </td>
            <td>
              <span class="badge badge-xs font-bold uppercase tracking-widest p-2" 
                    :class="msg.status === 'pending' ? 'badge-warning' : 'badge-success text-white'">
                {{ msg.status === 'pending' ? 'Chờ xử lý' : 'Đã phản hồi' }}
              </span>
            </td>
            <td class="text-right pr-8">
              <div class="flex justify-end gap-2 items-center">
                <!-- Reply Form -->
                <div v-if="replyingTo === msg._id" class="flex flex-col gap-2 items-end">
                    <textarea v-model="responseText" class="textarea textarea-bordered textarea-xs w-48 h-20" placeholder="Soạn phản hồi..."></textarea>
                    <div class="flex gap-1">
                      <button @click="replyingTo = null" class="btn btn-xs btn-ghost text-[8px]">Hủy</button>
                      <button @click="sendReply(msg._id)" :disabled="isSubmitting" class="btn btn-xs btn-primary text-[8px]">Gửi</button>
                    </div>
                </div>
                <div v-else class="flex gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                   <button @click="startReply(msg)" class="btn btn-xs btn-ghost btn-primary">Phản hồi</button>
                   <button @click="deleteMessage(msg._id)" class="btn btn-xs btn-ghost btn-error">Xóa</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
