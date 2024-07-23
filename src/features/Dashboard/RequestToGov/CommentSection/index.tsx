"use client";
import { ProfileAvatar, UpArrow } from "@/assets/imgs";
import API from "@/http/api";
import { useRequest, useRequestMutation } from "@/http/request";
import { Divider } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

export default function CommentSection() {
  const [commentValue, setCommentValue] = useState("");
  console.log(commentValue);

  const { data } = useRequest(API.organization_comments, { method: "GET" });
  const commentData = data?.data;
  const { commentSend } = useRequestMutation(API.create_comment, {
    method: "POST",
    data: commentValue,
  });
  const commentHandler = (e: React.FormEvent) => {
    e.preventDefault();
    commentSend();
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className="w-full text-center text-blue-primary text-md">Şərhlər</h1>
        <Divider />
        <div className="flex flex-col gap-7">
          {commentData &&
            commentData.map((comment: any) => (
              <div key={comment.commentId} className="flex flex-col gap-5">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Image src={ProfileAvatar} alt="avatar-icon" />
                    <span className="text-xs text-blue-primary font-semibold">
                      {comment.fullName || comment.authority}
                    </span>
                  </div>
                  <span className="text-surface-secondary text-sm-text">{comment.createDate}</span>
                </div>
                <p className="text-parag-gray text-md">{comment.commentText}</p>
                <Divider />
              </div>
            ))}
          <form className="flex items-center justify-between" onSubmit={commentHandler}>
            <input
              type="text"
              placeholder="Şərh yazın"
              className="w-[91%] bg-primary-container h-[50px] rounded-3xl border-[0.5px] focus:outline-none border-container-outline px-3 py-5 placeholder-bl-secondary placeholder:text-md placeholder:font-medium"
              value={commentValue}
              onChange={e => setCommentValue(e.target.value)}
            />
            <button className="w-11 h-11 rounded-[100px] bg-blue-primary flex justify-center items-center">
              <Image src={UpArrow} alt="arrow-up" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
