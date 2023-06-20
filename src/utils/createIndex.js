// 게시글 커스텀 postId
/** (현재 post 게시글 배열 객체) */
const createPostId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(4);
  return `post${index}`;
};

const createDomId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(4);
  return `dom${index}`;
};

const createReviewId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(4);
  return `review${index}`;
};

const createCommentId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(4);
  return `comment${index}`;
};

const createGroupId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(4);
  return `group${index}`;
};

const createGuestId = async () => {
  const { nanoid } = await import('nanoid');
  const index = nanoid(3);
  return `guest${index}`;
};

module.exports = {
  createPostId,
  createDomId,
  createReviewId,
  createCommentId,
  createGroupId,
  createGuestId,
};
