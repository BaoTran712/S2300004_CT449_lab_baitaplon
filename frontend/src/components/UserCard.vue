<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

const goToEditUser = (user_id) => {
    router.push({ name: "userprofile.edit", params: { id: user_id } });
};
</script>

<template>
  <div class="flex flex-col shadow rounded-2xl overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all bg-base-100 border border-base-200">
    <!-- Avatar Section -->
    <div class="flex flex-col items-center gap-3 p-8 bg-gradient-to-b from-primary/5 to-transparent">
      <div class="avatar online">
        <div class="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-xl">
          <img :src="user.avatar || 'https://i.pravatar.cc/150?u=' + (user.username || 'user')" alt="Avatar" />
        </div>
      </div>
      <div class="text-center mt-2">
        <h3 class="text-2xl font-black text-base-content leading-tight">{{ user.last_name }} {{ user.first_name }}</h3>
        <p class="text-xs font-bold uppercase tracking-widest text-primary opacity-70">{{ user.role }}</p>
      </div>
    </div>

    <!-- Details Section -->
    <div class="p-6 pt-0 flex-grow">
      <div class="divide-y divide-base-200 text-sm">
        <div class="flex justify-between py-3">
          <span class="font-bold text-gray-400 uppercase text-[10px]">Tên đăng nhập</span>
          <span class="font-medium text-base-content">{{ user.username }}</span>
        </div>
        <div class="flex justify-between py-3">
          <span class="font-bold text-gray-400 uppercase text-[10px]">Ngày sinh</span>
          <span class="font-medium text-base-content">{{ user.birthday ? new Date(user.birthday).toLocaleDateString('vi-VN') : '---' }}</span>
        </div>
        <div class="flex justify-between py-3">
          <span class="font-bold text-gray-400 uppercase text-[10px]">Giới tính</span>
          <span class="font-medium text-base-content">{{ user.gender ? 'Nam' : 'Nữ' }}</span>
        </div>
        <div class="flex justify-between py-3">
          <span class="font-bold text-gray-400 uppercase text-[10px]">Điện thoại</span>
          <span class="font-medium text-base-content">{{ user.phone }}</span>
        </div>
        <div class="flex flex-col gap-1 py-3">
          <span class="font-bold text-gray-400 uppercase text-[10px]">Địa chỉ</span>
          <span class="font-medium text-base-content line-clamp-2 italic">{{ user.address }}</span>
        </div>
      </div>
      
      <button @click="goToEditUser(user._id)" class="btn btn-primary btn-outline btn-sm w-full mt-6 rounded-xl hover:shadow-lg transition-all">
        Chỉnh sửa hồ sơ
      </button>
    </div>
  </div>
</template>