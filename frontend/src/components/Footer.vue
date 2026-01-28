<template>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; 2024 Car Sales Web. All rights reserved.</p>
      <p>Find your dream car with us!</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
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
