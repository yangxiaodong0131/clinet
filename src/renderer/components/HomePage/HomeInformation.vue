<template>
  <div>
    <div class="alert alert-danger" role="alert">
      <h4 class="alert-heading">记住这个页面：随时使用本页面提供的向导功能!</h4>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">在其他页面，都可以点击左上角菜单栏的<a href="#">hitb-clinet</a>返回这个页面</li>
        <li class="breadcrumb-item active" aria-current="page"></li>
      </ol>
    </div>
    <div class="alert alert-primary" role="alert">
      <h4 class="alert-heading">病历编辑（数据采集）</h4>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">点击菜单栏的<a href="#">数据采集，打开数据采集的页面</a></li>
        <li class="breadcrumb-item active" aria-current="page"></li>
      </ol>
    </div>
    <div class="alert alert-primary" role="alert">
      <h4 class="alert-heading">数据分析</h4>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">点击菜单栏的<a href="#">数据分析，打开数据分析的页面</a></li>
        <li class="breadcrumb-item active" aria-current="page"></li>
      </ol>
    </div>
    <div class="alert alert-primary" role="alert">
      <h4 class="alert-heading">术语字典</h4>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">点击菜单栏的<a href="#">术语字典，打开术语字典的页面</a></li>
        <li class="breadcrumb-item active" aria-current="page"></li>
      </ol>
    </div>
    <div class="alert alert-success" role="alert">
      <h4 class="alert-heading">导入用户自己的本地数据</h4>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">点击菜单栏的<a href="#">系统服务，打开系统服务的页面</a></li>
        <li class="breadcrumb-item active" aria-current="page"></li>
      </ol>
    </div>
    <div class="alert alert-warning" role="alert">
      <h4 class="alert-heading">系统服务</h4>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">点击菜单栏的<a href="#">系统服务，打开系统服务的页面</a></li>
        <li class="breadcrumb-item active" aria-current="page"></li>
      </ol>
    </div>
    <div class="alert alert-secondary" role="alert">
      <h4 class="alert-heading">区块链服务</h4>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">点击菜单栏的<a href="#">区块链服务，打开区块链服务的页面</a></li>
        <li class="breadcrumb-item active" aria-current="page"></li>
      </ol>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        name: this.$route.name
      };
    },
    methods: {
      load: function (n) {
        switch (n) {
          case 1:
            this.$router.push('/edit');
            break;
          case 2:
            this.$router.push('/stat');
            break;
          case 3:
            this.$router.push('/library');
            break;
          case 4:
            this.$router.push('/system');
            break;
          case 5:
            this.$router.push('/blockChain');
            break;
          default:
            this.$router.push('/edit');
        }
      },
    },
  };
</script>

<style scoped>
  li.breadcrumb-item::before {
    content: ">>>";
  }
</style>
