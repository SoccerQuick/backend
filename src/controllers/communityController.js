const communityService = require('../services/communityService');
const {
  AppError,
  errorMessageHandler,
} = require('../middlewares/errorHandler');
const {
  addPostSchema,
  updatePostSchema,
  deletePostSchema,
  addCommentSchema,
  updateCommentSchema,
  deleteCommentSchema,
} = require('../validator/communityValidator');

//[ 커뮤니티 전체 게시글 조회 ]
const getAllPosts = async (req, res, next) => {
  try {
    const { statusCode, message, data } = await communityService.getAllPosts();

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 커뮤니티 게시글 상세페이지 ]
const getOnePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const { statusCode, message, data } = await communityService.getOnePost(
      postId
    );

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 커뮤니티 게시글 페이징 ]
const getPagePost = async (req, res, next) => {
  const { page } = req.query;

  try {
    const { statusCode, message, data } = await communityService.getPagePost(
      page
    );

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ 커뮤니티 게시글 등록 ]
const addPost = async (req, res, next) => {
  const { user_id } = req.user;
  const imageFile = req.files;
  const { title, description, notice } = req.body;

  const { error } = addPostSchema.validate({
    user_id,
    title,
    description,
    notice,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await communityService.addPost({
      user_id,
      title,
      description,
      notice,
      imageFile,
    });

    if (statusCode !== 201) return next(new AppError(statusCode, message));

    res.status(201).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ (유저,관리자) 커뮤니티 게시글 수정 ]
// [admin, manager] 는 게시글 공지사항 변경 가능.
const updatePost = async (req, res, next) => {
  const { user_id } = req.user;
  const { postId } = req.params;
  const { title, description, notice } = req.body;

  const { error } = updatePostSchema.validate({
    postId,
    user_id,
    title,
    description,
    notice,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await communityService.updatePost({
      postId,
      user_id,
      title,
      description,
      notice,
    });

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ (유저, 관리자) 커뮤니티 게시글 삭제 ]
const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const { user_id } = req.user;

  const { error } = deletePostSchema.validate({ postId, user_id });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message } = await communityService.deletePost(
      postId,
      user_id
    );

    if (statusCode !== 204) return next(new AppError(statusCode, message));

    res.status(204).json({
      message: message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 커뮤니티 게시글 댓글 등록 ]
const addComment = async (req, res, next) => {
  const { postId } = req.params;
  const { user_id } = req.user;
  const { content } = req.body;

  const { error } = addCommentSchema.validate({ postId, user_id, content });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await communityService.addComment(
      postId,
      user_id,
      content
    );

    if (statusCode !== 201) return next(new AppError(statusCode, message));

    res.status(201).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 커뮤니티 게시글 댓글 수정 ]
const updateComment = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { user_id } = req.user;
  const { content } = req.body;

  const { error } = updateCommentSchema.validate({
    postId,
    commentId,
    user_id,
    content,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message, data } = await communityService.updateComment({
      postId,
      commentId,
      user_id,
      content,
    });

    if (statusCode !== 200) return next(new AppError(statusCode, message));

    res.status(200).json({
      message,
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

// [ 커뮤니티 댓글 삭제 ]
const deleteComment = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { user_id } = req.user;

  const { error } = deleteCommentSchema.validate({
    postId,
    commentId,
    user_id,
  });

  if (error) {
    const message = errorMessageHandler(error);
    return next(new AppError(400, message));
  }

  try {
    const { statusCode, message } = await communityService.deleteComment({
      postId,
      commentId,
      user_id,
    });

    if (statusCode !== 204) return next(new AppError(statusCode, message));

    res.status(204).json({
      message,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

//[ 이미지 업로드 용 ]
const uploadImage = async (req, res, next) => {
  const image = req.file || null;

  try {
    const { statusCode, message, data } = await communityService.uploadImage(
      image
    );

    if (statusCode !== 201) return next(new AppError(statusCode, message));

    res.status(201).json({
      data,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(500, 'Internal Server Error'));
  }
};

module.exports = {
  addPost,
  getAllPosts,
  getOnePost,
  getPagePost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  uploadImage,
};
