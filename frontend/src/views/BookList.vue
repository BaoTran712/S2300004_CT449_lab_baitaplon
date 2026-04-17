<script setup>
import BookCard from "../components/BookCard.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import InputSearch from "../components/InputSearch.vue";

import { useRouter } from "vue-router";
import { ref, computed, onMounted, watch } from 'vue';
import BookService from '../services/book.service';
import PublisherService from '../services/publisher.service';
import { push } from "notivue";

const router = useRouter();
const bookService = new BookService();
const publisherService = new PublisherService();
const role = computed(() => localStorage.getItem("role"));

const books = ref([]);
const publishers = ref([]);
const searchText = ref("");
const selectedPublisher = ref("");
const sortKey = ref("newest");

// Pagination State
const currentPage = ref(1);
const itemsPerPage = ref(20);

const fetchBooks = async () => {
  try {
    books.value = await bookService.getAllBooks();
  } catch (error) {
    push.error("Lỗi khi tải danh sách sách");
  }
};

const fetchPublishers = async () => {
  try {
    publishers.value = await publisherService.getAllPublishers();
  } catch (error) {
    push.error("Lỗi khi tải danh sách NXB");
  }
};

const searchFilteredBooks = computed(() => {
  let result = [...books.value];

  // 1. Text Search
  if (searchText.value) {
    const kw = searchText.value.toLowerCase();
    result = result.filter(book => {
      const searchableFields = [
        book.title,
        book.author,
        book.published_year?.toString(),
        book.price?.toString(),
        book.publisher_id?.name // Include publisher name in search
      ];
      const searchableText = searchableFields.filter(Boolean).join(' ').toLowerCase();
      return searchableText.includes(kw);
    });
  }

  // 2. Publisher Filter
  if (selectedPublisher.value) {
    result = result.filter(book => book.publisher_id?._id === selectedPublisher.value || book.publisher_id === selectedPublisher.value);
  }

  // 3. Sorting
  result.sort((a, b) => {
    if (sortKey.value === 'price_asc') return a.price - b.price;
    if (sortKey.value === 'price_desc') return b.price - a.price;
    if (sortKey.value === 'year_oldest') return a.published_year - b.published_year;
    if (sortKey.value === 'year_newest') return b.published_year - a.published_year;
    if (sortKey.value === 'title_az') return a.title.localeCompare(b.title);
    return 0; // default
  });

  return result;
});

const totalPages = computed(() => Math.ceil(searchFilteredBooks.value.length / itemsPerPage.value));

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return searchFilteredBooks.value.slice(start, end);
});

// Reset page when filters change
watch([searchText, selectedPublisher, sortKey, itemsPerPage], () => {
  currentPage.value = 1;
});

const goToAddBook = () => {
  router.push({ name: "book.add" });
};

const handleDeleteAllBooks = async () => {
  try {
    if (confirm("Xác nhận xóa tất cả sách?")) {
      await bookService.deleteAllBooks();
      push.success("Xóa tất cả sách thành công");
      fetchBooks();
    }
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi xóa tất cả sách");
  }
};

onMounted(async () => {
  fetchBooks();
  fetchPublishers();
});
</script>

<template>

  <div class="flex flex-col min-h-screen overflow-hidden">

    <Header></Header>

    <div class="flex-grow container mx-auto px-4 sm:px-8 lg:px-16 my-8">
      <div class="flex flex-col gap-6">
        <!-- Toolbar: Search, Filter, Sort, Actions -->
        <div class="bg-base-200 p-4 rounded-xl shadow-sm border border-base-300 flex flex-col xl:flex-row gap-4 items-center justify-between">
          
          <!-- Left: Search & Filters -->
          <div class="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-center">
            <div class="tooltip tooltip-bottom" data-tip="Tìm theo tựa sách, tác giả, năm...">
              <InputSearch class="w-full md:w-64" v-model=" searchText " placeholder="Tìm kiếm sách..."></InputSearch>
            </div>
            
            <div class="flex gap-2 w-full md:w-auto">
              <!-- Publisher Filter -->
              <select v-model="selectedPublisher" class="select select-bordered select-sm md:select-md flex-grow md:w-48">
                <option value="">Tất cả Nhà xuất bản</option>
                <option v-for="pub in publishers" :key="pub._id" :value="pub._id">{{ pub.name }}</option>
              </select>

              <!-- Sort Option -->
              <select v-model="sortKey" class="select select-bordered select-sm md:select-md flex-grow md:w-48">
                <option value="newest">Mới nhất</option>
                <option value="year_oldest">Cũ nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="title_az">Tên: A-Z</option>
              </select>
            </div>
          </div>

          <!-- Right: Staff Actions -->
          <template v-if=" role === 'staff' ">
            <div class="flex gap-2 w-full xl:w-auto justify-end">
              <button class="btn btn-neutral btn-sm md:btn-md hover:btn-info hover:text-white" @click=" goToAddBook ">
                + Thêm sách
              </button>
              <button class="btn btn-outline btn-error btn-sm md:btn-md hover:text-white" @click=" handleDeleteAllBooks ">
                Xóa tất cả
              </button>
            </div>
          </template>
        </div>

        <!-- list books -->
        <div class="flex flex-col gap-8">
          <div v-if=" searchFilteredBooks.length > 0 " class="flex justify-between items-center text-sm opacity-60 italic px-2">
            <span>Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, searchFilteredBooks.length) }} trong tổng số {{ searchFilteredBooks.length }} cuốn sách</span>
            <div class="flex items-center gap-2">
              <span>Mỗi trang:</span>
              <select v-model=" itemsPerPage " class="select select-ghost select-xs focus:ring-0">
                <option :value=" 20 ">20</option>
                <option :value=" 50 ">50</option>
                <option :value=" 100 ">100</option>
              </select>
            </div>
          </div>

          <template v-if=" paginatedBooks.length > 0 ">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              <BookCard v-for=" book in paginatedBooks " :key=" book._id " :book=" book "></BookCard>
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-1 text-center py-20">
              <p class="font-bold opacity-30 text-xl">Không tìm thấy sách phù hợp...</p>
            </div>
          </template>

          <!-- Pagination Controls -->
          <div v-if=" totalPages > 1 " class="flex justify-center mt-12 mb-8">
            <div class="join shadow-sm border border-base-300">
              <button class="join-item btn btn-sm md:btn-md" :disabled=" currentPage === 1 " @click=" currentPage-- ">«</button>
              <button v-for=" page in totalPages " :key=" page " 
                class="join-item btn btn-sm md:btn-md"
                :class=" { 'btn-active': page === currentPage } "
                @click=" currentPage = page "
                v-show=" Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages "
              >
                {{ page }}
              </button>
              <button class="join-item btn btn-sm md:btn-md" :disabled=" currentPage === totalPages " @click=" currentPage++ ">»</button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <Footer></Footer>

  </div>
</template>