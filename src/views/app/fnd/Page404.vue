<template>

        <!-- Main content -->
        <section class="section">
            <div class="error404-body-con">
                <div class="err-card err-card-bordered">
                    <div class="has-text-centered">
                        <div class="error404-body-con-title"> 404</div>

                        <div class="error-content">
                            <p class="error404-body-con-message">Oops! Page not found.</p>

                            <p>
                            <i class="fa fa-cog fa-spin"></i>
                                We could not find the page you were looking for.
                                Meanwhile, you may <router-link to="/app/fnd/dashboard">return to dashboard</router-link>.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- /.content -->
</template>

<script>
  export default {
    name: 'NotFound',
  }
</script>

<style lang="scss">
.error404-body-con {
    width: 700px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
}

.err-card {
    background: #fff;
    border-radius: 4px;
    font-size: 16px;
    position: relative;
    transition: all .2s ease-in-out;
    padding-top: 40px;
    padding-bottom: 50px;
}

.err-card-bordered {
    border: 1px solid #dddee1;
        border-top-color: rgb(221, 222, 225);
        border-right-color: rgb(221, 222, 225);
        border-bottom-color: rgb(221, 222, 225);
        border-left-color: rgb(221, 222, 225);
    border-color: #e9eaec;
}

.error404-body-con-title {
    text-align: center;
    font-size: 240px;
    font-weight: 700;
    color: #2d8cf0;
    height: 260px;
    line-height: 260px;
}

.error404-body-con-message {
    display: block;
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    letter-spacing: 12px;
    color: #dddde2;
}

</style>
