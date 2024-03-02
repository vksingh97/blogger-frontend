import React, { useState, useEffect } from 'react';
import {
  EditOutlined,
  StarOutlined,
  LikeOutlined,
  DeleteOutlined,
  LikeTwoTone,
  StarFilled,
} from '@ant-design/icons';
import styled from 'styled-components';
import { Card, Avatar, Badge } from 'antd'; // Import Badge from Ant Design
import { useSelector } from 'react-redux';
import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const { Meta } = Card;

const BlogPosts = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const PostImage = styled.img`
  width: 100%;
`;

const CardContainer = styled.div`
  margin: 20px;
`;

const PostCard = styled(Card)`
  width: 500px;
  margin-bottom: 20px;
`;

const AllBlogs = ({
  blogPosts,
  setSelectedPost,
  favouritePosts,
  setUserLikedPost,
  userLikedPost,
  setFavouritePosts,
  summarize,
  setSummarize,
  selectedPost,
  editPost,
  setEditPost,
  setSelectedEditingPost,
  selectedEditingPost,
}) => {
  const userDetails = useSelector((state) => state.userDetails);

  const truncateDescription = (description) => {
    const maxLength = 150;
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  const updatePostLike = async ({ postId, like }) => {
    if (like) {
      setUserLikedPost([...userLikedPost, postId]);
    } else {
      setUserLikedPost(userLikedPost.filter((id) => id !== postId));
    }
    try {
      await apiInstance.post(
        `/posts/${postId}/like`,
        {
          userId: userDetails.id,
          like,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          },
        },
        {
          withCredentials: true,
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const markAsFavourite = async ({ postId, isFavourite }) => {
    if (isFavourite) {
      setFavouritePosts([...favouritePosts, postId]);
    } else {
      setFavouritePosts(favouritePosts.filter((id) => id !== postId));
    }
    try {
      await apiInstance.post(
        `/posts/${postId}/favourite`,
        {
          userId: userDetails.id,
          isFavourite,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          },
        },
        {
          withCredentials: true,
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const deletePost = async ({ postId }) => {
    try {
      await apiInstance.delete(`/delete-post/${postId}`, {
        withCredentials: true,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <BlogPosts>
        {blogPosts.map((item) => (
          <CardContainer key={item._id}>
            <PostCard
              cover={
                <PostImage
                  onClick={() => setSelectedPost(item)}
                  alt='example'
                  src={
                    item.imageUrl
                      ? item.imageUrl
                      : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                  }
                />
              }
              actions={[
                item.authorId === userDetails.id ? (
                  <EditOutlined
                    style={{ fontSize: '20px' }}
                    key='edit'
                    onClick={() => {
                      setSelectedEditingPost(item);
                      setEditPost(true);
                    }}
                  />
                ) : (
                  <div>
                    <Badge count={item.likes} style={{ margin: '0px -20px' }}>
                      {item && userLikedPost.includes(item._id) ? (
                        <LikeTwoTone
                          style={{ fontSize: '20px' }}
                          key='liked'
                          onClick={() => {
                            updatePostLike({
                              postId: item._id,
                              like: false,
                            });
                          }}
                        />
                      ) : (
                        <div>
                          <LikeOutlined
                            style={{ fontSize: '20px' }}
                            key='like'
                            onClick={() => {
                              updatePostLike({
                                postId: item._id,
                                like: true,
                              });
                            }}
                          />
                        </div>
                      )}
                    </Badge>
                  </div>
                ),
                item.authorId === userDetails.id ? (
                  <DeleteOutlined
                    style={{ fontSize: '20px' }}
                    key='delete'
                    onClick={() => deletePost({ postId: item._id })}
                  />
                ) : (
                  <div>
                    {favouritePosts.includes(item._id.toString()) ? (
                      <StarFilled
                        style={{ fontSize: '20px', color: '#ffd700' }}
                        key='favourite'
                        onClick={() =>
                          markAsFavourite({
                            postId: item._id,
                            isFavourite: false,
                          })
                        }
                      />
                    ) : (
                      <StarOutlined
                        style={{ fontSize: '20px' }}
                        key='notFavourite'
                        onClick={() =>
                          markAsFavourite({
                            postId: item._id,
                            isFavourite: true,
                          })
                        }
                      />
                    )}
                  </div>
                ),
              ]}
            >
              <Meta
                onClick={() => setSelectedPost(item)}
                avatar={
                  <Avatar src='https://api.dicebear.com/7.x/miniavs/svg?seed=8' />
                }
                title={item.title}
                description={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: truncateDescription(item.content),
                    }}
                  />
                }
              />
            </PostCard>
          </CardContainer>
        ))}
      </BlogPosts>
    </div>
  );
};

export default AllBlogs;
