<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { useRouter } from 'vue-router';
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { push } from 'notivue';
import { useForm, useField } from "vee-validate";
import { staffSchema } from '../validations/staff.validation';
import StaffService from '../services/staff.service';

const route = useRoute();
const router = useRouter();
const staffService = new StaffService();
const staffEditId = route.params.id;
const staffId = computed(() => localStorage.getItem("id"));
const role = computed(() => localStorage.getItem("role"));

const { handleSubmit, resetForm } = useForm({
  validationSchema: staffSchema
});

const { value: name, errorMessage: nameError } = useField("name");
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: avatar, errorMessage: avatarError } = useField("avatar");

const handleStaffProfileEdit = handleSubmit(async (values) => {
  try {
    await staffService.updateStaff(staffEditId, values);
    push.success("Cập nhật thông tin nhân viên thành công");
    router.push("/staffs");
  } catch (error) {
    if (error.response.status === 409) {
      push.error("Tên đăng nhập đã tồn tại");
    } else {
      push.error("Đã xảy ra lỗi khi cập nhật thông tin nhân viên");
    } console.log(error);
  }
});

const handleStaffProfileDelete = async (staffId) => {
  try {
    if (confirm("Xác nhận xóa nhân viên?")) {
      await staffService.deleteStaff(staffId);
      push.success("Xóa nhân viên thành công");
      router.push("/staffs");
    }
  } catch (error) {
    push.error("Đã xảy ra lỗi khi xóa nhân viên");
  }
};

onMounted(async () => {
  if (role.value !== "staff") {
    router.push("/");
  }
  if (staffEditId !== staffId) {
    const staffData = await staffService.getStaff(staffEditId);
    resetForm({
      values: {
        name: staffData.name,
        username: staffData.username,
        phone: staffData.phone,
        address: staffData.address,
        avatar: staffData.avatar,
      }
    });
  } else {
    const staffData = await staffService.getStaff(staffId.value);
    resetForm({
      values: {
        name: staffData.name,
        username: staffData.username,
        phone: staffData.phone,
        address: staffData.address,
        avatar: staffData.avatar,
      }
    });
  }
});
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header></Header>
    <div class="flex justify-center items-center flex-grow">
      <form @submit.prevent>
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base shadow">
          <legend class="fieldset-legend text-xl">Cập nhật thông tin nhân viên</legend>
          <label class="label" for="name">Họ và tên</label>
          <input v-model=" name " type="text" class="input" id="name" placeholder="Nhập họ và tên" />
          <span class="text-sm text-red-600">{{ nameError }}</span>


          <label class="label">Địa chỉ</label>
          <input v-model=" address " type="text" class="input" placeholder="Nhập địa chỉ" />
          <span class="text-sm text-red-600">{{ addressError }}</span>

          <label class="label">Số điện thoại</label>
          <input v-model=" phone " type="text" class="input" placeholder="Nhập số điện thoại" />
          <span class="text-sm text-red-600">{{ phoneError }}</span>

          <label class="label" for="username">Tên đăng nhập</label>
          <input v-model=" username " type="text" class="input" id="username" placeholder="Nhập tên đăng nhập" />
          <span class="text-sm text-red-600">{{ usernameError }}</span>

          <label class="label" for="password">Mật khẩu</label>
          <input v-model=" password " type="password" class="input" id="password" placeholder="Nhập mật khẩu" />
          <span class="text-sm text-red-600">{{ passwordError }}</span>

          <div class="divider text-xs opacity-50 uppercase font-black">Ảnh đại diện</div>
          <div class="flex items-center gap-6 mt-2 mb-4">
             <div class="avatar online shadow-xl">
                <div class="w-20 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                   <img :src="avatar || 'https://i.pravatar.cc/150?u=preview'" />
                </div>
             </div>
             <div class="flex-grow">
                <label class="label" for="avatar">Lên kết ảnh</label>
                <input v-model=" avatar " type="text" class="input w-full" id="avatar" placeholder="https://..." />
                <span class="text-xs text-info mt-1 italic block">Sử dụng link ảnh i.pravatar.cc hoặc unsplash</span>
                <span class="text-sm text-red-600">{{ avatarError }}</span>
             </div>
          </div>

          <template v-if=" staffEditId !== staffId ">
            <div class="grid grid-cols-2 gap-2">
              <button class="btn btn-neutral mt-4 hover:scale-[1.01] text-base"
                @click="handleStaffProfileEdit( staffEditId )">Lưu thay đổi</button>
              <button class="btn btn-neutral mt-4 hover:scale-[1.01] text-base"
                @click="handleStaffProfileDelete( staffEditId )">Xóa</button>
            </div>
          </template>
          <template v-else>
            <div class="grid grid-cols-1 gap-2">
              <button class="btn btn-neutral mt-4 hover:scale-[1.01] text-base"
                @click="handleStaffProfileEdit( staffEditId )">Lưu thay đổi</button>
            </div>
          </template>
          <span class="mt-4">
            <strong class="hover:underline">
              <template v-if=" staffEditId === staffId ">
                <RouterLink to="/staffprofile" class="text-base">Quay lại</RouterLink>
              </template>
              <template v-else>
                <RouterLink to="/staffs" class="text-base">Quay lại</RouterLink>
              </template>
            </strong>
          </span>
        </fieldset>
      </form>
    </div>
    <Footer></Footer>
  </div>
</template>