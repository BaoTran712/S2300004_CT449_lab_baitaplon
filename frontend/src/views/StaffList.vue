<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import InputSearch from '../components/InputSearch.vue';
import StaffCard from '../components/StaffCard.vue';
import AdminLayout from '../components/AdminLayout.vue';


import { ref, computed, onMounted } from "vue";
import StaffService from '../services/staff.service';
import { useRouter } from 'vue-router';
import { push } from 'notivue';

const staffService = new StaffService();
const router = useRouter();
const staffs = ref([]);
const searchText = ref("");
const role = computed(() => localStorage.getItem("role"));
const staff_id = computed(() => localStorage.getItem("id"));

const fetchStaffs = async () => {
  try {
    const response = await staffService.getAllStaffs();
    // debug code later
    // console.log(response);
    staffs.value = response.filter(staff => staff._id !== staff_id.value);
  } catch (error) {
    console.error(error);
    push.error("Đã có lỗi xảy ra khi hiện thị danh sách nhân viên");
  }
};

const searchFilteredStaff = computed(() => {
  if (!searchText.value) return staffs.value;

  const keyword = searchText.value.toLowerCase();

  return staffs.value.filter(staff => {
    const searchableText = [staff.name, staff.username, staff.address, staff.phone].filter(Boolean).join(' ').toLowerCase();
    return searchableText.includes(keyword);
  });
});

const goToAddStaff = () => {
  router.push({ name: "staff.add" });
};

const handleDeleteAllStaffs = async () => {
  try {
    if (confirm("Xác nhận xóa tất cả nhân viên?")) {
      const staffToDelete = staffs.value.filter(staff => staff._id !== staff_id);
      console.log(staffToDelete);
      // await staffService.deleteAllStaffs();
      push.info("Xóa tất cả nhân viên thành công");
      fetchStaffs();
    }
  } catch (error) {
    console.log(error);
    push.error("Đã xảy ra lỗi khi xóa tất cả nhân viên");
  }
};

onMounted(async () => {
  if (role.value !== "staff") {
    router.push("/");
  }
  fetchStaffs();
});
</script>

<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-black text-neutral mb-2">Quản Lý Nhân Viên</h1>
      <p class="text-gray-500">Danh sách đội ngũ nhân viên thư viện</p>
    </div>

    <div class="flex flex-col gap-8">
      <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-base-200">
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
          <div class="tooltip tooltip-right" data-tip="Họ và tên, địa chỉ, số điện thoại, tên đăng nhập">
            <InputSearch class="w-full sm:w-80" v-model=" searchText "></InputSearch>
          </div>
          <button class="btn btn-neutral hover:btn-info hover:text-white hover:scale-[1.01]"
            @click=" goToAddStaff ">+ Thêm nhân viên mới</button>
        </div>
      </div>

      <template v-if=" searchFilteredStaff.length > 0 ">
        <div class="overflow-x-auto bg-white rounded-[2.5rem] shadow-xl border border-base-200">
          <table class="table table-zebra w-full text-neutral">
            <thead class="bg-base-200/50">
              <tr class="text-neutral uppercase text-[10px] tracking-widest border-b border-base-300">
                <th class="py-5 pl-8">Nhân viên</th>
                <th>Tài khoản</th>
                <th>Liên hệ</th>
                <th>Địa chỉ</th>
                <th class="text-right pr-8">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="staff in searchFilteredStaff" :key="staff._id" class="hover:bg-base-100 transition-colors group">
                <td class="py-4 pl-8">
                  <div class="flex items-center gap-4">
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12 shadow-sm">
                        <img :src="staff.avatar || 'https://i.pravatar.cc/150?u=' + (staff.username || 'staff')" alt="Avatar" />
                      </div>
                    </div>
                    <div>
                      <div class="font-black text-neutral uppercase tracking-tighter">{{ staff.name }}</div>
                      <div class="text-[10px] font-bold text-secondary uppercase">{{ staff.role }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="font-mono text-xs opacity-70">{{ staff.username }}</span>
                </td>
                <td>
                  <div class="flex flex-col gap-0.5">
                    <span class="text-sm font-medium">{{ staff.phone }}</span>
                  </div>
                </td>
                <td>
                  <span class="text-xs italic line-clamp-1 max-w-[200px]">{{ staff.address }}</span>
                </td>
                <td class="text-right pr-8">
                  <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="router.push({ name: 'staffprofile.edit', params: { id: staff._id } })" 
                            class="btn btn-sm btn-secondary btn-ghost rounded-xl">Sửa</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <div class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-base-200">
          <p class="text-xl font-bold text-gray-400">Không tìm thấy nhân viên nào phù hợp</p>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>