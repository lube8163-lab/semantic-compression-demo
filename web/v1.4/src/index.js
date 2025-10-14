<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Semantic Communication v1.4 Demo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f0f2f5;
      margin: 0;
      padding: 0;
    }
    header {
      background: #fff;
      border-bottom: 1px solid #ddd;
      padding: 10px 20px;
      font-weight: bold;
      font-size: 20px;
      position: sticky;
      top: 0;
    }
    #container {
      max-width: 600px;
      margin: 20px auto;
    }
    #postForm {
      background: #fff;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    #postForm textarea {
      width: 100%;
      resize: none;
    }
    #postForm button {
      background: #1d9bf0;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 20px;
      margin-top: 10px;
      cursor: pointer;
    }
    .post {
      background: #fff;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .post-header {
      font-size: 14px;
      color: #555;
      margin-bottom: 10px;
    }
    .post img {
      max-width: 100%;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <header>Semantic Communication v1.4</header>
  <div id="container">

    <!-- 投稿フォーム -->
    <form id="postForm">
      <input type="file" id="imageInput" accept="image/*"><br><br>
      <button type="submit">意味送信（投稿）</button>
    </form>

    <!-- タイムライン -->
    <div id="timeline"></div>
  </div>

  <script>
    const form = document.getElementById('postForm');
    const timeline = document.getElementById('timeline');
    const MAX_POSTS = 10;
    const WORKER_URL = "https://semantic-worker.semantic-compression.workers.dev";

    // 🧩 v1.4: /auto エンドポイントを呼び出す
    async function autoGenerate(imageBlob) {
      const formData = new FormData();
      formData.append("file", imageBlob, "upload.jpg");

      const response = await fetch(WORKER_URL + "/auto", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!data.imageUrl) throw new Error("Regeneration failed");
      return data; // { caption, imageUrl }
    }

    // 🔁 ページ読み込み時に投稿履歴を表示
    window.onload = () => {
      const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
      timeline.innerHTML = "";
      savedPosts.reverse().forEach(addPostToTimeline);
    };

    // ✉️ 投稿処理
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const file = document.getElementById("imageInput").files[0];
      if (!file) return alert("画像を選んでね！");

      resizeImage(file, 800, 800, async (compressedDataUrl, blob) => {
        try {
          addTemporaryPost(); // 「生成中…」表示
          const { caption, imageUrl } = await autoGenerate(blob);
          savePost(caption, imageUrl);
          form.reset();
        } catch (err) {
          console.error("投稿エラー:", err);
          alert("投稿中にエラーが発生しました。");
        }
      });
    });

    // 🪄 一時的に「生成中...」を表示
    function addTemporaryPost() {
      const tempDiv = document.createElement("div");
      tempDiv.className = "post";
      tempDiv.id = "tempPost";
      tempDiv.innerHTML = `
        <div class="post-header">生成中...</div>
        <p>AIが意味を解析しています...</p>
      `;
      timeline.prepend(tempDiv);
    }

    // 💾 投稿を保存して表示
    function savePost(caption, imageUrl) {
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      const now = new Date();
      const pseudoUser = "user_" + now.getHours() + now.getMinutes();

      const post = {
        user: pseudoUser,
        time: now.toLocaleString(),
        caption,
        image: imageUrl,
      };

      posts.unshift(post);
      if (posts.length > MAX_POSTS) posts = posts.slice(0, MAX_POSTS);
      localStorage.setItem("posts", JSON.stringify(posts));

      // 「生成中...」を削除してから新しい投稿を描画
      const temp = document.getElementById("tempPost");
      if (temp) temp.remove();
      addPostToTimeline(post);
    }

    // 🧱 タイムラインに投稿を追加
    function addPostToTimeline(post) {
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      postDiv.innerHTML = `
        <div class="post-header">@${post.user} ・ ${post.time}</div>
        <p>${post.caption}</p>
        <img src="${post.image}" alt="AI再構成画像">
      `;
      timeline.prepend(postDiv);
    }

    // 🖼️ 圧縮
    function resizeImage(file, maxWidth, maxHeight, callback) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
              callback(dataUrl, blob);
            },
            "image/jpeg",
            0.7
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  </script>
</body>
</html>
