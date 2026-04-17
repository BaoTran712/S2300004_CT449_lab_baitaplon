<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import InputSearch from '../components/InputSearch.vue';
import UserCard from '../components/UserCard.vue';

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
    <div class="flex flex-col min-h-screen overflow-hidden">
        <Header></Header>
        <div class="flex-grow mx-8 sm:mx-16 lg:mx-24 my-8">
            <div class="flex flex-col sm:flex-row gap-2 justify-center">
                <div class="tooltip" data-tip="Họ lót, tên, địa chỉ, số điện thoại">
                    <InputSearch class="w-full" v-model=" searchText "></InputSearch>
                </div>
                <template v-if=" role === 'staff' ">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 mb-8">
                        <button class="btn btn-neutral hover:btn-info hover:text-white hover:scale-[1.01]"
                            @click=" goToAddUser ">Thêm người dùng</button>
                        <button class="btn btn-neutral hover:btn-error hover:text-white hover:scale-[1.01]"
                            @click=" handleDeleteAllUsers ">Xóa tất cả</button>
                    </div>
                </template>
            </div>
            <template v-if=" searchFilteredUsers.length > 0 ">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                    <UserCard v-for=" user in searchFilteredUsers " :key=" user._id " :user=" user "></UserCard>
                </div>
            </template>
            <template v-else>
                <div class="grid grid-cols-1 text-center">

                    <p class="py-6 font-bold">Hiện tại không thể tìm thấy người dùng</p>
                </div>
            </template>
        </div>
        <Footer></Footer>
    </div>
</template>