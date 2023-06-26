
import { createSelector } from 'reselect';

const getAuthError = createSelector(
(state) => state.auth,
(auth) => auth.authError,
);

const getUser = createSelector(
(state) => state.user,
(user) => user.user,
);

const getAuth = createSelector(
(state) => state.auth,
(auth) => auth.auth,
);

const postViewerSelector = createSelector(
(state) => state.post,
getUser,
(post, user) => ({
post: post.post,
error: post.error,
loading: post.loading,
user
}),
);

const paginationSelector = createSelector(
(state) => state.posts.lastPage,
(state) => state.posts.posts,
(state) => state.loading['posts/LIST_POSTS'],
(lastPage, posts, loading) => ({ lastPage, posts, loading }),
);

const postListSelector = createSelector(
(state) => state.posts.posts,
(state) => state.posts.error,
(state) => state.loading['posts/LIST_POSTS'],
getUser,
(posts, error, loading, user) => ({ posts, error, loading, user }),
);

const editorSelector = createSelector(
(state) => state.write,
(write) => ({
title: write.title,
body: write.body,
}),
);

const tagBoxSelector = createSelector(
(state) => state.write,
(write) => ({
tags: write.tags,
}),
);

const writeActionButtonsSelector = createSelector(
(state) => state.write,
(write) => ({
title: write.title,
body: write.body,
tags: write.tags,
post: write.post,
postError: write.postError,
originalPostId: write.originalPostId,
}),
);

export {
getAuthError,
getUser,
getAuth,
postViewerSelector,
paginationSelector,
postListSelector,
editorSelector,
tagBoxSelector,
writeActionButtonsSelector,
};