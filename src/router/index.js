import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "menu",
      component: () => import("@/views/MenuView.vue"),
    },
    {
      path: "/manifesto",
      name: "manifesto",
      component: () => import("@/views/ManifestoView.vue"),
    },
    {
      path: "/roadmap",
      name: "roadmap",
      component: () => import("@/views/RoadmapView.vue"),
    },
    {
      path: "/faq",
      name: "faq",
      component: () => import("@/views/FaqView.vue"),
    },
    {
      path: "/credits",
      name: "credits",
      component: () => import("@/views/CreditsView.vue"),
    },
  ],
});

export default router;
