<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BookService from "../services/book.service";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { push } from "notivue";

const route = useRoute();
const router = useRouter();
const bookService = new BookService();

const bookId = route.params.id;
const book = ref(null);
const loading = ref(true);

const fetchBookData = async () => {
  try {
    book.value = await bookService.getBook(bookId);
    if (!book.value.preview_chapter) {
       push.warning("Sách hiện chưa có trích đoạn đọc thử");
       router.push({ name: 'book.detail', params: { id: bookId } });
    }
  } catch (error) {
    push.error("Lỗi khi tải dữ liệu đọc thử");
    router.push({ name: 'book.detail', params: { id: bookId } });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBookData);
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#faf9f6]">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-12 max-w-4xl">
      <div v-if="loading" class="flex justify-center items-center py-20">
         <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="book" class="bg-white shadow-2xl rounded-3xl overflow-hidden border border-base-200">
         <!-- Header Section -->
         <div class="bg-neutral text-neutral-content p-8 text-center relative">
            <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>
            <h1 class="text-3xl md:text-5xl font-serif font-black mb-2 relative z-10">{{ book.title }}</h1>
            <p class="text-xl opacity-80 relative z-10">Tác giả: {{ book.author }}</p>
         </div>

         <!-- Content Body -->
         <div class="p-8 md:p-16 bg-[#fffcf5] relative">
            <div class="flex items-center justify-between mb-12 border-b border-orange-100 pb-4">
               <span class="text-base-content/50 font-bold uppercase tracking-widest text-sm">Chương 1: Trở về bản ngã</span>
               <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-400"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div class="w-3 h-3 rounded-full bg-green-400"></div>
               </div>
            </div>

            <div class="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed whitespace-pre-wrap select-none drop-shadow-sm">
{{ book.preview_chapter }}
            </div>

            <!-- Footer of reading area -->
            <div class="mt-16 pt-8 border-t border-orange-100 text-center flex flex-col items-center gap-6">
               <div class="text-gray-400 italic">... Hết trích đoạn đọc thử ...</div>
               
               <div class="flex flex-wrap justify-center gap-4">
                  <button @click="router.push({ name: 'borrow.add', params: { id: bookId } })" class="btn btn-primary btn-lg shadow-xl px-12">
                     Mượn sách ngay để đọc tiếp
                  </button>
                  <button @click="window.close()" class="btn btn-ghost btn-lg">
                     Đóng trang
                  </button>
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

.prose {
    font-size: 1.25rem;
    line-height: 2;
    text-align: justify;
}
</style>
