<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0f111a;
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px; /* mobile default */
  box-sizing: border-box;
}

/* Responsive adjustments */
@media (min-width: 769px) {
  body {
    padding: 40px;
  }
}
</style>
