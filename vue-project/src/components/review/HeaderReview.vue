<script>
export default {
    name: 'HeaderReview'
}
</script>

<template>
    <div class="header">
        <p>Ms Vermont's Class | Essay reviews</p>
        <h2>Emma Buxley</h2>
        <h4>9th Grade — Read and essay writing</h4>
    </div>
</template>




<style lang="scss" scoped>
@import "@/assets/_variables.scss";


.header {
    padding-top: 80px;
    padding-bottom: 8px;
    width: 900px;
    padding-left: 200px;

    h2 {
        margin: 0;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: bold;
    }

    h4 {
        margin: 0;
        color: #999999;
    }

    p {
        padding: 0;
        margin: 0;
        color: $blue;
    }
}
</style>
