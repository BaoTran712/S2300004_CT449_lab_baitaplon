<script setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import contactService from '../services/contact.service';
import { push } from 'notivue';

const schema = yup.object({
  name: yup.string().required('Họ tên không được để trống').min(2, 'Tên quá ngắn'),
  email: yup.string().required('Email không được để trống').email('Email không hợp lệ'),
  phone: yup.string().matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số').optional(),
  subject: yup.string().required('Tiêu đề không được để trống'),
  message: yup.string().required('Nội dung không được để trống').min(10, 'Nội dung quá ngắn'),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  }
});

const { value: name, errorMessage: nameError } = useField('name');
const { value: email, errorMessage: emailError } = useField('email');
const { value: phone, errorMessage: phoneError } = useField('phone');
const { value: subject, errorMessage: subjectError } = useField('subject');
const { value: message, errorMessage: messageError } = useField('message');

const isSubmitting = ref(false);

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    await contactService.create(values);
    push.success('Gửi lời nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.');
    resetForm();
  } catch (error) {
    console.error(error);
    push.error('Đã xảy ra lỗi khi gửi lời nhắn.');
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    
    <main class="flex-grow bg-[#faf9f6]">
      <!-- Hero Section -->
      <section class="py-16 bg-white border-b border-base-200">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-black text-neutral mb-4 font-serif">Liên Hệ Với Chúng Tôi</h1>
          <p class="text-gray-500 max-w-2xl mx-auto italic">
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Hãy để lại tin nhắn, các chuyên viên của Ebookshelf sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </section>

      <div class="container mx-auto px-4 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <!-- Contact Form Card -->
          <div class="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-base-200 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 class="text-2xl font-bold text-neutral mb-8 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Gửi tin nhắn cho chúng tôi
            </h2>

            <form @submit.prevent="onSubmit" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-control">
                  <label class="label font-bold text-xs uppercase text-gray-400">Họ tên *</label>
                  <input v-model="name" type="text" class="input input-bordered" placeholder="VD: Nguyễn Văn A" />
                  <span class="text-xs text-red-500 mt-1">{{ nameError }}</span>
                </div>
                <div class="form-control">
                  <label class="label font-bold text-xs uppercase text-gray-400">Email *</label>
                  <input v-model="email" type="email" class="input input-bordered" placeholder="example@mail.com" />
                  <span class="text-xs text-red-500 mt-1">{{ emailError }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-control">
                  <label class="label font-bold text-xs uppercase text-gray-400">Số điện thoại</label>
                  <input v-model="phone" type="text" class="input input-bordered" placeholder="0123 456 789" />
                  <span class="text-xs text-red-500 mt-1">{{ phoneError }}</span>
                </div>
                <div class="form-control">
                  <label class="label font-bold text-xs uppercase text-gray-400">Tiêu đề *</label>
                  <input v-model="subject" type="text" class="input input-bordered" placeholder="Cần tư vấn về..." />
                  <span class="text-xs text-red-500 mt-1">{{ subjectError }}</span>
                </div>
              </div>

              <div class="form-control">
                <label class="label font-bold text-xs uppercase text-gray-400">Nội dung *</label>
                <textarea v-model="message" class="textarea textarea-bordered h-32" placeholder="Nội dung lời nhắn..."></textarea>
                <span class="text-xs text-red-500 mt-1">{{ messageError }}</span>
              </div>

              <button type="submit" class="btn btn-primary w-full text-white" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="loading loading-spinner"></span>
                Gửi ngay bây giờ
              </button>
            </form>
          </div>

          <!-- Contact Information -->
          <div class="flex flex-col gap-8">
            <h2 class="text-2xl font-bold text-neutral mb-4 font-serif">Thông tin liên hệ</h2>
            
            <div class="space-y-6">
              <div class="flex items-start gap-4 p-6 bg-white rounded-3xl border border-base-200 hover:shadow-lg transition-shadow">
                <div class="bg-primary/10 p-4 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg">Địa chỉ</h3>
                  <p class="text-gray-500">Khu II, Đ. 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ</p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-6 bg-white rounded-3xl border border-base-200 hover:shadow-lg transition-shadow">
                <div class="bg-primary/10 p-4 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg">Điện thoại</h3>
                  <p class="text-gray-500">0123 456 789 (Hỗ trợ 24/7)</p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-6 bg-white rounded-3xl border border-base-200 hover:shadow-lg transition-shadow">
                <div class="bg-primary/10 p-4 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg">Thời gian mở cửa</h3>
                  <p class="text-gray-500">Thứ 2 - Chủ Nhật: 08:00 - 20:00</p>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="pt-8">
              <h3 class="font-bold text-lg mb-4">Theo dõi chúng tôi</h3>
              <div class="flex gap-4">
                <a href="#" class="btn btn-circle btn-outline border-base-300 hover:bg-blue-600 hover:border-blue-600">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="btn btn-circle btn-outline border-base-300 hover:bg-pink-600 hover:border-pink-600">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="btn btn-circle btn-outline border-base-300 hover:bg-black hover:border-black">
                  <i class="fab fa-tiktok"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Map Section -->
      <div class="grayscale-[50%] hover:grayscale-0 transition-all duration-700 h-[400px] w-full bg-base-300 mt-16">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8475254921673!2d105.768142!3d10.0305892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0883d2192b087%3A0x2318083a7fd96767!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1713240000000!5m2!1svi!2s" 
          width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
