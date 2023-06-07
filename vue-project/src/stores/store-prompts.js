// prompts.js (store)
import { defineStore } from 'pinia';
import promptData from '@/assets/promptData.json';
import rubricData from '@/assets/rubricData.json';
import reviewData from '@/assets/reviewData.json';
console.log("review")
const essayData = "In Paul Bogard's article “Let there be dark” he's building an arguement to persuade his audience to preserve natural darkness. Bogard builds his arguement in a few different ways. Bogard uses a personal story, appeals to people's emotions, and states benefits of natural darkness. By using a personal story Bogard allows his audience to connect to him. If his audience can relate or even understand his story they will be more willing to agree with him. The personal story also shows that the issue of preserving natural darkness isn't just another topic to write about but something that he is actually passionate for. In his personal story Bogard uses great imagery making the audience picture what he saw and maybe make them want to experience it too. \n\nBogard uses pathos by stating examples that appeal to people's emotions. In the article he wrote “Those of us over 35 are perhaps among the last generation to have known truly dark nights.” This statement appeals more to the younger generations emotion. By stating this people who are younger then 35 might feel that they were robbed of the oppurtunity to experience the real beauty of natural darkness. This would proably help his younger audience to agree with him because they might want the chance to see the real beauty of natural darkness.\n\nBogard writes about the benefits that natural darkness actually produces. In the article he talks about how darkens actually helps the body produce a hormone that keeps certain cancers from developing. He also includes how darkness helps and is neccessary for certain animals. These examples will help his audience see that he is arguing for some benefical for people. This also helps appeal to an audience that might not care for the beauty of darkness but care for their own personal health. \n\nBogard uses different features in order to persuade his audience. The different features also help him in appealing to a broader audience."

function generateUniqueID() {
    return Math.floor(Math.random() * Date.now());
}

export const usePromptStore = defineStore('promptStore', {
    state: () => ({
        prompts: promptData,
    }),
    getters: {
        getPrompts: (state) => state.prompts,
    },
});

export const useRubricStore = defineStore('rubricStore', {
    state: () => ({
        rubrics: rubricData,
    }),
    getters: {
        getRubrics: (state) => state.rubrics,
    },
});

export const useFeedbackStore = defineStore('feedbackStore', {
    state: () => ({
        feedbacks: reviewData.overallFeedback.map((feedback) => ({
            id: generateUniqueID(),
            ...feedback,
            isApproved: false,
        })),
    }),
    getters: {
        getFeedbacks: (state) => state.feedbacks,
    },
});

export const useCommentStore = defineStore('commentStore', {
    state: () => ({
        comments: reviewData.targetedFeedback.map((comment) => ({
            id: generateUniqueID(),
            ...comment,
            isApproved: false,
            isRejected: false,
            isHovering: false
        })),
    }),
    getters: {
        getComments: (state) => state.comments,
    },
});

export const useEssayStore = defineStore('rubricStore', {
    state: () => ({
        essay: essayData,
    }),
    getters: {
        getEssay: (state) => state.essay
    },
});


