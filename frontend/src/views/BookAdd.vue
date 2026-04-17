<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import BookForm from '../components/BookForm.vue';
import BookService from "../services/book.service";
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { push } from 'notivue';

const bookService = new BookService();
const router = useRouter();
const role = computed(() => localStorage.getItem("role"));
const loading = ref(false);

const handleCreateBook = async (payload) => {
  loading.value = true;
  try {
    await bookService.createBook(payload);
    push.success("Thêm sách thành công");
    router.push("/books");
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi thêm sách");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (role.value !== "staff") {
    router.push("/");
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-base-100">
    <Header></Header>
    <div class="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
      <div class="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-base-200">
          <div class="flex items-center gap-4 mb-8">
            <div class="bg-primary/10 p-4 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-black text-neutral">Thêm mới sách</h1>
              <p class="text-sm text-gray-500 italic">Nhập đầy đủ thông tin để đưa sách lên kệ</p>
            </div>
          </div>

          <BookForm 
            submitLabel="Thêm sách ngay" 
            :loading="loading"
            @submit="handleCreateBook" 
            @cancel="router.push('/books')" 
          />
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>