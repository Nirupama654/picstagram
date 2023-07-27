import React, { useState } from 'react';
import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme, Modal } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Friend from "components/Friend";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "state";

const PostModal = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
    open,
    setOpen
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    };
    return (
      <div>
        <Modal
          open={open}
          onClose={()=>{
            setOpen(!open)
          }} 
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
          sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vh', // Set the width of the modal
            height: '90vh', // Set the maximum height of the modal
            overflow: 'hidden', // Enable vertical scrolling if content exceeds the maximum height
            bgcolor: 'background.paper',
            boxShadow: 24,
            pt : 5,
            pb: 8,
            pl : 5,
            pr : 2,
            '@media (max-width: 600px)': {
                width: '90%', /* Adjust modal width for smaller screens (e.g., smartphones) */
                maxHeight: '90vh', /* Adjust maximum modal height for smaller screens */
              },
          }}
        >
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="80%"
          height="80%"
          objectFit="cover"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </Box>
        </Modal>
      </div>
    );
  };

  export default PostModal;
  