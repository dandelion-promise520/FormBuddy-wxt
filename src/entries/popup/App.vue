<template>
  <div class="flex w-auto min-w-xl flex-col gap-4 p-2">
    <header class="flex items-center justify-between rounded-t-2xl bg-[#409eff] p-2 text-white">
      <span class="text-sm"> 这是一个帮忙快速填写表单的工具 </span>
      <el-button>新增表单</el-button>
    </header>
    <main>
      <section class="flex items-center justify-between gap-2">
        <!-- 提示按键部分 -->
        <kbd
          class="center rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-sm font-medium text-nowrap text-gray-800 shadow-[inset_0_-1px_0_#d1d5db] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:shadow-[inset_0_-1px_0_#374151]"
        >
          alt + 1
        </kbd>

        <!-- 输入框部分 -->
        <el-input
          placeholder="可以填写您的常用信息"
          :disabled="!isEdit"
          v-model="input"
          @blur="handleBlur"
        />

        <!-- 按钮组部分 -->
        <div class="flex">
          <el-button type="primary" @click="handleFill">填充</el-button>
          <el-button type="success" @click="handleEdit">编辑</el-button>
          <el-button type="danger" @click="handleDelete">删除</el-button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const input = ref("");
const isEdit = ref(false);

// 输入框失焦
const handleBlur = () => {
  isEdit.value = false;
};

// 填充按钮
const handleFill = async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (tab.id) {
    await browser.tabs.sendMessage(tab.id, input.value);
  }
};

// 编辑按钮
const handleEdit = () => {
  isEdit.value = true;
};

// 删除此表单
const handleDelete = () => {
  input.value = "";
};
</script>

<style></style>
