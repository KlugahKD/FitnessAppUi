<script setup lang="ts">
import { useNav } from "@/composables/useNav";
import { useRoute } from "vue-router";
import { computed } from "vue";

import FloatingAssistant from "@/components/FloatingAssistant.vue";

const route = useRoute();
const { navMain } = useNav();

const breadcrumbTitle = computed(() => {
  const match = navMain.find((item) => item.url === route.path);
  return match?.title || "Page";
});

const hideAssistantOn = ["/avatar"];
const showAssistant = computed(() => !hideAssistantOn.includes(route.path));
</script>

<template>
  <ClientOnly>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <h3>{{ breadcrumbTitle }}</h3>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <slot />
      </SidebarInset>

      <!-- 🧠 Floating AI Assistant -->
      <FloatingAssistant v-if="showAssistant" />
    </SidebarProvider>
  </ClientOnly>
</template>
