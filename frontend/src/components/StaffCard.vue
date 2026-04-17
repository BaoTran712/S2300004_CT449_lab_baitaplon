<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
    staff: {
        type: Object,
        required: true
    }
});

const goToEditStaff = (staff_id) => {
    router.push({ name: "staffprofile.edit", params: { id: staff_id } });
};
</script>

<template>
  <div class="flex flex-col shadow rounded-2xl overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all bg-base-100 border border-base-200">
    <!-- Avatar Section -->
    <div class="flex flex-col items-center gap-3 p-8 bg-gradient-to-b from-secondary/5 to-transparent">
      <div class="avatar online">
        <div class="w-24 h-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-4 shadow-xl">
          <img :src="staff.avatar || 'https://i.pravatar.cc/150?u=' + (staff.username || 'staff')" alt="Avatar" />
        </div>
      </div>
      <div class="text-center mt-2">
        <h3 class="text-2xl font-black text-base-content leading-tight">{{ staff.name }}</h3>
        <span class="badge badge-secondary badge-sm font-bold uppercase tracking-tight">{{ staff.role }}</span>
      </div>
    </div>

    <!-- Details Section -->
    <div class="p-6 pt-0 flex-grow">
      <div class="divide-y divide-base-200 text-sm">
        <div class="flex justify-between py-3">
          <span class="font-bold text-gray-400 uppercase text-[10px]">Tên đăng nhập</span>
          <span class="font-medium text-base-content">{{ staff.username }}</span>
        </div>
        <div class="flex justify-between py-3">
          <span class="font-bold text-gray-400 uppercase text-[10px]">Điện thoại</span>
          <span class="font-medium text-base-content">{{ staff.phone }}</span>
        </div>
        <div class="flex flex-col gap-1 py-3 border-b border-base-200">
          <span class="font-bold text-gray-400 uppercase text-[10px]">Địa chỉ</span>
          <span class="font-medium text-base-content line-clamp-2 italic">{{ staff.address }}</span>
        </div>
      </div>
      
      <button @click="goToEditStaff(staff._id)" class="btn btn-secondary btn-outline btn-sm w-full mt-6 rounded-xl hover:shadow-lg transition-all">
        Sửa thông tin nhân viên
      </button>
    </div>
  </div>
</template>