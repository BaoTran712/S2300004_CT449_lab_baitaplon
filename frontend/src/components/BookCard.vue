<script setup>
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from 'vue';
import PublisherService from "../services/publisher.service";
import BookService from "../services/book.service";
import { push } from "notivue";
import { onUnmounted } from 'vue';

const role = computed(() => localStorage.getItem("role"));
const router = useRouter();
const publisherService = new PublisherService();
const bookService = new BookService();

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  showInfo: {
    type: Boolean,
    default: true
  }
});

const title = ref("");
const loading = ref(true);

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
  <div class="flex flex-col h-full shadow rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.001] transition">

    <div class="h-64 w-full relative group overflow-hidden cursor-pointer" @click="goToDetail(props.book?._id)">
      <div v-if=" loading " class="skeleton h-full w-full object-cover"></div>
      <img alt="Book cover" @load="loading = false" :class=" { 'opacity-0': loading } "
        :src=" props.book?.image || `https://images.unsplash.com/photo-1543004218-2c4cc8ea131c?auto=format&fit=crop&q=80&w=800` "
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button v-if="role !== 'staff'" @click.stop=" goToBorrowBook( props.book?._id )" class="btn btn-primary btn-sm shadow-xl">Mượn ngay</button>
        <button v-else @click.stop="goToDetail(props.book?._id)" class="btn btn-white btn-sm shadow-xl">Xem chi tiết</button>
      </div>

      <div v-if="isFlashSaleActive" class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg flex flex-col items-center border border-red-400 backdrop-blur-sm bg-opacity-90">
        <span class="flex items-center gap-1"><span class="animate-bounce inline-block">⚡</span> FLASH SALE</span>
        <span class="text-[10px] font-mono mt-0.5">{{ timeLeft }}</span>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-4 flex flex-col flex-grow bg-white">
      <template v-if=" role !== 'staff' ">
        <!-- User View: Simplified & Modern -->
        <div class="mb-4">
          <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer capitalize">
            {{ book.title }}
          </h3>
          <p v-if="showInfo" class="text-sm text-gray-500 italic">
            {{ book.author }} <span class="mx-1">|</span> {{ book.published_year }}
          </p>
        </div>

        <div class="mt-auto flex items-center justify-between">
          <div class="flex flex-col">
             <template v-if="isFlashSaleActive">
                <span class="text-xs line-through text-gray-400">{{ `${ book.price.toLocaleString() }đ` }}</span>
                <span class="text-lg font-extrabold text-red-600">{{ `${ book.flash_sale_price.toLocaleString() }đ` }}</span>
             </template>
             <span v-else class="text-lg font-bold text-gray-900">{{ `${ book.price.toLocaleString() }đ` }}</span>
          </div>
          
          <div class="text-[10px] font-medium px-2 py-1 rounded-full" :class="{
             'bg-emerald-100 text-emerald-700': book.quantity >= 15,
             'bg-red-100 text-red-700': book.quantity < 15 && book.quantity > 0,
             'bg-gray-100 text-gray-700': book.quantity === 0
          }">
            {{ book.quantity > 0 ? `Còn ${book.quantity}` : 'Hết hàng' }}
          </div>
        </div>
        
        <!-- Minimal View Call to Action -->
        <div v-if="!showInfo" class="mt-4">
           <button @click="goToDetail(book._id)" class="btn btn-primary btn-sm w-full">Xem chi tiết</button>
        </div>
      </template>

      <template v-else>
        <!-- Staff View: Detailed & Functional -->
        <dl class="text-xs space-y-1 mb-4 flex-grow">
          <div class="flex justify-between border-b border-gray-100 pb-1">
            <dt class="font-semibold text-gray-400">Tựa sách</dt>
            <dd class="text-right font-bold truncate max-w-[120px]">{{ book.title }}</dd>
          </div>
          <div class="flex justify-between border-b border-gray-100 pb-1">
            <dt class="font-semibold text-gray-400">Tác giả</dt>
            <dd class="text-right truncate max-w-[120px]">{{ book.author }}</dd>
          </div>
          <div class="flex justify-between border-b border-gray-100 pb-1">
            <dt class="font-semibold text-gray-400">Năm/NXB</dt>
            <dd class="text-right">{{ book.published_year }} / {{ book.publisher_id?.name || '---' }}</dd>
          </div>
          <div class="flex justify-between font-bold pt-1">
            <dt>Giá</dt>
            <dd class="text-primary">{{ book.price.toLocaleString() }}đ</dd>
          </div>
        </dl>

        <div class="mt-auto flex flex-col gap-2">
          <button @click=" goToEditBook( props.book?._id )" class="btn btn-outline btn-info btn-xs w-full">Sửa thông tin</button>
          <button @click=" goToBorrowBook( props.book?._id )" class="btn btn-neutral btn-xs w-full" :disabled="book.quantity <= 0">Mượn sách</button>
        </div>
      </template>
    </div>
  </div>
</template>