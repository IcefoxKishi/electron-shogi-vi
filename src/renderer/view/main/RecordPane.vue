<template>
  <div ref="root" class="full column record-pane">
    <div class="auto record">
      <RecordView
        :record="store.record"
        :operational="isRecordOperational"
        :show-comment="showComment"
        :show-elapsed-time="showElapsedTime"
        :elapsed-time-toggle-label="t.elapsedTime"
        :comment-toggle-label="t.commentsAndBookmarks"
        :opacity="appSettings.enableTransparent ? appSettings.recordOpacity : 1"
        :show-top-control="showTopControl"
        :show-bottom-control="showBottomControl"
        :show-branches="showBranches"
        @go-begin="goBegin"
        @go-back="goBack"
        @go-forward="goForward"
        @go-end="goEnd"
        @select-move="selectMove"
        @select-branch="selectBranch"
        @swap-with-previous-branch="swapWithPreviousBranch"
        @swap-with-next-branch="swapWithNextBranch"
        @toggle-show-elapsed-time="onToggleElapsedTime"
        @toggle-show-comment="onToggleComment"
      />
    </div>
    <div v-if="store.remoteRecordFileURL">
      <button class="wide" @click="store.loadRemoteRecordFile()">{{ t.fetchLatestData }}</button>
    </div>
  </div>
</template>

<script lang="ts">
export const minWidth = 200;
</script>

<script setup lang="ts">
import { t } from "@/common/i18n";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import RecordView from "@/renderer/view/primitive/RecordView.vue";
import { useStore } from "@/renderer/store";
import { AppState } from "@/common/control/state.js";
import {
  installHotKeyForMainWindow,
  uninstallHotKeyForMainWindow,
} from "@/renderer/devices/hotkey";
import { useAppSettings } from "@/renderer/store/settings";

defineProps({
  showElapsedTime: {
    type: Boolean,
    required: false,
  },
  showComment: {
    type: Boolean,
    required: false,
  },
  showTopControl: {
    type: Boolean,
    required: false,
    default: true,
  },
  showBottomControl: {
    type: Boolean,
    required: false,
    default: true,
  },
  showBranches: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const store = useStore();
const appSettings = useAppSettings();
const root = ref();

onMounted(() => {
  installHotKeyForMainWindow(root.value);
});

onBeforeUnmount(() => {
  uninstallHotKeyForMainWindow(root.value);
});

const goto = (ply: number) => {
  store.changePly(ply);
};

const goBegin = () => {
  goto(0);
};

const goBack = () => {
  goto(store.record.current.ply - 1);
};

const goForward = () => {
  goto(store.record.current.ply + 1);
};

const goEnd = () => {
  goto(Number.MAX_SAFE_INTEGER);
};

const selectMove = (ply: number) => {
  goto(ply);
};

const selectBranch = (index: number) => {
  store.changeBranch(index);
};

const swapWithPreviousBranch = () => {
  store.swapWithPreviousBranch();
};

const swapWithNextBranch = () => {
  store.swapWithNextBranch();
};

const onToggleElapsedTime = (enabled: boolean) => {
  appSettings.updateAppSettings({
    showElapsedTimeInRecordView: enabled,
  });
};

const onToggleComment = (enabled: boolean) => {
  appSettings.updateAppSettings({
    showCommentInRecordView: enabled,
  });
};

const isRecordOperational = computed(() => {
  return store.appState === AppState.NORMAL;
});
</script>

<style scoped>
.record-pane {
  box-sizing: border-box;
}
.record {
  width: 100%;
  min-height: 0;
}
button.wide {
  width: 100%;
}
</style>
