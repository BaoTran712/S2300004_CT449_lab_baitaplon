import { useRouter } from 'vue-router';
import { push } from 'notivue';

export function useAuth() {
    const router = useRouter();

    const logOut = () => {
        if (confirm("Xác nhận đăng xuất?")) {
            localStorage.clear();
            push.info("Đăng xuất thành công");
            router.push('/');
        }
    };

    return { logOut };
}