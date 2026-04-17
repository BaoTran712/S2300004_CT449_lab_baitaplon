<template>
  <footer class="bg-neutral text-neutral-content py-12 md:py-16 font-sans">
    <div class="container mx-auto px-4 md:px-8 lg:px-16 flex flex-col lg:flex-row justify-between gap-12 border-b border-neutral-focus pb-12">
      
      <!-- Brand & Description -->
      <div class="w-full lg:w-1/3 space-y-6">
        <h2 class="text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Ebookshelf
        </h2>
        <p class="opacity-70 leading-relaxed max-w-sm">
          Thư viện sách điện tử hàng đầu dành cho sinh viên và giảng viên đại học. Khám phá tri thức mọi lúc, mọi nơi với hệ thống mượn sách thông minh.
        </p>
        <div class="flex gap-4">
          <a href="#" class="btn btn-circle btn-sm btn-ghost hover:bg-neutral-focus hover:text-white transition-colors">
            <i class="fab fa-facebook-f text-lg"></i>
          </a>
          <a href="#" class="btn btn-circle btn-sm btn-ghost hover:bg-neutral-focus hover:text-white transition-colors">
            <i class="fab fa-instagram text-lg"></i>
          </a>
          <a href="#" class="btn btn-circle btn-sm btn-ghost hover:bg-neutral-focus hover:text-white transition-colors">
            <i class="fab fa-twitter text-lg"></i>
          </a>
        </div>
      </div>

      <!-- Quick Links grid -->
      <div class="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Column 1: Sách & Tác giả -->
        <div class="flex flex-col gap-4">
          <h3 class="text-white font-bold text-lg uppercase tracking-wider mb-2">Khám Phá Thể Loại</h3>
          <RouterLink to="/books" class="link link-hover opacity-70 hover:opacity-100 hover:text-primary transition-colors">📚 Tất cả sách</RouterLink>
          <RouterLink to="/books?search=vũ+trụ" class="link link-hover opacity-70 hover:opacity-100 hover:text-primary transition-colors">Vũ trụ & Khoa học</RouterLink>
          <RouterLink to="/books?search=lịch+sử" class="link link-hover opacity-70 hover:opacity-100 hover:text-primary transition-colors">Lịch sử & Cổ đại</RouterLink>
          <RouterLink to="/books?search=kỹ+thuật" class="link link-hover opacity-70 hover:opacity-100 hover:text-primary transition-colors">Tương lai & Kỹ thuật</RouterLink>
        </div>

        <!-- Column 2: Liên kết hỗ trợ -->
        <div class="flex flex-col gap-4">
          <h3 class="text-white font-bold text-lg uppercase tracking-wider mb-2">Hỗ Trợ</h3>
          <RouterLink to="/contact" class="link link-hover opacity-70 hover:opacity-100 hover:text-primary transition-colors">Liên hệ với chúng tôi</RouterLink>
          <a href="#" class="link link-hover opacity-70 hover:opacity-100 hover:text-primary transition-colors">Hướng dẫn mượn sách</a>
          <a href="#" class="link link-hover opacity-70 hover:opacity-100 hover:text-primary transition-colors">Câu hỏi thường gặp (FAQ)</a>
        </div>

        <!-- Column 3: Chính sách (Hiển thị từng dòng) -->
        <div class="flex flex-col gap-4">
          <h3 class="text-white font-bold text-lg uppercase tracking-wider mb-2">Chính Sách</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-2 group cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <a href="#" class="opacity-70 group-hover:opacity-100 group-hover:text-primary transition-colors">Điều khoản dịch vụ</a>
            </li>
            <li class="flex items-start gap-2 group cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <a href="#" class="opacity-70 group-hover:opacity-100 group-hover:text-primary transition-colors">Chính sách bảo mật</a>
            </li>
            <li class="flex items-start gap-2 group cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <a href="#" class="opacity-70 group-hover:opacity-100 group-hover:text-primary transition-colors">Chính sách đổi trả & đền bù</a>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
    
    <!-- Copyright -->
    <div class="container mx-auto px-4 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-50">
      <p>Copyright &copy; {{ new Date().getFullYear() }} - CTU Ebookshelf - Kệ sách điện tử.</p>
      <p>Phát triển với ❤️ bởi đội ngũ CTU</p>
    </div>
  </footer>
</template>