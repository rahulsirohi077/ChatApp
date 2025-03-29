import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHAT,
} from "../constants/events.js";
import { ErrorHandler } from "../utils/utility.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2) {
    return next(
      new ErrorHandler("Group chat must have at least 3 members", 400)
    );
  }

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHAT, members);

  return res.status(201).json({
    success: true,
    message: "Group created successfully",
  });
});

const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.user);

    return {
      _id,
      name: groupChat ? name : otherMember.name,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });

  return res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ _id, name, members, groupChat }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
});

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!members || members.length === 0) {
    return next(new ErrorHandler("Please provide members", 400));
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 404));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not authorized to add members", 403));
  }

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100) {
    return next(new ErrorHandler("Group chat limit reached", 400));
  }

  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(", ");

  emitEvent(req, ALERT, chat.members, `${allUsersName} added in the group`);
  emitEvent(req, REFETCH_CHAT, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});

const removeMember = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;

  if (!userId) {
    return next(new ErrorHandler("Please provide correct userId", 400));
  }

  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 404));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not authorized to remove members", 403)
    );
  }

  if (chat.members.length <= 3) {
    return next(new ErrorHandler("Group must have at Least 3 Members", 400));
  }

  chat.members = chat.members.filter((i) => i.toString() !== userId.toString());

  await chat.save();
  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemoved.name} removed from the group`
  );
  emitEvent(req, REFETCH_CHAT, chat.members);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 404));
  }

  const remainingMembers = chat.members.filter(
    (i) => i.toString() !== req.user.toString()
  );

  if (remainingMembers.length < 3) {
    return next(new ErrorHandler("Group must have at Least 3 Members", 400));
  }

  if (chat.creator.toString() === req.user.toString()) {
    const randomNumber = Math.floor(Math.random() * remainingMembers.length);

    const newCreator = remainingMembers[randomNumber];

    chat.creator = newCreator;
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, `${user.name} left the group`);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

const sendAttachment = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name avatar"),
  ]);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  const files = req.files || [];

  if (files.length === 0) {
    return next(new ErrorHandler("Please provide attachment", 400));
  }

  // Upload files to cloudinary
  const attachments = [];

  const messageForDb = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDb,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDb);

  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({
    success: true,
    message,
  });
});

const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

const renameGroups = TryCatch(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  const { name } = req.body;

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 404));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not authorized to rename the group", 403)
    );
  }

  if (!name || name.length === 0) {
    return next(new ErrorHandler("Please provide a name", 400));
  }

  chat.name = name;

  await chat.save();

  emitEvent(req, REFETCH_CHAT, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group renamed successfully",
  });
});

const deleteChat = TryCatch(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete the group", 403)
    );
  }

  if (chat.groupChat && !chat.members.includes(req.user.toString())) {
    return next(new ErrorHandler("You are not a member of this group", 403));
  }
  // here we have to delete all the messages as well as attachments or files from cloudinary
  const messagesWithAttachments = await Message.find({
    chat: req.params.id,
    attachments: { $exists: true, $ne: [] },
  });

  const public_id = [];

  messagesWithAttachments.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => {
      public_id.push(public_id);
    });
  });

  await Promise.all([
    // delete files from Cloudinary
    deleteFilesFromCloudinary(public_id),
    chat.deleteOne(),
    Message.deleteMany({ chat: req.params.id }),
  ]);

  emitEvent(req, REFETCH_CHAT, members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const getMessages = TryCatch(async (req, res, next) => {

  const chatId = req.params.id;
  const {page=1} = req.query;

  const resultPerPage = 20;
  const skip = (page - 1) * resultPerPage;

  if (!chatId) {
    return next(new ErrorHandler("Chat id not found", 400));
  }

  const [messages, totalMessagesCount] = await Promise.all([Message.find({ chat: chatId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(resultPerPage)
    .populate("sender", "name avatar")
    .lean(),Message.countDocuments({ chat: chatId })]);

  const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

  return res.status(200).json({
    success: true,
    messages,
    totalPages,
  });
});

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachment,
  getChatDetails,
  renameGroups,
  deleteChat,
  getMessages
};
