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

