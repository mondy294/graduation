<template>
    <div class="collapse-panel">
      <div class="header" @click="toggle">
        <slot name="header">Toggle</slot>
      </div>
      <transition name="collapse">
        <div class="content" v-if="isOpen">
          <slot name="content">Content Here</slot>
        </div>
      </transition>
    </div>
    <div>1111</div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'CollapsePanel',
    setup() {
      const isOpen = ref(false);
  
      const toggle = () => {
        isOpen.value = !isOpen.value;
      };
  
      return {
        isOpen,
        toggle
      };
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .content{
    background-color:blue;
    height: 100px;
  }
  .collapse-panel .header {
    cursor: pointer;
    background-color:red;
  }
  
  .collapse-panel .content {
    overflow: hidden;
  }
  
  .collapse-enter-active, .collapse-leave-active {
    transition: all 0.5s ease;
  }
  
  .collapse-enter-from, .collapse-leave-to {
    height: 0px;
  }
  .collapse-enter-to, .collapse-leave-from {
    height: 100px;
  }
  </style>