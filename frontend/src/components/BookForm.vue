<script setup>
import { ref, onMounted, watch } from 'vue';
import { useForm, useField } from "vee-validate";
import { bookSchema } from '../validations/book.validation';
import PublisherService from '../services/publisher.service';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  submitLabel: {
    type: String,
    default: "Lưu thay đổi"
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["submit", "cancel"]);

const publisherService = new PublisherService();
const publishers = ref([]);

const { handleSubmit, resetForm } = useForm({
  validationSchema: bookSchema,
  initialValues: {
    title: props.initialData.title || "",
    author: props.initialData.author || "",
    price: props.initialData.price || undefined,
    published_year: props.initialData.published_year || undefined,
    quantity: props.initialData.quantity || undefined,
    publisher_id: props.initialData.publisher_id?._id || props.initialData.publisher_id || "",
    image: props.initialData.image || "",
    description: props.initialData.description || "",
    preview_chapter: props.initialData.preview_chapter || "",
    flash_sale_price: props.initialData.flash_sale_price || undefined,
    flash_sale_end_time: props.initialData.flash_sale_end_time ? new Date(props.initialData.flash_sale_end_time).toISOString().slice(0, 16) : undefined
  }
});

const { value: title, errorMessage: titleError } = useField("title");
const { value: author, errorMessage: authorError } = useField("author");
const { value: price, errorMessage: priceError } = useField("price");
const { value: published_year, errorMessage: published_yearError } = useField("published_year");
const { value: publisher_id, errorMessage: publisher_idError } = useField("publisher_id");
const { value: quantity, errorMessage: quantityError } = useField("quantity");
const { value: image, errorMessage: imageError } = useField("image");
const { value: description, errorMessage: descriptionError } = useField("description");
const { value: preview_chapter, errorMessage: preview_chapterError } = useField("preview_chapter");

const isFlashSale = ref(!!props.initialData.flash_sale_price);
const { value: flash_sale_price, errorMessage: flashSalePriceError } = useField("flash_sale_price");
const { value: flash_sale_end_time, errorMessage: flashSaleEndTimeError } = useField("flash_sale_end_time");

const fetchPublishers = async () => {
  try {
    publishers.value = await publisherService.getAllPublishers();
  } catch (error) {
    console.error("Lỗi khi tải NXB:", error);
  }
};

const onSubmit = handleSubmit((values) => {
  const payload = { ...values };
  if (!isFlashSale.value) {
    delete payload.flash_sale_price;
    delete payload.flash_sale_end_time;
  }
  emit("submit", payload);
});

// Watch for initialData changes (useful for Modals)
watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    isFlashSale.value = !!newData.flash_sale_price;
    resetForm({
      values: {
        title: newData.title || "",
        author: newData.author || "",
        price: newData.price || undefined,
        published_year: newData.published_year || undefined,
        quantity: newData.quantity || undefined,
        publisher_id: newData.publisher_id?._id || newData.publisher_id || "",
        image: newData.image || "",
        description: newData.description || "",
        preview_chapter: newData.preview_chapter || "",
        flash_sale_price: newData.flash_sale_price || undefined,
        flash_sale_end_time: newData.flash_sale_end_time ? new Date(newData.flash_sale_end_time).toISOString().slice(0, 16) : undefined
      }
    });
  }
}, { deep: true });

onMounted(fetchPublishers);
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label font-bold text-xs uppercase text-gray-400" for="title">Tựa sách</label>
        <input v-model="title" type="text" class="input input-bordered" id="title" placeholder="Nhập tựa sách" />
        <span class="text-xs text-red-500 mt-1">{{ titleError }}</span>
      </div>

      <div class="form-control">
        <label class="label font-bold text-xs uppercase text-gray-400" for="author">Tác giả</label>
        <input v-model="author" type="text" class="input input-bordered" id="author" placeholder="Nhập tác giả" />
        <span class="text-xs text-red-500 mt-1">{{ authorError }}</span>
      </div>

      <div class="form-control">
        <label class="label font-bold text-xs uppercase text-gray-400" for="publisher">Nhà xuất bản</label>
        <select v-model="publisher_id" class="select select-bordered" id="publisher">
          <option disabled value="">Chọn nhà xuất bản</option>
          <option v-for="pub in publishers" :key="pub._id" :value="pub._id">{{ pub.name }}</option>
        </select>
        <span class="text-xs text-red-500 mt-1">{{ publisher_idError }}</span>
      </div>

      <div class="form-control">
        <label class="label font-bold text-xs uppercase text-gray-400" for="published_year">Năm xuất bản</label>
        <input v-model="published_year" type="number" class="input input-bordered" id="published_year" placeholder="VD: 2024" />
        <span class="text-xs text-red-500 mt-1">{{ published_yearError }}</span>
      </div>

      <div class="form-control">
        <label class="label font-bold text-xs uppercase text-gray-400" for="price">Đơn giá (VNĐ)</label>
        <input v-model="price" type="number" class="input input-bordered" id="price" placeholder="Nhập giá" />
        <span class="text-xs text-red-500 mt-1">{{ priceError }}</span>
      </div>

      <div class="form-control">
        <label class="label font-bold text-xs uppercase text-gray-400" for="quantity">Số lượng</label>
        <input v-model="quantity" type="number" class="input input-bordered" id="quantity" placeholder="Nhập số lượng" />
        <span class="text-xs text-red-500 mt-1">{{ quantityError }}</span>
      </div>
    </div>

    <div class="form-control">
      <label class="label font-bold text-xs uppercase text-gray-400" for="image">URL Ảnh bìa</label>
      <input v-model="image" type="text" class="input input-bordered" id="image" placeholder="https://..." />
      <span class="text-xs text-red-500 mt-1">{{ imageError }}</span>
      <div v-if="image" class="mt-2 w-20 h-28 rounded shadow-sm overflow-hidden border">
        <img :src="image" class="w-full h-full object-cover" alt="Preview">
      </div>
    </div>

    <div class="form-control">
      <label class="label font-bold text-xs uppercase text-gray-400" for="description">Mô tả / Review ngắn</label>
      <textarea v-model="description" class="textarea textarea-bordered h-24" id="description" placeholder="Tóm tắt nội dung..."></textarea>
      <span class="text-xs text-red-500 mt-1">{{ descriptionError }}</span>
    </div>

    <div class="form-control">
      <label class="label font-bold text-xs uppercase text-gray-400" for="preview_chapter">Nội dung đọc thử</label>
      <textarea v-model="preview_chapter" class="textarea textarea-bordered h-48 font-serif" id="preview_chapter" placeholder="Dán nội dung chương 1..."></textarea>
      <span class="text-xs text-red-500 mt-1">{{ preview_chapterError }}</span>
    </div>

    <!-- Flash Sale Section -->
    <div class="bg-warning/5 p-4 rounded-2xl border border-warning/20">
      <label class="label cursor-pointer justify-start gap-4">
        <input type="checkbox" v-model="isFlashSale" class="toggle toggle-warning" />
        <span class="font-bold text-warning text-sm uppercase">⚡ Cấu hình Flash Sale</span>
      </label>
      
      <div v-if="isFlashSale" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in duration-300">
        <div class="form-control">
          <label class="label text-xs font-semibold" for="fs_price">Giá Flash Sale</label>
          <input v-model="flash_sale_price" type="number" class="input input-bordered input-sm" id="fs_price" />
          <span class="text-xs text-red-500 mt-1">{{ flashSalePriceError }}</span>
        </div>
        <div class="form-control">
          <label class="label text-xs font-semibold" for="fs_time">Kết thúc lúc</label>
          <input v-model="flash_sale_end_time" type="datetime-local" class="input input-bordered input-sm" id="fs_time" />
          <span class="text-xs text-red-500 mt-1">{{ flashSaleEndTimeError }}</span>
        </div>
      </div>
    </div>

    <div class="flex gap-2 pt-6">
      <button type="submit" class="btn btn-primary flex-grow" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner"></span>
        {{ submitLabel }}
      </button>
      <button type="button" @click="emit('cancel')" class="btn btn-ghost">Hủy</button>
    </div>
  </form>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
