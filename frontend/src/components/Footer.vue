<template>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; {{ currentYear }} Car Sales Web. All rights reserved.</p>
      <p>Find your dream car with us!</p>
    </div>
  </footer>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Footer',
  setup() {
    const currentYear = ref(new Date().getFullYear());
    
    return {
      currentYear
    };
  }
};
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  text-align: center;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer p {
  margin: 5px 0;
}
</style>
