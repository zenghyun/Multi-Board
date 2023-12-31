import React, { useEffect } from 'react';
import WriteActionButtons from '../../components/write/WriteActionButtons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { writePost, updatePost } from '../../modules/write';
import { writeActionButtonsSelector } from '../selectors';

const WriteActionButtonsContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    title,
    body,
    tags,
    post,
    postError,
    originalPostId
  } = useSelector(writeActionButtonsSelector);

  // 포스트 등록
  const onPublish = () => {
    if (originalPostId) {
      dispatch(
        updatePost({
          title,
          body,
          tags,
          id: originalPostId
        })
      );
      return;
    }
    dispatch(
      writePost({
        title,
        body,
        tags
      })
    );
  };

  // 취소
  const onCancel = () => {
    navigate(-1);
  };

  // 성공 혹은 실패시 할 작업
  useEffect(() => {
    if (post) {
      const {
        _id,
        user
      } = post;
      console.log(post);
      navigate(`/@${user.username}/${_id}`);
    }
    if (postError) {
      console.log(postError);
    }
  }, [navigate, post, postError]);

  return <WriteActionButtons onPublish={onPublish} onCancel={onCancel} isEdit={!!originalPostId} />;
};

export default WriteActionButtonsContainer;
