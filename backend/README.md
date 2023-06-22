# Backend 

## 🏠 Database : Mongodb <br />
## 🚀 Framework : Koa 


---

<br>

## 스키마 생성 

<br>

### 게시글 
<br>

|필드 이름|데이터 타입|설명|
|------|---|---|
|title|문자열|제목|
|body|문자열|내용|
|tags|문자열 배열|태그 목록|
|publishedDate|날짜|작성 날짜|

<br>

```js
import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema({
    title: String,
    body: String,
    tags: [String], // 문자열로 이루어진 배열 
    publishedData: {
        type: Date,
        default: Date.now, // 현재 날짜를 기본 값으로 지정 
    },
    user: {
        _id: mongoose.Types.ObjectId,
        username: String,
    },
}); 

const Post = mongoose.model('Post', PostSchema); 
export default Post; 
```

<br>

### 사용자 

<br>

|필드 이름|데이터 타입|설명|
|------|---|---|
|username|문자열|아이디|
|hashedPassword|문자열|암호화된 비밀번호|

```js
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true or false
};

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // 첫 번째 파라미터에는 토큰 안에 집어넣고 싶은 데이터를 넣습니다.
    {
      _id: this.id,
      username: this.username,
    },
    // eslint-disable-next-line no-undef
    process.env.JWT_SECRET, // 두 번째 파라미터에 JWT 암호를 넣음
    {
      expiresIn: '7d', // 7일 동안 유효
    },
  );
  return token;
};

const User = mongoose.model('User', UserSchema);
export default User;

```
<br>

## 데이터 생성 
<br>

```js
/* POST /api/posts 
{
  title: '제목',
  body: '내용',
  tags: ['태그1', '태그2']
} 
*/

export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
```
<br>

## 데이터 조회 
<br>

```js
/* 
  GET /api/posts?username=&tag=&page= 
*/
export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 합니다.
  // 값이 주어지지 않았다면 1을 기본으로 사용합니다.
  const page = parseInt(ctx.query.pate || '1', 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query; 
  // tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음 
  const query = {
    ...(username ? {'user.username' : username} : {}),
    ...(tag ? {tags : tag} : {}), 
  }; 

  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts
      .map((post) => ({
        ...post,
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
      }));
  } catch (e) {
    ctx.throw(500, e);
  }
};
```
<br>

## 특정 포스트 조회 

<br>

```js
/* 
  GET /api/posts/:id
*/

export const read = (ctx) => {
  ctx.body = ctx.state.post;  
};
```
<br>

## 데이터 삭제 

<br>

```js
/*
  DELETE /api/posts/:id
*/

export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content ( 성공하기는 했지만 응답할 데이터 x)
  } catch (e) {
    ctx.throw(500, e);
  }
};
```

<br>

## 데이터 수정 

<br>

```js
/*
  PATCH /api/posts/:id
  {
    title: '수정',
    body: '수정 내용',
    tags: [
      '수정', '태그'
    ]
  }
*/

export const update = async (ctx) => {
  const { id } = ctx.params;
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 업데이트 된 데이터를 반환
      // false 일 때는 업데이트되기 전의 데이터 반환
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state; 
  if(post.user._id.toString() !== user._id) {
    ctx.status = 403; 
    return;
  }
  return next(); 
}
```

----

<br>

# 회원가입 구현하기 

<br>

## 회원가입 
<br>

```js
/* 
    POST /api/auth/register 
    {
        username: 'zenghyun' 
        password: 'password123'
    }
*/
export const register = async (ctx) => {
  // 회원가입
  // Request body 검증하기
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    // username이 이미 존재하는지 확인
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; // Conflict
      return;
    }

    const user = new User({
      username,
    });

    await user.setPassword(password); // 비밀번호 설정
    await user.save(); // 데이터베이스에 저장

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
```
<br>

## 로그인
<br>

```js
/*
    POST /api/auth/login
    {
        username: 'zenghyun'
        password: 'password123'
    }
*/

export const login = async (ctx) => {
  // 로그인
  const { username, password } = ctx.request.body;

  // username, password가 없으면 에러 처리
  if (!username || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    // 계정이 존재하지 않으면 에러 처리
    if (!user) {
      ctx.status = 401;
      return;
    }

    const valid = await user.checkPassword(password);
    // 잘못된 비밀번호
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
```

<br>

## 로그인 상태 확인 
<br>

```js
/* 
    GET /api/auth/check
*/
export const check = async (ctx) => {
  // 로그인 상태 확인
  const { user } = ctx.state; 
  if(!user) {
    //로그인 중 아님 
    ctx.status = 401; // Unauthorized 
    return;
  }
  ctx.body = user; 
};
```

<br>

## 로그아웃
<br>

```js
/* 
    POST /api/auth/logout
*/
export const logout = async (ctx) => {
  // 로그아웃
  ctx.cookies.set('access_token');
  ctx.status = 204; 
};

```