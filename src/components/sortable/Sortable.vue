<script setup lang="ts" generic="T">
import { DnDOperations, IDnDPayload, IDnDStore, useDroppable } from "@vue-dnd-kit/core";
import { computed } from "vue";

const { groups = ["sortable"], data } = defineProps<{
  groups?: string[];
  data: T[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  dragEnd: [{ store: IDnDStore; payload: IDnDPayload }];
}>();

const { elementRef } = useDroppable({
  groups,
  data: computed(() => ({
    data,
  })),
  events: {
    // onDrop: DnDOperations.applyTransfer,
    onDrop: (store, payload) => {
      emit("dragEnd", { store, payload });
      DnDOperations.applyTransfer(store);
    },
  },
});
</script>

<template>
  <ul ref="elementRef" class="vue-dnd-sortable">
    <slot />
  </ul>
</template>

<style src="./styles.css" />
