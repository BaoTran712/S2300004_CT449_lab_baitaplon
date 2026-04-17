<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import InputSearch from '../components/InputSearch.vue';

import PublisherService from "../services/publisher.service";
import PublisherCard from '../components/PublisherCard.vue';
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
    <div class="flex flex-col min-h-screen">
        <Header></Header>
        <section class="flex-grow mx-8 sm:mx-16 lg:mx-24 my-8">

            <div class="flex flex-col sm:flex-row gap-2 justify-center">
                <div class="tooltip" data-tip="Tên nhà xuất bản, địa chỉ">
                    <InputSearch class="w-full" v-model=" searchText "></InputSearch>
                </div>

                <template v-if=" role === 'staff' ">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2">
                        <button class="btn btn-neutral hover:btn-info hover:text-white hover:scale-[1.01]"
                            @click=" goToAddPublisher ">Thêm nhà xuất bản</button>
                        <button class="btn btn-neutral hover:btn-error hover:text-white hover:scale-[1.01]"
                            @click=" handleDeleteAllPublishers ">Xóa tất cả</button>
                    </div>
                </template>
            </div>

            <template v-if=" searchFilteredPublishers.length > 0 ">
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8 mt-8">
                    <PublisherCard v-for=" publisher in searchFilteredPublishers " :key=" publisher._id "
                        :publisher=" publisher "></PublisherCard>
                </div>
            </template>
            <template v-else>
                <div class="grid grid-cols-1 text-center mt-8">

                    <p class="py-6 font-bold">Lỗi không thể tìm thấy người dùng</p>
                </div>
            </template>
        </section>
        <Footer></Footer>
    </div>
</template>