import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TagBox from '../../components/write/TagBox';
import { changeField } from '../../modules/write';
import { tagBoxSelector } from '../selectors';

const TagBoxContainer = () => {
  const dispatch = useDispatch();
  const { tags } = useSelector(tagBoxSelector);
  const onChangeTags = (nextTags) => {
    dispatch(
      changeField({
        key: 'tags',
        value: nextTags,
      }),
    );
  };

  return <TagBox onChangeTags={onChangeTags} tags={tags} />;
};

export default TagBoxContainer;
