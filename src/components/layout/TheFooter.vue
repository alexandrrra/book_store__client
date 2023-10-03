<template>
  <footer class="footer">
    <div class="footer_container__logo">
      <router-link to="/" class="footer-container__logo-name">Буклиб</router-link>
      <span>Интернет-магазин книг</span>
    </div>
    <div class="description">
      <h1>Книжный магазин Буклиб</h1>
      <p>Буклиб - сеть книжных магазинов, успешно работающих во всех регионах России</p>
      <p>А еще это - крупный магазин книг. В нем вы можете заказыватьк книги в любое время 24 часа в сутки</p>
    </div>
  </footer>
</template>

<script>

</script>

<style scoped>
.footer{
  background-color: var(--blue);
  display:flex;
  justify-content:space-around;
  padding:20px;
}

.footer_container__logo{
  display: flex;
  flex-direction: column;
  align-items:center;
}

.footer-container__logo-name {
  font-family: 'Playfair', serif;
  color:var(--white);
  font-size: 40px;
  font-weight:bold;
}

.footer-container__logo-name:hover{
  color:var(--red);
}

.footer_container__logo span{
  font-family: 'Playfair', serif;
  color:var(--white);
}

.description{
  color:var(--white);
}
</style>