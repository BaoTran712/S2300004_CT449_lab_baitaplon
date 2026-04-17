<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '../services/user.service';
import { push } from 'notivue';
import { useForm, useField } from "vee-validate";
import { loginSchema } from '../validations/login.validation';

const userService = new UserService();

const router = useRouter();
const { handleSubmit } = useForm({
  validationSchema: loginSchema
});

const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");

const handleUserLogin = handleSubmit(async () => {
  try {
    const response = await userService.login(username.value, password.value);

    // console.log(response.data);

    if (response?.data?.token) {
      localStorage.setItem("authenticateToken", response.data.token);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("id", response.data.user.id);
      localStorage.setItem("role", "user");
      localStorage.setItem("avatar", response.data.user.avatar || "");
      push.success("Đăng nhập thành công");
      router.push("/");
    }

  } catch (error) {
    console.error(error);
    if (error.response.status === 400) {
      push.error("Vui lòng điền đầy đủ thông tin");
    } else if (error.response.status === 401) {
      push.error("Mật khẩu không khớp");
    } else if (error.response.status === 404) {
      push.error("Tên đăng nhập không tồn tại");
    }
    else {
      push.error("Đăng nhập thất bại, vui lòng thử lại");
    }
  }
});
</script>

<template>
  <div class="bg-cover bg-[url(/images/t2_de_sach_sau_khi_doc.jpg)] transition-all duration-300">
    <div
      class="backdrop-brightness-50 backdrop-blur-xs grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-8 place-items-center h-screen">
      <form @submit.prevent=" handleUserLogin ">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base shadow-xl">
          <!-- User login -->
          <h1 class="font-bold text-2xl text-center mb-4">Đăng Nhập</h1>
          <label class="label" for="username">Tên đăng nhập</label>
          <input v-model=" username " id="username" type="text" class="input" placeholder="Nhập tên đăng nhập" />
          <span class="text-red-600 text-sm">{{ usernameError }}</span>

          <label class="label" for="password">Mật khẩu</label>
          <input v-model=" password " id="password" type="password" class="input" placeholder="Nhập mật khẩu" />
          <span class="text-red-600 text-sm">{{ passwordError }}</span>

          <button type="submit" class="btn btn-neutral mt-4 text-base hover:scale-[1.01]">Đăng
            Nhập</button>
          <span class="mt-8">Bạn chưa có tài khoản? <strong class="hover:underline">
              <RouterLink to="/user/register">Đăng ký</RouterLink>
            </strong></span>
          <span>Bạn là nhân viên? <strong class="hover:underline">
              <RouterLink to="/staff/login">Đăng nhập</RouterLink>
            </strong></span>
        </fieldset>
      </form>
    </div>
  </div>
</template>
