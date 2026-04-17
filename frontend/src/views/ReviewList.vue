<script setup>
import { ref, onMounted, computed } from "vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import AdminLayout from "../components/AdminLayout.vue";

import ReviewService from "../services/review.service";
import { push } from "notivue";
import { useRouter } from "vue-router";

const router = useRouter();
const reviewService = new ReviewService();
const reviews = ref([]);
const loading = ref(true);
const role = computed(() => localStorage.getItem("role"));

const fetchAllReviews = async () => {
  try {
    reviews.value = await reviewService.getAllReviews();
  } catch (error) {
    push.error("Không thể tải danh sách phản hồi");
  } finally {
    loading.value = false;
  }
};

const deleteReview = async (id) => {
  if (confirm("Xác nhận xóa phản hồi này?")) {
    try {
      await reviewService.deleteReview(id);
      push.success("Đã xóa phản hồi");
      fetchAllReviews();
    } catch (error) {
      push.error("Lỗi khi xóa phản hồi");
    }
  }
};

const replyingTo = ref(null);
const replyText = ref('');
const isSubmitting = ref(false);

const startReply = (review) => {
  replyingTo.value = review._id;
  replyText.value = review.reply || '';
};

const sendReply = async (id) => {
  if (!replyText.value.trim()) return;
  isSubmitting.value = true;
  try {
    await reviewService.updateReply(id, replyText.value);
    push.success('Đã gửi phản hồi đánh giá');
    replyingTo.value = null;
    fetchAllReviews();
  } catch (error) {
    push.error('Lỗi khi gửi phản hồi');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(fetchAllReviews);
</script>

<template>
  <AdminLayout v-if="role === 'staff'">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-neutral tracking-tight uppercase">Quản Lý Đánh Giá</h1>
        <p class="text-gray-500 mt-1">Lắng nghe và tương tác với cộng đồng độc giả Ebookshelf</p>
      </div>
      <div class="badge badge-lg badge-neutral p-4 font-bold">{{ reviews.length }} nhận xét</div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="reviews.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-base-200 gap-6 text-center">
      <p class="text-xl font-medium opacity-50">Chưa có phản hồi nào từ cộng đồng độc giả</p>
    </div>

    <div v-else class="overflow-x-auto bg-white rounded-[2.5rem] shadow-xl border border-base-200 mb-10">
      <table class="table table-zebra w-full text-neutral">
        <thead class="bg-base-200/50">
          <tr class="text-neutral uppercase text-[10px] tracking-widest border-b border-base-300">
            <th class="py-5 pl-8">Độc giả</th>
            <th>Sách & Đánh giá</th>
            <th>Nội dung</th>
            <th>Trạng thái phản hồi</th>
            <th class="text-right pr-8">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="review in reviews" :key="review._id" class="hover:bg-base-100 transition-colors group">
            <td class="py-4 pl-8">
              <div class="flex items-center gap-3">
                <div class="avatar placeholder shadow-sm">
                  <div class="bg-primary text-primary-content rounded-xl w-10 h-10">
                    <span class="font-black text-sm">{{ (review.username || "U").charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
                <div>
                  <div class="font-black text-neutral uppercase tracking-tighter">{{ review.username || "Người dùng ẩn" }}</div>
                  <div class="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-wider">{{ new Date(review.createdAt).toLocaleDateString('vi-VN') }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="flex flex-col gap-1">
                <RouterLink :to="review.book_id ? '/book/' + review.book_id._id : '#'" 
                            class="text-[10px] font-black uppercase text-indigo-600 hover:underline">
                  {{ review.book_id?.title || 'Đã bị xóa' }}
                </RouterLink>
                <div class="flex gap-0.5">
                  <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" 
                       :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'" 
                       class="h-3 w-3" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
            </td>
            <td>
               <p class="text-xs italic line-clamp-2 max-w-[250px]">"{{ review.comment }}"</p>
               <div v-if="review.reply" class="mt-2 pl-2 border-l-2 border-emerald-400">
                  <p class="text-[10px] text-emerald-600 font-bold opacity-70">Phản hồi: <span class="font-medium italic">{{ review.reply }}</span></p>
               </div>
            </td>
            <td>
              <span class="badge badge-xs font-bold uppercase tracking-widest p-2" 
                    :class="review.reply ? 'badge-success text-white' : 'badge-ghost opacity-50'">
                {{ review.reply ? 'Đã trả lời' : 'Chưa trả lời' }}
              </span>
            </td>
            <td class="text-right pr-8">
              <div class="flex justify-end gap-2">
                 <!-- Reply Action -->
                 <div v-if="replyingTo === review._id" class="flex flex-col gap-2 items-end">
                    <textarea v-model="replyText" class="textarea textarea-bordered textarea-xs w-48 h-20" placeholder="Trả lời..."></textarea>
                    <div class="flex gap-1">
                      <button @click="replyingTo = null" class="btn btn-xs btn-ghost text-[8px]">Hủy</button>
                      <button @click="sendReply(review._id)" :disabled="isSubmitting" class="btn btn-xs btn-primary text-[8px]">Gửi</button>
                    </div>
                 </div>
                 <div v-else class="flex gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                    <button @click="startReply(review)" class="btn btn-xs btn-ghost btn-primary">Phản hồi</button>
                    <button @click="deleteReview(review._id)" class="btn btn-xs btn-ghost btn-error">Xóa</button>
                 </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>

  <div v-else class="flex flex-col min-h-screen bg-base-100 text-neutral">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-black tracking-tight">Phản hồi & Đánh giá</h1>
          <p class="text-gray-500 mt-1">Tổng hợp ý kiến từ cộng đồng độc giả Ebookshelf</p>
        </div>
        <div class="badge badge-lg badge-neutral p-4 font-bold">{{ reviews.length }} nhận xét</div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="reviews.length === 0" class="flex flex-col items-center justify-center py-20 bg-base-100 rounded-[3rem] border-2 border-dashed border-base-300 gap-6">
        <div class="flex gap-4">
          <div class="chat chat-start opacity-30 transform -rotate-12">
            <div class="chat-bubble chat-bubble-secondary">Đang chờ những review đầu tiên...</div>
          </div>
          <div class="chat chat-end opacity-30 transform rotate-6">
            <div class="chat-bubble chat-bubble-primary font-bold text-lg">Bạn nghĩ sao về thư viện?</div>
          </div>
        </div>
        <p class="text-xl font-medium opacity-50 mt-4">Chưa có phản hồi nào từ cộng đồng độc giả</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="review in reviews" :key="review._id" 
             class="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all group rounded-3xl overflow-hidden">
          
          <div class="p-6 text-neutral">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="avatar placeholder">
                  <div class="bg-primary text-primary-content rounded-full w-10 ring ring-primary ring-offset-base-100 ring-offset-2">
                    <span class="font-bold">{{ (review.username || "U").charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
                <div>
                  <h4 class="font-black leading-none">{{ review.username || "Người dùng ẩn" }}</h4>
                  <span class="text-[10px] text-gray-400 mt-1 block">{{ new Date(review.createdAt).toLocaleDateString('vi-VN') }}</span>
                </div>
              </div>
              <div class="flex">
                <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" 
                     :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'" 
                     class="h-4 w-4" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>

            <div class="mb-4">
               <RouterLink :to="review.book_id ? '/book/' + review.book_id._id : '#'" 
                           class="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors">
                  Sách: {{ review.book_id?.title || 'Đã bị xóa' }}
               </RouterLink>
            </div>

            <p class="italic leading-relaxed line-clamp-4 min-h-[5rem]">
              "{{ review.comment }}"
            </p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
