<template>
  
  <div class="max-w-7xl mx-auto p-6 md:p-8 bg-[#1a1d2d] rounded-2xl shadow-lg text-white font-mono flex flex-col items-center">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <Icon name="uil:search" class="text-white text-3xl" />
      <h1 class="text-2xl md:text-3xl text-[#00ffc8] font-bold text-center">Diff Checker</h1>
    </div>


    <!-- Subtitle -->
    <p class="text-gray-400 mb-8 text-center text-sm md:text-base px-4">
      Paste two texts or code snippets below to analyze their differences in real-time.
    </p>


    <!-- Mode Toggle -->
    <div class="flex items-center gap-6 mb-6">
      <label class="flex items-center gap-2 cursor-pointer">
        <input 
          v-model="mode" 
          type="radio" 
          value="chars" 
          class="accent-[#00ffc8] w-4 h-4"
        >
        <span class="text-sm md:text-base text-gray-300">Characters</span>
      </label>

      <label class="flex items-center gap-2 cursor-pointer">
        <input 
          v-model="mode" 
          type="radio" 
          value="words" 
          class="accent-[#00ffc8] w-4 h-4"
        >
        <span class="text-sm md:text-base text-gray-300">Words</span>
      </label>
    </div>

    <!-- Inputs -->
    <div class="w-full flex flex-col md:flex-row gap-6 mb-8">
      <textarea 
        v-model="firstString"
        placeholder="Enter first text..."
        class="w-full h-48 md:h-64 p-4 bg-[#222538] border border-[#333] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#00ffc8] focus:border-transparent text-sm md:text-base"
      />
      
      <textarea 
        v-model="secondString"
        placeholder="Enter second text..."
        class="w-full h-48 md:h-64 p-4 bg-[#222538] border border-[#333] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#00ffc8] focus:border-transparent text-sm md:text-base"
      />
    </div>

    <!-- Error message -->
    <div v-if="(!firstString && !secondString) && comparisonDone" class="text-red-400 font-bold mb-6 text-center">
      Please enter both texts to compare.
    </div>

    <!-- Results -->
    <div v-if="comparisonDone && (firstString || secondString)" class="w-full">
      <h2 class="text-xl md:text-2xl mb-4 font-semibold text-center md:text-left">Result:</h2>

      <!-- Exact Match -->
      <div v-if="isExactMatch" class="flex flex-col items-center justify-center md:justify-start gap-2">
        <div class="flex gap-2 bg-green-900 text-green-400 p-4 rounded-lg mb-6">
          <Icon name="uil:check-circle" class="text-green-400 text-2xl" /> 
          <p>{{ mode === 'chars' ? 'Characters' : 'Words' }} are identical! No differences found.</p>
        </div>
        <div class="bg-[#2a2d3b] p-4 md:p-6 rounded-lg overflow-x-auto max-h-[300px] w-full whitespace-pre-wrap break-words text-sm md:text-lg flex flex-col gap-2">
          {{ firstString }}<hr class="w-full border-b border-gray-600">{{ secondString }}
        </div>
      </div>

      <!-- Differences -->
      <div v-else class="bg-[#2a2d3b] p-4 md:p-6 rounded-lg overflow-x-auto max-h-[300px]">
        <!-- <p class="text-xs md:text-sm text-gray-400 mb-4">Green = Added | Red = Removed</p> -->
        <p class="text-xs md:text-sm text-gray-400 mb-4">
          <span class="text-green-400">Green</span> = Added | 
          <span class="text-red-400"> Red</span> = Removed
        </p>
        <p class="text-xs md:text-sm text-gray-400 mb-4">
          <span class="text-gray-300">Gray</span> = Unchanged
        </p>

        <div class="whitespace-pre-wrap break-words text-sm md:text-lg">
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
import { diffChars, diffWords } from 'diff';

const mode = ref('chars'); // or 'words' for word-based comparison

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
  
  const diffMethod = mode.value === 'chars' ? diffChars : diffWords;
  differences.value = diffMethod(firstString.value, secondString.value);
  comparisonDone.value = true;
  isExactMatch.value = firstString.value === secondString.value;
};

watch([firstString, secondString, mode], () => {
  compareStrings();
});
</script>
