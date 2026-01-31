<template>
  <div class="flex w-auto min-w-xl flex-col gap-4 p-1">
    <header class="flex items-center justify-between rounded-t-md bg-[#409eff] p-2 text-white">
      <span class="text-sm"> 这是一个帮忙快速填写表单的工具 </span>
      <el-button @click="handleAdd">新增表单</el-button>
    </header>

    <Sortable
      :data="dataArray"
      @drag-end="({ store, payload }) => handleDragEnd({ store, payload })"
    >
      <TransitionGroup name="task-list" tag="div">
        <SortableItem
          v-for="(data, index) in dataArray"
          :key="data.id"
          :index="index"
          :source="dataArray"
          class="flex items-center justify-between gap-2"
        >
          <template #default="{ handleDragStart }">
            <!-- 拖拽器 -->
            <el-icon
              :size="28"
              class="cursor-move rounded-md p-1 duration-300 hover:bg-gray-300"
              @pointerdown="handleDragStart"
            >
              <span className="icon-[icon-park-outline--drag]" />
            </el-icon>

            <!-- 提示按键部分 -->
            <kbd
              class="center rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-sm font-medium text-nowrap text-gray-800 shadow-[inset_0_-1px_0_#d1d5db] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:shadow-[inset_0_-1px_0_#374151]"
            >
              alt+ {{ index + 1 }}
            </kbd>

            <!-- 输入框部分 -->
            <el-input
              placeholder="可以填写您的常用信息"
              v-model="data.value"
              :disabled="!data.isEdit"
              @blur="handleBlur(data)"
            />

            <!-- 按钮组部分 -->
            <div class="flex">
              <el-button type="primary" @click="handleFill(data)">填充</el-button>
              <el-button type="success" @click="handleEdit(data)">编辑</el-button>
              <el-popconfirm
                cancel-button-text="取消"
                cancel-button-type="default"
                confirm-button-text="确认"
                confirm-button-type="danger"
                width="220"
                icon-color="#626AEF"
                title="确认删除此表单吗?"
                @confirm="handleDelete(data)"
              >
                <template #reference>
                  <el-button type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </SortableItem>
      </TransitionGroup>
    </Sortable>
  </div>
</template>

<script setup lang="ts">
import { Sortable, SortableItem } from "@/components/sortable";
import { IDnDPayload, IDnDStore } from "@vue-dnd-kit/core";
import { nanoid } from "nanoid";
import { TransitionGroup } from "vue";

interface DataProp {
  id: string;
  value: string;
  isEdit: boolean;
}

// 表单数据
const dataArray = ref<DataProp[]>([]);

// 定义表单数据的存储值
const dataStorage = storage.defineItem<DataProp[]>("local:data");

// 页面挂载时将存储值赋值给表单数据
onMounted(async () => {
  dataArray.value = (await dataStorage.getValue()) ||
    // 初始化时本地存储没有值则采用默认值
    [
      { id: nanoid(), isEdit: false, value: "可以填您的qq号" },
      { id: nanoid(), isEdit: false, value: "可以填您的手机号" },
    ];
});

// 新增表单
const handleAdd = async () => {
  const array = dataArray.value;

  // 给array push一下
  array.push({ id: nanoid(), isEdit: false, value: "" });

  dataArray.value = array;
};

// 拖拽完成之后重新存一下数组，使得下次刷新时是拖拽后的排序
const handleDragEnd = async ({ payload }: { store: IDnDStore; payload: IDnDPayload }) => {
  await dataStorage.setValue(toRaw(payload.items[0].data?.source as DataProp[]));
};

// 输入框失焦
const handleBlur = async (data: DataProp) => {
  data.isEdit = false;
  await dataStorage.setValue(toRaw(dataArray.value));
};

// 填充按钮
const handleFill = async (data: DataProp) => {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    if (!tab.id) return;

    await browser.tabs.sendMessage(tab.id, data.value);
  } catch (err) {
    console.warn("填充失败：当前页面未注入脚本", err);
  }
};

// 编辑按钮
const handleEdit = (data: DataProp) => {
  data.isEdit = true;
};

// 删除此表单
const handleDelete = async (data: DataProp) => {
  dataArray.value = toRaw(dataArray.value).filter((item) => item.id !== data.id);
  await dataStorage.setValue(toRaw(dataArray.value));
};
</script>

<style>
/* TransitionGroup animations */
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.task-list-move {
  transition: transform 0.5s ease;
}
</style>
