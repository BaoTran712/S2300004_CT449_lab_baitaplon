<script setup>
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from 'vue';
import BorrowService from "../services/borrow.service";
import UserService from "../services/user.service";
import BookService from "../services/book.service";
import { push } from "notivue";

const role = computed(() => localStorage.getItem("role"));
const staff_id = computed(() => localStorage.getItem("id"));
const router = useRouter();
const borrowService = new BorrowService();
const bookService = new BookService();
const emit = defineEmits(["fetchBorrows"]);

const props = defineProps({
    borrow: {
        type: Object,
        required: true
    }
});

const loading = ref(true);

const handleApproveBook = async (borrow_id) => {
    try {
        if (props.borrow.book_id?.quantity <= 0) {
            push.error("Duyệt sách thất bại do số lượng sách đã hết");
            return;
        }
        await borrowService.updateBorrow(props.borrow._id, { staff_id: staff_id.value });
        await borrowService.updateBorrow(props.borrow._id, { status: "borrowing" });
        await bookService.updateBook(props.borrow.book_id?._id, { quantity: props.borrow.book_id?.quantity - 1 });
        push.success("Duyệt sách thành công");
        emit("fetchBorrows");
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi duyệt sách");
    }
};

const handleApproveReturnBook = async (borrow_id) => {
    try {
        await borrowService.updateBorrow(props.borrow._id, { staff_id: staff_id.value });
        await borrowService.updateBorrow(props.borrow._id, { status: "returned" });
        await bookService.updateBook(props.borrow.book_id?._id, { quantity: props.borrow.book_id?.quantity + 1 });
        push.success("Duyệt trả sách thành công");
        emit("fetchBorrows");
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi duyệt trả sách");
    }
};

const handleRejectBook = async (borrow_id) => {
    try {
        if (props.borrow.book_id?.quantity <= 0) {
            push.error("Duyệt sách thất bại do số lượng sách đã hết");
            return;
        }
        await borrowService.updateBorrow(props.borrow._id, { staff_id: staff_id.value });
        await borrowService.updateBorrow(props.borrow._id, { status: "rejected" });
        push.success("Từ chối duyệt sách thành công");
        emit("fetchBorrows");
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi duyệt sách");
    }
};

const handleReturnBook = async (borrow_id) => {
    try {
        await borrowService.updateBorrow(props.borrow._id, { status: "return_pending" });
        push.info("Đang xử lý trả sách");
        emit("fetchBorrows");
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi trả sách");
    }
};

const handleDeleteBorrow = async (borrow_id) => {
    try {
        if (confirm("Xác nhận xóa đơn mượn sách?")) {
            await borrowService.deleteBorrow(borrow_id);
            push.info("Xóa đơn mượn sách thành công");
            emit("fetchBorrows");
        }
    } catch (error) {
        console.log(error);
        push.error("Đã xảy ra lỗi khi xóa đơn mượn sách");
    }
};

const goToEditBorrow = async (borrow_id) => {
    router.push({ name: "borrow.edit", params: { id: borrow_id } });
};
</script>

<template>
    <div
        class="flex flex-wrap flex-col shadow rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.001] transition">
        <div class="flow-root">
            <div class="h-48 w-full">
                <div v-if=" loading " class="skeleton object-fit h-full w-full"></div>
                <img alt="Book cover" loading="lazy" @load="loading = false" :class=" { 'opacity-0': loading } "
                    :src=" `https://picsum.photos/seed/${ props.borrow.book_id?.title }/800` "
                    class="shadow-md h-full w-full object-cover transition-all duration-300" />
            </div>


            <dl class="divide-y divide-gray-200 rounded border border-gray-200 text-sm">
                <template v-if=" role === 'staff' ">
                    <div class="grid grid-cols-1 p-2">
                        <dt class="font-bold text-gray-900">Người mượn</dt>
                        <dd class="text-gray-800 sm:col-span-2 truncate">{{ ( borrow.user_id?.last_name &&
                            borrow.user_id?.first_name
                        ) ? `${ borrow.user_id.last_name } ${ borrow.user_id.first_name }` : "Không xác định" }}
                        </dd>
                    </div>
                </template>

                <div class="grid grid-cols-1 p-2">
                    <dt class="font-bold text-gray-900">Nhân viên duyệt</dt>
                    <dd class="text-gray-800 sm:col-span-2 truncate">{{ borrow.staff_id?.name || "Không xác định"
                    }}
                    </dd>
                </div>

                <div class="grid grid-cols-1 p-2">
                    <dt class="font-bold text-gray-900">Tựa sách</dt>

                    <dd class="text-gray-800 sm:col-span-2 truncate">{{ borrow.book_id?.title || "Không xác định" }}
                    </dd>
                </div>

                <div class="grid grid-cols-1 p-2">
                    <dt class="font-bold text-gray-900">Ngày mượn</dt>

                    <dd class="text-gray-800 sm:col-span-2 truncate">{{ borrow.borrow_date ? new
                        Date( borrow.borrow_date ).toLocaleDateString( "vi-VN" ) : "Không xác định" }}</dd>
                </div>

                <div class="grid grid-cols-1 p-2">
                    <dt class="font-bold text-gray-900">Ngày trả</dt>

                    <dd class="text-gray-800 sm:col-span-2 truncate">{{ borrow.return_date ? new
                        Date( borrow.return_date ).toLocaleDateString( "vi-VN" ) : "Không xác định" }}</dd>
                </div>

                <template v-if=" role === 'staff' ">
                    <div class="grid grid-cols-1 p-2">
                        <dt class="font-bold text-gray-900 truncate">Số lượng còn lại</dt>
                        <template v-if=" borrow.book_id?.quantity >= 45 ">
                            <dd class="text-emerald-600 font-bold sm:col-span-2 truncate">{{ `Còn ${ borrow.book_id?.quantity }
                                quyển sách` }}</dd>
                        </template>
                        <template v-else-if=" borrow.book_id?.quantity >= 30 ">
                            <dd class="text-lime-600 font-bold sm:col-span-2 truncate">{{ `Còn ${ borrow.book_id?.quantity } quyển
                                sách` }}</dd>
                        </template>
                        <template v-else-if=" borrow.book_id?.quantity >= 15 ">
                            <dd class="text-amber-600 font-bold sm:col-span-2 truncate">{{ `Còn ${ borrow.book_id?.quantity } quyển
                                sách` }}</dd>
                        </template>
                        <template v-else-if=" borrow.book_id?.quantity >= 1 ">
                            <dd class="text-red-600 font-bold sm:col-span-2 truncate">{{ `Còn ${ borrow.book_id?.quantity } quyển
                                sách` }}</dd>
                        </template>
                        <template v-else>
                            <dd class="text-stone-600 font-bold sm:col-span-2 truncate">Đã hết sách</dd>
                        </template>
                    </div>
                </template>

                <div class="grid grid-cols-1 p-2">
                    <dt class="font-bold text-gray-900">Trạng thái</dt>

                    <template v-if=" borrow.status === 'pending' ">
                        <dd class="text-amber-500 font-bold sm:col-span-2 truncate">Chờ duyệt</dd>
                    </template>
                    <template v-else-if=" borrow.status === 'borrowing' ">
                        <dd class="text-sky-500 font-bold sm:col-span-2 truncate">Đang mượn</dd>
                    </template>
                    <template v-else-if=" borrow.status === 'return_pending' ">
                        <dd class="text-amber-500 font-bold sm:col-span-2 truncate">Chờ duyệt trả</dd>
                    </template>
                    <template v-else-if=" borrow.status === 'returned' ">
                        <dd class="text-emerald-500 font-bold sm:col-span-2 truncate">Đã trả</dd>
                    </template>
                    <template v-else-if=" borrow.status === 'rejected' ">
                        <dd class="text-red-600 font-bold sm:col-span-2 truncate">Từ chối</dd>
                    </template>
                    <template v-else-if=" borrow.status === 'overdue' ">
                        <dd class="text-red-600 font-bold sm:col-span-2 truncate">Quá hạn</dd>
                    </template>
                    <template v-else>
                        <dd class="text-gray-500 font-bold sm:col-span-2 truncate">Không xác định</dd>
                    </template>
                </div>

                <template v-if=" role === 'staff' ">
                    <template v-if=" borrow.status === 'pending' ">
                        <div class="grid grid-cols-1">
                            <button @click=" handleApproveBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Duyệt
                                sách</button>
                        </div>
                        <div class="grid grid-cols-1">
                            <button @click=" handleRejectBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-error hover:text-white">Từ
                                chối</button>
                        </div>
                    </template>

                    <template v-if=" borrow.status === 'return_pending' ">
                        <div class="grid grid-cols-1">
                            <button @click=" handleApproveReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Duyệt
                                trả sách</button>
                        </div>

                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleRejectBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Từ
                                chối</button>
                        </div>
                    </template>

                    <template v-if=" borrow.status === 'borrowing' ">
                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleApproveReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Duyệt
                                trả sách</button>
                        </div>

                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleRejectBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Từ
                                chối</button>
                        </div>
                    </template>

                    <template v-if=" borrow.status === 'rejected' ">
                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Duyệt
                                trả
                                sách</button>
                        </div>
                        <div class="grid grid-cols-1">
                            <button @click=" handleDeleteBorrow( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-error hover:text-white">Xóa
                                đơn mượn</button>
                        </div>
                    </template>

                    <template v-if=" borrow.status === 'returned' ">
                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Duyệt
                                trả sách</button>
                        </div>
                        <div class="grid grid-cols-1">
                            <button @click=" handleDeleteBorrow( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-error hover:text-white">Xóa
                                đơn mượn</button>
                        </div>
                    </template>

                    <template v-if=" borrow.status === 'overdue' ">
                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Duyệt
                                trả sách</button>
                        </div>
                        <div class="grid grid-cols-1">
                            <button @click=" handleDeleteBorrow( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-error hover:text-white">Xóa
                                đơn mượn</button>
                        </div>
                    </template>

                    <div class="grid grid-cols-1">
                        <button @click=" goToEditBorrow( props.borrow._id )"
                            class="btn btn-ghost text-base hover:underline hover:btn-info hover:text-white">Chỉnh
                            sửa</button>
                    </div>
                </template>

                <template v-if=" role === 'user' ">
                    <template v-if=" borrow.status === 'pending' ">
                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Trả
                                sách</button>
                        </div>
                    </template>
                    <template v-if=" borrow.status === 'borrowing' ">
                        <div class="grid grid-cols-1">
                            <button @click=" handleReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Trả
                                sách</button>
                        </div>
                    </template>
                    <template v-if=" borrow.status === 'return_pending' ">
                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Trả
                                sách</button>
                        </div>
                    </template>
                    <template v-if=" borrow.status === 'rejected' ">
                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Trả
                                sách</button>
                        </div>
                    </template>

                    <template v-if=" borrow.status === 'returned' ">
                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Trả
                                sách</button>
                        </div>
                    </template>

                    <template v-if=" borrow.status === 'overdue' ">
                        <div class="grid grid-cols-1">
                            <button disabled @click=" handleReturnBook( props.borrow._id )"
                                class="btn btn-ghost text-base hover:underline hover:btn-success hover:text-white">Trả
                                sách</button>
                        </div>
                    </template>
                </template>
            </dl>
        </div>

    </div>
</template>