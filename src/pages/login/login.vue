<template>
    <div>
        LOGIN
    </div>
</template>

<script>
import {Login} from '@/request/login'
    export default {
        mounted () {
          Login();
        },
    }
</script>

<style lang="stylus" scoped>

</style>