<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import InputSearch from '../components/InputSearch.vue';

import PublisherService from "../services/publisher.service";
import PublisherCard from '../components/PublisherCard.vue';
import AdminLayout from '../components/AdminLayout.vue';

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { push } from 'notivue';

const publisherService = new PublisherService();
const router = useRouter();
const publishers = ref([]);
const searchText = ref("");
const role = computed(() => localStorage.getItem("role"));

const fetchPublishers = async () => {
    try {
        const response = await publisherService.getAllPublishers();
        // debug code later
        // console.log(response);
        publishers.value = response;
    } catch (error) {
        console.error(error);
    }
};

const searchFilteredPublishers = computed(() => {
    if (!searchText.value) return publishers.value;

    const keyword = searchText.value.toLowerCase();

    return publishers.value.filter(publisher => {
        const searchableText = [publisher.name, publisher.address]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return searchableText.includes(keyword);
    });
});

const goToAddPublisher = () => {
    router.push({ name: "publisher.add" });
};

const handleDeleteAllPublishers = async () => {
    try {
        if (confirm("Xác nhận xóa tất cả nhà xuất bản?")) {
            await publisherService.deleteAllPublishers();
            push.success("Xóa tất cả nhà xuất bản thành công");
            fetchPublishers();
        }
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi xóa tất cả nhà xuất bản");
    }
};

onMounted(async () => {
    if (role.value !== "staff") {
        router.push("/");
    }
    fetchPublishers();
});
</script>

<template>
    <AdminLayout>
        <div class="mb-8">
            <h1 class="text-3xl font-black text-neutral mb-2">Quản Lý Nhà Xuất Bản</h1>
            <p class="text-gray-500">Thông tin liên hệ các đối tác xuất bản</p>
        </div>

        <div class="flex flex-col gap-8">
            <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-base-200">
                <div class="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
                    <div class="tooltip tooltip-right" data-tip="Tên nhà xuất bản, địa chỉ">
                        <InputSearch class="w-full sm:w-80" v-model=" searchText "></InputSearch>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-neutral hover:btn-info hover:text-white hover:scale-[1.01]"
                            @click=" goToAddPublisher ">+ Thêm NXB</button>
                        <button class="btn btn-outline btn-error hover:text-white hover:scale-[1.01]"
                            @click=" handleDeleteAllPublishers ">Xóa tất cả</button>
                    </div>
                </div>
            </div>

            <template v-if=" searchFilteredPublishers.length > 0 ">
                <div class="overflow-x-auto bg-white rounded-[2.5rem] shadow-xl border border-base-200 mt-4">
                    <table class="table table-zebra w-full text-neutral">
                        <thead class="bg-base-200/50">
                            <tr class="text-neutral uppercase text-[10px] tracking-widest border-b border-base-300">
                                <th class="py-5 pl-8">Nhà Xuất Bản</th>
                                <th>Địa chỉ</th>
                                <th class="text-right pr-8">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="publisher in searchFilteredPublishers" :key="publisher._id" class="hover:bg-base-100 transition-colors group">
                                <td class="py-4 pl-8">
                                    <div class="font-black text-neutral uppercase tracking-tighter">{{ publisher.name }}</div>
                                </td>
                                <td>
                                    <span class="text-sm italic opacity-70">{{ publisher.address }}</span>
                                </td>
                                <td class="text-right pr-8">
                                    <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button @click="router.push({ name: 'publisher.edit', params: { id: publisher._id } })" 
                                                class="btn btn-sm btn-ghost btn-info rounded-xl">Sửa</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-else>
                <div class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-base-200">
                    <p class="text-xl font-bold text-gray-400">Không tìm thấy nhà xuất bản nào phù hợp</p>
                </div>
            </template>
        </div>
    </AdminLayout>
</template>