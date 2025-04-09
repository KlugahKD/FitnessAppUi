// composables/useNav.ts
import {
  Dumbbell,
  SquareActivity,
  Bot,
  Kanban,
  ChevronRight,
} from "lucide-vue-next";

export const useNav = () => {
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
  };
  const navMain = [
    {
      title: "Overview",
      icon: "Kanban",
      url: "/dashboard",
    },
    {
      title: "Workouts",
      icon: "Dumbbell",
      url: "/workouts",
    },
    {
      title: "Health Advice",
      icon: "SquareActivity",
      url: "/health",
    },
    {
      title: "Avatar",
      icon: "Bot",
      url: "/avatar",
    },
  ];

  const versions = ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"];

  const icons = {
    ChevronRight,
    Dumbbell,
    SquareActivity,
    Bot,
    Kanban,
  };

  return {
    navMain,
    versions,
    icons,
    data,
  };
};
