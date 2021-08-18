create table tag
(
    id   int auto_increment
        primary key,
    name varchar(255) not null,
    constraint name
        unique (name)
)
    collate = utf8mb4_unicode_ci;

create table user
(
    id       int auto_increment
        primary key,
    name     varchar(255) not null,
    password varchar(255) not null,
    constraint name
        unique (name)
);

create table avatar
(
    id       int auto_increment
        primary key,
    mimetype varchar(255) not null,
    filename varchar(255) not null,
    size     int          not null,
    userId   int          not null,
    constraint avatar_ibfk_1
        foreign key (userId) references user (id)
)
    collate = utf8mb4_unicode_ci;

create index userId
    on avatar (userId);

create table post
(
    id      int auto_increment
        primary key,
    title   varchar(255) not null,
    content longtext     null,
    userId  int          null,
    constraint post_ibfk_1
        foreign key (userId) references user (id)
)
    collate = utf8mb4_unicode_ci;

create table comment
(
    id       int auto_increment
        primary key,
    content  longtext null,
    postId   int      not null,
    userId   int      not null,
    parentId int      null,
    constraint comment_ibfk_1
        foreign key (postId) references post (id),
    constraint comment_ibfk_2
        foreign key (userId) references user (id),
    constraint comment_ibfk_3
        foreign key (parentId) references comment (id)
)
    collate = utf8mb4_unicode_ci;

create index parentId
    on comment (parentId);

create index postId
    on comment (postId);

create index userId
    on comment (userId);

create table file
(
    id           int auto_increment
        primary key,
    originalname varchar(255) not null,
    mimetype     varchar(255) not null,
    filename     varchar(255) not null,
    size         int          not null,
    postId       int          not null,
    userId       int          not null,
    width        smallint     not null,
    height       smallint     not null,
    metadata     json         null,
    constraint file_ibfk_1
        foreign key (postId) references post (id),
    constraint file_ibfk_2
        foreign key (userId) references user (id)
)
    collate = utf8mb4_unicode_ci;

create index postId
    on file (postId);

create index userId
    on file (userId);

create index userId
    on post (userId);

create table post_tag
(
    postId int not null,
    tagId  int not null,
    primary key (postId, tagId),
    constraint post_tag_ibfk_1
        foreign key (postId) references post (id),
    constraint post_tag_ibfk_2
        foreign key (tagId) references tag (id)
)
    collate = utf8mb4_unicode_ci;

create index tagId
    on post_tag (tagId);

create table user_like_post
(
    userId int not null,
    postId int not null,
    primary key (userId, postId),
    constraint user_like_post_ibfk_1
        foreign key (userId) references user (id),
    constraint user_like_post_ibfk_2
        foreign key (postId) references post (id)
)
    collate = utf8mb4_unicode_ci;

create index postId
    on user_like_post (postId);
