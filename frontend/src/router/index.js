import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../services/auth.service";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/user/login",
    name: "user.login",
    component: () => import("../views/UserLogin.vue")
  },
  {
    path: "/staff/login",
    name: "staff.login",
    component: () => import("../views/StaffLogin.vue")
  },
  {
    path: "/user/register",
    name: "user.register",
    component: () => import("../views/UserRegister.vue")
  },
  {
    path: "/userprofile",
    name: "userprofile",
    component: () => import("../views/UserProfile.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/rewards",
    name: "rewards",
    component: () => import("../views/UserRewards.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/user/add",
    name: "user.add",
    component: () => import("../views/UserAdd.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/userprofile/edit/:id",
    name: "userprofile.edit",
    component: () => import("../views/UserProfileEdit.vue"),
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: "/books",
    name: "book.list",
    component: () => import("../views/BookList.vue"),
  },
  {
    path: "/book/:id",
    name: "book.detail",
    component: () => import("../views/BookDetail.vue"),
    props: true,
  },
  {
    path: "/book/:id/preview",
    name: "book.preview",
    component: () => import("../views/BookPreview.vue"),
    props: true,
  },
  {
    path: "/users",
    name: "user.list",
    component: () => import("../views/UserList.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/book/add",
    name: "book.add",
    component: () => import("../views/BookAdd.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/book/edit/:id",
    name: "book.edit",
    component: () => import("../views/BookEdit.vue"),
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: "/borrow/add/:id",
    name: "borrow.add",
    component: () => import("../views/BorrowAdd.vue"),
    props: true,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/borrow/edit/:id",
    name: "borrow.edit",
    component: () => (import("../views/BorrowEdit.vue")),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/staffs",
    name: "staff.list",
    component: () => import("../views/StaffList.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/staffprofile",
    name: "staff.profile",
    component: () => import("../views/StaffProfile.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/staff/add",
    name: "staff.add",
    component: () => import("../views/StaffAdd.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/staff/edit/:id",
    name: "staffprofile.edit",
    component: () => import("../views/StaffProfileEdit.vue"),
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: "/publishers",
    name: "publisher.list",
    component: () => import("../views/PublisherList.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/publisher/add",
    name: "publisher.add",
    component: () => import("../views/PublisherAdd.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/publisher/edit/:id",
    name: "publisher.edit",
    component: () => import("../views/PublisherEdit.vue"),
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: "/borrowpending",
    name: "borrow.pending",
    component: () => import("../views/BorrowPending.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/borrowcheck",
    name: "borrow.check",
    component: () => import("../views/BorrowCheck.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/reviews",
    name: "review.list",
    component: () => import("../views/ReviewList.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/Contact.vue"),
  },
  {
    path: "/contact-management",
    name: "contact.management",
    component: () => import("../views/ContactManagement.vue"),
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: "notfound",
    component: () => import("../views/NotFound.vue")
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/user/login");
  } else {
    next();
  }
});

export default router;