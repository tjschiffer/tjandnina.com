<template>
  <div class="tj--font-blacksword">
    <span class="dot">.</span><span class="dot dot-1">.</span><span class="dot dot-2">.</span>
  </div>
</template>

<script>
  export default {
    name: "loading-dots"
  }
</script>

<style lang="scss" scoped>
  @keyframes blink {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .dot {
    animation: blink 1s linear 0s infinite;
    font-size: 2.5em;
  }

  .dot-1 {
    animation-delay: 0.25s;
  }

  .dot-2 {
    animation-delay: 0.5s;
  }
</style>