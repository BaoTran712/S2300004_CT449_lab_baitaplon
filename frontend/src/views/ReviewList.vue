<script setup>
import { ref, onMounted, computed } from "vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
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

onMounted(fetchAllReviews);
</script>

<template>
  <div class="flex flex-col min-h-screen bg-base-100">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-black text-base-content tracking-tight">Phản hồi & Đánh giá</h1>
          <p class="text-gray-500 mt-1">Tổng hợp ý kiến từ cộng đồng độc giả Ebookshelf</p>
        </div>
        <div class="badge badge-lg badge-neutral p-4 font-bold">{{ reviews.length }} nhận xét</div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="reviews.length === 0" class="flex flex-col items-center justify-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
        <div class="text-6xl mb-4 opacity-20">💬</div>
        <p class="text-xl font-medium opacity-50">Chưa có phản hồi nào từ độc giả</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="review in reviews" :key="review._id" 
             class="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all group rounded-3xl overflow-hidden">
          
          <div class="p-6">
            <!-- Header: User & Rating -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="avatar placeholder">
                  <div class="bg-primary text-primary-content rounded-full w-10 ring ring-primary ring-offset-base-100 ring-offset-2">
                    <span class="font-bold">{{ (review.username || "U").charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
                <div>
                  <h4 class="font-black text-base-content leading-none">{{ review.username || "Người dùng ẩn" }}</h4>
                  <span class="text-[10px] text-gray-400 mt-1 block">{{ new Date(review.createdAt).toLocaleDateString('vi-VN') }}</span>
                </div>
              </div>
              <div class="flex text-yellow-400">
                <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" 
                     :class="i <= review.rating ? 'fill-current' : 'fill-gray-200'" 
                     class="h-4 w-4" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>

            <!-- Context: Book Title -->
            <div class="mb-4">
               <RouterLink :to="review.book_id ? '/book/' + review.book_id._id : '#'" 
                           class="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors">
                  Sách: {{ review.book_id?.title || 'Đã bị xóa' }}
               </RouterLink>
            </div>

            <!-- Comment -->
            <p class="text-gray-600 italic leading-relaxed line-clamp-4 min-h-[5rem]">
              "{{ review.comment }}"
            </p>

            <!-- Footer: Delete if Staff -->
            <div v-if="role === 'staff'" class="mt-6 pt-4 border-t border-base-200 flex justify-end">
              <button @click="deleteReview(review._id)" class="btn btn-error btn-sm btn-ghost text-red-600 hover:bg-red-50">
                Xóa nhận xét
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
