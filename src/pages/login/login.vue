<template>
<div>LOGIN</div>
</template>

<script>
import {
    mapActions
} from "vuex";
export default {
    methods: {
        ...mapActions("user", ["loginUserdo", "loginout"]),
    },
};
</script>

<style lang="stylus" scoped></style>
