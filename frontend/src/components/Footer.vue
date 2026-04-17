<template>
  <footer class="bg-black/90 text-neutral-content py-16 font-sans">
    <div class="container mx-auto px-4 md:px-8 lg:px-16 flex flex-col lg:flex-row justify-between gap-12 border-b border-white/5 pb-12">
      
      <!-- Brand & Description -->
      <div class="w-full lg:w-1/3 space-y-6">
        <h2 class="text-4xl font-black tracking-tighter text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          CTU Ebookshelf
        </h2>
        <p class="text-gray-400 leading-relaxed max-w-sm text-lg font-light">
          Hệ thống thư viện điện tử thông minh, mang tri thức đến gần hơn với cộng đồng sinh viên và giảng viên.
        </p>
        <div class="flex gap-4">
          <a href="#" class="btn btn-circle btn-sm btn-ghost bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all">
            <i class="fab fa-facebook-f text-lg"></i>
          </a>
          <a href="#" class="btn btn-circle btn-sm btn-ghost bg-white/5 border border-white/10 hover:bg-pink-600 hover:text-white transition-all">
            <i class="fab fa-instagram text-lg"></i>
          </a>
          <a href="#" class="btn btn-circle btn-sm btn-ghost bg-white/5 border border-white/10 hover:bg-black hover:text-white transition-all">
            <i class="fab fa-twitter text-lg"></i>
          </a>
        </div>
      </div>

      <!-- Quick Links grid -->
      <div class="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        <!-- Column 1: Explore -->
        <div class="flex flex-col gap-5">
          <h3 class="text-white font-black text-sm uppercase tracking-widest mb-2 border-l-2 border-primary pl-3">Khám Phá</h3>
          <RouterLink to="/books" class="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
            <span class="text-xs">📖</span> Tất cả sách
          </RouterLink>
          <RouterLink to="/books?search=vũ+trụ" class="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
            <span class="text-xs">🚀</span> Vũ trụ & Khoa học
          </RouterLink>
          <RouterLink to="/books?search=lịch+sử" class="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
            <span class="text-xs">🏛️</span> Lịch sử & Cổ đại
          </RouterLink>
          <RouterLink to="/contact" class="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
            <span class="text-xs">📞</span> Liên hệ hỗ trợ
          </RouterLink>
        </div>

        <!-- Column 2: Support -->
        <div class="flex flex-col gap-5">
          <h3 class="text-white font-black text-sm uppercase tracking-widest mb-2 border-l-2 border-primary pl-3">Hỗ Trợ</h3>
          <RouterLink to="/user/login" class="text-gray-400 hover:text-primary transition-colors">Tài khoản cá nhân</RouterLink>
          <RouterLink to="/user/register" class="text-gray-400 hover:text-primary transition-colors">Đăng ký thành viên</RouterLink>
          <RouterLink to="/admin/login" class="text-gray-400 hover:text-primary transition-colors">Dành cho nhân viên</RouterLink>
        </div>

        <!-- Column 3: Policy -->
        <div class="flex flex-col gap-5">
          <h3 class="text-white font-black text-sm uppercase tracking-widest mb-2 border-l-2 border-primary pl-3">Thông Tin</h3>
          <div class="space-y-4">
            <a href="#" class="block text-gray-400 hover:text-primary transition-colors text-sm">Điều khoản dịch vụ</a>
            <a href="#" class="block text-gray-400 hover:text-primary transition-colors text-sm">Chính sách bảo mật</a>
            <a href="#" class="block text-gray-400 hover:text-primary transition-colors text-sm">Hướng dẫn mượn trả</a>
          </div>
        </div>
        
      </div>
    </div>
    
    <!-- Copyright -->
    <div class="container mx-auto px-4 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-30">
      <p>Copyright &copy; {{ new Date().getFullYear() }} - CTU Ebookshelf.</p>
      <p>Phát triển bởi Trân S2300004</p>
    </div>
  </footer>
</template>