<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import BookService from "../services/book.service";
import ReviewService from "../services/review.service";
import { push } from "notivue";

const route = useRoute();
const router = useRouter();
const bookService = new BookService();
const reviewService = new ReviewService();

const bookId = route.params.id;
const book = ref(null);
const reviews = ref([]);
const loading = ref(true);

const user = JSON.parse(localStorage.getItem("user") || "{}");
const role = computed(() => localStorage.getItem("role"));

const newReview = ref({
  rating: 5,
  comment: ""
});

const fetchBookData = async () => {
  try {
    book.value = await bookService.getBook(bookId);
    reviews.value = await reviewService.getReviewsByBookId(bookId);
  } catch (error) {
    push.error("Lỗi khi tải thông tin sách");
    router.push({ name: "book.list" });
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  if (!newReview.value.comment.trim()) {
    push.warning("Vui lòng nhập nội dung đánh giá");
    return;
  }
  try {
    const payload = {
      book_id: bookId,
      user_id: user._id,
      username: user.username || "Người dùng",
      rating: newReview.value.rating,
      comment: newReview.value.comment
    };
    await reviewService.createReview(payload);
    push.success("Cảm ơn bạn đã đánh giá!");
    newReview.value.comment = "";
    fetchBookData(); // Refresh reviews
  } catch (error) {
    push.error("Lỗi khi gửi đánh giá");
  }
};

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.value.length).toFixed(1);
});

const goToBorrow = () => {
  if (book.value?.quantity <= 0) {
    push.error("Sách hiện tại đã hết");
    return;
  }
  router.push({ name: "borrow.add", params: { id: bookId } });
};

onMounted(fetchBookData);
</script>

<template>
  <div class="flex flex-col min-h-screen bg-base-100">
    <Header />
    
    <main class="flex-grow container mx-auto px-4 py-12">
      <div v-if="loading" class="flex justify-center items-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="book" class="flex flex-col gap-12">
        <!-- Book Header Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <!-- Left: Cover Image -->
          <div class="lg:col-span-5 xl:col-span-4">
             <div class="relative group group rounded-3xl overflow-hidden shadow-2xl border border-base-300">
                <img :src="book.image || 'https://images.unsplash.com/photo-1543004218-2c4cc8ea131c?auto=format&fit=crop&q=80&w=800'" 
                     class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" 
                     alt="Book Cover">
                <div v-if="book.flash_sale_price" class="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-xl animate-pulse">
                  Flash Sale!
                </div>
             </div>
          </div>

          <!-- Right: Basic Info -->
          <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <nav class="text-xs breadcrumbs text-gray-400 mb-2">
                <ul>
                  <li><RouterLink to="/">Trang chủ</RouterLink></li>
                  <li><RouterLink to="/books">Thư viện</RouterLink></li>
                  <li class="font-bold text-base-content">{{ book.title }}</li>
                </ul>
              </nav>
              <h1 class="text-4xl md:text-5xl font-black text-base-content leading-tight capitalize">{{ book.title }}</h1>
              <div class="flex items-center gap-4 text-lg text-gray-500 font-medium">
                <span>{{ book.author }}</span>
                <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span>{{ book.published_year }}</span>
              </div>
            </div>

            <div class="flex items-center gap-6">
               <div class="rating rating-md items-center gap-2">
                  <div class="flex text-yellow-400">
                     <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="i <= Math.round(averageRating) ? 'fill-current' : 'fill-gray-200'" class="h-6 w-6" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                  <span class="font-bold text-lg">{{ averageRating }}</span>
                  <span class="text-gray-400 text-sm">({{ reviews.length }} nhận xét)</span>
               </div>
            </div>

            <div class="divider"></div>

            <div class="flex flex-col gap-4">
               <div class="flex items-baseline gap-4">
                  <template v-if="book.flash_sale_price">
                    <span class="text-4xl font-black text-red-600">{{ book.flash_sale_price.toLocaleString() }}đ</span>
                    <span class="text-xl text-gray-400 line-through">{{ book.price.toLocaleString() }}đ</span>
                  </template>
                  <span v-else class="text-4xl font-black text-base-content">{{ book.price.toLocaleString() }}đ</span>
               </div>
               
               <p class="text-gray-600 leading-relaxed text-lg max-w-3xl">
                 {{ book.description }}
               </p>

               <div class="flex flex-wrap gap-4 mt-4">
                  <div class="badge badge-lg badge-outline py-4 px-6 border-base-300">
                    NXB: {{ book.publisher_id?.name || '---' }}
                  </div>
                  <div class="badge badge-lg badge-outline py-4 px-6 border-base-300" :class="book.quantity > 0 ? 'text-emerald-600' : 'text-red-500'">
                    Số lượng còn: {{ book.quantity }}
                  </div>
               </div>
            </div>

            <div class="flex gap-4 mt-8">
               <button @click="goToBorrow" class="btn btn-primary btn-lg px-12 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                 Mượn Sách Ngay
               </button>
               <template v-if="role === 'staff'">
                  <button @click="router.push({ name: 'book.edit', params: { id: bookId } })" class="btn btn-outline btn-lg rounded-2xl">
                    Chỉnh sửa
                  </button>
               </template>
            </div>
          </div>
        </div>

        <!-- Review Section -->
        <div class="flex flex-col gap-8 mt-12 bg-base-200 p-8 md:p-12 rounded-[3rem]">
          <h2 class="text-3xl font-black text-base-content underline decoration-primary decoration-4 underline-offset-8">Đánh giá từ độc giả</h2>
          
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <!-- Left: Review Form (Protected) -->
            <div class="flex flex-col gap-6">
              <h3 class="text-xl font-bold">Để lại đánh giá của bạn</h3>
              
              <div v-if="user._id" class="card bg-base-100 shadow-sm p-6 border border-base-300">
                <div class="form-control gap-4">
                   <div class="flex items-center gap-4">
                      <span class="font-medium">Số sao:</span>
                      <div class="rating rating-lg">
                        <input v-for="i in 5" :key="i" type="radio" :name="'rating-form'" class="mask mask-star-2 bg-yellow-400" :checked="newReview.rating === i" @change="newReview.rating = i" />
                      </div>
                   </div>
                   <textarea v-model="newReview.comment" class="textarea textarea-bordered h-32 text-lg focus:textarea-primary" placeholder="Cảm nghĩ của bạn về cuốn sách này..."></textarea>
                   <button @click="submitReview" class="btn btn-primary mt-2">Gửi nhận xét</button>
                </div>
              </div>

              <div v-else class="card bg-base-100 shadow-sm p-10 border border-base-300 items-center justify-center text-center gap-4">
                <div class="text-5xl mb-2">🔒</div>
                <p class="text-gray-500 italic">Vui lòng đăng nhập để gửi đánh giá và chia sẻ cảm nghĩ của bạn.</p>
                <RouterLink :to="{ name: 'user.login' }" class="btn btn-primary btn-outline px-8 rounded-xl">Đăng nhập ngay</RouterLink>
              </div>
            </div>
            
            <!-- Right: Reviews List -->
            <div class="flex flex-col gap-6 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
              <div v-if="reviews.length === 0" class="text-center py-10 opacity-40 italic">
                 Chưa có nhận xét nào cho cuốn sách này. Hãy là người đầu tiên!
              </div>
              <div v-else v-for="review in reviews" :key="review._id" class="card bg-base-100 p-6 shadow-sm border-l-4 border-l-primary mb-2">
                 <div class="flex justify-between items-center mb-4">
                   <div class="flex items-center gap-2">
                      <div class="avatar placeholder">
                        <div class="bg-primary text-primary-content rounded-full w-8">
                          <span>{{ (review.username || "U").charAt(0).toUpperCase() }}</span>
                        </div>
                      </div>
                      <span class="font-bold">{{ review.username || "Người dùng ẩn" }}</span>
                   </div>
                   <div class="flex text-yellow-500 scale-75">
                      <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="i <= review.rating ? 'fill-current' : 'fill-gray-200'" class="h-4 w-4" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                   </div>
                 </div>
                 <p class="text-gray-700 leading-relaxed">{{ review.comment }}</p>
                 <span class="text-[10px] text-gray-400 mt-4 text-right">{{ new Date(review.createdAt).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Policy Section -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-base-300 pt-12">
           <div class="flex flex-col gap-4 p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200">
              <div class="text-3xl text-primary">📋</div>
              <h3 class="text-xl font-bold">Quy định mượn sách</h3>
              <p class="text-sm text-gray-600">Thời gian mượn tối đa là 14 ngày. Bạn có thể gia hạn thêm 1 lần (7 ngày) nếu sách không có người đặt trước.</p>
           </div>
           <div class="flex flex-col gap-4 p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200">
              <div class="text-3xl text-primary">🔄</div>
              <h3 class="text-xl font-bold">Chính sách đổi trả</h3>
              <p class="text-sm text-gray-600">Sách mượn phải được giữ gìn nguyên vẹn. Trường hợp hư hỏng hoặc mất mát, độc giả vui lòng bồi thường theo giá trị thực tế của sách.</p>
           </div>
           <div class="flex flex-col gap-4 p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200">
              <div class="text-3xl text-primary">⚖️</div>
              <h3 class="text-xl font-bold">Phí quá hạn</h3>
              <p class="text-sm text-gray-600">Mọi trường hợp trả sách quá hạn sẽ bị tính phí 5.000đ/ngày. Tài khoản sẽ bị tạm khóa nếu quá hạn trên 30 ngày.</p>
           </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
