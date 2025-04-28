<template>
  <div class="container mx-auto p-6 md:p-8 bg-[#1a1d2d] rounded-2xl shadow-lg text-white font-mono flex flex-col items-center">

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
        <input v-model="mode" type="radio" value="chars" class="accent-[#00ffc8] w-4 h-4">
        <span class="text-sm md:text-base text-gray-300">Characters</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input v-model="mode" type="radio" value="words" class="accent-[#00ffc8] w-4 h-4">
        <span class="text-sm md:text-base text-gray-300">Words</span>
      </label>
    </div>

    <!-- Inputs -->
    <div class="w-full flex flex-col md:flex-row gap-6 mb-8">
      <textarea v-model="firstString" placeholder="Enter first text..."
        class=" h-48 w-full md:h-64 p-4 bg-[#222538] border border-[#333] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#00ffc8] focus:border-transparent text-sm md:text-base" />
      
      <textarea v-model="secondString" placeholder="Enter second text..."
        class=" h-48 w-full md:h-64 p-4 bg-[#222538] border border-[#333] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#00ffc8] focus:border-transparent text-sm md:text-base" />
    </div>

    <!-- Error message -->
    <Transition name="fade">
      <div v-if="(!firstString && !secondString) && comparisonDone" class="text-red-400 font-bold mb-6 text-center bg-red-900 p-4 rounded-lg">
        Please enter both texts to compare.
      </div>
    </Transition>

    <!-- Results -->
    <Transition name="fade">
    <div v-if="comparisonDone && (firstString || secondString)" class="w-full">
      <!-- Wrap the entire block with Transition -->
        <div v-if="showCodeBox" class=" mb-6">
          <!-- Code Box -->
          <div class="bg-[#2a2d3b] p-4 md:p-6 rounded-lg overflow-x-auto max-h-[300px]">
            <p class="text-xs md:text-sm text-gray-400 mb-4">
                <span class="text-green-400">Green</span> = Added |
                <span class="text-red-400">Red</span> = Removed
              </p>
              <p class="text-xs md:text-sm text-gray-400 mb-4">
                <span class="text-gray-300">Gray</span> = Unchanged
              </p>
            <template v-if="isExactMatch">
              <div class="whitespace-pre-wrap break-words text-sm md:text-lg flex flex-col gap-2">
                {{ firstString }}
                <hr class=" border-b border-gray-600">{{ secondString }}
              </div>
            </template>

            <template v-else>
              <div class="whitespace-pre-wrap break-words text-sm md:text-lg">
                <span
                  v-for="(part, index) in differences" :key="index" :class="[
                    part.added ? 'bg-green-900 text-green-400' : '',
                    part.removed ? 'bg-red-900 text-red-400' : '',
                    (!part.added && !part.removed) ? 'text-gray-300' : '',
                    'px-1 rounded'
                  ]">
                  {{ part.value }}
                </span>
              </div>
            </template>

          </div>
        </div>
        <!-- Success Message -->
        <Transition name="fade" mode="out-in" appear>
          <div key="success" v-if="isExactMatch" class="flex gap-2 bg-green-900 text-green-400 p-4 rounded-lg items-center justify-center">
            <Icon name="uil:check-circle" class="text-green-400 text-2xl" />
            <p>{{ mode === 'chars' ? 'Characters' : 'Words' }} are identical! No differences found.</p>
          </div>
          <div key="error" v-else class="flex gap-2 bg-red-900 text-red-400 p-4 rounded-lg items-center justify-center">
            <Icon name="uil:exclamation-triangle" class="text-red-400 text-2xl" />
            <p>{{ mode === 'chars' ? 'Characters' : 'Words' }} have {{ differences.length }} differences.</p>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { diffChars, diffWords } from 'diff';

const mode = ref('chars');
const firstString = ref('');
const secondString = ref('');
const differences = ref([]);
const comparisonDone = ref(false);
const isExactMatch = ref(false);
const showCodeBox = ref(false); // new flag for initial fade-in

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

  if (!showCodeBox.value && (firstString.value || secondString.value)) {
    showCodeBox.value = true;
  }

};

watch([firstString, secondString, mode], () => {
  compareStrings();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease-in-out, position 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* One-time fade for codebox */
.fade-once-enter-active {
  transition: opacity 0.8s ease;
}
.fade-once-enter-from {
  opacity: 0;
}
.fade-once-enter-to {
  opacity: 1;
}
</style>
