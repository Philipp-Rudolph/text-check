<template>
  <div class="max-w-7xl mx-auto p-8 bg-[#1a1d2d] rounded-2xl shadow-lg text-white font-mono flex flex-col items-center">
    <div class="flex items-center gap-4 mb-6">
      <Icon name="uil:search" class="text-white text-3xl" />
      <h1 class="text-3xl text-[#00ffc8] font-bold">Vue 3 Diff Checker</h1>
    </div>

    <p class="text-gray-400 mb-8 text-center">Paste two texts or code snippets below to analyze their differences in real-time.</p>

    <div class="w-full flex flex-col md:flex-row gap-6 mb-6">
      <textarea 
        v-model="firstString"
        placeholder="Enter first text..."
        class="w-full h-64 p-4 bg-[#222538] border border-[#333] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#00ffc8] focus:border-transparent"
      />

      <textarea 
        v-model="secondString"
        placeholder="Enter second text..."
        class="w-full h-64 p-4 bg-[#222538] border border-[#333] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#00ffc8] focus:border-transparent"
      />
    </div>

    <div v-if="(!firstString && !secondString) && comparisonDone" class="text-red-400 font-bold mb-6">
      Please enter both texts to compare.
    </div>

    <div v-if="comparisonDone && (firstString || secondString)" class="w-full">
      <h2 class="text-2xl mb-4 font-semibold">Result:</h2>

      <div v-if="isExactMatch" class="flex items-center gap-2 bg-green-900 text-green-400 p-4 rounded-lg mb-4">
        <Icon name="uil:check-circle" class="text-green-400" /> Strings are identical! No differences found.
      </div>

      <div v-else class="bg-[#2a2d3b] p-6 rounded-lg overflow-scroll max-h-[250px]">
        <p class="text-sm text-gray-400 mb-4">Green = Added | Red = Removed</p>

        <div class="whitespace-pre-wrap break-words text-lg">
          <span 
            v-for="(part, index) in differences" 
            :key="index"
            :class="[
              part.added ? 'bg-green-900 text-green-400' : '',
              part.removed ? 'bg-red-900 text-red-400' : '',
              (!part.added && !part.removed) ? 'text-gray-300' : '',
              'px-1 rounded'
            ]"
          >
            {{ part.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { diffChars } from 'diff';

const firstString = ref('');
const secondString = ref('');
const differences = ref([]);
const comparisonDone = ref(false);
const isExactMatch = ref(false);

const compareStrings = () => {
  if (!firstString.value && !secondString.value) {
    differences.value = [];
    comparisonDone.value = true;
    isExactMatch.value = false;
    return;
  }
  differences.value = diffChars(firstString.value, secondString.value);
  comparisonDone.value = true;
  isExactMatch.value = firstString.value === secondString.value;
};

watch([firstString, secondString], () => {
  compareStrings();
});
</script>
