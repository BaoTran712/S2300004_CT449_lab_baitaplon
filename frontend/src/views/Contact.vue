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

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 z-10 mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <!-- Left Side: Contact Form -->
            <div class="lg:col-span-7 bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-blue-50">
              <h2 class="text-3xl font-black text-neutral mb-8 flex items-center gap-3">
                <span class="bg-primary/10 p-2 rounded-xl text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </span>
                Gửi lời nhắn cho chúng tôi
              </h2>
              
              <form @submit.prevent="onSubmit" class="space-y-6">
                <!-- Name & Email Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-control w-full">
                    <label class="label"><span class="label-text font-black uppercase text-[10px] tracking-widest text-gray-400">Họ và tên</span></label>
                    <input v-model="name" type="text" placeholder="Nguyễn Văn A" class="input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    <span class="text-xs text-red-500 mt-1">{{ nameError }}</span>
                  </div>
                  <div class="form-control w-full">
                    <label class="label"><span class="label-text font-black uppercase text-[10px] tracking-widest text-gray-400">Địa chỉ Email</span></label>
                    <input v-model="email" type="email" placeholder="example@ctu.edu.vn" class="input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                    <span class="text-xs text-red-500 mt-1">{{ emailError }}</span>
                  </div>
                </div>

                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-black uppercase text-[10px] tracking-widest text-gray-400">Số điện thoại</span></label>
                  <input v-model="phone" type="text" placeholder="0123 456 789" class="input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  <span class="text-xs text-red-500 mt-1">{{ phoneError }}</span>
                </div>

                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-black uppercase text-[10px] tracking-widest text-gray-400">Vấn đề cần hỗ trợ</span></label>
                  <input v-model="subject" type="text" placeholder="Mượn sách, tài khoản, đóng góp ý kiến..." class="input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  <span class="text-xs text-red-500 mt-1">{{ subjectError }}</span>
                </div>

                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-black uppercase text-[10px] tracking-widest text-gray-400">Lời nhắn chi tiết</span></label>
                  <textarea v-model="message" class="textarea textarea-bordered h-40 rounded-xl bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Nhập nội dung tin nhắn của bạn tại đây..."></textarea>
                  <span class="text-xs text-red-500 mt-1">{{ messageError }}</span>
                </div>

                <button type="submit" :disabled="isSubmitting" class="btn btn-primary btn-block rounded-xl text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all border-none py-4 h-auto">
                    {{ isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu ngay' }}
                </button>
              </form>
            </div>

            <!-- Right Side: Consolidated Info & Social -->
            <div class="lg:col-span-5 space-y-8 mt-12 lg:mt-0">
              
              <!-- Unified Contact Info Card -->
              <div class="bg-white rounded-[2rem] shadow-xl p-10 relative overflow-hidden group border border-base-200">
                <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors duration-700"></div>
                <h2 class="text-2xl font-black mb-10 relative z-10 flex items-center gap-3 font-serif text-neutral">
                    Thông tin liên hệ
                    <span class="w-12 h-1 bg-primary rounded-full"></span>
                </h2>
                
                <div class="space-y-10 relative z-10">
                    <div class="flex items-start gap-6">
                        <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Địa chỉ văn phòng</p>
                            <p class="text-lg font-medium leading-relaxed text-gray-700">Khu II, Đường 3/2, Quận Ninh Kiều, TP. Cần Thơ</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-6">
                        <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Đường dây nóng</p>
                            <p class="text-2xl font-black tracking-tighter text-neutral">(+84) 123 456 789</p>
                        </div>
                    </div>

                    <div class="flex items-start gap-6">
                        <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Giờ làm việc</p>
                            <p class="text-lg font-medium text-gray-700">Thứ 2 - Thứ 7: 07:30 - 17:00</p>
                        </div>
                    </div>
                </div>
              </div>

              <!-- Social Section -->
              <div class="bg-white rounded-[2rem] shadow-xl p-8 border border-base-200">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 text-center">Theo dõi chúng tôi tại</p>
                <div class="flex justify-center gap-6">
                    <a href="https://facebook.com" target="_blank" class="flex flex-col items-center gap-3 group">
                        <div class="w-16 h-16 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all duration-300 shadow-sm border border-[#1877F2]/20">
                            <i class="fab fa-facebook-f text-2xl"></i>
                        </div>
                        <span class="text-xs font-black uppercase tracking-tighter text-gray-500">Facebook</span>
                    </a>
                    <a href="https://twitter.com" target="_blank" class="flex flex-col items-center gap-3 group">
                        <div class="w-16 h-16 rounded-2xl bg-[#1DA1F2]/10 flex items-center justify-center text-[#1DA1F2] group-hover:bg-[#1DA1F2] group-hover:text-white transition-all duration-300 shadow-sm border border-[#1DA1F2]/20">
                            <i class="fab fa-twitter text-2xl"></i>
                        </div>
                        <span class="text-xs font-black uppercase tracking-tighter text-gray-500">Twitter</span>
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
