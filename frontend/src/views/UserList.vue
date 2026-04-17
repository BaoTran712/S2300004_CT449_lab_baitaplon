<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import InputSearch from '../components/InputSearch.vue';
import UserCard from '../components/UserCard.vue';
import AdminLayout from '../components/AdminLayout.vue';


import UserService from '../services/user.service';
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { push } from 'notivue';

const userService = new UserService();
const router = useRouter();
const users = ref([]);
const searchText = ref("");
const role = computed(() => localStorage.getItem("role"));

const fetchUsers = async () => {
    try {
        const response = await userService.getAllUsers();
        // debug code later
        // console.log(response);
        users.value = response;
    } catch (error) {
        console.error(error);
    }
};

const searchFilteredUsers = computed(() => {
    if (!searchText.value) return users.value;

    const keyword = searchText.value.toLowerCase();

    return users.value.filter(user => {
        const searchableText = [user.first_name, user.last_name, user.birthday, user.gender, user.address, user.phone]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return searchableText.includes(keyword);
    });
});

const goToAddUser = () => {
    router.push({ name: "user.add" });
};

const handleDeleteAllUsers = async () => {
    try {
        if (confirm("Xác nhận xóa tất cả người dùng?")) {
            await userService.deleteAllUsers();
            push.success("Xóa tất cả người dùng thành công");
            fetchUsers();
        }
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi xóa tất cả người dùng");
    }
};

onMounted(async () => {
    if (role.value !== "staff") {
        router.push("/");
    }
    fetchUsers();
});
</script>

<template>
    <AdminLayout>
        <div class="mb-8">
            <h1 class="text-3xl font-black text-neutral mb-2">Quản Lý Người Dùng</h1>
            <p class="text-gray-500">Danh sách thành viên đăng ký trong hệ thống</p>
        </div>

        <div class="flex flex-col gap-8">
            <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-base-200">
                <div class="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
                    <div class="tooltip tooltip-right" data-tip="Họ lót, tên, địa chỉ, số điện thoại">
                        <InputSearch class="w-full sm:w-80" v-model=" searchText "></InputSearch>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-neutral hover:btn-info hover:text-white hover:scale-[1.01]"
                            @click=" goToAddUser ">+ Thêm người dùng</button>
                        <button class="btn btn-outline btn-error hover:text-white hover:scale-[1.01]"
                            @click=" handleDeleteAllUsers ">Xóa tất cả</button>
                    </div>
                </div>
            </div>

            <template v-if=" searchFilteredUsers.length > 0 ">
                <div class="overflow-x-auto bg-white rounded-[2.5rem] shadow-xl border border-base-200">
                    <table class="table table-zebra w-full text-neutral">
                        <thead class="bg-base-200/50">
                            <tr class="text-neutral uppercase text-[10px] tracking-widest border-b border-base-300">
                                <th class="py-5 pl-8">Thành viên</th>
                                <th>Tài khoản</th>
                                <th>Thông tin cá nhân</th>
                                <th>Liên hệ</th>
                                <th class="text-right pr-8">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in searchFilteredUsers" :key="user._id" class="hover:bg-base-100 transition-colors group">
                                <td class="py-4 pl-8">
                                    <div class="flex items-center gap-4">
                                        <div class="avatar shadow-sm">
                                            <div class="mask mask-squircle w-12 h-12">
                                                <img :src="user.avatar || 'https://i.pravatar.cc/150?u=' + (user.username || 'user')" alt="Avatar" />
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-black text-neutral uppercase tracking-tighter">{{ user.last_name }} {{ user.first_name }}</div>
                                            <div class="text-[10px] font-bold text-primary uppercase">{{ user.role }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="font-mono text-xs opacity-70">{{ user.username }}</span>
                                </td>
                                <td>
                                    <div class="flex flex-col gap-0.5">
                                        <div class="flex items-center gap-2">
                                            <span class="badge badge-xs" :class="user.gender ? 'badge-info' : 'badge-secondary'">{{ user.gender ? 'Nam' : 'Nữ' }}</span>
                                            <span class="text-xs font-medium">{{ user.birthday ? new Date(user.birthday).toLocaleDateString('vi-VN') : '---' }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-col gap-0.5 text-xs">
                                        <span class="font-bold">{{ user.phone }}</span>
                                        <span class="opacity-60 italic line-clamp-1 max-w-[150px]">{{ user.address }}</span>
                                    </div>
                                </td>
                                <td class="text-right pr-8">
                                    <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button @click="router.push({ name: 'userprofile.edit', params: { id: user._id } })" 
                                                class="btn btn-sm btn-primary btn-ghost rounded-xl">Sửa</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-else>
                <div class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-base-200">
                    <p class="text-xl font-bold text-gray-400">Hiện tại không thể tìm thấy người dùng nào</p>
                </div>
            </template>
        </div>
    </AdminLayout>
</template>