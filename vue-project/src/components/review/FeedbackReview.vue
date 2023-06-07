

<template>
    <div class="block">
        <h2>Essay feedback</h2>
        <div v-for="feedback in feedbacks" :key="feedback.id" :class="['feedback', 'score' + feedback.score, {
            'approved': feedback.isApproved,
        }]">
            <div class="buttons">
                <i class="thumbsup ph ph-thumbs-up" @click="approveFeedback(feedback)"></i>
                <i class="approve ph ph-check" @click="approveFeedback(feedback)"></i>
            </div>
            <h3>
                {{ feedback.dimension }}
            </h3>
            <p contenteditable="true" @click="editFeedback(feedback)" @input="updateFeedback(feedback)">
                {{ feedback.feedback }}
            </p>
        </div>
    </div>
</template>






<script>
import { ref } from 'vue';
import { computed } from 'vue';
import { useFeedbackStore } from '@/stores/store-prompts';
export default {
    name: 'FeedbackReview',
    setup() {
        const feedbackStore = useFeedbackStore();
        const feedbacks = feedbackStore.getFeedbacks;
        const isApproved = computed((feedback) => {
            return feedback ? feedback.isApproved : false;
        });

        const approveFeedback = (feedback) => {
            feedback.isApproved = true;
            console.log('approve');
        };
        const editFeedback = (feedback) => {
            console.log('editFeedback');
        };
        const updateFeedback = (feedback) => {
            console.log('editFeedback');
        };
        return {
            isApproved,
            feedbacks,
            editFeedback,
            updateFeedback,
            approveFeedback
        };
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.feedback {
    background-color: #abd6bf;
    border-radius: 16px;
    padding: 24px;

    &.approved {
        background-color: #e2f1e2;
    }

}

.buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-top: 4px;

    i {
        border-radius: 100%;
        padding: 8px;
        // background-color: #fff000;
        transform-origin: center;

        &:hover {
            cursor: pointer;
            background-color: rgba($color: #000000, $alpha: 0.1)
        }
    }

    .thumbsup {
        display: block;
    }

    .thumbsdown {
        display: block;
    }

    .approve {
        display: none;
    }
}

p:hover {
    background-color: #fff000;
}
</style>

