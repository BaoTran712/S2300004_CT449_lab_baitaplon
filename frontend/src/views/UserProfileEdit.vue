<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { useRouter } from 'vue-router';
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { push } from 'notivue';
import { userSchema } from '../validations/user.validation';
import UserService from '../services/user.service';
import { useForm, useField } from "vee-validate";

const userService = new UserService();
const router = useRouter();
const route = useRoute();
const role = computed(() => localStorage.getItem("role"));

const { handleSubmit, resetForm } = useForm({
  validationSchema: userSchema,
});

const user_id = route.params.id;

const handleUserProfileEdit = handleSubmit(async (values) => {
  try {
    await userService.updateUser(user_id, values);
    push.success("Cập nhật thông tin người dùng thành công");
    if (role.value === "staff") {
      router.push("/users");
    } else {
      router.push("/userprofile");
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 400) {
      push.error("Vui lòng điền đầy đủ thông tin");
    } else if (error.response.status === 409) {
      push.error("Tên đăng nhập đã tồn tại");
    }
    else {
      push.error("Đã xảy ra lỗi khi cập nhật thông tin người dùng");
    }
  }
});

const handleUserProfileDelete = async (user_id) => {
  try {
    if (confirm("Xác nhận xóa người dùng?")) {
      await userService.deleteUser(user_id);
      push.success("Xóa người dùng thành công");
      router.push("/users");
    }
  } catch (error) {
    push.error("Đã xảy ra lỗi khi xóa người dùng");
  }
};

const { value: first_name, errorMessage: first_nameError } = useField("first_name");
const { value: last_name, errorMessage: last_nameError } = useField("last_name");
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: birthday, errorMessage: birthdayError } = useField("birthday");
const { value: gender, errorMessage: genderError } = useField("gender");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");
const { value: avatar, errorMessage: avatarError } = useField("avatar");

onMounted(async () => {
  const userData = await userService.getUser(user_id);
  console.log();
  resetForm({
    values: {
      first_name: userData.first_name,
      last_name: userData.last_name,
      gender: userData.gender,
      address: userData.address,
      birthday: new Date(userData.birthday).toISOString().slice(0, 10),
      phone: userData.phone,
      username: userData.username,
      avatar: userData.avatar,
      // password: userData.password
    }
  });
});
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header></Header>
    <div class="flex justify-center items-center flex-grow">
      <form @submit.prevent>
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base shadow">
          <legend class="fieldset-legend text-xl">Cập nhật người dùng</legend>
          <label class="label" for="last_name">Họ lót</label>
          <input v-model=" last_name " type="text" class="input" id="last_name" placeholder="Nhập họ lót" />
          <span class="text-sm text-red-600">{{ last_nameError }}</span>

          <label class="label" for="first_name">Tên</label>
          <input v-model=" first_name " type="text" class="input" id="first_name" placeholder="Nhập tên" />
          <span class="text-sm text-red-600">{{ first_nameError }}</span>


          <label class="label" for="birthday">Ngày sinh</label>
          <input v-model=" birthday " type="date" id="birthday" class="input" />
          <span class="text-sm text-red-600">{{ birthdayError }}</span>

          <label class="label">Giới tính</label>
          <div class="flex gap-8">
            <div><input v-model=" gender " :value=" true " type="radio" name="radio-1" class="radio mr-1" />
              <span>Nam</span>
            </div>
            <div class=""><input v-model=" gender " :value=" false " type="radio" name="radio-1" class="radio mr-1" />
              <span>Nữ</span>
            </div>
          </div>
          <span class="text-sm text-red-600">{{ genderError }}</span>

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
          <input v-model=" password " type="password" minlength="3" class="input" id="password"
            placeholder="Nhập mật khẩu" />
          <span class="text-sm text-red-600">{{ passwordError }}</span>

          <div class="divider text-xs opacity-50 uppercase font-black">Ảnh đại diện</div>
          <div class="flex items-center gap-6 mt-2 mb-4">
             <div class="avatar online shadow-xl">
                <div class="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                   <img :src="avatar || 'https://i.pravatar.cc/150?u=preview'" />
                </div>
             </div>
             <div class="flex-grow">
                <label class="label" for="avatar">Liên kết ảnh</label>
                <input v-model=" avatar " type="text" class="input w-full" id="avatar" placeholder="https://..." />
                <span class="text-xs text-info mt-1 italic block">Sử dụng link ảnh i.pravatar.cc hoặc unsplash</span>
                <span class="text-sm text-red-600">{{ avatarError }}</span>
             </div>
          </div>

          <template v-if=" role === 'staff' ">
            <div class="grid grid-cols-2 gap-2">
              <button class="btn btn-neutral mt-4 hover:scale-[1.01] text-base"
                @click=" handleUserProfileEdit( user_id )">Lưu thay đổi</button>
              <button class="btn btn-neutral mt-4 hover:scale-[1.01] text-base"
                @click=" handleUserProfileDelete( user_id )">Xóa</button>
            </div>
          </template>
          <template v-else>
            <div class="grid grid-cols-1 gap-2">
              <button class="btn btn-neutral mt-4 hover:scale-[1.01] text-base"
                @click=" handleUserProfileEdit( user_id )">Lưu thay đổi</button>
            </div>
          </template>
          <span class="mt-4">
            <strong class="hover:underline">
              <template v-if=" role === 'staff' ">
                <RouterLink to="/users" class="text-base">Quay lại</RouterLink>
              </template>
              <template v-else>
                <RouterLink to="/userprofile" class="text-base">Quay lại</RouterLink>
              </template>
            </strong>
          </span>
        </fieldset>
      </form>
    </div>
    <Footer></Footer>
  </div>
</template>