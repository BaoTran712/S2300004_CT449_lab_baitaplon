<template>
  <div class="flex flex-col min-h-screen relative transition-all bg-[#0a0f16] bg-[url('/images/t2_sach_2.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
    
    <!-- Dark overlay to ensure text remains readable -->
    <div class="fixed inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none z-0"></div>

    <Header class="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10"></Header>
    
    <div class="relative z-10">
        <!-- Hero Section -->
        <div class="hero min-h-[calc(100vh-4rem)] relative overflow-hidden">
        <div class="hero-content text-neutral-content text-center flex flex-col justify-center items-center h-full w-full animate-fade-in-up">
            <div class="max-w-2xl px-4 py-20 md:py-0">
            <h1 class="text-7xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CTU Ebookshelf</h1>
            <h2 class="text-3xl md:text-4xl font-bold mb-6 text-primary drop-shadow-lg">Kệ sách điện tử</h2>
            <p class="text-xl md:text-2xl mt-4 mb-10 text-gray-300 font-light italic">
                Kết nối dễ dàng với kho tàng kiến thức.
            </p>
            <RouterLink to="/books" class="btn btn-primary btn-lg rounded-full px-12 text-white font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-all border-none">
                Truy cập ngay
            </RouterLink>
            </div>
        </div>
        <!-- Scroll indicator -->
        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-10 hidden md:block" @click="scrollToFeatured">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white/50 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </div>
        </div>

        <!-- Featured Books Section -->
        <section ref="featuredRef" class="py-24 bg-white/5 backdrop-blur-sm px-4 md:px-8 lg:px-16 fade-in-section" :class="{ 'is-visible': isFeaturedVisible }">
        <div class="container mx-auto">
            <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-wider relative inline-block">
                Sách Nổi Bật Trong Tuần
                <span class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary),0.5)]"></span>
            </h2>
            </div>
            
            <div v-if="loading" class="flex justify-center my-20">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <BookCard v-for="book in featuredBooks" :key="book._id" :book="book" viewType="grid" class="bg-base-100/10 backdrop-blur-md border border-white/10" />
            </div>
        </div>
        </section>

        <!-- More Books Section -->
        <section ref="moreBooksRef" class="py-24 bg-black/20 backdrop-blur-sm px-4 md:px-8 lg:px-16 fade-in-section" :class="{ 'is-visible': isMoreBooksVisible }">
        <div class="container mx-auto">
            <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div class="text-center md:text-left">
                <h2 class="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">Khám Phá Sách Khác</h2>
                <p class="text-gray-400 italic mt-2">Hàng ngàn tri thức đang chờ bạn phía trước...</p>
            </div>
            <RouterLink to="/books" class="btn btn-outline btn-primary rounded-full px-8 hover:-translate-y-1 transition-transform">
                Xem Tất Cả Sách
            </RouterLink>
            </div>
            
            <div v-if="loading" class="flex justify-center my-20">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <BookCard v-for="book in moreBooks" :key="book._id" :book="book" viewType="grid" class="bg-base-100/10 backdrop-blur-md border border-white/10" />
            </div>
        </div>
        </section>

        <!-- Rules Section -->
        <section class="py-24 bg-white/5 backdrop-blur-md px-4 md:px-8 lg:px-16 border-y border-white/5">
            <div class="container mx-auto max-w-4xl">
                <div class="flex flex-col md:flex-row items-center gap-12">
                    <div class="w-full md:w-1/3 text-center">
                        <div class="text-8xl mb-4 opacity-50 drop-shadow-2xl">📜</div>
                        <h3 class="text-2xl font-black text-white uppercase tracking-tighter">Quy định chung</h3>
                    </div>
                    <div class="w-full md:w-2/3 space-y-4">
                        <p class="text-lg text-gray-300 leading-relaxed font-medium">
                            Chào mừng bạn đến với CTU Ebookshelf. Để đảm bảo quyền lợi cho cộng đồng độc giả, quý khách vui lòng tuân thủ các quy định sau: 
                        </p>
                        <ul class="space-y-3 text-gray-400">
                            <li class="flex items-center gap-3">
                                <span class="badge badge-primary badge-xs"></span> 
                                Mỗi tài khoản được mượn tối đa 10 cuốn sách cùng lúc.
                            </li>
                            <li class="flex items-center gap-3">
                                <span class="badge badge-primary badge-xs"></span> 
                                Thời gian mượn tiêu chuẩn là 14 ngày, có thể gia hạn linh hoạt.
                            </li>
                            <li class="flex items-center gap-3">
                                <span class="badge badge-primary badge-xs"></span> 
                                Vui lòng giữ gìn sách (file điện tử) cẩn thận, không chia sẻ trái phép.
                            </li>
                            <li class="flex items-center gap-3">
                                <span class="badge badge-primary badge-xs"></span> 
                                Các trường hợp quá hạn sẽ bị tạm khóa chức năng mượn mới.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Promo Section -->
        <section ref="promoRef" class="py-24 bg-transparent text-white relative overflow-hidden fade-in-section" :class="{ 'is-visible': isPromoVisible }">
        <div class="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
            <div class="flex flex-col md:flex-row items-center justify-between gap-16">
            
            <div class="w-full md:w-1/2 space-y-8 text-center md:text-left">
                <div class="inline-block px-5 py-1.5 rounded-full bg-primary/20 text-primary font-bold text-sm tracking-widest uppercase shadow-sm border border-primary/20">
                ✨ Ưu đãi đặc quyền
                </div>
                <h2 class="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Gia nhập ngay <br/> cộng đồng Ebookshelf
                </h2>
                <p class="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                Mượn sách hoàn toàn miễn phí, tham gia bình luận và chia sẻ với hàng ngàn sinh viên Đại Học Cần Thơ. Một tài khoản mở ra vô vàn chân trời mới!
                </p>
                <div class="pt-4">
                <RouterLink to="/user/register" class="btn btn-primary btn-lg rounded-full text-white font-bold px-12 shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all border-none">
                    Đăng Ký Miễn Phí
                </RouterLink>
                </div>
            </div>
            
            <div class="w-full md:w-1/2 flex justify-center perspective-1000">
                <div class="relative w-full max-w-lg transform md:rotate-3 hover:rotate-0 transition-all duration-700 hover:scale-105">
                <div class="absolute -inset-2 bg-gradient-to-tr from-primary to-accent rounded-3xl blur-xl opacity-40 animate-pulse pointer-events-none"></div>
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Students reading" class="relative rounded-[2rem] shadow-2xl object-cover h-[350px] md:h-[450px] w-full border border-white/10" />
                </div>
            </div>

            </div>
        </div>
        </section>

        <Footer class="relative z-10 bg-black/60 backdrop-blur-xl border-t border-white/5"></Footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import BookCard from '../components/BookCard.vue';
import BookService from '../services/book.service';

const bookService = new BookService();
const allBooks = ref([]);
const featuredBooks = ref([]);
const moreBooks = ref([]);
const loading = ref(true);

const fetchBooks = async () => {
  try {
    loading.value = true;
    const response = await bookService.getAllBooks();
    allBooks.value = response;
    
    if (response.length > 0) {
      // Pick random 12 books to display (4 featured, 8 more)
      const shuffled = [...response].sort(() => 0.5 - Math.random());
      featuredBooks.value = shuffled.slice(0, 4);
      moreBooks.value = shuffled.slice(4, 12);
    }
  } catch (error) {
    console.error("Lỗi khi tải sách: ", error);
  } finally {
    loading.value = false;
  }
};

// Scroll references for animation
const featuredRef = ref(null);
const moreBooksRef = ref(null);
const promoRef = ref(null);

const isFeaturedVisible = ref(false);
const isMoreBooksVisible = ref(false);
const isPromoVisible = ref(false);

const scrollToFeatured = () => {
  if (featuredRef.value) {
    featuredRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

let observer = null;

onMounted(() => {
  fetchBooks();
  
  // Custom simple intersection observer for fade-in animations on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target === featuredRef.value) isFeaturedVisible.value = true;
        if (entry.target === moreBooksRef.value) isMoreBooksVisible.value = true;
        if (entry.target === promoRef.value) isPromoVisible.value = true;
        
        // Once visible, stop observing
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // We need to wait a tick for DOM refs to hydrate
  setTimeout(() => {
    if (featuredRef.value) observer.observe(featuredRef.value);
    if (moreBooksRef.value) observer.observe(moreBooksRef.value);
    if (promoRef.value) observer.observe(promoRef.value);
  }, 100);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
/* Scroll Animation Classes */
.fade-in-section {
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.fade-in-section.is-visible {
  opacity: 1;
  transform: none;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.perspective-1000 {
  perspective: 1000px;
}
</style>