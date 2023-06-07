<template>
    <div class="comments">
        <h2>Comments</h2>
        <CommentReview v-for="comment in comments" :key="comment.id" :comment="comment" />
    </div>
</template>

<script>
import CommentReview from './CommentReview.vue'; // Import the Comment component
import { ref } from 'vue';
import { useCommentStore } from '@/stores/store-prompts';
export default {
    name: 'CommentsReview',
    components: {
        CommentReview // Register the Comment component
    },
    setup() {
        const commentStore = useCommentStore();
        const comments = commentStore.getComments;
        return { comments };
    }
}
</script>



<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.comments {
    display: flex;
    flex-direction: column;
    gap: 16px;

}
</style>

