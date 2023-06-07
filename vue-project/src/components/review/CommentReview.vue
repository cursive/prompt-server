<template>
    <div :data-id="comment.id" :class="['comment', 'score' + comment.score, {
        'approved': isApproved,
        'rejected': isRejected,
        'editing': isEditing,
        'hovering': isHovering,
    }]" @mouseover="hoverOn" @mouseout="hoverOff">
        <div class="content">
            <img class="avatar migo" src="@/assets/migo.png">
            <img class="avatar teacher" src="@/assets/teacher.png">
            {{ comment.dimension }}
            <div class="feedback" contenteditable="true" @click="editComment" @input="updateFeedback">{{ comment.feedback }}
            </div>
            <div class="buttons">

                <!-- <i class="edit ph ph-pencil" @click="editComment"></i> -->
                <i class="thumbsup ph ph-thumbs-up" @click="approveComment"></i>
                <i class="thumbsdown ph ph-thumbs-down" @click="rejectComment"></i>
                <i class="approve ph ph-check" @click="approveComment"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { computed } from 'vue';
import { useCommentStore } from '@/stores/store-prompts';

export default {
    name: 'CommentReview',
    props: {
        comment: Object,
    },
    setup(props) {
        const commentStore = useCommentStore();
        const storedComment = commentStore.getComments.find(c => c.id === props.comment.id);
        const isEditing = ref(false);

        const isApproved = computed(() => {
            return storedComment ? storedComment.isApproved : false;
        });

        const isRejected = computed(() => {
            return storedComment ? storedComment.isRejected : false;
        });

        const isHovering = computed(() => {
            return storedComment ? storedComment.isHovering : false;
        });

        const hoverOn = () => {
            storedComment.isHovering = true
        };
        const hoverOff = () => {
            storedComment.isHovering = false
        };

        const editComment = () => {
            console.log('editComment');
            isEditing.value = !isEditing.value;
        };

        const approveComment = () => {
            console.log('approveComment');
            isEditing.value = false;
            commentStore.getComments.find(c => c.id === props.comment.id).isApproved = true;
        };

        const rejectComment = () => {
            console.log('rejectComment');
            commentStore.getComments.find(c => c.id === props.comment.id).isRejected = true;
        };

        const updateFeedback = (event) => {
            //update the store a speople type
            console.log('updateFeedback');
            storedComment.feedback = event.target.textContent;
        };

        return {
            isApproved,
            isRejected,
            isEditing,
            isHovering,
            hoverOn,
            hoverOff,
            approveComment,
            rejectComment,
            updateFeedback,
            editComment,
        };
    },
};
</script>


<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.comment {
    * {
        transition: 300ms;
    }

    box-sizing:border-box;
    width: 360px;
    padding: 8px;
    padding-top: 16px;
    padding-right: 8px;

    display: flex;
    flex-direction: row;
    gap: 8px;
    border-radius: 16px;



    .avatar {
        padding-left: 8px;
        transform-origin: center;

        &.teacher {
            margin-left: -32px;
            scale: 0;
        }
    }



    .teacher {}

    .dimension {
        padding-left: 8px;
        font-size: 16px;
        font-weight: 300;
        text-transform: capitalize;
        padding-top: 8px;
    }

    .feedback {
        transition: 700ms;
        font-size: 16px;
        color: #666666;
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 4px;
        border-radius: 8px;

        &:hover {
            background-color: rgba($color: #000000, $alpha: 0.05);
            cursor: pointer;
        }

        &:focus {
            outline: 2px solid rgba($color: #000000, $alpha: 0.3);
            background-color: rgba($color: #ffffff, $alpha: 0.05);
            transition: 300ms;
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


    &.score1 {
        background-color: $lightred;
    }

    &.score2 {
        background-color: $lightorange;
    }

    &.score3 {
        background-color: $lightorange;
    }

    &.score4 {
        background-color: $lightgreen;
    }

    &.hovering {
        outline: solid 2px rgba($color: #000000, $alpha: 0.5);
        outline-offset: -2px;
    }

    // &:hover {
    //     outline: solid 2px rgba($color: #000000, $alpha: 0.5);
    //     outline-offset: -2px;
    // }

    &.triggeredhover {
        // border: 5px solid rgba($color: #000000, $alpha: 0.5)
        outline: solid 2px rgba($color: #000000, $alpha: 0.5);
        outline-offset: -2px;
    }


    &.editing {

        .buttons.edit,
        .buttons.thumbsup,

        .buttons {


            .thumbsup {
                display: none;
            }

            .thumbsdown {
                display: none;
            }

            .approve {
                display: block !important;
                ;
            }
        }
    }

    &.approved {
        background-color: #d9dde7;

        .migo {
            scale: 0;
        }

        .teacher {
            scale: 1;
        }

        .buttons {


            .thumbsup {
                display: none;
            }

            .thumbsdown {
                display: none;
            }

            .approve {
                display: none;
            }
        }

    }


    &.rejected {
        // opacity: 0;
        transition: 1300ms;
        scale: 0;
        transform-origin: 30% 90%;
        transition: 300ms;
        transition-timing-function: cubic-bezier(-1, 0.7, 1.0, 0.1);
    }





}
</style>
