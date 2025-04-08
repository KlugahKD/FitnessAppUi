<script setup lang="ts">
definePageMeta({
  middleware() {
    return navigateTo("/auth");
  },
});
</script>
