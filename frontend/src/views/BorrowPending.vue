<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import InputSearch from "../components/InputSearch.vue";
import BorrowCard from "../components/BorrowCard.vue";
import AdminLayout from "../components/AdminLayout.vue";

import { useRouter } from "vue-router";
import { ref, computed, onMounted } from 'vue';
import BorrowService from "../services/borrow.service";
import BookService from "../services/book.service";
import { push } from "notivue";

const router = useRouter();
const borrowService = new BorrowService();
const bookService = new BookService();
const role = computed(() => localStorage.getItem("role"));
const staff_id = computed(() => localStorage.getItem("id"));

const borrows = ref([]);
const searchText = ref("");
const filteredStatus = ref("");
const filteredStatusText = ref("");

const fetchBorrows = async () => {
    try {
        const response = await borrowService.getAllBorrows();
        borrows.value = response;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        for (const borrow of borrows.value) {
            const returnDate = new Date(borrow.return_date).setHours(0, 0, 0, 0);
            if ((now > returnDate && borrow.status !== "returned" && borrow.status !== "rejected")) {
                await borrowService.updateBorrow(borrow._id, { status: "overdue" });
            }
        };
    } catch (error) {
        console.error(error);
    }
};

const handleFilterStatus = (status) => {
    filteredStatus.value = status;
    switch (status) {
        case "pending":
            filteredStatusText.value = "Chờ duyệt";
            break;
        case "return_pending":
            filteredStatusText.value = "Chờ duyệt trả";
            break;
        case "borrowing":
            filteredStatusText.value = "Đang mượn";
            break;
        case "returned":
            filteredStatusText.value = "Đã trả";
            break;
        case "rejected":
            filteredStatusText.value = "Từ chối";
            break;
        case "overdue":
            filteredStatusText.value = "Quá hạn";
            break;
        default:
            filteredStatusText.value = "Tất cả sách";
            break;
    }
};

const filteredBorrows = computed(() => {
    let result = borrows.value;
    if (filteredStatus.value) {
        return result.filter(borrow => borrow.status === filteredStatus.value);
    }
    if (searchText.value) {
        const keyword = searchText.value.toLowerCase();
        return borrows.value.filter(borrow => {
            const searchableText = [borrow.book_id?.title, borrow.user_id?.first_name, borrow.user_id?.last_name, borrow.staff_id?.name]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return searchableText.includes(keyword);
        });
    }
    return borrows.value;
});

const handleApproveAllBorrows = async () => {
    try {
        const pendingBorrows = borrows.value.filter(borrow => borrow.status === "pending");
        const return_pendingBorrows = borrows.value.filter(borrow => borrow.status === "return_pending");
        for (const borrow of pendingBorrows) {
            if (borrow.book_id?.quantity > 0) {
                await borrowService.updateBorrow(borrow._id, { staff_id: staff_id.value });
                await borrowService.updateBorrow(borrow._id, { status: "borrowing" });
                await bookService.updateBook(borrow.book_id?._id, { quantity: borrow.book_id?.quantity - 1 });
            } else {
                push.error("Không thể duyệt tất cả sách do có sách đã hết");
                return;
            }
        }
        for (const borrow of return_pendingBorrows) {
            if (borrow.book_id?.quantity > 0) {
                await borrowService.updateBorrow(borrow._id, { staff_id: staff_id.value });
                await borrowService.updateBorrow(borrow._id, { status: "returned" });
                await bookService.updateBook(borrow.book_id?._id, { quantity: borrow.book_id?.quantity + 1 });
            } else {
                push.error("Không thể duyệt tất cả sách do có sách đã hết");
                return;
            }
        }
        push.success("Đã duyệt tất cả các đơn mượn chưa được duyệt");
        fetchBorrows();
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi trong quá trình duyệt tất cả các đơn mượn");
    }
};

const handleApproveBook = async (borrow) => {
    try {
        if (borrow.book_id?.quantity <= 0) {
            push.error("Duyệt sách thất bại do số lượng sách đã hết");
            return;
        }
        await borrowService.updateBorrow(borrow._id, { staff_id: staff_id.value });
        await borrowService.updateBorrow(borrow._id, { status: "borrowing" });
        await bookService.updateBook(borrow.book_id?._id, { quantity: borrow.book_id?.quantity - 1 });
        push.success("Duyệt sách thành công");
        fetchBorrows();
    } catch (error) {
        push.error("Đã xảy ra lỗi khi duyệt sách");
    }
};

const handleApproveReturnBook = async (borrow) => {
    try {
        await borrowService.updateBorrow(borrow._id, { staff_id: staff_id.value });
        await borrowService.updateBorrow(borrow._id, { status: "returned" });
        await bookService.updateBook(borrow.book_id?._id, { quantity: borrow.book_id?.quantity + 1 });
        push.success("Duyệt trả sách thành công");
        fetchBorrows();
    } catch (error) {
        push.error("Đã xảy ra lỗi khi duyệt trả sách");
    }
};

const handleRejectBook = async (borrow) => {
    try {
        await borrowService.updateBorrow(borrow._id, { staff_id: staff_id.value });
        await borrowService.updateBorrow(borrow._id, { status: "rejected" });
        push.success("Từ chối duyệt sách thành công");
        fetchBorrows();
    } catch (error) {
        push.error("Đã xảy ra lỗi khi duyệt sách");
    }
};

const handleDeleteBorrow = async (borrowId) => {
    if (confirm("Xác nhận xóa đơn mượn sách?")) {
        try {
            await borrowService.deleteBorrow(borrowId);
            push.info("Xóa đơn mượn sách thành công");
            fetchBorrows();
        } catch (error) {
            push.error("Đã xảy ra lỗi khi xóa đơn mượn sách");
        }
    }
};

onMounted(async () => {
    if (role.value !== "staff") {
        router.push("/");
    }
    fetchBorrows();
});
</script>

<template>
    <AdminLayout>
        <div class="mb-8">
            <h1 class="text-3xl font-black text-neutral mb-2">Quản Lý Đơn Mượn</h1>
            <p class="text-gray-500">Phê duyệt và theo dõi trạng thái mượn trả sách</p>
        </div>

        <div class="flex flex-col gap-8">
            <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-base-200">
                <div class="flex flex-col xl:flex-row gap-4 justify-between items-center w-full">
                    <div class="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-center">
                        <div class="tooltip tooltip-bottom" data-tip="Người mượn, nhân viên duyệt, tựa sách">
                            <InputSearch class="w-full md:w-80" v-model=" searchText "></InputSearch>
                        </div>
                        
                        <div class="dropdown dropdown-center">
                            <div tabindex="0" role="button" class="btn btn-ghost bg-base-100 border border-base-300 min-w-[160px]">
                                {{ filteredStatusText || "Tất cả trạng thái" }}
                            </div>
                            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl border border-base-200">
                                <li><a @click="handleFilterStatus( '' )">Tất cả sách</a></li>
                                <li><a @click="handleFilterStatus( 'pending' )">Chờ duyệt</a></li>
                                <li><a @click="handleFilterStatus( 'borrowing' )">Đang mượn</a></li>
                                <li><a @click="handleFilterStatus( 'return_pending' )">Chờ duyệt trả</a></li>
                                <li><a @click="handleFilterStatus( 'returned' )">Đã trả</a></li>
                                <li><a @click="handleFilterStatus( 'rejected' )">Từ chối</a></li>
                                <li><a @click="handleFilterStatus( 'overdue' )">Quá hạn</a></li>
                            </ul>
                        </div>
                    </div>

                    <button class="btn btn-neutral hover:btn-success hover:text-white w-full xl:w-auto"
                        @click=" handleApproveAllBorrows ">
                        Duyệt tất cả đơn chờ
                    </button>
                </div>
            </div>

            <template v-if=" filteredBorrows.length > 0 ">
                <div class="overflow-x-auto bg-white rounded-[2.5rem] shadow-xl border border-base-200">
                    <table class="table table-zebra w-full text-neutral">
                        <thead class="bg-base-200/50">
                            <tr class="text-neutral uppercase text-[10px] tracking-widest border-b border-base-300">
                                <th class="py-5 pl-8 text-center">Hình ảnh</th>
                                <th>Độc giả & Sách</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th class="text-right pr-8">Xử lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="borrow in filteredBorrows" :key="borrow._id" class="hover:bg-base-100 transition-colors group">
                                <td class="py-4 pl-8">
                                    <div class="avatar shadow-md">
                                        <div class="w-12 h-16 rounded-lg overflow-hidden">
                                            <img :src="borrow.book_id?.image || 'https://picsum.photos/seed/' + (borrow.book_id?.title || 'book') + '/200/300'" 
                                                 class="object-cover w-full h-full" alt="Book" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-col gap-1">
                                        <span class="font-black text-neutral line-clamp-1 uppercase tracking-tighter">{{ borrow.book_id?.title }}</span>
                                        <div class="flex items-center gap-2">
                                            <div class="avatar placeholder">
                                                <div class="bg-neutral text-neutral-content rounded-full w-4 h-4 text-[8px]">
                                                    <span>{{ (borrow.user_id?.first_name || 'U').charAt(0) }}</span>
                                                </div>
                                            </div>
                                            <span class="text-[10px] font-bold opacity-70">{{ borrow.user_id?.last_name }} {{ borrow.user_id?.first_name }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex flex-col text-[10px] font-mono">
                                        <span class="text-neutral font-bold tracking-tight">Mượn: {{ new Date(borrow.borrow_date).toLocaleDateString('vi-VN') }}</span>
                                        <span class="text-error font-bold tracking-tight">Hạn: {{ new Date(borrow.return_date).toLocaleDateString('vi-VN') }}</span>
                                    </div>
                                </td>
                                <td>
                                    <div v-if="borrow.status === 'pending'" class="badge badge-warning badge-sm font-bold uppercase text-[9px]">Chờ duyệt</div>
                                    <div v-else-if="borrow.status === 'borrowing'" class="badge badge-info badge-sm font-bold uppercase text-[9px] text-white">Đang mượn</div>
                                    <div v-else-if="borrow.status === 'return_pending'" class="badge badge-warning badge-sm font-bold uppercase text-[9px]">Chờ duyệt trả</div>
                                    <div v-else-if="borrow.status === 'returned'" class="badge badge-success badge-sm font-bold uppercase text-[9px] text-white">Đã trả</div>
                                    <div v-else-if="borrow.status === 'rejected'" class="badge badge-error badge-sm font-bold uppercase text-[9px] text-white">Từ chối</div>
                                    <div v-else-if="borrow.status === 'overdue'" class="badge badge-error badge-sm font-bold uppercase text-[9px] text-white animate-pulse">Quá hạn</div>
                                    <div v-if="borrow.staff_id" class="text-[8px] opacity-40 mt-1 uppercase font-bold italic">Duyệt bởi: {{ borrow.staff_id.name || borrow.staff_id }}</div>
                                </td>
                                <td class="text-right pr-8">
                                    <div class="flex justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity flex-wrap sm:flex-nowrap">
                                        <template v-if="borrow.status === 'pending'">
                                            <button @click="handleApproveBook(borrow)" class="btn btn-xs btn-success text-white">Duyệt</button>
                                            <button @click="handleRejectBook(borrow)" class="btn btn-xs btn-error text-white">Bỏ</button>
                                        </template>
                                        <template v-else-if="borrow.status === 'return_pending'">
                                            <button @click="handleApproveReturnBook(borrow)" class="btn btn-xs btn-success text-white">Duyệt Trả</button>
                                        </template>
                                        <button @click="router.push({ name: 'borrow.edit', params: { id: borrow._id } })" 
                                                class="btn btn-xs btn-ghost btn-neutral">Sửa</button>
                                        <button v-if="['returned', 'rejected', 'overdue'].includes(borrow.status)" 
                                                @click="handleDeleteBorrow(borrow._id)" class="btn btn-xs btn-ghost btn-error">Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-else>
                <div class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-base-200">
                    <p class="text-xl font-bold text-gray-400">Không có đơn mượn nào cần xử lý</p>
                </div>
            </template>
        </div>
    </AdminLayout>
</template>