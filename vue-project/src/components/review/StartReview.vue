<script>
export default {
    name: 'StartReview'
}
</script>

<template>
    <div class="start">
        <h3>Pre review</h3>
        <p>We can take a first pass at review using the <span class="showrubric">blah blah</span> to
            call out what matters to you.
        </p>
        <div class="bigButton"></div>
    </div>
</template>




<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.start {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 16px;
    width: 344px;

    .showrubric {
        color: #1865F2;

        &:hover {
            text-decoration: underline;
            font-weight: bold;
            cursor: pointer;
        }
    }
}

.bigButton {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px 32px;
    width: 276px;
    height: 56px;

    color: white;
    background: linear-gradient(to right, #0f57dc, #0f57dc 50%, #0b48ba 50%, #0b48ba);
    background-size: 200% 100%;
    border-radius: 6px;

    &::before {
        content: 'Review essay';
    }


    &:hover {
        text-decoration: underline;
        background: linear-gradient(to right, #0f57dc, #0f57dc 50%, #0b48ba 50%, #0b48ba);
        background-size: 200% 100%;
        cursor: pointer;
    }

    &.loading {
        animation: pulse 2.1s infinite;
        background-position: -100% 0;
        transition: all 70s ease-out;
        text-decoration: none;
        cursor: default !important;

        &::before {
            content: 'Loading (about 60s)...';
        }

    }

    &.loaded {

        background: #999999;
        // background-position: left bottom;
        text-decoration: none;
        cursor: not-allowed !important;

        &::before {
            content: 'View as student';
        }

    }

}

@keyframes pulse {
    0% {
        color: rgba($color: #ffffff, $alpha: 0.2);
    }

    50% {
        color: rgba($color: #ffffff, $alpha: 0.7);
    }

    100% {
        color: rgba($color: #ffffff, $alpha: 0.2);
    }
}
</style>
