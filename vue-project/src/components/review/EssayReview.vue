<template>
    <div class="essay" @mouseover="hoverOn" @mouseout="hoverOff">
        <h2>Essay on Paul Bogard's “Let There Be Dark"</h2>
        <span class="quote">Sample 1</span>
        <div id="fromStudent">
            <span class="quote">Sample 2</span>
            <div v-html="highlightedEssay"></div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useEssayStore } from '@/stores/store-prompts';
import { useCommentStore } from '@/stores/store-prompts';

export default {
    name: 'EssayReview',
    setup() {
        const essayStore = useEssayStore();
        const commentStore = useCommentStore();

        let hoveringComment = null;

        const hoverOn = (event) => {
            const target = event.target;
            if (target.tagName === 'SPAN' && target.classList.contains('quote')) {
                const quote = target.innerText;
                hoveringComment = commentStore.comments.find((comment) => comment.quote === quote);
                if (hoveringComment) {
                    // alert('hoverOn: ' + hoveringComment.quote);
                    hoveringComment.isHovering = true;
                    // Perform additional actions with the hoveringComment if needed
                }
            }
        };

        const hoverOff = () => {
            if (hoveringComment) {
                hoveringComment.isHovering = false;
            }
        };

        const highlightedEssay = computed(() => {
            let essay = essayStore.getEssay;

            commentStore.comments.forEach((comment) => {
                const hoveringClass = comment.isHovering ? 'hovering' : '';
                const spanClass = `quote score${comment.score} ${hoveringClass}`;
                const spanContent = comment.quote;
                const spanElement = `<span class="${spanClass}">${spanContent}</span>`;
                essay = essay.replace(new RegExp(comment.quote, 'g'), spanElement);
            });

            return essay;
        });

        return {
            highlightedEssay,
            hoverOn,
            hoverOff,
        };
    },
};
</script>




<style lang="scss" >
@import "@/assets/_variables.scss";

.essay {
    background-color: $white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;

    #fromStudent {
        font-size: 18px;
    }
}


.quote {


    &.score1 {
        background-color: $lightred;
    }

    &.score2 {
        background-color: $lightred;
    }

    &.score3 {
        background-color: $lightorange;
    }

    &.score4 {
        background-color: $lightgreen;
    }

    &.rejected {
        background-color: #ffffff !important;
    }

    filter: brightness(104%);


    &.hovering {
        filter: saturate(4) brightness(100%);
        // border: 1px solid red;
    }

}
</style>
