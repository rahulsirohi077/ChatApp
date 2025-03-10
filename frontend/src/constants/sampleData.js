export const sampleChats = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
        groupChat: false,
        members: ["1", "2"],
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Boi",
        _id: "2",
        groupChat: false,
        members: ["1", "2"],
    },
];

export const sampleUsers = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Boi",
        _id: "2",
    },
];

export const sampleNotifications = [
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Doe",
        },
        _id: "1",
    },
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Boi",
        },
        _id: "2",
    },
];

export const sampleMessages = [
    {
        attachments:[],
        content: "Hello",
        _id:"waddwdsasdas",
        sender:{
            _id:"1",
            name:"John Doe"
        },
        chat:"ChatId",
        createdAt:"2021-10-10T12:00:00.000Z"
    },
    {
        attachments:[
            {
                public_id:"image1",
                url:"https://www.w3schools.com/howto/img_avatar.png"
            }
        ],
        content: "Hello2",
        _id:"waddwdsasdas2",
        sender:{
            _id:"qwejqi",
            name:"Aman Singh"
        },
        chat:"ChatId",
        createdAt:"2021-10-10T12:00:00.000Z"
    },
];