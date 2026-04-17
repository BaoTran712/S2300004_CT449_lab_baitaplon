<template>
  <div class="flex flex-col min-h-screen transition-all">
    <Header></Header>
    <div class="hero flex-grow bg-[url(/images/t2_sach_2.jpg)] transition-all duration-300">
      <div class=" hero-overlay backdrop-brightness-60 backdrop-blur-xs"></div>
      <div class="hero-content text-neutral-content text-center py-24">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">CTU Ebookshelf <br /> Kệ sách điện tử</h1>
          <p class="text-2xl my-8">
            Kết nối dễ dàng với kho tàng kiến thức.
          </p>
          <RouterLink to="/books" class="shadow font-bold text-base btn btn-lg hover:underline hover:shadow-md animate-bounce mt-4">Truy
            cập
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Flash Sale Section -->
    <div v-if="flashSaleBooks.length > 0" class="w-full bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 py-12 relative overflow-hidden shadow-inner">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col md:flex-row items-center justify-between mb-8">
          <div class="text-white text-4xl md:text-5xl font-extrabold flex items-center gap-4 mb-4 md:mb-0 drop-shadow-lg uppercase tracking-tight">
            <span class="animate-pulse text-yellow-300 text-5xl">⚡</span>
            Khuyến mãi Chớp Nhoáng
          </div>
          <div>
            <RouterLink to="/books" class="btn btn-outline text-white border-white hover:bg-white hover:text-red-600 font-bold drop-shadow">Xem tất cả >></RouterLink>
          </div>
        </div>

        <div class="carousel carousel-center w-full p-4 space-x-6 bg-white/5 rounded-3xl cursor-grab active:cursor-grabbing pb-10">
          <div v-for="book in flashSaleBooks" :key="book._id" class="carousel-item w-72 sm:w-64 md:w-72">
            <div class="w-full transform transition hover:-translate-y-2 hover:shadow-2xl duration-300 rounded-2xl overflow-hidden bg-white shadow-xl">
              <BookCard :book="book" :showInfo="false" />
            </div>
          </div>
        </div>
        <div class="text-center mt-4 text-white/50 text-xs italic">
          << Vuốt hoặc kéo để xem thêm ưu đãi >>
        </div>

      </div>
    </div>
    <!-- End Flash Sale Section -->

    <Footer></Footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import BookCard from '../components/BookCard.vue';
import BookService from '../services/book.service';

const bookService = new BookService();
const flashSaleBooks = ref([]);

const fetchFlashSaleBooks = async () => {
  try {
    const response = await bookService.getAllBooks();
    const now = new Date().getTime();
    
    flashSaleBooks.value = response.filter(book => {
      if (!book.flash_sale_end_time || !book.flash_sale_price) return false;
      const endTime = new Date(book.flash_sale_end_time).getTime();
      return endTime > now;
    }).slice(0, 30); // display up to 30 flash sale books in carousel
    
  } catch (error) {
    console.error(error);
  }
};

let timerInterval = null;
onMounted(() => {
  fetchFlashSaleBooks();
  // Auto-refresh the list occasionally just in case sales expire while idle
  timerInterval = setInterval(fetchFlashSaleBooks, 60000); 
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

</script>