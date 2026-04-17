<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import BorrowService from "../services/borrow.service";

const username = computed(() => localStorage.getItem("username"));
const role = computed(() => localStorage.getItem("role"));

const avatarURL = computed(() => localStorage.getItem("avatar"));

const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/";
};

const borrowService = new BorrowService();
const pendingCount = ref(0);
let countInterval = null;

const fetchPendingCounts = async () => {
  if (role.value === 'staff') {
    try {
      const allBorrows = await borrowService.getAllBorrows();
      pendingCount.value = allBorrows.filter(
        b => b.status === "pending" || b.status === "return_pending"
      ).length;
    } catch (error) {
      console.log(error);
    }
  }
};

onMounted(() => {
  fetchPendingCounts();
  // refresh it every 15s to keep notifications alive
  countInterval = setInterval(fetchPendingCounts, 15000); 
});

onUnmounted(() => {
  if (countInterval) clearInterval(countInterval);
});

</script>

<template>
  <div class="navbar bg-base-100 shadow">
    <div class="navbar-start">
      <template v-if=" role === 'user' || role === 'staff' ">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <template v-if=" role === 'staff' ">
              <li>
                <RouterLink to="/books" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
                  Danh mục sách</RouterLink>
              </li>
              <li>
                <RouterLink to="/borrowpending" class="text-base flex items-center gap-1"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
                  Đơn mượn sách
                  <span v-if="pendingCount > 0" class="badge badge-error badge-sm text-white border-none font-bold shadow-sm shadow-red-500/50 animate-pulse">{{ pendingCount }}</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/publishers" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">Nhà xuất bản
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/users" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">Người dùng
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/staffs" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">Nhân viên
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/staffprofile" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">Thông tin nhân
                  viên</RouterLink>
              </li>
              <li>
                <RouterLink to="/reviews" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">Phản hồi
                </RouterLink>
              </li>
            </template>
            <template v-if=" role === 'user' ">
              <li>
                <RouterLink to="/books" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">Danh mục sách
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/borrowcheck" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">Kiểm tra đơn mượn
                  sách</RouterLink>
              </li>
              <li>
                <RouterLink to="/userprofile" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">Thông tin người
                  dùng</RouterLink>
              </li>
              <li>
                <RouterLink to="/reviews" class="text-base"
                  exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">Phản hồi
                </RouterLink>
              </li>
            </template>
          </ul>
        </div>
      </template>
      <RouterLink to="/" class="ml-2 text-base md:text-lg lg:text-xl font-bold hover:underline">Ebookshelf</RouterLink>
    </div>

    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 text-base">

        <template v-if=" role === 'staff' ">
          <li>
            <RouterLink to="/books" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Danh mục sách
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/borrowpending" class="text-base hover:font-bold hover:underline flex items-center gap-1"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Đơn mượn sách
              <span v-if="pendingCount > 0" class="badge badge-error badge-sm text-white border-none font-bold shadow-sm shadow-red-500/50 animate-pulse">{{ pendingCount }}</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/publishers" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Nhà xuất bản</RouterLink>
          </li>
          <li>
            <RouterLink to="/users" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Người dùng</RouterLink>
          </li>
          <li>
            <RouterLink to="/staffs" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Nhân viên</RouterLink>
          </li>
          <li>
            <RouterLink to="/staffprofile" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Thông tin nhân viên</RouterLink>
          </li>
          <li>
            <RouterLink to="/reviews" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Phản hồi</RouterLink>
          </li>
        </template>

        <template v-if=" role === 'user' ">
          <li>
            <RouterLink to="/books" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Danh mục sách</RouterLink>
          </li>
          <li>
            <RouterLink to="/borrowcheck" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Kiểm tra đơn mượn sách</RouterLink>
          </li>
          <li>
            <RouterLink to="/userprofile" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Thông tin người dùng</RouterLink>
          </li>
          <li>
            <RouterLink to="/reviews" class="text-base hover:font-bold hover:underline"
              exact-active-class="text-base font-bold transition-all duration-200 ease-in-out">
              Phản hồi</RouterLink>
          </li>
        </template>
      </ul>
    </div>

    <div class="navbar-end gap-2">
      <template v-if=" !username ">
        <RouterLink to="/user/login" class="btn btn-neutral px-4 text-base mr-2 hover:scale-[1.01]">Đăng Nhập
        </RouterLink>
      </template>
      <template v-else>
        <div class="dropdown dropdown-end">
           <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar border-2 border-primary/20 hover:border-primary transition-all">
             <div class="w-10 rounded-full">
               <img v-if="avatarURL" :src="avatarURL" alt="Profile" />
               <div v-else class="bg-primary text-primary-content flex items-center justify-center font-bold text-lg h-full">
                 {{ username.charAt(0).toUpperCase() }}
               </div>
             </div>
           </div>
           <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-2xl border border-base-300">
             <li class="menu-title text-primary font-black px-4 py-2 border-b border-base-200 mb-2">Xin chào, {{ username }}</li>
             <li>
               <RouterLink :to="role === 'staff' ? '/staffprofile' : '/userprofile'">Trang cá nhân</RouterLink>
             </li>
             <li class="mt-2 pt-2 border-t border-base-200">
               <button @click="handleLogout" class="text-error font-bold w-full text-left">Đăng xuất</button>
             </li>
           </ul>
        </div>
      </template>
    </div>
  </div>
</template>