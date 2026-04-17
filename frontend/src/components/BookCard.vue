<script setup>
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from 'vue';
import PublisherService from "../services/publisher.service";
import BookService from "../services/book.service";
import ReviewService from "../services/review.service";
import { push } from "notivue";
import { onUnmounted } from 'vue';

const role = computed(() => localStorage.getItem("role"));
const router = useRouter();
const publisherService = new PublisherService();
const bookService = new BookService();
const reviewService = new ReviewService();

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  viewType: {
    type: String,
    default: "grid" // 'grid' or 'list'
  }
});
// ... (rest of the script remains same)

const title = ref("");
const loading = ref(true);

const reviews = ref([]);
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.value.length).toFixed(1);
});

const fetchReviews = async () => {
  try {
    if (props.book?._id) {
       reviews.value = await reviewService.getReviewsByBookId(props.book._id);
    }
  } catch (e) {
    // Ignore error for non-critical ratings load
  }
};

const isFlashSaleActive = ref(false);
const timeLeft = ref("");
let timerInterval = null;

const updateFlashSale = () => {
  if (!props.book?.flash_sale_end_time || !props.book?.flash_sale_price) {
    isFlashSaleActive.value = false;
    return;
  }
  const now = new Date().getTime();
  const endTime = new Date(props.book.flash_sale_end_time).getTime();
  const distance = endTime - now;

  if (distance < 0) {
    isFlashSaleActive.value = false;
    timeLeft.value = "";
    clearInterval(timerInterval);
    return;
  }

  isFlashSaleActive.value = true;
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  timeLeft.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

onMounted(() => {
  updateFlashSale();
  timerInterval = setInterval(updateFlashSale, 1000);
  fetchReviews();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const goToBorrowBook = (book_id) => {
  if (props.book?.quantity <= 0) {
    push.error("Không thể mượn sách do sách đã hết");
  }
  else {
    router.push({ name: "borrow.add", params: { id: book_id } });
  }
};

const goToEditBook = (book_id) => {
  router.push({ name: "book.edit", params: { id: book_id } });
};

const goToDetail = (book_id) => {
  router.push({ name: "book.detail", params: { id: book_id } });
};

</script>

<template>
  <!-- Grid Layout (Default) -->
  <div v-if="viewType === 'grid'" class="flex flex-col h-full shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white border border-base-200">
    <div class="h-64 w-full relative group overflow-hidden cursor-pointer" @click="goToDetail(props.book?._id)">
      <div v-if=" loading " class="skeleton h-full w-full object-cover"></div>
      <img alt="Book cover" @load="loading = false" :class=" { 'opacity-0': loading } "
        :src=" props.book?.image || `https://images.unsplash.com/photo-1543004218-2c4cc8ea131c?auto=format&fit=crop&q=80&w=800` "
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button v-if="role !== 'staff'" @click.stop=" goToBorrowBook( props.book?._id )" class="btn btn-primary btn-sm shadow-xl rounded-full px-6">Mượn ngay</button>
        <button v-else @click.stop="goToDetail(props.book?._id)" class="btn btn-white btn-sm shadow-xl rounded-full px-6">Xem chi tiết</button>
      </div>

      <div v-if="isFlashSaleActive" class="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl flex flex-col items-center border border-red-400 backdrop-blur-sm bg-opacity-90">
        <span class="flex items-center gap-1">⚡ FLASH SALE</span>
        <span class="text-[10px] font-mono">{{ timeLeft }}</span>
      </div>
    </div>

    <div class="p-6 flex flex-col flex-grow bg-white">
      <template v-if=" role !== 'staff' ">
        <div class="mb-4">
          <h3 class="text-xl font-black text-gray-900 leading-tight mb-2 hover:text-primary transition-colors cursor-pointer capitalize line-clamp-2 min-h-[3rem]" @click="goToDetail(book._id)">
            {{ book.title }}
          </h3>
          <p v-if="showInfo" class="text-sm text-gray-500 italic mb-2">
            {{ book.author }} <span class="mx-1">|</span> {{ book.published_year }}
          </p>
          <div v-if="showInfo" class="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 drop-shadow-sm text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
             </svg>
             <span class="text-xs font-bold text-gray-800">{{ averageRating > 0 ? averageRating : 'Chưa có' }}</span>
             <span v-if="averageRating > 0" class="text-[10px] text-gray-400 font-medium">({{ reviews.length }})</span>
          </div>
        </div>

        <div class="mt-auto flex items-center justify-between">
          <div class="flex flex-col">
             <template v-if="isFlashSaleActive">
                <span class="text-xs line-through text-gray-400">{{ `${ book.price.toLocaleString() }đ` }}</span>
                <span class="text-2xl font-black text-red-600">{{ `${ book.flash_sale_price.toLocaleString() }đ` }}</span>
             </template>
             <span v-else class="text-2xl font-black text-primary">{{ `${ book.price.toLocaleString() }đ` }}</span>
          </div>
          
          <div class="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter" :class="{
             'bg-emerald-100 text-emerald-700': book.quantity >= 15,
             'bg-red-100 text-red-700': book.quantity < 15 && book.quantity > 0,
             'bg-gray-100 text-gray-700': book.quantity === 0
          }">
            {{ book.quantity > 0 ? `Còn ${book.quantity}` : 'Hết hàng' }}
          </div>
        </div>
        
        <div class="mt-4 flex flex-col gap-2">
           <button @click="goToDetail(book._id)" class="btn btn-primary btn-sm w-full rounded-xl">Xem chi tiết</button>
        </div>
      </template>

      <template v-else>
        <dl class="text-xs space-y-2 mb-4 flex-grow">
          <div class="flex justify-between border-b border-gray-100 pb-2">
            <dt class="font-semibold text-gray-400 uppercase tracking-widest text-[9px]">Tựa sách</dt>
            <dd class="text-right font-black truncate max-w-[150px]">{{ book.title }}</dd>
          </div>
          <div class="flex justify-between border-b border-gray-100 pb-2">
            <dt class="font-semibold text-gray-400 uppercase tracking-widest text-[9px]">Tác giả</dt>
            <dd class="text-right truncate max-w-[150px]">{{ book.author }}</dd>
          </div>
          <div class="flex justify-between border-b border-gray-100 pb-2">
            <dt class="font-semibold text-gray-400 uppercase tracking-widest text-[9px]">Năm/NXB</dt>
            <dd class="text-right">{{ book.published_year }} / {{ book.publisher_id?.name || '---' }}</dd>
          </div>
          <div class="flex justify-between font-black pt-2 text-primary text-sm">
            <dt>Giá</dt>
            <dd>{{ book.price.toLocaleString() }}đ</dd>
          </div>
        </dl>

        <div class="mt-auto flex flex-col gap-2">
          <button @click=" goToEditBook( props.book?._id )" class="btn btn-outline btn-info btn-xs w-full rounded-lg">Cập nhật</button>
          <button @click=" goToBorrowBook( props.book?._id )" class="btn btn-neutral btn-xs w-full rounded-lg" :disabled="book.quantity <= 0">Mượn sách</button>
        </div>
      </template>
    </div>
  </div>

  <!-- List Layout (Horizontal) -->
  <div v-else class="flex flex-col md:flex-row bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all border border-base-200 group">
    <!-- Image Area -->
    <div class="w-full md:w-48 h-48 relative overflow-hidden flex-shrink-0 cursor-pointer" @click="goToDetail(book._id)">
       <img :src="book.image || 'https://images.unsplash.com/photo-1543004218-2c4cc8ea131c?auto=format&fit=crop&q=80&w=800'" 
            class="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Book cover" />
       <div v-if="isFlashSaleActive" class="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-lg">⚡ FLASH</div>
    </div>

    <!-- Content Area -->
    <div class="p-6 flex flex-col md:flex-row flex-grow gap-6">
       <!-- Primary Info -->
       <div class="flex flex-col flex-grow min-w-0">
          <div class="flex items-center gap-2 mb-1">
             <span class="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Sách {{ book.published_year }}</span>
             <span class="text-[10px] uppercase font-bold text-gray-500">{{ book.publisher_id?.name }}</span>
          </div>
          <h3 class="text-2xl font-black text-neutral line-clamp-1 group-hover:text-primary transition-colors hover:cursor-pointer" @click="goToDetail(book._id)">{{ book.title }}</h3>
          <p class="text-gray-500 font-medium italic mt-1">{{ book.author }}</p>
          <div class="flex items-center gap-1.5 mt-2 opacity-90 hover:opacity-100 transition-opacity">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 drop-shadow-sm text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
             </svg>
             <span class="font-bold text-gray-800">{{ averageRating > 0 ? averageRating : 'Chưa có đánh giá' }}</span>
             <span v-if="averageRating > 0" class="text-xs text-gray-500 font-medium ml-1">({{ reviews.length }} nhận xét)</span>
          </div>
          <p class="text-sm text-gray-400 mt-2 line-clamp-2">{{ book.description }}</p>
       </div>

       <!-- Price & Inventory -->
       <div class="flex flex-row md:flex-col justify-between items-center md:items-end min-w-[140px] border-t md:border-t-0 md:border-l border-base-200 pt-4 md:pt-0 md:pl-6">
          <div class="flex flex-col items-center md:items-end">
             <template v-if="isFlashSaleActive">
                <span class="text-xs line-through text-gray-300">{{ book.price.toLocaleString() }}đ</span>
                <span class="text-2xl font-black text-red-600">{{ book.flash_sale_price.toLocaleString() }}đ</span>
             </template>
             <span v-else class="text-2xl font-black text-primary">{{ book.price.toLocaleString() }}đ</span>
          </div>
          <div class="badge badge-sm uppercase tracking-tighter mt-2 font-bold" :class="book.quantity > 0 ? 'badge-neutral' : 'badge-error'">
             {{ book.quantity > 0 ? `Tồn kho: ${book.quantity}` : 'Hết hàng' }}
          </div>
       </div>

       <!-- Actions -->
       <div class="flex flex-row md:flex-col gap-2 justify-center min-w-[120px]">
          <template v-if="role === 'staff'">
             <button @click="goToEditBook(book._id)" class="btn btn-outline btn-info btn-sm flex-grow rounded-xl">Chỉnh sửa</button>
             <button @click="goToBorrowBook(book._id)" class="btn btn-neutral btn-sm flex-grow rounded-xl" :disabled="book.quantity <= 0">Mượn ngay</button>
          </template>
          <template v-else>
             <button @click="goToDetail(book._id)" class="btn btn-primary btn-sm flex-grow rounded-xl px-4">Chi tiết</button>
             <button @click="goToBorrowBook(book._id)" class="btn btn-outline btn-primary btn-sm flex-grow rounded-xl px-4" :disabled="book.quantity <= 0">Mượn sách</button>
          </template>
       </div>
    </div>
  </div>
</template>