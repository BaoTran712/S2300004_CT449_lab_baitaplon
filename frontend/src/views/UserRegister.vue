<script setup>
import { ref } from "vue";
import UserService from "../services/user.service";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { userSchema } from "../validations/user.validation";
import { push } from "notivue";

const userService = new UserService();
const router = useRouter();

const { handleSubmit } = useForm({
  validationSchema: userSchema
});

const { value: first_name, errorMessage: first_nameError } = useField("first_name");
const { value: last_name, errorMessage: last_nameError } = useField("last_name");
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: birthday, errorMessage: birthdayError } = useField("birthday");
const { value: gender, errorMessage: genderError } = useField("gender");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");

const handleUserRegister = handleSubmit(async (values) => {
  try {
    await userService.register(values);
    // ? Debug code
    // console.log(data);
    // console.log(response.data);

    push.success("Đăng ký người dùng thành công");
    router.push("/user/login");
  } catch (error) {
    console.error(error);
    if (error.response.status === 400) {
      push.error("Vui lòng điền đầy đủ thông tin");
    } else if (error.response.status === 409) {
      push.error("Tên đăng nhập đã tồn tại");
    }
    else {
      push.error("Đăng ký thất bại, vui lòng thử lại");
    }
  }
});

</script>

<template>
  <div class="bg-cover bg-[url(/images/t2_khu_vuc_tu_hoc_2.jpg)] transition-all duration-300 overflow-hidden">
    <div class="backdrop-brightness-50 backdrop-blur-xs flex justify-center items-center h-screen">
      <form @submit.prevent=" handleUserRegister ">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 text-base shadow">
          <h1 class="font-bold text-2xl text-center">Đăng Ký</h1>
          <label class="label" for="last_name">Họ lót</label>
          <input v-model=" last_name " type="text" class="input" id="last_name" placeholder="Nhập họ lót" />
          <span class="text-red-600 text-sm">{{ last_nameError }}</span>

          <label class="label" for="first_name">Tên</label>
          <input v-model=" first_name " type="text" class="input" id="first_name" placeholder="Nhập tên" />
          <span class="text-red-600 text-sm">{{ first_nameError }}</span>

          <label class="label" for="birthday">Ngày sinh</label>
          <input v-model=" birthday " type="date" id="birthday" class="input" />
          <span class="text-red-600 text-sm">{{ birthdayError }}</span>

          <label class="label">Giới tính</label>
          <div class="flex gap-8">
            <div><input v-model=" gender " :value=" true " type="radio" name="radio-1" class="radio mr-1" />
              <span>Nam</span>
            </div>
            <div class=""><input v-model=" gender " :value=" false " type="radio" name="radio-1" class="radio mr-1" />
              <span>Nữ</span>
            </div>
          </div>
          <span class="text-red-600 text-sm">{{ genderError }}</span>

          <label class="label" for="address">Địa chỉ</label>
          <input v-model=" address " type="text" class="input" id="address" placeholder="Nhập địa chỉ" />
          <span class="text-red-600 text-sm">{{ addressError }}</span>

          <label class="label" for="phone">Số điện thoại</label>
          <input v-model=" phone " type="text" class="input" id="phone" placeholder="Nhập số điện thoại" />
          <span class="text-red-600 text-sm">{{ phoneError }}</span>

          <label class="label" for="username">Tên đăng nhập</label>
          <input v-model=" username " type="text" class="input" id="username" placeholder="Nhập tên đăng nhập" />
          <span class="text-red-600 text-sm">{{ usernameError }}</span>

          <label class="label" for="password">Mật khẩu</label>
          <input v-model=" password " type="password" class="input" id="password" placeholder="Nhập mật khẩu" />
          <span class="text-red-600 text-sm">{{ passwordError }}</span>

          <button type="submit" class="btn btn-neutral mt-4 hover:scale-[1.01] text-base">Đăng Ký</button>
          <span class="mt-8">Bạn đã có tài khoản?
            <strong class="hover:underline">
              <RouterLink to="/user/login" class="text-base">Đăng nhập</RouterLink>
            </strong>
          </span>
        </fieldset>
      </form>
    </div>
  </div>
</template>