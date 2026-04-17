<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import BookForm from '../components/BookForm.vue';
import BookService from "../services/book.service";
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { push } from 'notivue';

const bookService = new BookService();
const router = useRouter();
const route = useRoute();
const book_id = route.params.id;
const book = ref(null);
const role = computed(() => localStorage.getItem("role"));
const loading = ref(false);

const fetchBook = async () => {
    try {
        book.value = await bookService.getBook(book_id);
    } catch (error) {
        console.log(error);
        push.error("Không thể tải thông tin sách");
    }
};

const handleUpdateBook = async (payload) => {
    loading.value = true;
    try {
        await bookService.updateBook(book_id, payload);
        push.success("Cập nhật sách thành công");
        router.push("/books");
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi cập nhật sách");
    } finally {
        loading.value = false;
    }
};

const handleDeleteBook = async () => {
    try {
        if (confirm("Xác nhận xóa sách?")) {
            await bookService.deleteBook(book_id);
            push.success("Xóa sách thành công");
            router.push("/books");
        }
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi xóa sách");
    }
};

onMounted(() => {
    if (role.value !== "staff") {
        router.push("/");
    }
    fetchBook();
});
</script>

<template>
    <div class="flex flex-col min-h-screen bg-base-100">
        <Header></Header>
        <div class="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
            <div v-if="book" class="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-base-200">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-4">
                        <div class="bg-info/10 p-4 rounded-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-black text-neutral">Cập nhật sách</h1>
                            <p class="text-xs text-gray-400 font-mono mt-1">ID: {{ book_id }}</p>
                        </div>
                    </div>
                    <button @click="handleDeleteBook" class="btn btn-error btn-outline btn-sm rounded-xl">Xóa sách</button>
                </div>

                <BookForm 
                    :initialData="book"
                    submitLabel="Lưu các thay đổi" 
                    :loading="loading"
                    @submit="handleUpdateBook" 
                    @cancel="router.push('/books')" 
                />
            </div>
            <div v-else class="py-20">
                <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>